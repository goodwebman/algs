import { defineTask } from '../types';

export default defineTask({
  slug: 'longest-k-distinct',
  title: 'Подстрока с k различными символами',
  topic: 'sliding-window',
  prompt:
    'Найди длину самой длинной подстроки, содержащей не более k различных символов.\n' +
    'Нужно O(n) по времени и O(k) по памяти.',
  exportName: 'longestKDistinct',
  starter: `export function longestKDistinct(input, k) {
  // Состояние окна — счётчик частот в Map.
  // Количество различных символов — это counts.size.
  //
  // Внимание: когда счётчик символа дошёл до нуля, запись нужно УДАЛИТЬ.
}
`,
  solution: `export function longestKDistinct(input, k) {
  const chars = [...input];
  const counts = new Map();
  let left = 0;
  let best = 0;

  for (let right = 0; right < chars.length; right += 1) {
    const char = chars[right];
    counts.set(char, (counts.get(char) ?? 0) + 1);

    while (counts.size > k) {
      const leaving = chars[left];
      const next = counts.get(leaving) - 1;

      // Иначе counts.size соврёт и окно не перестанет сжиматься.
      if (next === 0) counts.delete(leaving);
      else counts.set(leaving, next);

      left += 1;
    }

    best = Math.max(best, right - left + 1);
  }

  return best;
}
`,
  cases: [
    { name: 'классический вход', args: ['eceba', 2], expected: 3 },
    { name: 'один символ повторяется', args: ['aa', 1], expected: 2 },
    { name: 'k = 0', args: ['abc', 0], expected: 0 },
    { name: 'k больше алфавита строки', args: ['abc', 10], expected: 3 },
    { name: 'пустая строка', args: ['', 2], expected: 0 },
    // Ловит незакрытую запись со значением 0
    { name: 'повторы внутри окна', args: ['aabbcc', 2], expected: 4 },
    { name: 'длинный хвост', args: ['abcadcacacaca', 3], expected: 11 },
  ],
  bench: {
    sizes: [1000, 5000, 20000, 60000, 150000],
    makeArgsSource: "(n) => [Array.from({ length: n }, (_, i) => 'abcde'[i % 5]).join(''), 3]",
    compareWith: ['O(n)', 'O(n²)'],
  },
  hints: [
    'counts.size — это и есть количество различных символов в окне.',
    'При сжатии удаляй ключ, когда счётчик стал нулём: counts.delete(char).',
    'Проверь на "aabbcc" — там повторы, и незакрытые нулевые записи сразу дадут неверный ответ.',
  ],
});
