import { testTask } from '../test-derived';

export default testTask({
  slug: 'trapping-rain-water',
  title: 'Собрать дождевую воду',
  topic: 'two-pointers',
  prompt: 'По высотам столбиков вычисли, сколько воды останется после дождя.',
  exportName: 'trap',
  solution: `export function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;
  while (left <= right) {
    if (height[left] <= height[right]) {
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left++];
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right--];
    }
  }
  return water;
}
`,
  cases: [
    { name: 'классика', args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
    { name: 'ровная стена', args: [[3, 3, 3]], expected: 0 },
    { name: 'один провал', args: [[3, 0, 2]], expected: 2 },
  ],
  hints: ['Обрабатывай сторону с меньшей текущей высотой.', 'Вода над позицией равна максимуму слева минус высота.'],
});
