import { defineTask } from '../types';

export default defineTask({
  slug: 'decode-string',
  title: 'Раскодировать вложенную строку',
  topic: 'stack',
  prompt:
    'Раскодируй строку вида "3[a]2[bc]" → "aaabcbc".\n' +
    'Множитель может быть многозначным, вложенность — любой глубины.\n' +
    'Буквы вне блоков попадают в ответ как есть.',
  exportName: 'decodeString',
  starter: `export function decodeString(input) {
  // Стек хранит отложенный контекст каждого уровня: { text, count }.
  // На '[' откладываем текущее и начинаем новое.
  // На ']' достаём и склеиваем: снаружи + внутреннее × множитель.
}
`,
  solution: `export function decodeString(input) {
  const stack = [];
  let current = '';
  let count = 0;

  for (const char of input) {
    if (char >= '0' && char <= '9') {
      count = count * 10 + Number(char);
    } else if (char === '[') {
      stack.push({ text: current, count });
      current = '';
      count = 0;
    } else if (char === ']') {
      const frame = stack.pop();
      current = frame.text + current.repeat(frame.count);
    } else {
      current += char;
    }
  }

  return current;
}
`,
  cases: [
    { name: 'два блока подряд', args: ['3[a]2[bc]'], expected: 'aaabcbc' },
    { name: 'вложенность', args: ['3[a2[c]]'], expected: 'accaccacc' },
    { name: 'хвост без множителя', args: ['2[abc]3[cd]ef'], expected: 'abcabccdcdcdef' },
    { name: 'многозначный множитель', args: ['12[a]'], expected: 'a'.repeat(12) },
    { name: 'глубокая вложенность', args: ['2[2[2[a]]]'], expected: 'aaaaaaaa' },
    { name: 'без кодирования', args: ['abc'], expected: 'abc' },
    { name: 'пустая строка', args: [''], expected: '' },
    { name: 'нулевой множитель', args: ['0[abc]def'], expected: 'def' },
    { name: 'множитель 1', args: ['1[x]'], expected: 'x' },
  ],
  hints: [
    'count = count * 10 + Number(char) накапливает многозначное число.',
    'На "[" откладывай { text: current, count }, потом обнуляй оба.',
    'String.repeat применяет множитель — проще и быстрее цикла конкатенации.',
  ],
});
