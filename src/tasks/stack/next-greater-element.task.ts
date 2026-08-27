import { testTask } from '../test-derived';

export default testTask({
  slug: 'next-greater-element',
  title: 'Следующий больший элемент',
  topic: 'stack',
  prompt: 'Для каждого числа из nums1 найди следующий больший элемент справа в nums2.',
  exportName: 'nextGreaterElement',
  solution: `export function nextGreaterElement(nums1, nums2) {
  const stack = [];
  const next = new Map();
  for (const value of nums2) {
    while (stack.length && value > stack.at(-1)) next.set(stack.pop(), value);
    stack.push(value);
  }
  while (stack.length) next.set(stack.pop(), -1);
  return nums1.map((value) => next.get(value));
}
`,
  cases: [
    { name: 'классика', args: [[4, 1, 2], [1, 3, 4, 2]], expected: [-1, 3, -1] },
    { name: 'все найдены', args: [[2, 4], [1, 2, 3, 4]], expected: [3, -1] },
    { name: 'нет больших', args: [[3], [3, 2, 1]], expected: [-1] },
  ],
  hints: ['Поддерживай стек монотонно убывающим.', 'Когда пришедшее число больше вершины, оно и есть её ответ.'],
});
