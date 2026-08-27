import { testTask } from '../test-derived';

export default testTask({
  slug: 'search-rotated',
  title: 'Поиск в повёрнутом массиве',
  topic: 'binary-search',
  prompt: 'Найди target в отсортированном массиве, который был повёрнут в неизвестной точке. Верни индекс или -1.',
  exportName: 'search',
  solution: `export function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    if (nums[left] <= nums[mid]) {
      if (nums[left] <= target && target < nums[mid]) right = mid - 1;
      else left = mid + 1;
    } else if (nums[mid] < target && target <= nums[right]) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
`,
  cases: [
    { name: 'поворот в середине', args: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
    { name: 'элемент отсутствует', args: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
    { name: 'без поворота', args: [[1, 2, 3, 4], 1], expected: 0 },
  ],
  hints: ['В каждый момент одна половина остаётся отсортированной.', 'Проверь, попадает ли target в границы этой половины.'],
});
