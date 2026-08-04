import { defineTask } from '../types';

export default defineTask({
  slug: 'move-zeroes',
  title: 'Перенос нулей в конец',
  topic: 'arrays',
  prompt:
    'Сдвинь все нули в конец массива, сохранив относительный порядок остальных элементов.\n' +
    'Работай на месте и верни изменённый массив.\n' +
    'splice в цикле не подойдёт — это O(n²).',
  exportName: 'moveZeroes',
  starter: `export function moveZeroes(nums) {
  // slow — первая позиция, куда должно встать ненулевое значение.
  // fast — ищет ненулевые.
  // Обмен, а не сдвиг: только он сохранит порядок за один проход.
  return nums;
}
`,
  solution: `export function moveZeroes(nums) {
  let slow = 0;

  for (let fast = 0; fast < nums.length; fast += 1) {
    if (nums[fast] === 0) continue;

    if (slow !== fast) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
    }

    slow += 1;
  }

  return nums;
}
`,
  cases: [
    { name: 'классический вход', args: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
    { name: 'нулей нет', args: [[1, 2, 3]], expected: [1, 2, 3] },
    { name: 'все нули', args: [[0, 0, 0]], expected: [0, 0, 0] },
    { name: 'один ненулевой в конце', args: [[0, 0, 1]], expected: [1, 0, 0] },
    { name: 'пустой массив', args: [[]], expected: [] },
    { name: 'порядок сохраняется', args: [[0, 5, 0, 3, 0, 1]], expected: [5, 3, 1, 0, 0, 0] },
    { name: 'отрицательные не трогаем', args: [[0, -1, 0, -2]], expected: [-1, -2, 0, 0] },
  ],
  bench: {
    sizes: [500, 2000, 10000, 40000, 120000],
    makeArgsSource: '(n) => [Array.from({ length: n }, (_, i) => (i % 3 === 0 ? 0 : i))]',
    compareWith: ['O(n)', 'O(n²)'],
  },
  hints: [
    'fast идёт с нуля и просто пропускает нули через continue.',
    'slow увеличивается только когда ненулевое значение поставлено на место.',
    'Проверка slow !== fast избавляет от бессмысленного обмена элемента с самим собой.',
  ],
});
