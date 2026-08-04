import { defineTask } from '../types';

export default defineTask({
  slug: 'insertion-sort',
  title: 'Сортировка вставками',
  topic: 'sorting',
  prompt:
    'Отсортируй массив чисел по возрастанию, реализовав insertion sort.\n' +
    'Верни новый массив. Сдвигай элементы, а не обменивай на каждом шаге.',
  exportName: 'insertionSort',
  starter: `export function insertionSort(nums) {
  // Держи отсортированный префикс, вставляй в него очередной элемент.
  // Сдвиг: nums[j + 1] = nums[j], строгое > в while — ради стабильности.
}
`,
  solution: `export function insertionSort(nums) {
  const result = [...nums];

  for (let i = 1; i < result.length; i += 1) {
    const current = result[i];
    let j = i - 1;

    // Строгое >: равные не сдвигаются — сортировка стабильна.
    while (j >= 0 && result[j] > current) {
      result[j + 1] = result[j];
      j -= 1;
    }

    result[j + 1] = current;
  }

  return result;
}
`,
  cases: [
    { name: 'обычный вход', args: [[5, 2, 4, 6, 1, 3]], expected: [1, 2, 3, 4, 5, 6] },
    { name: 'уже отсортирован', args: [[1, 2, 3, 4, 5]], expected: [1, 2, 3, 4, 5] },
    { name: 'обратный порядок — худший случай', args: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5] },
    { name: 'все равны', args: [[3, 3, 3, 3]], expected: [3, 3, 3, 3] },
    { name: 'пустой массив', args: [[]], expected: [] },
    { name: 'один элемент', args: [[42]], expected: [42] },
    { name: 'почти отсортирован', args: [[1, 2, 4, 3, 5]], expected: [1, 2, 3, 4, 5] },
    { name: 'отрицательные', args: [[3, -1, 2, -1]], expected: [-1, -1, 2, 3] },
  ],
  bench: {
    sizes: [100, 500, 2000, 6000, 15000],
    // Почти отсортированный вход: insertion sort показывает линейное поведение.
    // Каждый сотый элемент не на месте — мало сдвигов на вставку.
    makeArgsSource:
      '(n) => [Array.from({ length: n }, (_, i) => (i % 100 === 0 ? i + 1 : i))]',
    compareWith: ['O(n)', 'O(n²)'],
  },
  hints: [
    'Берёшь result[i], ищешь ему место сдвигами влево.',
    'Сдвиг — это result[j + 1] = result[j], а не обмен.',
    'Строгое > в while сохраняет стабильность и не трогает равные.',
  ],
});
