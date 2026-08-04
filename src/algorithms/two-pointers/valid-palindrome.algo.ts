import raw from './valid-palindrome.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Палиндром с игнорированием регистра и всего, что не буква и не цифра.
 *
 * Указатели идут навстречу и пропускают мусор ПО ХОДУ, а не после очистки
 * строки. Разница принципиальна по памяти: очистка через regex создаёт
 * вторую строку размером с исходную — O(n), здесь же O(1).
 */
const isAlphanumeric = (char: string): boolean => /[\p{L}\p{N}]/u.test(char);

export function* traceValidPalindrome(input: string): AlgoTrace<VizState, boolean> {
  const chars = [...input];
  let left = 0;
  let right = chars.length - 1;

  const view = (marks: Record<number, MarkKind>, note: string): VizState => ({
    kind: 'array',
    data: chars.map((char) => (char === ' ' ? '␣' : char)),
    pointers: [
      { name: 'left', index: left, tone: 'l' },
      { name: 'right', index: right, tone: 'r' },
    ],
    marks,
    caption: note,
  });

  while (left < right) {
    // Пропускаем всё, что не буква и не цифра. Условие left < right
    // внутри обязательно: строка из одних знаков препинания иначе уведёт
    // указатель за границу массива.
    if (!isAlphanumeric(chars[left])) {
      // @skipLeft
      yield {
        state: view({ [left]: 'excluded' }, `«${chars[left]}» — не буква, пропускаем`),
        at: 'skipLeft',
        note: `Символ «${chars[left]}» слева не буква и не цифра — игнорируем.`,
      };
      left += 1;
      continue;
    }

    if (!isAlphanumeric(chars[right])) {
      // @skipRight
      yield {
        state: view({ [right]: 'excluded' }, `«${chars[right]}» — не буква, пропускаем`),
        at: 'skipRight',
        note: `Символ «${chars[right]}» справа не буква и не цифра — игнорируем.`,
      };
      right -= 1;
      continue;
    }

    const a = chars[left].toLowerCase();
    const b = chars[right].toLowerCase(); // @compare

    if (a !== b) {
      yield {
        state: view({ [left]: 'swap', [right]: 'swap' }, `«${a}» ≠ «${b}» — не палиндром`),
        at: 'compare',
        note: `«${a}» и «${b}» не совпали — дальше можно не смотреть.`,
        metrics: { comparisons: 1 },
      };
      return false;
    }

    yield {
      state: view({ [left]: 'done', [right]: 'done' }, `«${a}» = «${b}»`),
      at: 'compare',
      note: `«${a}» совпал с «${b}» — сдвигаем оба указателя внутрь.`,
      metrics: { comparisons: 1 },
    };

    left += 1;
    right -= 1;
  }

  yield {
    state: view({}, 'указатели встретились'),
    note: 'Указатели сошлись, все пары совпали — это палиндром.',
  };

  return true;
}
// #endregion

export const isPalindrome = (input: string): boolean => runTrace(traceValidPalindrome(input));

export default defineAlgo({
  meta: {
    slug: 'valid-palindrome',
    title: 'Проверка на палиндром',
    topic: 'two-pointers',
    summary: 'Проверить, читается ли строка одинаково в обе стороны, игнорируя регистр и пунктуацию.',
    complexity: { time: 'O(n)', space: 'O(1)', growth: 'O(n)' },
    difficulty: 'easy',
    leetcode: { id: 125, title: 'valid-palindrome' },
    tags: ['два указателя', 'строки', 'юникод'],
  },
  raw,
  presets: [
    {
      label: '"A man, a plan, a canal"',
      args: ['A man, a plan, a canal: Panama'] as const,
      hint: 'Классика: пунктуация и пробелы пропускаются на лету.',
    },
    { label: '"race a car"', args: ['race a car'] as const, hint: 'Не палиндром — выход на первом же несовпадении.' },
    { label: '"А роза упала на лапу Азора"', args: ['А роза упала на лапу Азора'] as const, hint: 'Кириллица: \\p{L} ловит её, диапазон [а-я] — нет.' },
    { label: '".,!"', args: ['.,!'] as const, hint: 'Одни знаки препинания: пустая строка считается палиндромом.' },
  ],
  trace: traceValidPalindrome,
  formatResult: (result) => (result ? 'палиндром' : 'не палиндром'),
});
