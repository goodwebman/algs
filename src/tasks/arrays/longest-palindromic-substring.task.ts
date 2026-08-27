import { testTask } from '../test-derived';

export default testTask({
  slug: 'longest-palindromic-substring',
  title: 'Самая длинная палиндромная подстрока',
  topic: 'arrays',
  prompt: 'Верни самую длинную подстроку-палиндром. Если вариантов несколько, подойдёт любой из них.',
  exportName: 'longestPalindrome',
  solution: `export function longestPalindrome(s) {
  let best = '';
  const expand = (left, right) => {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      if (right - left + 1 > best.length) best = s.slice(left, right + 1);
      left -= 1;
      right += 1;
    }
  };
  for (let i = 0; i < s.length; i += 1) {
    expand(i, i);
    expand(i, i + 1);
  }
  return best;
}
`,
  cases: [
    { name: 'нечётный центр', args: ['babad'], expected: 'bab' },
    { name: 'чётный центр', args: ['cbbd'], expected: 'bb' },
    { name: 'один символ', args: ['a'], expected: 'a' },
  ],
  hints: ['У каждого палиндрома есть центр: символ или щель.', 'Расширяйся от каждого из 2n - 1 центров.'],
});
