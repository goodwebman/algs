import { defineTask } from '../types';

export default defineTask({
  slug: 'min-subarray-len',
  title: 'Кратчайший подмассив с суммой ≥ target',
  topic: 'sliding-window',
  prompt:
    'Дан массив положительных чисел и target.\n' +
    'Верни минимальную длину непрерывного подмассива с суммой не меньше target.\n' +
    'Если такого нет — верни 0. Нужно O(n).\n' +
    'Порядок аргументов: (target, nums).',
  exportName: 'minSubArrayLen',
  starter: `export function minSubArrayLen(target, nums) {
  // Расширяй окно, пока суммы не хватает.
  // Как только хватило — сжимай слева, пока условие держится.
  // Сжатие обязательно while, а не if.
}
`,
  solution: `export function minSubArrayLen(target, nums) {
  let left = 0;
  let sum = 0;
  let best = Infinity;

  for (let right = 0; right < nums.length; right += 1) {
    sum += nums[right];

    while (sum >= target) {
      // Длину запоминаем ДО вычитания — окно ещё то самое.
      best = Math.min(best, right - left + 1);
      sum -= nums[left];
      left += 1;
    }
  }

  return best === Infinity ? 0 : best;
}
`,
  cases: [
    { name: 'ответ в конце', args: [7, [2, 3, 1, 2, 4, 3]], expected: 2 },
    { name: 'одного элемента достаточно', args: [4, [1, 4, 4]], expected: 1 },
    { name: 'подходит только весь массив', args: [15, [1, 2, 3, 4, 5]], expected: 5 },
    { name: 'суммы не хватает', args: [11, [1, 1, 1, 1, 1, 1, 1, 1]], expected: 0 },
    { name: 'пустой массив', args: [1, []], expected: 0 },
    { name: 'сумма попадает точно в target', args: [6, [1, 2, 3]], expected: 3 },
    { name: 'первый же элемент подходит', args: [3, [10, 1, 1]], expected: 1 },
  ],
  bench: {
    sizes: [1000, 5000, 20000, 60000, 150000],
    makeArgsSource: '(n) => [n * 3, Array.from({ length: n }, () => 1)]',
    compareWith: ['O(n)', 'O(n²)'],
  },
  hints: [
    'best начинается с Infinity, а возвращается 0, если он таким и остался.',
    'Обновляй ответ ДО того, как вычтешь nums[left].',
    'Сжатие — while (sum >= target), потому что сжимать может понадобиться несколько раз подряд.',
  ],
});
