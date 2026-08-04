import raw from './quick-sort.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace, type Step } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Быстрая сортировка (схема Ломуто).
 *
 * Выбираем опорный элемент, переставляем массив так, чтобы слева от него
 * оказалось всё меньшее, справа — всё большее. Опорный при этом встаёт на
 * своё финальное место. Дальше рекурсия по обеим частям.
 *
 * В среднем O(n log n) и на практике быстрее merge sort — сортирует на месте,
 * без выделения памяти и с хорошей локальностью по кэшу.
 *
 * Но худший случай — O(n²): если опорный каждый раз оказывается минимумом
 * или максимумом, разбиение вырождается в «один элемент против остальных».
 * На уже отсортированном массиве с опорным-последним это происходит всегда.
 * Отсюда выбор середины в качестве опорного — дешёвая защита от самого
 * частого патологического входа.
 */
export function* traceQuickSort(input: readonly number[]): AlgoTrace<VizState, number[]> {
  const nums = [...input];
  const ids = nums.map((value, i) => `${value}#${i}`);

  const swap = (a: number, b: number) => {
    [nums[a], nums[b]] = [nums[b], nums[a]];
    [ids[a], ids[b]] = [ids[b], ids[a]];
  };

  const view = (marks: Record<number, MarkKind | undefined>, note: string): VizState => ({
    kind: 'array',
    data: nums,
    ids,
    bars: true,
    marks,
    caption: note,
  });

  function* partition(low: number, high: number): Generator<Step<VizState>, number, void> {
    // Опорный — середина, а не край: на отсортированном входе
    // выбор края даёт гарантированный худший случай O(n²).
    const middle = low + Math.floor((high - low) / 2); // @pivot
    swap(middle, high);
    const pivot = nums[high];

    yield {
      state: view({ [high]: 'target' }, `опорный ${pivot}`),
      at: 'pivot',
      note: `Опорный элемент — ${pivot}, временно отправлен в конец отрезка.`,
      metrics: { swaps: 1 },
    };

    let boundary = low;

    for (let i = low; i < high; i += 1) { // @scan
      if (nums[i] < pivot) {
        if (i !== boundary) swap(i, boundary); // @swap
        boundary += 1;

        yield {
          state: view({ [high]: 'target', [boundary - 1]: 'swap', [i]: 'compare' }, `${nums[boundary - 1]} < ${pivot}`),
          at: 'swap',
          note: `${nums[boundary - 1]} меньше опорного — отправляем его в левую зону.`,
          metrics: { comparisons: 1, swaps: 1 },
        };
      } else {
        yield {
          state: view({ [high]: 'target', [i]: 'compare' }, `${nums[i]} ≥ ${pivot}`),
          at: 'scan',
          note: `${nums[i]} не меньше опорного — остаётся в правой зоне.`,
          metrics: { comparisons: 1 },
        };
      }
    }

    swap(boundary, high); // @place

    yield {
      state: view({ [boundary]: 'done' }, `${pivot} на месте`),
      at: 'place',
      note: `Опорный ${pivot} встал на индекс ${boundary} — это его финальная позиция.`,
      metrics: { swaps: 1 },
    };

    return boundary;
  }

  function* sort(low: number, high: number): Generator<Step<VizState>, void, void> {
    if (low >= high) return;

    const pivotIndex = yield* partition(low, high);
    yield* sort(low, pivotIndex - 1);
    yield* sort(pivotIndex + 1, high);
  }

  yield* sort(0, nums.length - 1);

  yield {
    state: view(Object.fromEntries(nums.map((_, i) => [i, 'done' as const])), 'отсортировано'),
    note: 'Каждый опорный элемент встал на своё место — массив отсортирован.',
  };

  return nums;
}
// #endregion

export const quickSort = (nums: readonly number[]): number[] => runTrace(traceQuickSort(nums));

export default defineAlgo({
  meta: {
    slug: 'quick-sort',
    title: 'Быстрая сортировка',
    topic: 'sorting',
    summary: 'Разбиение вокруг опорного элемента: в среднем O(n log n) и сортировка на месте.',
    complexity: { time: 'O(n log n) в среднем, O(n²) в худшем', space: 'O(log n)', growth: 'O(n log n)' },
    difficulty: 'medium',
    tags: ['сортировка', 'разделяй и властвуй', 'на месте', 'опорный элемент'],
  },
  raw,
  presets: [
    { label: '[5,2,4,6,1,3]', args: [[5, 2, 4, 6, 1, 3]] as const, hint: 'Обычный случай: разбиения примерно пополам.' },
    { label: '[1,2,3,4,5]', args: [[1, 2, 3, 4, 5]] as const, hint: 'Отсортированный вход. Опорный-середина спасает от вырождения.' },
    { label: '[3,3,3,3]', args: [[3, 3, 3, 3]] as const, hint: 'Все равны: схема Ломуто отправляет всё в правую зону — это худший случай.' },
    { label: '[9,1,8,2,7,3]', args: [[9, 1, 8, 2, 7, 3]] as const, hint: 'Перемешанный вход, много обменов.' },
  ],
  trace: traceQuickSort,
  formatResult: (result) => `[${result.join(', ')}]`,
});
