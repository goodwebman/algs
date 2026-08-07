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
  if (!input.length) return [];

  // Правка против исходного решения: там сортировался сам аргумент, а конец
  // интервала правился прямо в нём (prevInterval[1] = …). Пресеты плеера
  // переиспользуются, второй прогон получил бы уже слитый вход — копируем.
  const sorted = [...input].sort((a, b) => a[0] - b[0]); // @sort
  const res: Interval[] = [];
  let prevInterval: [number, number] = [...sorted[0]];

  // #hide
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
        // prevInterval попадает в res только на разрыве, поэтому до тех пор
        // показываем его отдельно — иначе панель отстаёт от кода на шаг.
        title: 'результат · последний ещё собирается',
        view: {
          kind: 'array',
          data: (res[res.length - 1] === prevInterval ? res : [...res, prevInterval]).map(
            ([from, to]) => `${from}–${to}`,
          ),
          marks: { [res.length]: 'active' },
        },
      },
    ],
    caption: note,
  });
  // #endhide

  yield {
    state: view(-1, {}, 'отсортировали по началу'),
    at: 'sort',
    note: 'После сортировки по началу достаточно сравнивать каждый интервал только с предыдущим.',
    metrics: { comparisons: sorted.length },
  };

  for (let i = 1; i < sorted.length; i++) {
    const curInterval = sorted[i];

    // Касание считается пересечением: [1,3] и [3,5] дают [1,5].
    if (curInterval[0] <= prevInterval[1]) { // @overlap
      // Текущий интервал может целиком лежать внутри предыдущего —
      // тогда конец не двигаем. Отсюда Math.max, а не просто конец.
      prevInterval[1] = Math.max(prevInterval[1], curInterval[1]);

      yield {
        state: view(i, { [i]: 'swap' }, `${curInterval[0]}–${curInterval[1]} сливается`),
        at: 'overlap',
        note: `${curInterval[0]} ≤ ${prevInterval[1]} — интервалы пересекаются. Конец текущего стал ${prevInterval[1]}.`,
        metrics: { comparisons: 1, writes: 1 },
      };
      continue;
    }

    res.push(prevInterval); // @push
    prevInterval = [...curInterval];

    yield {
      state: view(i, { [i]: 'done' }, `${curInterval[0]}–${curInterval[1]} не пересекается`),
      at: 'push',
      note: `${curInterval[0]} > конца предыдущего — разрыв. Прошлый интервал уходит в ответ, копим новый.`,
      metrics: { comparisons: 1, writes: 1 },
    };
  }

  // Последний интервал ещё не в ответе: цикл кладёт предыдущий
  // только когда встречает разрыв, а после последнего разрыва нет.
  res.push(prevInterval); // @flush

  yield {
    state: view(-1, {}, 'готово'),
    note: `Слито в ${res.length} непересекающихся интервалов.`,
  };

  return res;
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
