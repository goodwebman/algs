import raw from './quick-sort.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace, type Step } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Быстрая сортировка (схема Хоара, двумя указателями).
 *
 * Берём опорное ЗНАЧЕНИЕ из середины отрезка. Два указателя идут навстречу:
 * левый ищет элемент не меньше опорного, правый — не больше. Найденную пару
 * меняем местами. Когда указатели встретились, отрезок разделён: слева всё
 * не больше опорного, справа — не меньше.
 *
 * В среднем O(n log n) и на практике быстрее merge sort — сортирует на месте,
 * без выделения памяти и с хорошей локальностью по кэшу.
 *
 * Но худший случай — O(n²): если опорный каждый раз оказывается минимумом
 * или максимумом, разбиение вырождается в «один элемент против остальных».
 * Опорный из середины — дешёвая защита от самого частого патологического
 * входа, уже отсортированного массива.
 */
export function* traceQuickSort(input: readonly number[]): AlgoTrace<VizState, number[]> {
  const arr = [...input];

  // #hide
  const ids = arr.map((value, i) => `${value}#${i}`);

  const view = (marks: Record<number, MarkKind | undefined>, note: string): VizState => ({
    kind: 'array',
    data: arr,
    ids,
    bars: true,
    marks,
    caption: note,
  });
  // #endhide

  function* partition(left: number, right: number): Generator<Step<VizState>, number, void> {
    // Правка против исходного решения: там стояло arr[Math.floor(left + right / 2)].
    // Деление выполняется раньше сложения, и опорным становился случайный
    // элемент — на больших отрезках вообще за границей.
    const pivot = arr[Math.floor((left + right) / 2)]; // @pivot
    let i = left - 1;
    let j = right + 1;

    yield {
      state: view({ [Math.floor((left + right) / 2)]: 'target' }, `опорное значение ${pivot}`),
      at: 'pivot',
      note: `Опорное значение — ${pivot}, из середины отрезка [${left}…${right}].`,
      metrics: { reads: 1 },
    };

    while (true) {
      do {
        i++;
      } while (arr[i] < pivot); // @scanLeft

      do {
        j--;
      } while (arr[j] > pivot); // @scanRight

      yield {
        state: view({ [i]: 'compare', [j]: 'compare' }, `i=${i} (${arr[i]}), j=${j} (${arr[j]})`),
        at: 'scanRight',
        note: `Левый указатель встал на ${arr[i]} (не меньше опорного), правый — на ${arr[j]} (не больше).`,
        metrics: { comparisons: 2, reads: 2 },
      };

      if (i >= j) return j; // @meet

      [arr[i], arr[j]] = [arr[j], arr[i]]; // @swap
      // #hide
      [ids[i], ids[j]] = [ids[j], ids[i]];
      // #endhide

      yield {
        state: view({ [i]: 'swap', [j]: 'swap' }, `меняем ${arr[j]} и ${arr[i]}`),
        at: 'swap',
        note: `Элементы стоят не на своих половинах — меняем их местами.`,
        metrics: { swaps: 1 },
      };
    }
  }

  function* quickSort(left: number, right: number): Generator<Step<VizState>, void, void> {
    if (left >= right) return;

    const pivotIndex = yield* partition(left, right);

    // Именно pivotIndex, а не pivotIndex - 1: у Хоара опорный НЕ встаёт
    // на финальное место, он остаётся внутри левой половины.
    yield* quickSort(left, pivotIndex);
    yield* quickSort(pivotIndex + 1, right);
  }

  yield* quickSort(0, arr.length - 1);

  yield {
    state: view(Object.fromEntries(arr.map((_, i) => [i, 'done' as const])), 'отсортировано'),
    note: 'Все отрезки схлопнулись до одного элемента — массив отсортирован.',
  };

  return arr;
}
// #endregion

export const quickSort = (nums: readonly number[]): number[] => runTrace(traceQuickSort(nums));

export default defineAlgo({
  meta: {
    slug: 'quick-sort',
    title: 'Быстрая сортировка',
    topic: 'sorting',
    summary: 'Разбиение двумя указателями вокруг опорного значения: в среднем O(n log n), на месте.',
    complexity: { time: 'O(n log n) в среднем, O(n²) в худшем', space: 'O(log n)', growth: 'O(n log n)' },
    difficulty: 'medium',
    tags: ['сортировка', 'разделяй и властвуй', 'на месте', 'схема Хоара'],
  },
  raw,
  presets: [
    { label: '[5,2,4,6,1,3]', args: [[5, 2, 4, 6, 1, 3]] as const, hint: 'Обычный случай: разбиения примерно пополам.' },
    { label: '[1,2,3,4,5]', args: [[1, 2, 3, 4, 5]] as const, hint: 'Отсортированный вход. Опорный-середина спасает от вырождения.' },
    { label: '[3,3,3,3]', args: [[3, 3, 3, 3]] as const, hint: 'Все равны: у Хоара указатели встречаются посередине — разбиение ровное.' },
    { label: '[9,1,8,2,7,3]', args: [[9, 1, 8, 2, 7, 3]] as const, hint: 'Перемешанный вход, много обменов.' },
  ],
  trace: traceQuickSort,
  formatResult: (result) => `[${result.join(', ')}]`,
});
