import { defineTask } from '../types';

export default defineTask({
  slug: 'two-sum-sorted',
  title: 'Пара с заданной суммой',
  topic: 'two-pointers',
  prompt:
    'Дан массив чисел, отсортированный по возрастанию, и число target.\n' +
    'Верни массив [i, j] — индексы двух РАЗНЫХ элементов, дающих в сумме target.\n' +
    'Если такой пары нет — верни null. Дополнительная память — O(1).',
  exportName: 'twoSumSorted',
  starter: `export function twoSumSorted(nums, target) {
  // Массив отсортирован — это ключ к решению за один проход.
  // Подумай: если сумма краёв меньше target, какой указатель двигать?
}
`,
  solution: `export function twoSumSorted(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];

    if (sum === target) return [left, right];
    // Сумма мала — увеличить её можно только сдвигом left:
    // любая пара с текущим left даст ещё меньше.
    if (sum < target) left += 1;
    else right -= 1;
  }

  return null;
}
`,
  cases: [
    { name: 'ответ в начале и конце', args: [[2, 7, 11, 15], 9], expected: [0, 1] },
    { name: 'указатели идут навстречу', args: [[1, 3, 4, 5, 7, 11], 9], expected: [2, 3] },
    { name: 'ответа нет', args: [[1, 2, 3], 100], expected: null },
    { name: 'отрицательные числа', args: [[-4, -1, 0, 3, 10], -1], expected: [0, 3] },
    { name: 'ровно два элемента', args: [[3, 3], 6], expected: [0, 1] },
    { name: 'пустой массив', args: [[], 5], expected: null },
    { name: 'один элемент — пары быть не может', args: [[5], 10], expected: null },
    {
      name: 'нельзя использовать один элемент дважды',
      args: [[1, 2, 4], 8],
      expected: null,
    },
    { name: 'не мутирует вход', args: [[1, 2, 3, 4], 7], expected: [2, 3], noMutation: true },
  ],
  bench: {
    sizes: [100, 500, 2000, 8000, 30000],
    // Ответа в массиве нет — значит указатели пройдут его целиком,
    // и замер покажет честный худший случай, а не удачное попадание на первом шаге.
    makeArgsSource: '(n) => [Array.from({ length: n }, (_, i) => i * 2), 1]',
    compareWith: ['O(n)', 'O(n²)'],
  },
  hints: [
    'Начни с двух указателей: left = 0, right = nums.length - 1.',
    'Сравни nums[left] + nums[right] с target. Три случая: равно, меньше, больше.',
    'Условие цикла — left < right, а не left <= right: иначе один элемент сложится сам с собой.',
  ],
});
