import { testTask } from '../test-derived';

export default testTask({
  slug: 'longest-palindrome-length',
  title: 'Длина самого длинного палиндрома',
  topic: 'hash-tables',
  prompt: 'Из символов строки можно переставлять буквы. Верни максимальную длину палиндрома, который можно собрать.',
  exportName: 'longestPalindrome',
  solution: `export function longestPalindrome(s) {
  const counts = new Map();
  for (const char of s) counts.set(char, (counts.get(char) ?? 0) + 1);
  let length = 0;
  let odd = false;
  for (const count of counts.values()) {
    length += Math.floor(count / 2) * 2;
    if (count % 2) odd = true;
  }
  return length + (odd ? 1 : 0);
}
`,
  cases: [
    { name: 'классика', args: ['abccccdd'], expected: 7 },
    { name: 'один символ', args: ['a'], expected: 1 },
    { name: 'все разные', args: ['abc'], expected: 1 },
  ],
  hints: ['В палиндром входят пары символов.', 'Одну нечётную группу можно поставить в центр.'],
});
