import raw from './valid-parentheses.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { VizState } from '@/viz/types';

// #region show
/**
 * Правильная скобочная последовательность.
 *
 * Каноническая задача на стек. Инсайт: закрывающая скобка обязана
 * соответствовать САМОЙ ПОСЛЕДНЕЙ незакрытой открывающей. «Самая последняя» —
 * это буквально определение LIFO, поэтому нужен именно стек, а не счётчик.
 *
 * Счётчиком можно обойтись, если скобка одного вида. Как только видов
 * несколько, счётчик не отличит «([)]» от «([])» — а стек отличает.
 */
const pairs: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

export function* traceValidParentheses(input: string): AlgoTrace<VizState, boolean> {
  const chars = [...input];
  const stack: string[] = [];

  // #hide
  const view = (index: number, note: string, topMark?: 'active' | 'swap' | 'done'): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: 'строка',
        view: {
          kind: 'array',
          data: chars,
          pointers: [{ name: 'i', index, tone: 'scan' }],
          marks: {
            ...Object.fromEntries(chars.map((_, i) => [i, i < index ? ('visited' as const) : undefined])),
            [index]: 'active',
          },
        },
      },
      {
        title: 'стек незакрытых скобок',
        view: {
          kind: 'stack',
          items: stack,
          marks: topMark && stack.length ? { [stack.length - 1]: topMark } : {},
        },
      },
    ],
    caption: note,
  });
  // #endhide

  for (let i = 0; i < chars.length; i++) {
    const symb = chars[i];

    if (!pairs[symb]) {
      stack.push(symb); // @push

      yield {
        state: view(i, `открыли «${symb}»`, 'active'),
        at: 'push',
        note: `«${symb}» — открывающая. Кладём на стек, ждём парную.`,
        metrics: { writes: 1 },
        memoryPeak: stack.length,
      };
      continue;
    }

    // На пустом стеке pop() вернёт undefined — отдельная проверка
    // stack.length === 0 не нужна, сравнение всё равно провалится.
    const top = stack.pop(); // @pop

    if (top !== pairs[symb]) { // @mismatch
      yield {
        state: view(i, top ? `«${top}» ≠ пара для «${symb}»` : `«${symb}» нечего закрывать`, 'swap'),
        at: 'mismatch',
        note: top
          ? `Последняя незакрытая — «${top}», а закрывают «${symb}». Не совпало.`
          : `«${symb}» пришла, а стек пуст — закрывать нечего.`,
        metrics: { comparisons: 1 },
      };
      return false;
    }

    yield {
      state: view(i, `«${top}» закрыта «${symb}»`, 'done'),
      at: 'pop',
      note: `«${symb}» закрывает «${top}» — снимаем со стека.`,
      metrics: { comparisons: 1, reads: 1 },
    };
  }

  // Стек обязан опустеть: остаток — это незакрытые скобки.
  yield {
    state: view(Math.max(0, chars.length - 1), stack.length ? 'остались незакрытые' : 'стек пуст'),
    at: 'final',
    note: stack.length
      ? `Строка кончилась, а на стеке осталось ${stack.length} незакрытых.`
      : 'Строка кончилась, стек пуст — последовательность правильная.',
  };

  return stack.length === 0; // @final
}
// #endregion

export const isValidParentheses = (input: string): boolean => runTrace(traceValidParentheses(input));

export default defineAlgo({
  meta: {
    slug: 'valid-parentheses',
    title: 'Правильная скобочная последовательность',
    topic: 'stack',
    summary: 'Проверить, что скобки трёх видов расставлены корректно и вложены правильно.',
    complexity: { time: 'O(n)', space: 'O(n)', growth: 'O(n)' },
    difficulty: 'easy',
    leetcode: { id: 20, title: 'valid-parentheses' },
    tags: ['стек', 'LIFO', 'скобки'],
  },
  raw,
  presets: [
    { label: '"([{}])"', args: ['([{}])'] as const, hint: 'Правильная вложенность — стек растёт и полностью схлопывается.' },
    { label: '"([)]"', args: ['([)]'] as const, hint: 'Счётчиком не отличить от правильной, стеком — сразу видно.' },
    { label: '"((("', args: ['((('] as const, hint: 'Стек не опустел — незакрытые скобки.' },
    { label: '")("', args: [')('] as const, hint: 'Закрывающая при пустом стеке — выход на первом же символе.' },
  ],
  trace: traceValidParentheses,
  formatResult: (ok) => (ok ? 'последовательность правильная' : 'последовательность неправильная'),
});
