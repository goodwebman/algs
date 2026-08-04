import { defineTask } from '../types';

export default defineTask({
  slug: 'remove-duplicates',
  title: 'Удаление дубликатов на месте',
  topic: 'arrays',
  prompt:
    'Дан отсортированный массив. Удали повторы НА МЕСТЕ и верни новую длину k.\n' +
    'Первые k элементов должны содержать уникальные значения в исходном порядке.\n' +
    'Что лежит после k — не важно. Дополнительная память — O(1), Set использовать нельзя.',
  exportName: 'removeDuplicates',
  starter: `export function removeDuplicates(nums) {
  // slow — последний записанный уникальный элемент.
  // fast — читает исходные данные.
  // Не забудь про пустой массив.
}
`,
  solution: `export function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  let slow = 0;

  for (let fast = 1; fast < nums.length; fast += 1) {
    if (nums[fast] === nums[slow]) continue;

    slow += 1;
    nums[slow] = nums[fast];
  }

  return slow + 1;
}
`,
  cases: [
    { name: 'один дубликат', args: [[1, 1, 2]], expected: 2 },
    { name: 'много повторов', args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]], expected: 5 },
    { name: 'дубликатов нет', args: [[1, 2, 3]], expected: 3 },
    { name: 'все одинаковые', args: [[7, 7, 7, 7]], expected: 1 },
    { name: 'пустой массив', args: [[]], expected: 0 },
    { name: 'один элемент', args: [[5]], expected: 1 },
    { name: 'отрицательные числа', args: [[-3, -3, -1, 0, 0]], expected: 3 },
  ],
  bench: {
    sizes: [500, 2000, 10000, 40000, 120000],
    makeArgsSource: '(n) => [Array.from({ length: n }, (_, i) => Math.floor(i / 2))]',
    // Решение через splice в цикле уедет на O(n²) — сравнение это покажет.
    compareWith: ['O(n)', 'O(n²)'],
  },
  hints: [
    'Пустой массив нужно обработать до цикла: иначе вернёшь 1 вместо 0.',
    'Цикл начинается с fast = 1 — первый элемент уникален по определению.',
    'Возвращается slow + 1, потому что slow — это индекс, а не количество.',
  ],
});
