/// <reference lib="webworker" />
import { compareBy, deepEqual } from './deep-equal';
import { preview } from './preview';
import type { BenchPoint, TestResult, WorkerRequest, WorkerResponse } from './types';

/**
 * Исполнитель пользовательского кода.
 *
 * Живёт в воркере не для скорости, а потому что бесконечный цикл в решении —
 * это норма при обучении. Убить его можно только `worker.terminate()` с
 * главного потока; будь код на главном потоке, вкладка просто повисла бы
 * и `Promise.race` с таймаутом не помог бы — таймеру негде выполниться.
 */

const post = (message: WorkerResponse) => self.postMessage(message);

// Перехват консоли: вывод пользователя должен попадать в панель, а не в devtools.
for (const level of ['log', 'warn', 'error'] as const) {
  console[level] = (...args: unknown[]) => {
    post({ type: 'console', line: { level, text: args.map((a) => preview(a)).join(' ') } });
  };
}

// Учебный код не должен ходить в сеть. Заглушки дают внятную ошибку
// вместо непонятного зависания или CORS-исключения.
const forbid = (name: string) => () => {
  throw new Error(`${name} недоступен в песочнице: код исполняется локально, без сети`);
};
Object.assign(self, {
  fetch: forbid('fetch'),
  XMLHttpRequest: forbid('XMLHttpRequest'),
  importScripts: forbid('importScripts'),
});

/** Импортирует код пользователя как ES-модуль. */
const loadModule = async (code: string): Promise<Record<string, unknown>> => {
  const url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
  try {
    // Blob-модуль, а не `new Function`: так работают import/export и
    // синтаксические ошибки приходят с номером строки.
    return (await import(/* @vite-ignore */ url)) as Record<string, unknown>;
  } finally {
    URL.revokeObjectURL(url);
  }
};

const pickExport = (module: Record<string, unknown>, exportName: string): ((...args: any[]) => unknown) => {
  const candidate = module[exportName] ?? module.default;
  if (typeof candidate !== 'function') {
    const available = Object.keys(module).filter((k) => typeof module[k] === 'function');
    throw new Error(
      available.length
        ? `Не найдена функция «${exportName}». Экспортированы: ${available.join(', ')}`
        : `Ничего не экспортировано. Добавь «export function ${exportName}(...)» или «export default».`,
    );
  }
  return candidate as (...args: any[]) => unknown;
};

const runCases = async (request: Extract<WorkerRequest, { type: 'run' }>) => {
  const solution = pickExport(await loadModule(request.code), request.exportName);
  const results: TestResult[] = [];

  for (const testCase of request.cases) {
    // Копия входа нужна дважды: чтобы решение не портило следующий кейс
    // и чтобы поймать мутацию аргументов там, где она запрещена.
    const args = structuredClone(testCase.args) as unknown[];
    const before = testCase.noMutation ? structuredClone(args) : null;
    const started = performance.now();

    try {
      const actual = await solution(...args);
      const durationMs = performance.now() - started;
      const mutated = before ? !deepEqual(args, before) : false;
      const passed = compareBy(testCase.compare ?? 'deep', actual, testCase.expected) && !mutated;

      results.push({
        name: testCase.name,
        passed,
        actual: preview(actual),
        expected: preview(testCase.expected),
        durationMs,
        mutated,
      });
    } catch (cause) {
      results.push({
        name: testCase.name,
        passed: false,
        actual: '—',
        expected: preview(testCase.expected),
        durationMs: performance.now() - started,
        error: cause instanceof Error ? `${cause.name}: ${cause.message}` : String(cause),
      });
    }
  }

  post({ type: 'results', results });
};

const runBench = async (request: Extract<WorkerRequest, { type: 'bench' }>) => {
  const solution = pickExport(await loadModule(request.code), request.exportName);
  const makeArgs = (await loadModule(`export default ${request.makeArgsSource}`)).default as (
    n: number,
  ) => unknown[];

  const points: BenchPoint[] = [];

  for (const n of request.sizes) {
    const args = makeArgs(n);
    // Прогрев: первый вызов ловит компиляцию в JIT и на малых n даёт
    // выброс, из-за которого кривая выглядит как что угодно, кроме правды.
    solution(...structuredClone(args));

    const repeats = n <= 1000 ? 20 : 3;
    let total = 0;
    for (let i = 0; i < repeats; i += 1) {
      const input = structuredClone(args);
      const started = performance.now();
      solution(...input);
      total += performance.now() - started;
    }

    points.push({ n, ms: total / repeats });
  }

  post({ type: 'bench', points });
};

const runFree = async (request: Extract<WorkerRequest, { type: 'exec' }>) => {
  const module = await loadModule(request.code);
  const started = performance.now();

  // default-экспорт не обязателен: код может просто печатать в консоль.
  const value = typeof module.default === 'function' ? await (module.default as () => unknown)() : undefined;

  post({ type: 'exec', value: preview(value), durationMs: performance.now() - started });
};

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  try {
    if (event.data.type === 'run') await runCases(event.data);
    else if (event.data.type === 'bench') await runBench(event.data);
    else await runFree(event.data);
  } catch (cause) {
    post({
      type: 'failure',
      message: cause instanceof Error ? `${cause.name}: ${cause.message}` : String(cause),
    });
  }
};
