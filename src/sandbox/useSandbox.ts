import { useCallback, useEffect, useRef, useState } from 'react';

import type { BenchPoint, ConsoleLine, TestCase, TestResult, WorkerRequest, WorkerResponse } from './types';

export type SandboxStatus = 'idle' | 'running' | 'done' | 'timeout' | 'failed';

export const TEST_TIMEOUT_MS = 3000;
export const BENCH_TIMEOUT_MS = 20_000;

export interface SandboxState {
  status: SandboxStatus;
  results: TestResult[];
  output: ConsoleLine[];
  bench: BenchPoint[] | null;
  /** Результат свободного запуска: что вернул default-экспорт. */
  execValue: { value: string; durationMs: number } | null;
  failure: string | null;
  runTests: (code: string, exportName: string, cases: readonly TestCase[]) => void;
  runBench: (code: string, exportName: string, sizes: readonly number[], makeArgsSource: string) => void;
  runFree: (code: string) => void;
  stop: () => void;
}

/**
 * Запуск пользовательского кода в воркере с жёстким таймаутом.
 *
 * Таймаут реализован единственным способом, который работает против
 * `while (true) {}` — терминацией воркера. Терминированный воркер
 * невосстановим, поэтому следующий запуск поднимает новый.
 */
export const useSandbox = (onResults?: (results: TestResult[]) => void): SandboxState => {
  const workerRef = useRef<Worker | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Колбэк дёргается из обработчика сообщения воркера — это путь события, а не
  // рендер. Ref держит свежую ссылку, не пересоздавая обработчик и не
  // перезапуская воркер. Запись — в эффекте: во время рендера ref трогать нельзя.
  const onResultsRef = useRef(onResults);
  useEffect(() => {
    onResultsRef.current = onResults;
  }, [onResults]);

  const [status, setStatus] = useState<SandboxStatus>('idle');
  const [results, setResults] = useState<TestResult[]>([]);
  const [output, setOutput] = useState<ConsoleLine[]>([]);
  const [bench, setBench] = useState<BenchPoint[] | null>(null);
  const [execValue, setExecValue] = useState<{ value: string; durationMs: number } | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const kill = useCallback(() => {
    clearTimer();
    workerRef.current?.terminate();
    workerRef.current = null;
  }, []);

  // Уходим со страницы во время прогона — воркер обязан умереть вместе с ней.
  useEffect(() => kill, [kill]);

  const send = useCallback(
    (request: WorkerRequest, timeoutMs: number) => {
      kill();

      setStatus('running');
      setResults([]);
      setOutput([]);
      setFailure(null);
      setExecValue(null);
      if (request.type === 'bench') setBench(null);

      const worker = new Worker(new URL('./runner.worker.ts', import.meta.url), { type: 'module' });
      workerRef.current = worker;

      worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
        const message = event.data;

        if (message.type === 'console') {
          // Ограничение на длину лога: `console.log` в цикле на 10⁵ итераций
          // иначе съедает память вкладки быстрее, чем сам алгоритм.
          setOutput((lines) => (lines.length > 300 ? lines : [...lines, message.line]));
          return;
        }

        clearTimer();
        if (message.type === 'results') {
          setResults(message.results);
          setStatus('done');
          onResultsRef.current?.(message.results);
        } else if (message.type === 'bench') {
          setBench(message.points);
          setStatus('done');
        } else if (message.type === 'exec') {
          setExecValue({ value: message.value, durationMs: message.durationMs });
          setStatus('done');
        } else {
          setFailure(message.message);
          setStatus('failed');
        }
      };

      worker.onerror = (event) => {
        clearTimer();
        setFailure(event.message || 'Ошибка в коде');
        setStatus('failed');
      };

      timerRef.current = setTimeout(() => {
        kill();
        setStatus('timeout');
      }, timeoutMs);

      worker.postMessage(request);
    },
    [kill],
  );

  const runTests = useCallback(
    (code: string, exportName: string, cases: readonly TestCase[]) =>
      send({ type: 'run', code, exportName, cases }, TEST_TIMEOUT_MS),
    [send],
  );

  const runBench = useCallback(
    (code: string, exportName: string, sizes: readonly number[], makeArgsSource: string) =>
      send({ type: 'bench', code, exportName, sizes, makeArgsSource }, BENCH_TIMEOUT_MS),
    [send],
  );

  const runFree = useCallback((code: string) => send({ type: 'exec', code }, TEST_TIMEOUT_MS), [send]);

  const stop = useCallback(() => {
    kill();
    setStatus('idle');
  }, [kill]);

  return { status, results, output, bench, execValue, failure, runTests, runBench, runFree, stop };
};
