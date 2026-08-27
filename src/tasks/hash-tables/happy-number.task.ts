import { testTask } from '../test-derived';

export default testTask({
  slug: 'happy-number',
  title: 'Счастливое число',
  topic: 'hash-tables',
  prompt: 'Повторяй замену числа суммой квадратов его цифр. Верни true, если процесс приходит к 1, и false, если зацикливается.',
  exportName: 'isHappy',
  solution: `export function isHappy(n) {
  const seen = new Set();
  while (n !== 1 && !seen.has(n)) {
    seen.add(n);
    let next = 0;
    while (n > 0) {
      const digit = n % 10;
      next += digit * digit;
      n = Math.floor(n / 10);
    }
    n = next;
  }
  return n === 1;
}
`,
  cases: [
    { name: 'счастливое', args: [19], expected: true },
    { name: 'цикл', args: [2], expected: false },
    { name: 'единица', args: [1], expected: true },
  ],
  hints: ['Множество хранит уже встречавшиеся промежуточные числа.', 'Повтор означает цикл, а не ошибку вычисления.'],
});
