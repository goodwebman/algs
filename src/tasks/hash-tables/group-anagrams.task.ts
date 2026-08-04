import { defineTask } from '../types';

export default defineTask({
  slug: 'group-anagrams',
  title: 'Группировка анаграмм',
  topic: 'hash-tables',
  prompt:
    'Разложи слова по группам: в одной группе — слова из одних и тех же букв.\n' +
    'Верни массив групп. Порядок групп не важен, порядок слов внутри группы — как во входе.\n' +
    'Нужен один проход по словам.',
  exportName: 'groupAnagrams',
  starter: `export function groupAnagrams(words) {
  // Придумай канонический вид: представление, одинаковое у всех анаграмм.
  // Дальше это обычная группировка по ключу в Map.
}
`,
  solution: `export function groupAnagrams(words) {
  const groups = new Map();

  for (const word of words) {
    const key = [...word].sort().join('');
    const bucket = groups.get(key);

    if (bucket) bucket.push(word);
    else groups.set(key, [word]);
  }

  return [...groups.values()];
}
`,
  cases: [
    {
      name: 'три группы',
      args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']],
      expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']],
      compare: 'unordered',
    },
    { name: 'пустой вход', args: [[]], expected: [], compare: 'unordered' },
    { name: 'одно слово', args: [['a']], expected: [['a']], compare: 'unordered' },
    {
      name: 'анаграмм нет',
      args: [['abc', 'xyz']],
      expected: [['abc'], ['xyz']],
      compare: 'unordered',
    },
    { name: 'пустые строки — одна группа', args: [['', '']], expected: [['', '']], compare: 'unordered' },
    {
      name: 'разная длина не анаграммы',
      args: [['ab', 'aab', 'ba']],
      expected: [['ab', 'ba'], ['aab']],
      compare: 'unordered',
    },
    {
      name: 'опасные ключи',
      args: [['constructor', 'rotcurtsnoc']],
      expected: [['constructor', 'rotcurtsnoc']],
      compare: 'unordered',
    },
  ],
  hints: [
    'Канонический вид проще всего — отсортированные буквы слова.',
    '[...word].sort().join("") даёт ключ. split("") тоже сработает для букв, но сломается на эмодзи.',
    'Ответ — [...groups.values()].',
  ],
});
