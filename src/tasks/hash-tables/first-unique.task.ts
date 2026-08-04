import { defineTask } from '../types';

export default defineTask({
  slug: 'first-unique',
  title: 'Первый неповторяющийся символ',
  topic: 'hash-tables',
  prompt:
    'Верни индекс первого символа строки, встречающегося ровно один раз.\n' +
    'Если таких символов нет — верни −1.\n' +
    'Нужно O(n): решение через indexOf/lastIndexOf в цикле не подойдёт.',
  exportName: 'firstUniqueChar',
  starter: `export function firstUniqueChar(input) {
  // За один проход ответить нельзя: символ может повториться в самом конце.
  // Сначала посчитай частоты, потом пройди строку заново.
}
`,
  solution: `export function firstUniqueChar(input) {
  const chars = [...input];
  const counts = new Map();

  for (const char of chars) {
    counts.set(char, (counts.get(char) ?? 0) + 1);
  }

  for (let i = 0; i < chars.length; i += 1) {
    if (counts.get(chars[i]) === 1) return i;
  }

  return -1;
}
`,
  cases: [
    { name: 'ответ на первой позиции', args: ['leetcode'], expected: 0 },
    { name: 'ответ в середине', args: ['loveleetcode'], expected: 2 },
    { name: 'уникальных нет', args: ['aabb'], expected: -1 },
    { name: 'пустая строка', args: [''], expected: -1 },
    { name: 'один символ', args: ['z'], expected: 0 },
    { name: 'ответ в самом конце', args: ['aabbc'], expected: 4 },
    { name: 'кириллица', args: ['аба'], expected: 1 },
    // Объект-аккумулятор без Object.create(null) сломается на этом кейсе:
    // "constructor" уже "есть" в прототипе.
    // c, o, t, r повторяются — первый уникальный это «n» на индексе 2
    { name: 'опасные имена ключей', args: ['constructor'], expected: 2 },
  ],
  bench: {
    sizes: [500, 2000, 10000, 40000, 100000],
    makeArgsSource:
      "(n) => ['a'.repeat(n - 1) + 'b']",
    compareWith: ['O(n)', 'O(n²)'],
  },
  hints: [
    'Первый цикл только считает — ничего не возвращай из него.',
    'counts.get(char) ?? 0 — иначе undefined + 1 даст NaN.',
    'Второй цикл идёт по строке (не по Map), чтобы индекс был исходным.',
  ],
});
