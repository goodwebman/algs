import { defineTask } from '../types';

export default defineTask({
  slug: 'quick-sort',
  title: 'Быстрая сортировка',
  topic: 'sorting',
  prompt:
    'Отсортируй массив чисел по возрастанию, реализовав quicksort.\n' +
    'Верни новый массив. Опорный — середина отрезка, не край:\n' +
    'иначе отсортированный вход даст худший случай O(n²).',
  exportName: 'quickSort',
  starter: `export function quickSort(nums) {
  // partition вокруг опорного, потом рекурсия по обеим частям.
  // Опорный возьми из середины отрезка.
}
`,
  solution: `export function quickSort(nums) {
  if (nums.length <= 1) return [...nums];

  const result = [...nums];
  sort(result, 0, result.length - 1);
  return result;
}

function sort(nums, low, high) {
  if (low >= high) return;

  const pivotIndex = partition(nums, low, high);
  sort(nums, low, pivotIndex - 1);
  sort(nums, pivotIndex + 1, high);
}

function partition(nums, low, high) {
  // Середина, не край — защита от вырождения на отсортированном входе.
  const mid = low + Math.floor((high - low) / 2);
  [nums[mid], nums[high]] = [nums[high], nums[mid]];

  const pivot = nums[high];
  let boundary = low;

  for (let i = low; i < high; i += 1) {
    if (nums[i] < pivot) {
      [nums[i], nums[boundary]] = [nums[boundary], nums[i]];
      boundary += 1;
    }
  }

  [nums[boundary], nums[high]] = [nums[high], nums[boundary]];
  return boundary;
}
`,
  cases: [
    { name: 'обычный вход', args: [[5, 2, 4, 6, 1, 3]], expected: [1, 2, 3, 4, 5, 6] },
    // Без защиты (опорный-край) этот кейс вырождается в O(n²), но ответ тот же —
    // тест ловит только корректность, не асимптотику. Асимптотику проверяет бенч.
    { name: 'отсортированный вход', args: [[1, 2, 3, 4, 5]], expected: [1, 2, 3, 4, 5] },
    { name: 'обратный порядок', args: [[5, 4, 3, 2, 1]], expected: [1, 2, 3, 4, 5] },
    { name: 'все равны', args: [[3, 3, 3, 3]], expected: [3, 3, 3, 3] },
    { name: 'пустой массив', args: [[]], expected: [] },
    { name: 'один элемент', args: [[42]], expected: [42] },
    { name: 'дубликаты вперемешку', args: [[3, 1, 3, 1, 2, 2]], expected: [1, 1, 2, 2, 3, 3] },
    { name: 'не мутирует вход', args: [[3, 1, 2]], expected: [1, 2, 3], noMutation: true },
  ],
  bench: {
    sizes: [1000, 5000, 20000, 60000, 150000],
    // Отсортированный вход: с опорным-серединой должно остаться O(n log n).
    makeArgsSource: '(n) => [Array.from({ length: n }, (_, i) => i)]',
    compareWith: ['O(n log n)', 'O(n²)'],
  },
  hints: [
    'Опорный бери из середины отрезка и временно отправляй в конец.',
    'boundary делит массив на «меньше опорного» и «остальное».',
    'Финальный обмен ставит опорный на его финальную позицию — верни boundary.',
  ],
});
