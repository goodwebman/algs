import { defineTask } from '../types';

export default defineTask({
  slug: 'merge-sort',
  title: 'Сортировка слиянием',
  topic: 'sorting',
  prompt:
    'Отсортируй массив чисел по возрастанию, реализовав merge sort.\n' +
    'Верни новый массив. Вход мутировать нельзя. Гарантия O(n log n) на любом входе.',
  exportName: 'mergeSort',
  starter: `export function mergeSort(nums) {
  // Рекурсивно режь пополам до одного элемента,
  // потом сливай пары отсортированных половин.
}
`,
  solution: `export function mergeSort(nums) {
  if (nums.length <= 1) return [...nums];

  const mid = Math.floor(nums.length / 2);
  const left = mergeSort(nums.slice(0, mid));
  const right = mergeSort(nums.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0;
  let j = 0;

  // <= при равенстве — ради стабильности: берём левый.
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }

  return result.concat(left.slice(i), right.slice(j));
}
`,
  cases: [
    { name: 'обычный вход', args: [[5, 2, 4, 6, 1, 3]], expected: [1, 2, 3, 4, 5, 6] },
    { name: 'уже отсортирован', args: [[1, 2, 3, 4, 5]], expected: [1, 2, 3, 4, 5] },
    { name: 'обратный порядок', args: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5] },
    { name: 'все равны', args: [[3, 3, 3, 3]], expected: [3, 3, 3, 3] },
    { name: 'пустой массив', args: [[]], expected: [] },
    { name: 'один элемент', args: [[42]], expected: [42] },
    { name: 'отрицательные', args: [[0, -5, 3, -5, 0, 7]], expected: [-5, -5, 0, 0, 3, 7] },
    { name: 'не мутирует вход', args: [[3, 1, 2]], expected: [1, 2, 3], noMutation: true },
  ],
  hints: [
    'Базовый случай: длина <= 1 → вернуть копию.',
    'slice(0, mid) и slice(mid) дают половины для рекурсии.',
    'В merge при равенстве берём левый (<=) — это стабильность.',
  ],
});
