import { defineTask } from '../types';

export default defineTask({
  slug: 'sorted-squares',
  title: 'Квадраты отсортированного массива',
  topic: 'two-pointers',
  prompt:
    'Дан массив чисел, отсортированный по возрастанию (могут быть отрицательные).\n' +
    'Верни новый массив квадратов, тоже отсортированный по возрастанию, за O(n).\n' +
    'Сортировать заново нельзя — это O(n log n).',
  exportName: 'sortedSquares',
  starter: `export function sortedSquares(nums) {
  // Максимальный квадрат всегда на одном из краёв.
  // Заполняй результат с КОНЦА — тогда unshift не понадобится.
}
`,
  solution: `export function sortedSquares(nums) {
  const result = new Array(nums.length).fill(0);
  let left = 0;
  let right = nums.length - 1;

  for (let write = nums.length - 1; write >= 0; write -= 1) {
    const leftSquare = nums[left] * nums[left];
    const rightSquare = nums[right] * nums[right];

    if (leftSquare > rightSquare) {
      result[write] = leftSquare;
      left += 1;
    } else {
      result[write] = rightSquare;
      right -= 1;
    }
  }

  return result;
}
`,
  cases: [
    { name: 'смешанный массив', args: [[-4, -1, 0, 3, 10]], expected: [0, 1, 9, 16, 100] },
    { name: 'чередование указателей', args: [[-7, -3, 2, 3, 11]], expected: [4, 9, 9, 49, 121] },
    { name: 'только положительные', args: [[1, 2, 3]], expected: [1, 4, 9] },
    { name: 'только отрицательные', args: [[-5, -4, -3]], expected: [9, 16, 25] },
    { name: 'пустой массив', args: [[]], expected: [] },
    { name: 'один элемент', args: [[-5]], expected: [25] },
    { name: 'нули и повторы', args: [[-2, -2, 0, 2, 2]], expected: [0, 4, 4, 4, 4] },
    { name: 'не мутирует вход', args: [[-3, -1, 2]], expected: [1, 4, 9], noMutation: true },
  ],
  bench: {
    sizes: [200, 1000, 4000, 12000, 30000],
    makeArgsSource: '(n) => [Array.from({ length: n }, (_, i) => i - Math.floor(n / 2))]',
    // Если вместо записи по индексу использовать unshift, замер ляжет на O(n²) —
    // именно ради этого сравнения здесь две опорные кривые.
    compareWith: ['O(n)', 'O(n²)'],
  },
  hints: [
    'Заведи результат нужной длины сразу: new Array(nums.length).fill(0).',
    'Указатель записи идёт от конца к началу, вместе с обычным циклом for.',
    'Сравнивай квадраты, а не сами числа: -4 больше по модулю, чем 3, хотя меньше по значению.',
  ],
});
