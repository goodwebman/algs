import { defineTask } from '../types';

export default defineTask({
  slug: 'rle',
  title: 'Run-Length Encoding',
  topic: 'js-practice',
  prompt:
    'Реализуй rle(input) — кодирование повторов.\n' +
    '"aaabbc" → "a3b2c1". Одиночный символ тоже получает счётчик.\n' +
    'Пустая строка → пустая строка.',
  exportName: 'rle',
  starter: `export function rle(input) {
  // Идёшь по строке, копишь счётчик одинаковых подряд.
  // Главная сложность — не забыть сбросить последнюю серию после цикла.
}
`,
  solution: `export function rle(input) {
  if (!input) return '';

  const chars = [...input];
  const parts = [];
  let count = 1;

  // Цикл до length ВКЛЮЧИТЕЛЬНО: на последней итерации chars[i]
  // равен undefined и не совпадёт ни с чем — это сбрасывает
  // финальную серию без дублирования кода после цикла.
  for (let i = 1; i <= chars.length; i += 1) {
    if (chars[i] === chars[i - 1]) {
      count += 1;
      continue;
    }

    parts.push(chars[i - 1] + count);
    count = 1;
  }

  return parts.join('');
}
`,
  cases: [
    { name: 'обычная строка', args: ['aaabbc'], expected: 'a3b2c1' },
    { name: 'все символы разные', args: ['abc'], expected: 'a1b1c1' },
    { name: 'один символ', args: ['a'], expected: 'a1' },
    { name: 'все одинаковые', args: ['aaaa'], expected: 'a4' },
    { name: 'пустая строка', args: [''], expected: '' },
    // Последняя серия часто теряется — этот кейс её ловит
    { name: 'длинная серия в конце', args: ['abccc'], expected: 'a1b1c3' },
    { name: 'серии чередуются', args: ['aabbaa'], expected: 'a2b2a2' },
    { name: 'счётчик больше 9', args: ['a'.repeat(12)], expected: 'a12' },
    { name: 'кириллица', args: ['ааб'], expected: 'а2б1' },
  ],
  hints: [
    'Копи счётчик, пока текущий символ равен предыдущему.',
    'Приём: цикл до i <= length — на последнем шаге chars[i] это undefined, серия сбрасывается сама.',
    'Собирай в массив и join("") — конкатенация строк в цикле дороже.',
  ],
});
