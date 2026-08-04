import { defineTask } from '../types';

export default defineTask({
  slug: 'first-true',
  title: 'Поиск границы (lower bound)',
  topic: 'binary-search',
  prompt:
    'Дан отсортированный массив и target. Верни первый индекс i,\n' +
    'для которого nums[i] >= target. Если таких нет — верни длину массива\n' +
    '(позицию вставки). Нужно O(log n).',
  exportName: 'firstTrue',
  starter: `export function firstTrue(nums, threshold) {
  // right = nums.length, не length - 1: ответ "никто не подошёл" должен быть выразим.
  // Веток всего две: условие истинно -> right = mid, ложно -> left = mid + 1.
}
`,
  solution: `export function firstTrue(nums, threshold) {
  let left = 0;
  let right = nums.length;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] >= threshold) right = mid;
    else left = mid + 1;
  }

  return left;
}
`,
  cases: [
    { name: 'элемент существует', args: [[1, 3, 5, 6], 5], expected: 2 },
    { name: 'позиция вставки', args: [[1, 3, 5, 6], 2], expected: 1 },
    { name: 'вставка в конец — ответ за массивом', args: [[1, 3, 5, 6], 7], expected: 4 },
    { name: 'первое вхождение среди дубликатов', args: [[2, 2, 2, 5], 2], expected: 0 },
    { name: 'все элементы подходят', args: [[10, 20, 30], 5], expected: 0 },
    { name: 'пустой массив', args: [[], 5], expected: 0 },
    { name: 'threshold меньше всех', args: [[3, 4, 5], 1], expected: 0 },
    { name: 'не мутирует вход', args: [[1, 3, 5], 4], expected: 2, noMutation: true },
  ],
  bench: {
    sizes: [1000, 10000, 100000, 1000000],
    makeArgsSource: '(n) => [Array.from({ length: n }, (_, i) => i), n + 5]',
    compareWith: ['O(log n)', 'O(n)'],
  },
  hints: [
    'right стартует с nums.length, а не length - 1.',
    'while (left < right) — строгое, right это граница, не индекс.',
    'Когда условие истинно, присваивай right = mid — mid может быть ответом.',
  ],
});
