import raw from './first-unique.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { VizState } from '@/viz/types';

// #region show
/**
 * Первый неповторяющийся символ строки.
 *
 * Инсайт: за один проход ответить нельзя — символ, уникальный на позиции 3,
 * может повториться на позиции 100. Значит нужно ДВА прохода: сначала
 * посчитать все частоты, потом найти первый символ с частотой 1.
 *
 * Два прохода — это по-прежнему O(n). Классическая ошибка новичка —
 * попытаться уложиться в один проход и получить O(n²) через indexOf/lastIndexOf.
 */
export function* traceFirstUnique(input: string): AlgoTrace<VizState, number> {
  const chars = [...input];
  const counts = new Map<string, number>();

  const view = (index: number, phase: string, activeKey?: string): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: `строка · ${phase}`,
        view: {
          kind: 'array',
          data: chars,
          pointers: [{ name: 'i', index, tone: 'scan' }],
          marks: { [index]: 'active' },
        },
      },
      {
        title: 'частоты символов',
        view: {
          kind: 'hashmap',
          entries: [...counts].map(([key, value]) => ({
            key,
            value,
            mark: key === activeKey ? ('active' as const) : value === 1 ? ('done' as const) : undefined,
          })),
        },
      },
    ],
  });

  for (let i = 0; i < chars.length; i += 1) {
    counts.set(chars[i], (counts.get(chars[i]) ?? 0) + 1); // @count

    yield {
      state: view(i, 'считаем частоты', chars[i]),
      at: 'count',
      note: `«${chars[i]}» встретился ${counts.get(chars[i])} раз(а).`,
      metrics: { reads: 1, writes: 1 },
      memoryPeak: counts.size,
    };
  }

  for (let i = 0; i < chars.length; i += 1) { // @check
    if (counts.get(chars[i]) === 1) { // @found
      yield {
        state: view(i, 'ищем первый уникальный', chars[i]),
        at: 'found',
        note: `«${chars[i]}» встречается ровно один раз — это индекс ${i}.`,
        metrics: { comparisons: 1 },
      };
      return i;
    }

    yield {
      state: view(i, 'ищем первый уникальный', chars[i]),
      at: 'check',
      note: `«${chars[i]}» повторяется (${counts.get(chars[i])} раз) — идём дальше.`,
      metrics: { comparisons: 1 },
    };
  }

  return -1;
}
// #endregion

export const firstUniqueChar = (input: string): number => runTrace(traceFirstUnique(input));

export default defineAlgo({
  meta: {
    slug: 'first-unique',
    title: 'Первый неповторяющийся символ',
    topic: 'hash-tables',
    summary: 'Найти индекс первого символа строки, который встречается ровно один раз.',
    complexity: { time: 'O(n)', space: 'O(k)', growth: 'O(n)' },
    difficulty: 'easy',
    leetcode: { id: 387, title: 'first-unique-character-in-a-string' },
    tags: ['хеш-таблица', 'частоты', 'два прохода'],
  },
  raw,
  presets: [
    { label: '"leetcode"', args: ['leetcode'] as const, hint: 'Ответ — самый первый символ.' },
    {
      label: '"loveleetcode"',
      args: ['loveleetcode'] as const,
      hint: 'Первые символы повторяются — второй проход идёт дольше.',
    },
    { label: '"aabb"', args: ['aabb'] as const, hint: 'Уникальных нет — возвращается −1.' },
    { label: '"алгоритм"', args: ['алгоритм'] as const, hint: 'Кириллица работает так же — Map не знает про алфавиты.' },
  ],
  trace: traceFirstUnique,
  formatResult: (index) => (index === -1 ? 'уникальных символов нет' : `индекс ${index}`),
});
