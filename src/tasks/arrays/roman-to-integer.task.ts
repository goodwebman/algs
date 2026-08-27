import { testTask } from '../test-derived';

export default testTask({
  slug: 'roman-to-integer',
  title: 'Римское число в целое',
  topic: 'arrays',
  prompt: 'Преобразуй корректную запись римского числа в десятичное значение.',
  exportName: 'romanToInt',
  solution: `export function romanToInt(s) {
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let result = 0;
  for (let i = 0; i < s.length; i += 1) {
    result += values[s[i]] < values[s[i + 1]] ? -values[s[i]] : values[s[i]];
  }
  return result;
}
`,
  cases: [
    { name: 'обычное число', args: ['III'], expected: 3 },
    { name: 'вычитание', args: ['IV'], expected: 4 },
    { name: 'сложное число', args: ['MCMXCIV'], expected: 1994 },
  ],
  hints: ['Если следующий символ больше текущего, текущий нужно вычесть.', 'Иначе прибавляй значение текущего символа.'],
});
