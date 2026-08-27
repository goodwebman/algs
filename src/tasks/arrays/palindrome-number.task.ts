import { testTask } from '../test-derived';

export default testTask({
  slug: 'palindrome-number',
  title: 'Число-палиндром',
  topic: 'arrays',
  prompt: 'Проверь, читается ли целое число одинаково слева направо и справа налево, не превращая его в строку.',
  exportName: 'isPalindromeNumber',
  solution: `export function isPalindromeNumber(x) {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  let reversed = 0;
  while (x > reversed) {
    reversed = reversed * 10 + (x % 10);
    x = Math.floor(x / 10);
  }
  return x === reversed || x === Math.floor(reversed / 10);
}
`,
  cases: [
    { name: 'палиндром', args: [121], expected: true },
    { name: 'не палиндром', args: [-121], expected: false },
    { name: 'заканчивается нулём', args: [10], expected: false },
    { name: 'одна цифра', args: [0], expected: true },
  ],
  hints: ['Отрицательные числа не подходят.', 'Разворачивай только половину цифр, чтобы не создавать строку.'],
});
