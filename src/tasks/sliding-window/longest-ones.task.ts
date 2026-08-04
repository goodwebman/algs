import { defineTask } from '../types';

export default defineTask({
  slug: 'longest-ones',
  title: 'Максимум единиц при k заменах',
  topic: 'sliding-window',
  prompt:
    'Дан массив из 0 и 1 и число k — сколько нулей разрешено перевернуть в единицы.\n' +
    'Верни максимальную длину серии единиц подряд, которую можно получить.\n' +
    'Переформулируй: самое длинное окно, в котором не более k нулей.',
  exportName: 'longestOnes',
  starter: `export function longestOnes(nums, k) {
  // Считай нули внутри окна. Если их стало больше k — сжимай слева.
  // Длина окна — right - left + 1. Единица здесь не опечатка.
}
`,
  solution: `export function longestOnes(nums, k) {
  let left = 0;
  let zeros = 0;
  let best = 0;

  for (let right = 0; right < nums.length; right += 1) {
    if (nums[right] === 0) zeros += 1;

    while (zeros > k) {
      if (nums[left] === 0) zeros -= 1;
      left += 1;
    }

    best = Math.max(best, right - left + 1);
  }

  return best;
}
`,
  cases: [
    // Ловит потерянную "+1": без неё вернётся 5
    { name: 'ответ — весь массив', args: [[1, 1, 0, 1, 1, 1], 1], expected: 6 },
    { name: 'окно проезжает блок нулей', args: [[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2], expected: 6 },
    { name: 'заменять нечего и нечем', args: [[0, 0, 0], 0], expected: 0 },
    { name: 'нулей нет вообще', args: [[1, 1, 1], 2], expected: 3 },
    { name: 'пустой массив', args: [[], 3], expected: 0 },
    { name: 'k покрывает все нули', args: [[0, 1, 0], 2], expected: 3 },
    { name: 'один элемент', args: [[0], 0], expected: 0 },
  ],
  bench: {
    sizes: [1000, 5000, 20000, 60000, 150000],
    makeArgsSource: '(n) => [Array.from({ length: n }, (_, i) => (i % 7 === 0 ? 0 : 1)), 3]',
    compareWith: ['O(n)', 'O(n²)'],
  },
  hints: [
    'Состояние окна здесь — одно число: сколько нулей внутри.',
    'Сжимай, пока zeros > k. Уменьшай счётчик, только если уходящий элемент был нулём.',
    'Проверь себя на входе, где ответ равен длине массива — там ловится off-by-one.',
  ],
});
