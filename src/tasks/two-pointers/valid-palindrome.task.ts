import { defineTask } from '../types';

export default defineTask({
  slug: 'valid-palindrome',
  title: 'Проверка на палиндром',
  topic: 'two-pointers',
  prompt:
    'Проверь, читается ли строка одинаково в обе стороны.\n' +
    'Регистр игнорируется, всё кроме букв и цифр — тоже.\n' +
    'Кириллица должна работать наравне с латиницей (включая «ё»).',
  exportName: 'isPalindrome',
  starter: `export function isPalindrome(input) {
  // Два указателя навстречу. Мусор пропускай ПО ХОДУ,
  // а не вычищай строку заранее — так получится O(1) по памяти.
  // Подсказка про буквы: /[\\p{L}\\p{N}]/u
}
`,
  solution: `const isAlphanumeric = (char) => /[\\p{L}\\p{N}]/u.test(char);

export function isPalindrome(input) {
  const chars = [...input];
  let left = 0;
  let right = chars.length - 1;

  while (left < right) {
    if (!isAlphanumeric(chars[left])) {
      left += 1;
      continue;
    }
    if (!isAlphanumeric(chars[right])) {
      right -= 1;
      continue;
    }

    if (chars[left].toLowerCase() !== chars[right].toLowerCase()) return false;

    left += 1;
    right -= 1;
  }

  return true;
}
`,
  cases: [
    { name: 'классический палиндром', args: ['A man, a plan, a canal: Panama'], expected: true },
    { name: 'не палиндром', args: ['race a car'], expected: false },
    { name: 'пустая строка', args: [''], expected: true },
    { name: 'одни знаки препинания', args: ['.,!'], expected: true },
    { name: 'один символ', args: ['x'], expected: true },
    { name: 'кириллица', args: ['А роза упала на лапу Азора'], expected: true },
    { name: 'буква ё не должна теряться', args: ['ёжё'], expected: true },
    { name: 'ё ломает палиндром', args: ['ёжик'], expected: false },
    { name: 'цифры участвуют', args: ['12321'], expected: true },
    { name: 'цифры и буквы вместе', args: ['a1b2b1a'], expected: true },
  ],
  hints: [
    'Пропуск мусора — отдельная ветка с continue, а не часть основного сравнения.',
    'Внутри пропусков нужна проверка left < right, иначе на строке из знаков указатель уедет за границу.',
    'Диапазон [а-я] не содержит «ё» — используй \\p{L} с флагом u.',
  ],
});
