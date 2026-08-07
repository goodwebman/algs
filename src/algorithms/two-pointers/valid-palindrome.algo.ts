import raw from './valid-palindrome.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Палиндром с игнорированием регистра и всего, что не буква и не цифра.
 *
 * Сначала чистим строку одной регуляркой, потом идём двумя указателями
 * навстречу: пока символы совпадают — сдвигаем оба, первое расхождение
 * закрывает вопрос.
 */
export function* traceValidPalindrome(input: string): AlgoTrace<VizState, boolean> {
  // Правка против исходного решения: там регулярка была /[^a-z0-9а-я]/g,
  // и «ё» вырезалась вместе с пунктуацией — «ёа» превращалось в «а» и
  // считалось палиндромом. \p{L}\p{N} закрывает весь юникод.
  const clean = [...input.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')]; // @clean
  let left = 0;
  let right = clean.length - 1;

  // #hide
  const view = (marks: Record<number, MarkKind>, note: string): VizState => ({
    kind: 'array',
    data: clean,
    pointers: [
      { name: 'left', index: left, tone: 'l' },
      { name: 'right', index: right, tone: 'r' },
    ],
    marks,
    caption: note,
  });
  // #endhide

  yield {
    state: view({}, `очищено: «${clean.join('')}»`),
    at: 'clean',
    note: `Регистр вниз, пунктуация и пробелы выброшены: «${clean.join('')}».`,
    memoryPeak: clean.length,
  };

  while (left < right) {
    if (clean[left] !== clean[right]) { // @compare
      yield {
        state: view({ [left]: 'swap', [right]: 'swap' }, `«${clean[left]}» ≠ «${clean[right]}»`),
        at: 'compare',
        note: `«${clean[left]}» и «${clean[right]}» не совпали — дальше можно не смотреть.`,
        metrics: { comparisons: 1 },
      };
      return false;
    }

    yield {
      state: view({ [left]: 'done', [right]: 'done' }, `«${clean[left]}» = «${clean[right]}»`),
      at: 'compare',
      note: `«${clean[left]}» совпал с «${clean[right]}» — сдвигаем оба указателя внутрь.`,
      metrics: { comparisons: 1 },
    };

    left++;
    right--;
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
    // O(n) по памяти: очищенная копия строки живёт до конца проверки.
    complexity: { time: 'O(n)', space: 'O(n)', growth: 'O(n)' },
    difficulty: 'easy',
    leetcode: { id: 125, title: 'valid-palindrome' },
    tags: ['два указателя', 'строки', 'юникод'],
  },
  raw,
  presets: [
    {
      label: '"A man, a plan, a canal"',
      args: ['A man, a plan, a canal: Panama'] as const,
      hint: 'Классика: пунктуация и пробелы уходят на этапе очистки.',
    },
    { label: '"race a car"', args: ['race a car'] as const, hint: 'Не палиндром — выход на первом же несовпадении.' },
    { label: '"А роза упала на лапу Азора"', args: ['А роза упала на лапу Азора'] as const, hint: 'Кириллица: \\p{L} ловит её, диапазон [а-я] — терял «ё».' },
    { label: '".,!"', args: ['.,!'] as const, hint: 'Одни знаки препинания: после очистки строка пуста — это палиндром.' },
  ],
  trace: traceValidPalindrome,
  formatResult: (result) => (result ? 'палиндром' : 'не палиндром'),
});
