import { testTask } from '../test-derived';

export default testTask({
  slug: 'valid-anagram',
  title: 'Проверка анаграммы',
  topic: 'hash-tables',
  prompt: 'Верни true, если две строки состоят из одного набора символов с одинаковыми частотами.',
  exportName: 'isAnagram',
  solution: `export function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const counts = new Map();
  for (const char of s) counts.set(char, (counts.get(char) ?? 0) + 1);
  for (const char of t) {
    const count = counts.get(char) ?? 0;
    if (count === 0) return false;
    counts.set(char, count - 1);
  }
  return true;
}
`,
  cases: [
    { name: 'анаграмма', args: ['anagram', 'nagaram'], expected: true },
    { name: 'разные частоты', args: ['rat', 'car'], expected: false },
    { name: 'кириллица', args: ['ёлка', 'лёка'], expected: true },
  ],
  hints: ['Длины строк должны совпасть.', 'Первый проход увеличивает счётчики, второй уменьшает.'],
});
