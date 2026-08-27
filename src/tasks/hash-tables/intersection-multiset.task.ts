import { testTask } from '../test-derived';

export default testTask({
  slug: 'intersection-multiset',
  title: 'Пересечение массивов с повторами',
  topic: 'hash-tables',
  prompt: 'Верни пересечение двух массивов: каждое значение должно встретиться столько раз, сколько оно встречается в обоих массивах.',
  exportName: 'intersect',
  solution: `export function intersect(nums1, nums2) {
  const counts = new Map();
  for (const value of nums1) counts.set(value, (counts.get(value) ?? 0) + 1);
  const result = [];
  for (const value of nums2) {
    const count = counts.get(value) ?? 0;
    if (count > 0) {
      result.push(value);
      counts.set(value, count - 1);
    }
  }
  return result;
}
`,
  cases: [
    { name: 'дубликаты', args: [[1, 2, 2, 1], [2, 2]], expected: [2, 2] },
    { name: 'частичное пересечение', args: [[4, 9, 5], [9, 4, 9, 8, 4]], expected: [9, 4], compare: 'unordered' },
    { name: 'нет пересечения', args: [[1, 2], [3, 4]], expected: [] },
  ],
  hints: ['Сначала посчитай частоты первого массива.', 'Второй проход уменьшает счётчик после добавления значения.'],
});
