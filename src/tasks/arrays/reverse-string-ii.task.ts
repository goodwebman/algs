import { testTask } from '../test-derived';

export default testTask({
  slug: 'reverse-string-ii',
  title: 'Разворот первых k символов',
  topic: 'arrays',
  prompt: 'Для каждого блока из 2k символов разверни первые k символов. В последнем коротком блоке разверни всё, что есть.',
  exportName: 'reverseStr',
  solution: `export function reverseStr(s, k) {
  const chars = [...s];
  for (let start = 0; start < chars.length; start += 2 * k) {
    let left = start;
    let right = Math.min(start + k - 1, chars.length - 1);
    while (left < right) [chars[left++], chars[right--]] = [chars[right], chars[left]];
  }
  return chars.join('');
}
`,
  cases: [
    { name: 'несколько блоков', args: ['abcdefg', 2], expected: 'bacdfeg' },
    { name: 'короткая строка', args: ['abc', 4], expected: 'cba' },
    { name: 'k один', args: ['abcd', 1], expected: 'abcd' },
  ],
  hints: ['Шаг внешнего цикла равен 2k.', 'Правая граница блока ограничивается длиной строки.'],
});
