import { testTask } from '../test-derived';

export default testTask({
  slug: 'flatten-array',
  title: 'Уплощение вложенного массива',
  topic: 'recursion',
  prompt: 'Преврати массив произвольной вложенности в плоский массив, сохранив порядок элементов.',
  exportName: 'flatten',
  solution: `export function flatten(items) {
  const result = [];
  for (const item of items) {
    if (Array.isArray(item)) result.push(...flatten(item));
    else result.push(item);
  }
  return result;
}
`,
  cases: [
    { name: 'вложенные массивы', args: [[1, [2, [3]], 4]], expected: [1, 2, 3, 4] },
    { name: 'пустые ветви', args: [[[], [1], [[2, 3]]]], expected: [1, 2, 3] },
    { name: 'уже плоский', args: [[1, 2, 3]], expected: [1, 2, 3] },
  ],
  hints: ['Массив — это рекурсивный случай.', 'Примитив добавляй в результат напрямую.'],
});
