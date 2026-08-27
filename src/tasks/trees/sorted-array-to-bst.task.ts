import { testTask } from '../test-derived';

export default testTask({
  slug: 'sorted-array-to-bst',
  title: 'Сбалансированное BST из массива',
  topic: 'trees',
  prompt: 'Построй из отсортированного массива сбалансированное дерево поиска. Узел имеет вид { val, left, right }.',
  exportName: 'sortedArrayToBST',
  solution: `export function sortedArrayToBST(nums) {
  function build(left, right) {
    if (left > right) return null;
    const mid = Math.floor((left + right) / 2);
    return { val: nums[mid], left: build(left, mid - 1), right: build(mid + 1, right) };
  }
  return build(0, nums.length - 1);
}
`,
  cases: [
    { name: 'три элемента', args: [[-3, 0, 9]], expected: { val: 0, left: { val: -3, left: null, right: null }, right: { val: 9, left: null, right: null } } },
    { name: 'пять элементов', args: [[1, 2, 3, 4, 5]], expected: { val: 3, left: { val: 1, left: null, right: { val: 2, left: null, right: null } }, right: { val: 4, left: null, right: { val: 5, left: null, right: null } } } },
    { name: 'пустой массив', args: [[]], expected: null },
  ],
  hints: ['Середина текущего диапазона становится корнем.', 'Рекурсивно построй левую и правую половины.'],
});
