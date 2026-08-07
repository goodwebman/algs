import raw from './merge-sort.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace, type Step } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Сортировка слиянием.
 *
 * «Разделяй и властвуй»: массив режется пополам до одиночных элементов
 * (они отсортированы по определению), затем куски попарно СЛИВАЮТСЯ.
 *
 * Слияние двух отсортированных массивов — линейная операция: смотрим на
 * головы обоих и забираем меньшую. Глубина рекурсии log n, на каждом
 * уровне суммарно O(n) работы → O(n log n).
 *
 * Главное свойство — СТАБИЛЬНОСТЬ: при `<=` в сравнении равные элементы
 * сохраняют исходный порядок. Именно поэтому merge sort лежит в основе
 * TimSort, которым сортирует V8.
 */
export function* traceMergeSort(input: readonly number[]): AlgoTrace<VizState, number[]> {
  const nums = [...input];
  const buffer = new Array<number>(nums.length).fill(0);

  // #hide
  const view = (marks: Record<number, MarkKind | undefined>, note: string): VizState => ({
    kind: 'array',
    data: nums,
    bars: true,
    marks,
    caption: note,
  });
  // #endhide

  function* mergeSort(from: number, to: number): Generator<Step<VizState>, void, void> {
    if (to - from <= 1) return; // @base

    const mid = from + Math.floor((to - from) / 2); // @split

    yield* mergeSort(from, mid);
    yield* mergeSort(mid, to);

    let left = from;
    let right = mid;
    let write = from;

    while (left < mid || right < to) {
      // Строгий `>` у правого: при равенстве берём ЛЕВЫЙ элемент.
      // Ровно эта строка делает сортировку стабильной.
      const takeLeft = right >= to || (left < mid && nums[left] <= nums[right]); // @compare

      buffer[write] = takeLeft ? nums[left] : nums[right];
      if (takeLeft) left += 1;
      else right += 1;
      write += 1;
    }

    for (let i = from; i < to; i += 1) nums[i] = buffer[i]; // @copy

    yield {
      state: view(
        Object.fromEntries(
          nums.map((_, i) => [i, i >= from && i < to ? ('done' as const) : undefined]),
        ),
        `слили [${from}…${to - 1}]`,
      ),
      at: 'copy',
      note: `Слили две отсортированные половины в отрезок [${from}…${to - 1}].`,
      metrics: { comparisons: to - from, writes: to - from },
      memoryPeak: nums.length,
    };
  }

  yield {
    state: view({}, 'исходный массив'),
    at: 'split',
    note: 'Режем массив пополам, пока не останутся одиночные элементы.',
  };

  yield* mergeSort(0, nums.length);

  yield {
    state: view(Object.fromEntries(nums.map((_, i) => [i, 'done' as const])), 'отсортировано'),
    note: 'Массив отсортирован. Порядок равных элементов сохранён — сортировка стабильна.',
  };

  return nums;
}
// #endregion

export const mergeSort = (nums: readonly number[]): number[] => runTrace(traceMergeSort(nums));

export default defineAlgo({
  meta: {
    slug: 'merge-sort',
    title: 'Сортировка слиянием',
    topic: 'sorting',
    summary: 'Разделяй и властвуй: O(n log n) в любом случае и гарантированная стабильность.',
    complexity: { time: 'O(n log n)', space: 'O(n)', growth: 'O(n log n)' },
    difficulty: 'medium',
    tags: ['сортировка', 'разделяй и властвуй', 'стабильность', 'слияние'],
  },
  raw,
  presets: [
    { label: '[5,2,4,6,1,3]', args: [[5, 2, 4, 6, 1, 3]] as const, hint: 'Видно, как отрезки сливаются снизу вверх.' },
    { label: '[1,2,3,4,5]', args: [[1, 2, 3, 4, 5]] as const, hint: 'Уже отсортирован — merge sort всё равно делает всю работу.' },
    { label: '[5,4,3,2,1]', args: [[5, 4, 3, 2, 1]] as const, hint: 'Обратный порядок — та же O(n log n), без деградации.' },
    { label: '[3,1,3,1]', args: [[3, 1, 3, 1]] as const, hint: 'Дубликаты: равные элементы не меняются местами.' },
  ],
  trace: traceMergeSort,
  formatResult: (result) => `[${result.join(', ')}]`,
});
