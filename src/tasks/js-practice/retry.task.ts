import { defineTask } from '../types';

export default defineTask({
  slug: 'retry',
  title: 'Retry с backoff',
  topic: 'js-practice',
  prompt:
    'Реализуй retry(fn, { attempts, delay }) — повторяет вызов fn при ошибке.\n' +
    'attempts — максимальное число ПОПЫТОК (не повторов). delay(n) возвращает паузу перед n-й попыткой.\n' +
    'Если все попытки провалились — пробрасывай последнюю ошибку.\n\n' +
    'Для проверки экспортируй probe(failCount, attempts): fn падает первые failCount раз,\n' +
    'потом возвращает "ok". Верни { result, calls } — результат (или текст ошибки) и число вызовов fn.',
  exportName: 'probe',
  starter: `async function retry(fn, config) {
  // Цикл по попыткам. Ошибку последней попытки пробрасывай наружу.
  // Пауза — только МЕЖДУ попытками, не после последней.
}

export async function probe(failCount, attempts) {
  let calls = 0;

  const fn = async () => {
    calls += 1;
    if (calls <= failCount) throw new Error('fail #' + calls);
    return 'ok';
  };

  try {
    const result = await retry(fn, { attempts, delay: () => 1 });
    return { result, calls };
  } catch (error) {
    return { result: String(error.message ?? error), calls };
  }
}
`,
  solution: `const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function retry(fn, { attempts, delay }) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      // await внутри try обязателен: без него отклонённый промис
      // улетит мимо catch, и retry не сработает вообще.
      return await fn();
    } catch (error) {
      lastError = error;

      // Пауза только между попытками — после последней ждать нечего.
      if (attempt < attempts) await sleep(delay(attempt));
    }
  }

  throw lastError;
}

export async function probe(failCount, attempts) {
  let calls = 0;

  const fn = async () => {
    calls += 1;
    if (calls <= failCount) throw new Error('fail #' + calls);
    return 'ok';
  };

  try {
    const result = await retry(fn, { attempts, delay: () => 1 });
    return { result, calls };
  } catch (error) {
    return { result: String(error.message ?? error), calls };
  }
}
`,
  cases: [
    { name: 'успех с первого раза', args: [0, 3], expected: { result: 'ok', calls: 1 } },
    { name: 'успех со второй попытки', args: [1, 3], expected: { result: 'ok', calls: 2 } },
    { name: 'успех с последней попытки', args: [2, 3], expected: { result: 'ok', calls: 3 } },
    // Все попытки провалились — ошибка пробрасывается, вызовов ровно attempts
    { name: 'все попытки провалились', args: [5, 3], expected: { result: 'fail #3', calls: 3 } },
    { name: 'одна попытка без повторов', args: [1, 1], expected: { result: 'fail #1', calls: 1 } },
  ],
  hints: [
    'Цикл for от 1 до attempts, внутри try/catch.',
    'return await fn() внутри try — без await ошибка пройдёт мимо catch.',
    'Пауза перед следующей попыткой, но не после последней: if (attempt < attempts).',
  ],
});
