import { testTask } from '../test-derived';

export default testTask({
  slug: 'unique-intersection',
  title: 'Уникальное пересечение массивов',
  topic: 'hash-tables',
  prompt: 'Верни только уникальные значения, которые встречаются и в nums1, и в nums2.',
  exportName: 'intersection',
  solution: `export function intersection(nums1, nums2) {
  const values = new Set(nums1);
  const result = new Set();
  for (const value of nums2) if (values.has(value)) result.add(value);
  return [...result];
}
`,
  cases: [
    { name: 'повторы исчезают', args: [[1, 2, 2, 1], [2, 2]], expected: [2] },
    { name: 'два значения', args: [[4, 9, 5], [9, 4, 9, 8, 4]], expected: [9, 4], compare: 'unordered' },
    { name: 'пустое пересечение', args: [[1], [2]], expected: [] },
  ],
  hints: ['Set убирает повторы автоматически.', 'Второй массив достаточно просмотреть один раз.'],
});
