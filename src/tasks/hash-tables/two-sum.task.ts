import { defineTask } from '../types';

export default defineTask({
  slug: 'two-sum',
  title: 'Пара с заданной суммой (Map)',
  topic: 'hash-tables',
  prompt:
    'Дан НЕотсортированный массив чисел и target.\n' +
    'Верни [i, j] — индексы двух разных элементов с суммой target, или null.\n' +
    'Нужен один проход: O(n) по времени. Сортировать нельзя — индексы должны остаться исходными.',
  exportName: 'twoSum',
  starter: `export function twoSum(nums, target) {
  // Для каждого элемента спроси: видел ли я раньше число, которого не хватает?
  // Map ответит за O(1).
  //
  // Внимательно с порядком: проверка или запись — что должно быть первым?
}
`,
  solution: `export function twoSum(nums, target) {
  const seen = new Map();

  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];

    // Проверка ДО записи, иначе элемент найдёт сам себя.
    if (seen.has(need)) return [seen.get(need), i];

    seen.set(nums[i], i);
  }

  return null;
}
`,
  cases: [
    { name: 'ответ в начале', args: [[2, 7, 11, 15], 9], expected: [0, 1] },
    { name: 'неотсортированный вход', args: [[3, 2, 4], 6], expected: [1, 2] },
    { name: 'два одинаковых числа', args: [[3, 3], 6], expected: [0, 1] },
    { name: 'один элемент не может дать пару', args: [[3], 6], expected: null },
    { name: 'ответа нет', args: [[1, 5, 9], 100], expected: null },
    { name: 'пустой массив', args: [[], 0], expected: null },
    { name: 'отрицательные числа', args: [[-3, 4, 3, 90], 0], expected: [0, 2] },
    { name: 'нули', args: [[0, 4, 0], 0], expected: [0, 2] },
    { name: 'не мутирует вход', args: [[2, 7, 11, 15], 26], expected: [2, 3], noMutation: true },
  ],
  bench: {
    sizes: [200, 1000, 5000, 20000, 60000],
    // Ответа нет — значит проход полный и Map вырастает до размера массива.
    makeArgsSource: '(n) => [Array.from({ length: n }, (_, i) => i * 2), 1]',
    compareWith: ['O(n)', 'O(n²)'],
  },
  hints: [
    'Заведи Map: ключ — значение элемента, значение — его индекс.',
    'need = target - nums[i]. Если need уже в Map — ответ найден.',
    'Записывай текущий элемент в Map только ПОСЛЕ проверки.',
  ],
});
