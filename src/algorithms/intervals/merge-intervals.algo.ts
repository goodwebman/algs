import raw from './merge-intervals.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Слияние пересекающихся интервалов.
 *
 * Приём всей темы: СНАЧАЛА СОРТИРОВКА ПО НАЧАЛУ. После неё достаточно
 * сравнивать каждый интервал только с последним в результате — все
 * предыдущие заведомо начинаются раньше и уже слиты.
 *
 * Без сортировки пришлось бы сравнивать каждый с каждым: O(n²).
 *
 * Инвариант: результат всегда содержит непересекающиеся интервалы,
 * отсортированные по началу.
 */
type Interval = readonly [number, number];

export function* traceMergeIntervals(input: readonly Interval[]): AlgoTrace<VizState, Interval[]> {
  // Копия перед сортировкой: молча переставить элементы во входном
  // массиве вызывающего — источник трудноуловимых багов.
  const sorted = [...input].sort((a, b) => a[0] - b[0]); // @sort
  const merged: Interval[] = [];

  const view = (index: number, marks: Record<number, MarkKind>, note: string): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: 'интервалы (отсортированы по началу)',
        view: {
          kind: 'array',
          data: sorted.map(([from, to]) => `${from}–${to}`),
          pointers: index >= 0 ? [{ name: 'i', index, tone: 'scan' }] : [],
          marks,
        },
      },
      {
        title: 'результат',
        view: {
          kind: 'array',
          data: merged.length ? merged.map(([from, to]) => `${from}–${to}`) : ['—'],
          marks: {},
        },
      },
    ],
    caption: note,
  });

  yield {
    state: view(-1, {}, 'отсортировали по началу'),
    at: 'sort',
    note: 'После сортировки по началу достаточно сравнивать каждый интервал только с последним слитым.',
    metrics: { comparisons: sorted.length },
  };

  for (let i = 0; i < sorted.length; i += 1) {
    const [start, end] = sorted[i];
    const last = merged[merged.length - 1];

    // Касание считается пересечением: [1,3] и [3,5] дают [1,5].
    if (last && start <= last[1]) { // @overlap
      // Новый интервал может целиком лежать внутри последнего —
      // тогда конец не двигаем. Отсюда Math.max, а не просто end.
      merged[merged.length - 1] = [last[0], Math.max(last[1], end)];

      yield {
        state: view(i, { [i]: 'swap' }, `${start}–${end} сливается с ${last[0]}–${last[1]}`),
        at: 'overlap',
        note: `${start} ≤ ${last[1]} — интервалы пересекаются. Расширяем последний до ${merged[merged.length - 1][1]}.`,
        metrics: { comparisons: 1, writes: 1 },
      };
      continue;
    }

    merged.push([start, end]); // @push

    yield {
      state: view(i, { [i]: 'done' }, `${start}–${end} не пересекается`),
      at: 'push',
      note: `${start} > ${last ? last[1] : '−∞'} — разрыв. Начинаем новый интервал.`,
      metrics: { comparisons: 1, writes: 1 },
    };
  }

  yield {
    state: view(-1, {}, 'готово'),
    note: `Слито в ${merged.length} непересекающихся интервалов.`,
  };

  return merged;
}
// #endregion

export const mergeIntervals = (input: readonly Interval[]): Interval[] =>
  runTrace(traceMergeIntervals(input));

export default defineAlgo({
  meta: {
    slug: 'merge-intervals',
    title: 'Слияние интервалов',
    topic: 'intervals',
    summary: 'Схлопнуть пересекающиеся отрезки в непересекающиеся — после сортировки за один проход.',
    complexity: { time: 'O(n log n)', space: 'O(n)', growth: 'O(n log n)' },
    difficulty: 'medium',
    leetcode: { id: 56, title: 'merge-intervals' },
    tags: ['интервалы', 'сортировка', 'один проход'],
  },
  raw,
  presets: [
    {
      label: '[[1,3],[2,6],[8,10],[15,18]]',
      args: [[[1, 3], [2, 6], [8, 10], [15, 18]] as Interval[]] as const,
      hint: 'Классика: первые два сливаются, остальные — отдельные.',
    },
    {
      label: '[[1,4],[4,5]] — касание',
      args: [[[1, 4], [4, 5]] as Interval[]] as const,
      hint: 'Касание считается пересечением: результат [1,5].',
    },
    {
      label: '[[1,10],[2,3]] — вложенный',
      args: [[[1, 10], [2, 3]] as Interval[]] as const,
      hint: 'Второй целиком внутри первого — конец не должен уехать назад.',
    },
    {
      label: '[[5,6],[1,2]] — не по порядку',
      args: [[[5, 6], [1, 2]] as Interval[]] as const,
      hint: 'Сортировка обязательна: без неё алгоритм даст мусор.',
    },
  ],
  trace: traceMergeIntervals,
  formatResult: (merged) => merged.map(([from, to]) => `[${from},${to}]`).join(' '),
});
