import { defineTask } from '../types';

export default defineTask({
  slug: 'longest-repeating-replacement',
  title: 'Одинаковые буквы при k заменах',
  topic: 'sliding-window',
  prompt:
    'Дана строка и число k — сколько символов разрешено заменить на любые другие.\n' +
    'Верни максимальную длину подстроки из одинаковых букв, которую можно получить.\n' +
    'Подсказка: окно допустимо, когда (длина − частота самого частого символа) ≤ k.',
  exportName: 'longestRepeatingReplacement',
  starter: `export function longestRepeatingReplacement(input, k) {
  // Считай частоты символов в окне.
  // Замен нужно: длина окна минус частота доминирующего символа.
  //
  // Уменьшай счётчик по СИМВОЛУ (chars[left]), а не по индексу (left).
}
`,
  solution: `export function longestRepeatingReplacement(input, k) {
  const chars = [...input];
  const counts = new Map();
  let left = 0;
  let best = 0;
  let maxCount = 0;

  for (let right = 0; right < chars.length; right += 1) {
    const char = chars[right];
    counts.set(char, (counts.get(char) ?? 0) + 1);
    maxCount = Math.max(maxCount, counts.get(char));

    while (right - left + 1 - maxCount > k) {
      const leaving = chars[left];
      counts.set(leaving, counts.get(leaving) - 1);
      left += 1;
    }

    best = Math.max(best, right - left + 1);
  }

  return best;
}
`,
  cases: [
    { name: 'заменяем обе B', args: ['ABAB', 2], expected: 4 },
    // Ловит ошибку "ключ вместо символа": окно перестаёт сжиматься и ответ завышается
    { name: 'окно реально сжимается', args: ['AABABBA', 1], expected: 4 },
    { name: 'замены не нужны', args: ['AAAA', 0], expected: 4 },
    { name: 'все символы разные', args: ['ABCDE', 1], expected: 2 },
    { name: 'пустая строка', args: ['', 2], expected: 0 },
    { name: 'один символ', args: ['A', 5], expected: 1 },
    { name: 'k больше длины строки', args: ['AB', 10], expected: 2 },
  ],
  bench: {
    sizes: [1000, 5000, 20000, 60000, 150000],
    makeArgsSource: "(n) => [Array.from({ length: n }, (_, i) => 'ABC'[i % 3]).join(''), 2]",
    compareWith: ['O(n)', 'O(n²)'],
  },
  hints: [
    'maxCount — частота самого частого символа, встреченного в окне.',
    'Условие сжатия: (right - left + 1) - maxCount > k.',
    'При сжатии уменьшай counts для chars[left], а не для left — это классическая опечатка.',
  ],
});
