import { defineTask } from '../types';

export default defineTask({
  slug: 'k-largest',
  title: 'k наибольших элементов через кучу',
  topic: 'heap',
  prompt:
    'Верни k наибольших элементов массива в порядке убывания.\n' +
    'Нужно O(n log k), а не O(n log n): держи мин-кучу размера k.\n' +
    'Как только куча переполнилась — выбрасывай минимум.',
  exportName: 'kLargest',
  starter: `export function kLargest(nums, k) {
  // Мин-куча размера k: её корень — наименьший из k лучших.
  // Новый элемент больше корня? Заменяем корень и просеиваем вниз.
  //
  // Придётся написать siftUp и siftDown — в JS кучи нет.
}
`,
  solution: `export function kLargest(nums, k) {
  if (k <= 0) return [];

  const heap = [];

  const siftUp = (start) => {
    let i = start;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (heap[parent] <= heap[i]) break;
      [heap[parent], heap[i]] = [heap[i], heap[parent]];
      i = parent;
    }
  };

  const siftDown = () => {
    let i = 0;
    for (;;) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;

      if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
      if (right < heap.length && heap[right] < heap[smallest]) smallest = right;
      if (smallest === i) break;

      [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
      i = smallest;
    }
  };

  for (const value of nums) {
    if (heap.length < k) {
      heap.push(value);
      siftUp(heap.length - 1);
    } else if (value > heap[0]) {
      // Корень — наименьший из текущих лучших. Новый больше — вытесняем.
      heap[0] = value;
      siftDown();
    }
  }

  return heap.sort((a, b) => b - a);
}
`,
  cases: [
    { name: 'три наибольших', args: [[3, 1, 5, 12, 2, 11], 3], expected: [12, 11, 5] },
    { name: 'k равно длине', args: [[3, 1, 2], 3], expected: [3, 2, 1] },
    { name: 'k = 1', args: [[5, 9, 2], 1], expected: [9] },
    { name: 'k = 0', args: [[1, 2, 3], 0], expected: [] },
    { name: 'дубликаты', args: [[4, 4, 4, 1], 2], expected: [4, 4] },
    { name: 'отрицательные', args: [[-5, -1, -10], 2], expected: [-1, -5] },
    { name: 'пустой массив', args: [[], 3], expected: [] },
    { name: 'не мутирует вход', args: [[3, 1, 5], 2], expected: [5, 3], noMutation: true },
  ],
  bench: {
    sizes: [1000, 5000, 20000, 60000, 150000],
    makeArgsSource: '(n) => [Array.from({ length: n }, (_, i) => (i * 37) % n), 10]',
    compareWith: ['O(n)', 'O(n log n)'],
  },
  hints: [
    'Мин-куча размера k: в корне лежит наименьший из k лучших кандидатов.',
    'Пока куча меньше k — просто добавляй с просеиванием вверх.',
    'Когда куча полна и новый элемент больше корня — заменяй корень и просеивай вниз.',
  ],
});
