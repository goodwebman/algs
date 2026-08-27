import { testTask } from '../test-derived';

export default testTask({
  slug: 'peak-mountain',
  title: 'Пик горного массива',
  topic: 'binary-search',
  prompt: 'В горном массиве найди индекс пика: слева значения растут, справа убывают.',
  exportName: 'peakIndexInMountainArray',
  solution: `export function peakIndexInMountainArray(arr) {
  let left = 0;
  let right = arr.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < arr[mid + 1]) left = mid + 1;
    else right = mid;
  }
  return left;
}
`,
  cases: [
    { name: 'пик в середине', args: [[0, 2, 5, 3, 1]], expected: 2 },
    { name: 'пик справа', args: [[0, 1, 2, 3]], expected: 3 },
    { name: 'пик слева', args: [[3, 2, 1]], expected: 0 },
  ],
  hints: ['Сравнивай mid с его правым соседом.', 'Если подъём продолжается, пик правее; иначе он не правее mid.'],
});
