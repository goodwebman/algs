import { testTask } from '../test-derived';

export default testTask({
  slug: 'next-greater-elements',
  title: 'Следующий больший элемент по кругу',
  topic: 'stack',
  prompt: 'Для каждого элемента кольцевого массива найди первый больший элемент справа. Если его нет, верни -1.',
  exportName: 'nextGreaterElements',
  solution: `export function nextGreaterElements(nums) {
  const result = Array(nums.length).fill(-1);
  const stack = [];
  for (let i = 0; i < nums.length * 2; i += 1) {
    const index = i % nums.length;
    while (stack.length && nums[index] > nums[stack.at(-1)]) {
      result[stack.pop()] = nums[index];
    }
    if (i < nums.length) stack.push(index);
  }
  return result;
}
`,
  cases: [
    { name: 'кольцо', args: [[1, 2, 1]], expected: [2, -1, 2] },
    { name: 'убывание', args: [[5, 4, 3, 2, 1]], expected: [-1, 5, 5, 5, 5] },
    { name: 'один элемент', args: [[7]], expected: [-1] },
  ],
  hints: ['Стек хранит индексы, которым ещё не нашли ответ.', 'Второй проход моделирует переход через конец массива.'],
});
