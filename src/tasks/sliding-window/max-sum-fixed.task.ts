import { defineTask } from '../types';

export default defineTask({
  slug: 'max-sum-fixed',
  title: 'Максимальная сумма окна длины k',
  topic: 'sliding-window',
  prompt:
    'Найди максимальную сумму k подряд идущих элементов массива.\n' +
    'Если k больше длины массива или k <= 0 — верни 0.\n' +
    'Нужно O(n): пересчитывать сумму окна с нуля нельзя.',
  exportName: 'maxSumFixed',
  starter: `export function maxSumFixed(nums, k) {
  // Собери сумму первого окна, дальше сдвигай:
  // одно значение входит справа, одно выходит слева.
}
`,
  solution: `export function maxSumFixed(nums, k) {
  if (k <= 0 || k > nums.length) return 0;

  let sum = 0;
  for (let i = 0; i < k; i += 1) sum += nums[i];

  let best = sum;

  for (let right = k; right < nums.length; right += 1) {
    sum += nums[right] - nums[right - k];
    if (sum > best) best = sum;
  }

  return best;
}
`,
  cases: [
    { name: 'максимум в середине', args: [[2, 1, 5, 1, 3, 2], 3], expected: 9 },
    { name: 'возрастающий массив', args: [[1, 2, 3, 4, 5], 2], expected: 9 },
    // best = 0 вместо суммы первого окна провалит именно этот кейс
    { name: 'только отрицательные', args: [[-1, -2, -3, -4], 2], expected: -3 },
    { name: 'окно во весь массив', args: [[5, 1, 1, 1], 4], expected: 8 },
    { name: 'k больше длины', args: [[1, 2], 5], expected: 0 },
    { name: 'k = 0', args: [[1, 2], 0], expected: 0 },
    { name: 'пустой массив', args: [[], 3], expected: 0 },
    { name: 'не мутирует вход', args: [[3, 1, 4, 1, 5], 2], expected: 6, noMutation: true },
  ],
  bench: {
    sizes: [1000, 5000, 20000, 60000, 150000],
    makeArgsSource: '(n) => [Array.from({ length: n }, (_, i) => (i * 37) % 101), 500]',
    compareWith: ['O(n)', 'O(n²)'],
  },
  hints: [
    'Первое окно собирается обычным циклом до k.',
    'Сдвиг окна — это sum += nums[right] - nums[right - k].',
    'Начальное значение ответа — сумма первого окна, а не 0.',
  ],
});
