import raw from './binary-search.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Классический бинарный поиск в отсортированном массиве.
 *
 * Инвариант: если элемент есть, он лежит в отрезке [left, right].
 * Каждый шаг сравнивает середину с целью и выбрасывает половину отрезка —
 * ту, в которой элемента заведомо нет.
 *
 * Отсюда O(log n): чтобы от n дойти до 1, отрезок надо поделить пополам
 * log₂(n) раз. Для миллиона элементов это 20 шагов.
 */
export function* traceBinarySearch(arr: readonly number[], target: number): AlgoTrace<VizState, number> {
  let left = 0;
  let right = arr.length - 1;

  // #hide
  const view = (mid: number | null, marks: Record<number, MarkKind>, note: string): VizState => ({
    kind: 'array',
    data: arr,
    pointers: [
      { name: 'left', index: left, tone: 'l', outOfRange: left >= arr.length },
      ...(mid === null ? [] : [{ name: 'mid', index: mid, tone: 'scan' as const }]),
      { name: 'right', index: right, tone: 'r', outOfRange: right < 0 },
    ],
    marks: {
      ...Object.fromEntries(
        arr.map((_, i) => [i, i < left || i > right ? ('excluded' as const) : undefined]),
      ),
      ...marks,
    },
    caption: `${note} · осталось ${Math.max(0, right - left + 1)} из ${arr.length}`,
  });
  // #endhide

  while (left <= right) {
    const mid = Math.floor((left + right) / 2); // @mid
    const guess = arr[mid];

    yield {
      state: view(mid, { [mid]: 'compare' }, `середина: ${guess}`),
      at: 'mid',
      note: `Середина отрезка — индекс ${mid}, значение ${guess}. Ищем ${target}.`,
      metrics: { comparisons: 1, reads: 1 },
    };

    if (guess === target) { // @found
      yield {
        state: view(mid, { [mid]: 'target' }, 'нашли'),
        at: 'found',
        note: `${guess} — это и есть ${target}. Индекс ${mid}.`,
      };
      return mid;
    } else if (guess < target) {
      left = mid + 1; // @goRight
      yield {
        state: view(null, {}, 'ушли вправо'),
        at: 'goRight',
        note: `${guess} меньше ${target}: вся левая половина, включая середину, отпадает.`,
      };
    } else {
      right = mid - 1; // @goLeft
      yield {
        state: view(null, {}, 'ушли влево'),
        at: 'goLeft',
        note: `${guess} больше ${target}: вся правая половина, включая середину, отпадает.`,
      };
    }
  }

  yield {
    state: view(null, {}, 'отрезок пуст'),
    note: `left обогнал right — отрезок пуст, значит ${target} в массиве нет.`,
  };

  // В исходном решении здесь был undefined. Тип ответа — number,
  // поэтому «не нашли» кодируется как -1, по соглашению LeetCode.
  return -1;
}
// #endregion

export const binarySearch = (arr: readonly number[], target: number): number =>
  runTrace(traceBinarySearch(arr, target));

export default defineAlgo({
  meta: {
    slug: 'binary-search',
    title: 'Бинарный поиск',
    topic: 'binary-search',
    summary: 'Найти индекс элемента в отсортированном массиве, отбрасывая половину вариантов за шаг.',
    complexity: { time: 'O(log n)', space: 'O(1)', growth: 'O(log n)' },
    difficulty: 'easy',
    leetcode: { id: 704, title: 'binary-search' },
    tags: ['бинарный поиск', 'инвариант', 'отсортированный массив'],
  },
  raw,
  presets: [
    { label: '[-1,0,3,5,9,12], 9', args: [[-1, 0, 3, 5, 9, 12], 9] as const, hint: 'Классика: три шага на шесть элементов.' },
    { label: '[-1,0,3,5,9,12], 2', args: [[-1, 0, 3, 5, 9, 12], 2] as const, hint: 'Элемента нет — видно, как отрезок схлопывается в пустоту.' },
    { label: '[1..15], 1', args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 1] as const, hint: '15 элементов, 4 шага — вот он логарифм.' },
    { label: '[5], 5', args: [[5], 5] as const, hint: 'Один элемент: left === right, и цикл всё равно обязан выполниться.' },
  ],
  trace: traceBinarySearch,
  formatResult: (index) => (index === -1 ? 'не найдено' : `индекс ${index}`),
});
