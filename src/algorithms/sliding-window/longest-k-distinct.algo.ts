import raw from './longest-k-distinct.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { VizState } from '@/viz/types';

// #region show
/**
 * Самая длинная подстрока, содержащая не более k различных символов.
 *
 * Условие окна теперь не про сумму, а про СОСТАВ — сколько разных символов
 * внутри. Значит нужен счётчик частот: он и отвечает на вопрос «сколько
 * различных», и позволяет узнать, когда символ покинул окно полностью.
 *
 * Ключевая деталь: при сжатии счётчик уменьшается по СИМВОЛУ, а не по
 * индексу, и запись удаляется, когда счётчик дошёл до нуля. Иначе
 * `counts.size` навсегда останется завышенным и окно перестанет сжиматься.
 */
export function* traceLongestKDistinct(input: string, k: number): AlgoTrace<VizState, number> {
  const chars = [...input];
  const counts = new Map<string, number>();
  let left = 0;
  let best = 0;
  let bestFrom = 0;

  const view = (right: number, note: string): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: 'строка',
        view: {
          kind: 'array',
          data: chars,
          window: right >= left ? { from: left, to: right } : null,
          pointers: [
            { name: 'left', index: left, tone: 'l' },
            { name: 'right', index: right, tone: 'r' },
          ],
          marks: Object.fromEntries(
            chars.map((_, i) => [i, i >= bestFrom && i < bestFrom + best ? ('done' as const) : undefined]),
          ),
        },
      },
      {
        title: `частоты в окне · различных: ${counts.size} из ${k}`,
        view: {
          kind: 'hashmap',
          entries: [...counts].map(([key, value]) => ({ key, value })),
        },
      },
    ],
    caption: `${note} · лучший ответ ${best}`,
  });

  for (let right = 0; right < chars.length; right += 1) {
    const char = chars[right];
    counts.set(char, (counts.get(char) ?? 0) + 1); // @expand

    yield {
      state: view(right, `вошёл «${char}»`),
      at: 'expand',
      note: `Добавили «${char}». Различных символов в окне: ${counts.size}.`,
      metrics: { reads: 1, writes: 1 },
      memoryPeak: counts.size,
    };

    while (counts.size > k) { // @shrink
      const leaving = chars[left];
      const next = counts.get(leaving)! - 1;

      // Удаляем ключ на нуле, а не оставляем со значением 0 —
      // иначе counts.size врёт и цикл не завершится.
      if (next === 0) counts.delete(leaving); // @delete
      else counts.set(leaving, next);

      left += 1;

      yield {
        state: view(right, `вышел «${leaving}»`),
        at: 'shrink',
        note: `Различных стало больше ${k} — выбрасываем «${leaving}» слева.`,
        metrics: { writes: 1 },
      };
    }

    if (right - left + 1 > best) { // @better
      best = right - left + 1;
      bestFrom = left;

      yield {
        state: view(right, `новый максимум ${best}`),
        at: 'better',
        note: `Окно длиной ${best} — лучшее из встреченных.`,
        metrics: { comparisons: 1 },
      };
    }
  }

  return best;
}
// #endregion

export const longestKDistinct = (input: string, k: number): number =>
  runTrace(traceLongestKDistinct(input, k));

export default defineAlgo({
  meta: {
    slug: 'longest-k-distinct',
    title: 'Подстрока с k различными символами',
    topic: 'sliding-window',
    summary: 'Найти длину самой длинной подстроки, в которой не больше k различных символов.',
    complexity: { time: 'O(n)', space: 'O(k)', growth: 'O(n)' },
    difficulty: 'medium',
    leetcode: { id: 340, title: 'longest-substring-with-at-most-k-distinct-characters' },
    tags: ['скользящее окно', 'частоты', 'Map'],
  },
  raw,
  presets: [
    { label: '"eceba", k=2', args: ['eceba', 2] as const, hint: 'Классика: ответ 3 — подстрока «ece».' },
    { label: '"aa", k=1', args: ['aa', 1] as const, hint: 'Сжатий не будет вообще.' },
    { label: '"abcadcacacaca", k=3', args: ['abcadcacacaca', 3] as const, hint: 'Длинный хвост из трёх символов — видно, как окно разрастается.' },
    { label: '"abc", k=0', args: ['abc', 0] as const, hint: 'k = 0: окно схлопывается сразу, ответ 0.' },
  ],
  trace: traceLongestKDistinct,
  formatResult: (best) => `максимальная длина: ${best}`,
});
