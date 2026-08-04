import { defineTask } from '../types';

export default defineTask({
  slug: 'binary-search',
  title: 'Бинарный поиск',
  topic: 'binary-search',
  prompt:
    'Дан отсортированный массив и target. Верни индекс элемента, равного target.\n' +
    'Если такого нет — верни −1. Нужно O(log n): линейный indexOf не подойдёт.',
  exportName: 'binarySearch',
  starter: `export function binarySearch(nums, target) {
  // Инвариант: ответ, если есть, лежит в [left, right].
  // Середина сравнивается с target, половина отбрасывается.
  // Условие цикла — left <= right, не строгое.
}
`,
  solution: `export function binarySearch(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] === target) return mid;
    if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}
`,
  cases: [
    { name: 'элемент в середине', args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4 },
    { name: 'элемента нет', args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1 },
    { name: 'первый элемент', args: [[1, 2, 3], 1], expected: 0 },
    { name: 'последний элемент', args: [[1, 2, 3], 3], expected: 2 },
    { name: 'пустой массив', args: [[], 5], expected: -1 },
    { name: 'один элемент — совпал', args: [[5], 5], expected: 0 },
    // left <= right обязательно, иначе этот кейс вернёт -1
    { name: 'один элемент — не совпал', args: [[5], 3], expected: -1 },
    { name: 'дубликаты — любой из равных', args: [[1, 3, 3, 3, 5], 3], expected: 2 },
  ],
  bench: {
    sizes: [1000, 10000, 100000, 1000000],
    makeArgsSource: '(n) => [Array.from({ length: n }, (_, i) => i * 2), 1]',
    compareWith: ['O(log n)', 'O(n)'],
  },
  hints: [
    'left + Math.floor((right - left) / 2) — безопасная середина.',
    'Найденное равенство возвращает mid немедленно.',
    'Сравнение в while нестрогое (<=): отрезок из одного элемента ещё нужно проверить.',
  ],
});
