import { testTask } from '../test-derived';

export default testTask({
  slug: 'container-water',
  title: 'Самый вместительный контейнер',
  topic: 'two-pointers',
  prompt: 'Найди две линии, которые образуют контейнер максимальной площади.',
  exportName: 'maxArea',
  solution: `export function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;
  while (left < right) {
    best = Math.max(best, Math.min(height[left], height[right]) * (right - left));
    if (height[left] < height[right]) left += 1;
    else right -= 1;
  }
  return best;
}
`,
  cases: [
    { name: 'классика', args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
    { name: 'две линии', args: [[1, 1]], expected: 1 },
    { name: 'возрастающие', args: [[1, 2, 3, 4]], expected: 4 },
  ],
  hints: ['Ширина уменьшается на каждом шаге.', 'Сдвигай меньшую линию: другая не может улучшить площадь без увеличения меньшей высоты.'],
});
