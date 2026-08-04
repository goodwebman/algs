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
const PAIRS: Record<string, string> = { ')': '(', ']': '[', '}': '{' };

export function* traceValidParentheses(input: string): AlgoTrace<VizState, boolean> {
  const chars = [...input];
  const stack: string[] = [];

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

  for (let i = 0; i < chars.length; i += 1) {
    const char = chars[i];

    if (!PAIRS[char]) {
      stack.push(char); // @push

      yield {
        state: view(i, `открыли «${char}»`, 'active'),
        at: 'push',
        note: `«${char}» — открывающая. Кладём на стек, ждём парную.`,
        metrics: { writes: 1 },
        memoryPeak: stack.length,
      };
      continue;
    }

    // Стек пуст — закрывать нечего. Это «)» в начале строки.
    if (stack.length === 0) { // @empty
      yield {
        state: view(i, `«${char}» нечего закрывать`),
        at: 'empty',
        note: `«${char}» пришла, а стек пуст — закрывать нечего.`,
      };
      return false;
    }

    const top = stack.pop()!; // @pop

    if (top !== PAIRS[char]) { // @mismatch
      yield {
        state: view(i, `«${top}» ≠ пара для «${char}»`, 'swap'),
        at: 'mismatch',
        note: `Последняя незакрытая — «${top}», а закрывают «${char}». Не совпало.`,
        metrics: { comparisons: 1 },
      };
      return false;
    }

    yield {
      state: view(i, `«${top}» закрыта «${char}»`, 'done'),
      at: 'pop',
      note: `«${char}» закрывает «${top}» — снимаем со стека.`,
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
