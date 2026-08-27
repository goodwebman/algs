import { testTask } from '../test-derived';

export default testTask({
  slug: 'reverse-vowels',
  title: 'Развернуть гласные',
  topic: 'two-pointers',
  prompt: 'Разверни только гласные буквы строки, сохранив остальные символы на местах.',
  exportName: 'reverseVowels',
  solution: `export function reverseVowels(input) {
  const vowels = new Set('aeiouAEIOU');
  const chars = [...input];
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    while (left < right && !vowels.has(chars[left])) left += 1;
    while (left < right && !vowels.has(chars[right])) right -= 1;
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left += 1;
    right -= 1;
  }
  return chars.join('');
}
`,
  cases: [
    { name: 'обычная строка', args: ['hello'], expected: 'holle' },
    { name: 'с пробелами', args: ['leetcode'], expected: 'leotcede' },
    { name: 'без гласных', args: ['rhythm'], expected: 'rhythm' },
  ],
  hints: ['Оба указателя пропускают согласные.', 'Меняй символы только когда оба указателя стоят на гласных.'],
});
