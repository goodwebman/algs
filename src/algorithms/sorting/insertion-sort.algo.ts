import raw from './insertion-sort.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Сортировка вставками.
 *
 * Держим отсортированный префикс и на каждом шаге вставляем в него очередной
 * элемент, сдвигая всё большее вправо. Так люди сортируют карты в руке.
 *
 * Асимптотика O(n²) — но это тот случай, когда асимптотика обманывает:
 * на ПОЧТИ отсортированных данных внутренний цикл почти не выполняется, и
 * фактическая сложность становится O(n). Плюс крошечная константа и работа
 * на месте.
 *
 * Именно поэтому вставками досортировывают короткие подмассивы внутри
 * TimSort — вместо того чтобы рекурсивно резать их дальше.
 */
export function* traceInsertionSort(input: readonly number[]): AlgoTrace<VizState, number[]> {
  const nums = [...input];
  const ids = nums.map((value, i) => `${value}#${i}`);

  const view = (sortedUpTo: number, marks: Record<number, MarkKind>, note: string): VizState => ({
    kind: 'array',
    data: nums,
    ids,
    bars: true,
    marks: {
      ...Object.fromEntries(nums.map((_, i) => [i, i <= sortedUpTo ? ('visited' as const) : undefined])),
      ...marks,
    },
    caption: note,
  });

  for (let i = 1; i < nums.length; i += 1) {
    const current = nums[i];
    const currentId = ids[i]; // @take
    let j = i - 1;

    yield {
      state: view(i - 1, { [i]: 'active' }, `вставляем ${current}`),
      at: 'take',
      note: `Берём ${current}. Слева отсортированный префикс — ищем, куда его вставить.`,
      metrics: { reads: 1 },
    };

    // Строгое `>`: равные элементы не сдвигаются, поэтому
    // сортировка стабильна.
    while (j >= 0 && nums[j] > current) { // @shift
      nums[j + 1] = nums[j];
      ids[j + 1] = ids[j];
      j -= 1;

      yield {
        state: view(i, { [j + 2]: 'swap', [j + 1]: 'compare' }, `сдвигаем ${nums[j + 2]} вправо`),
        at: 'shift',
        note: `${nums[j + 2]} больше ${current} — сдвигаем его вправо, освобождая место.`,
        metrics: { comparisons: 1, writes: 1 },
      };
    }

    nums[j + 1] = current;
    ids[j + 1] = currentId; // @place

    yield {
      state: view(i, { [j + 1]: 'done' }, `${current} на месте`),
      at: 'place',
      note: `${current} встал на индекс ${j + 1}. Префикс снова отсортирован.`,
      metrics: { writes: 1 },
    };
  }

  yield {
    state: view(nums.length - 1, Object.fromEntries(nums.map((_, i) => [i, 'done' as const])), 'готово'),
    note: 'Массив отсортирован.',
  };

  return nums;
}
// #endregion

export const insertionSort = (nums: readonly number[]): number[] => runTrace(traceInsertionSort(nums));

export default defineAlgo({
  meta: {
    slug: 'insertion-sort',
    title: 'Сортировка вставками',
    topic: 'sorting',
    summary: 'Вставляем элементы в отсортированный префикс — O(n) на почти отсортированных данных.',
    complexity: { time: 'O(n²), но O(n) на почти отсортированных', space: 'O(1)', growth: 'O(n²)' },
    difficulty: 'easy',
    tags: ['сортировка', 'на месте', 'стабильность', 'TimSort'],
  },
  raw,
  presets: [
    { label: '[5,2,4,6,1,3]', args: [[5, 2, 4, 6, 1, 3]] as const, hint: 'Обычный случай — много сдвигов.' },
    { label: '[1,2,3,4,5]', args: [[1, 2, 3, 4, 5]] as const, hint: 'Уже отсортирован: внутренний цикл не выполняется ни разу — это и есть O(n).' },
    { label: '[1,2,4,3,5]', args: [[1, 2, 4, 3, 5]] as const, hint: 'Почти отсортирован: ровно один сдвиг на весь массив.' },
    { label: '[5,4,3,2,1]', args: [[5, 4, 3, 2, 1]] as const, hint: 'Худший случай: каждый элемент едет через весь префикс.' },
  ],
  trace: traceInsertionSort,
  formatResult: (result) => `[${result.join(', ')}]`,
});
