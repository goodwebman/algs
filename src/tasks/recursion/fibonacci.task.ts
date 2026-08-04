import { defineTask } from '../types';

export default defineTask({
  slug: 'fibonacci',
  title: 'Числа Фибоначчи',
  topic: 'recursion',
  prompt:
    'Верни n-е число Фибоначчи: F(0)=0, F(1)=1, F(n)=F(n-1)+F(n-2).\n' +
    'Наивная рекурсия O(2ⁿ) не подойдёт — зависнет на n=40.\n' +
    'Нужно O(n): мемоизация или итеративно.',
  exportName: 'fibonacci',
  starter: `export function fibonacci(n) {
  // Наивный вариант fib(n-1)+fib(n-2) перевычисляет одно и то же миллионы раз.
  // Запоминай уже посчитанные значения — или считай итеративно снизу вверх.
}
`,
  solution: `export function fibonacci(n) {
  if (n <= 1) return n;

  let a = 0;
  let b = 1;

  for (let i = 2; i <= n; i += 1) {
    [a, b] = [b, a + b];
  }

  return b;
}
`,
  cases: [
    { name: 'базовые', args: [0], expected: 0 },
    { name: 'F(1)', args: [1], expected: 1 },
    { name: 'F(2)', args: [2], expected: 1 },
    { name: 'F(6)', args: [6], expected: 8 },
    { name: 'F(10)', args: [10], expected: 55 },
    // Без мемоизации/итераций этот кейс виснет
    { name: 'F(40) — мгновенно только при O(n)', args: [40], expected: 102334155 },
    { name: 'F(50)', args: [50], expected: 12586269025 },
  ],
  bench: {
    sizes: [10, 100, 1000, 5000, 20000],
    makeArgsSource: '(n) => [n]',
    compareWith: ['O(n)', 'O(n²)'],
  },
  hints: [
    'Базовый случай: n <= 1 → вернуть n.',
    'Итеративно: две переменные a и b, на каждом шаге сдвигаем.',
    'Обмен [a, b] = [b, a + b] — без временной переменной, читаемо.',
  ],
});
