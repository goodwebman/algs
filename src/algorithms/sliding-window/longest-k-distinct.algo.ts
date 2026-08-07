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
  const str = [...input];
  const freq = new Map<string, number>();
  let left = 0;
  let ans = 0;

  // #hide
  const view = (right: number, note: string): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: 'строка',
        view: {
          kind: 'array',
          data: str,
          window: right >= left ? { from: left, to: right } : null,
          pointers: [
            { name: 'left', index: left, tone: 'l' },
            { name: 'right', index: right, tone: 'r' },
          ],
        },
      },
      {
        title: `частоты в окне · различных: ${freq.size} из ${k}`,
        view: {
          kind: 'hashmap',
          entries: [...freq].map(([key, value]) => ({ key, value })),
        },
      },
    ],
    caption: `${note} · лучший ответ ${ans}`,
  });
  // #endhide

  for (let right = 0; right < str.length; right++) {
    freq.set(str[right], (freq.get(str[right]) ?? 0) + 1); // @expand

    yield {
      state: view(right, `вошёл «${str[right]}»`),
      at: 'expand',
      note: `Добавили «${str[right]}». Различных символов в окне: ${freq.size}.`,
      metrics: { reads: 1, writes: 1 },
      memoryPeak: freq.size,
    };

    while (freq.size > k) { // @shrink
      freq.set(str[left], freq.get(str[left])! - 1);

      // Ключ на нуле именно удаляется, а не остаётся со значением 0 —
      // иначе freq.size врёт и цикл не завершится.
      if (freq.get(str[left]) === 0) { // @delete
        freq.delete(str[left]);
      }

      yield {
        state: view(right, `вышел «${str[left]}»`),
        at: 'shrink',
        note: `Различных стало больше ${k} — выбрасываем «${str[left]}» слева.`,
        metrics: { writes: 1 },
      };

      left++;
    }

    ans = Math.max(ans, right - left + 1); // @better

    yield {
      state: view(right, `длина окна ${right - left + 1}`),
      at: 'better',
      note: `Окно длиной ${right - left + 1}, лучший ответ ${ans}.`,
      metrics: { comparisons: 1 },
    };
  }

  return ans;
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
