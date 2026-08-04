import { defineTask } from '../types';

export default defineTask({
  slug: 'time-limit',
  title: 'Промис с таймаутом',
  topic: 'js-practice',
  prompt:
    'Реализуй timeLimit(fn, ms) — обёртку, которая возвращает новую async-функцию.\n' +
    'Если исходная функция успела за ms — результат проходит как есть.\n' +
    'Если не успела — промис ОТКЛОНЯЕТСЯ со строкой "Time Limit Exceeded".\n\n' +
    'Для проверки экспортируй probe(delayMs, limitMs): вызови обёрнутую функцию,\n' +
    'которая ждёт delayMs и возвращает "ok", и верни "ok" либо текст ошибки.',
  exportName: 'probe',
  starter: `function timeLimit(fn, ms) {
  return async function (...args) {
    // Гонка двух промисов: результат fn против таймера.
    // Внимание на порядок аргументов в new Promise — это (resolve, reject).
  };
}

export async function probe(delayMs, limitMs) {
  const slow = (value) => new Promise((resolve) => setTimeout(() => resolve(value), delayMs));
  const limited = timeLimit(slow, limitMs);

  try {
    return await limited('ok');
  } catch (error) {
    return String(error);
  }
}
`,
  solution: `function timeLimit(fn, ms) {
  return async function (...args) {
    let timer;

    // Первый аргумент исполнителя — resolve, второй — reject.
    // Классическая ошибка: new Promise((reject) => ...) — тогда по таймауту
    // промис РЕЗОЛВИТСЯ строкой вместо отклонения.
    const timeout = new Promise((_resolve, reject) => {
      timer = setTimeout(() => reject('Time Limit Exceeded'), ms);
    });

    try {
      return await Promise.race([fn(...args), timeout]);
    } finally {
      // Без clearTimeout таймер держит процесс живым до срабатывания.
      // clearTimeout ждёт ID таймера, а не промис.
      clearTimeout(timer);
    }
  };
}

export async function probe(delayMs, limitMs) {
  const slow = (value) => new Promise((resolve) => setTimeout(() => resolve(value), delayMs));
  const limited = timeLimit(slow, limitMs);

  try {
    return await limited('ok');
  } catch (error) {
    return String(error);
  }
}
`,
  cases: [
    { name: 'успевает в лимит', args: [10, 100], expected: 'ok' },
    // Ловит перепутанные resolve/reject: там вернулось бы 'Time Limit Exceeded'
    // как успешный результат, а не как ошибка — но текст совпал бы.
    // Поэтому проверяем ОБА направления.
    { name: 'не успевает — отклонение', args: [100, 10], expected: 'Time Limit Exceeded' },
    { name: 'мгновенная функция', args: [0, 50], expected: 'ok' },
    { name: 'нулевой лимит', args: [50, 0], expected: 'Time Limit Exceeded' },
  ],
  hints: [
    'Promise.race([fn(...args), timeout]) — гонка результата и таймера.',
    'new Promise((resolve, reject) => ...): reject это ВТОРОЙ аргумент.',
    'clearTimeout принимает ID таймера из setTimeout, а не промис.',
  ],
});
