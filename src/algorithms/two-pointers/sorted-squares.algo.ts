import raw from './sorted-squares.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Квадраты отсортированного массива — снова отсортированные.
 *
 * Инсайт: после возведения в квадрат максимум оказывается на одном из КРАЁВ
 * (самое отрицательное или самое положительное число). Значит результат
 * можно заполнять С КОНЦА, каждый раз забирая больший из двух краёв.
 *
 * Именно с конца, а не с начала: заполнение с начала потребовало бы
 * `unshift`, а он сдвигает весь массив и превращает O(n) в O(n²).
 */
export function* traceSortedSquares(nums: readonly number[]): AlgoTrace<VizState, number[]> {
  const result = new Array<number>(nums.length).fill(0);
  let left = 0;
  let right = nums.length - 1;
  let write = nums.length - 1; // @write

  const view = (marks: Record<number, MarkKind>, note: string): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: 'вход',
        view: {
          kind: 'array',
          data: nums,
          pointers: [
            { name: 'left', index: left, tone: 'l' },
            { name: 'right', index: right, tone: 'r' },
          ],
          marks,
        },
      },
      {
        title: 'результат (заполняется справа налево)',
        view: {
          kind: 'array',
          data: result,
          pointers: [{ name: 'write', index: write, tone: 'aux', outOfRange: write < 0 }],
          marks: Object.fromEntries(
            result.map((_, i) => [i, i > write ? ('done' as const) : ('excluded' as const)]),
          ),
        },
      },
    ],
    caption: note,
  });

  while (left <= right) {
    const leftSquare = nums[left] * nums[left];
    const rightSquare = nums[right] * nums[right]; // @squares

    yield {
      state: view({ [left]: 'compare', [right]: 'compare' }, `${leftSquare} против ${rightSquare}`),
      at: 'squares',
      note: `Сравниваем квадраты краёв: ${nums[left]}² = ${leftSquare}, ${nums[right]}² = ${rightSquare}.`,
      metrics: { comparisons: 1, reads: 2 },
    };

    if (leftSquare > rightSquare) {
      result[write] = leftSquare; // @takeLeft
      yield {
        state: view({ [left]: 'target' }, `${leftSquare} уходит в позицию ${write}`),
        at: 'takeLeft',
        note: `Левый край по модулю больше — его квадрат и есть максимум оставшихся. Кладём в ${write}.`,
        metrics: { writes: 1 },
      };
      left += 1;
    } else {
      result[write] = rightSquare; // @takeRight
      yield {
        state: view({ [right]: 'target' }, `${rightSquare} уходит в позицию ${write}`),
        at: 'takeRight',
        note: `Правый край по модулю не меньше — его квадрат максимален. Кладём в ${write}.`,
        metrics: { writes: 1 },
      };
      right -= 1;
    }

    write -= 1;
  }

  yield {
    state: view({}, 'готово'),
    note: 'Все позиции заполнены. Результат отсортирован по построению.',
    memoryPeak: nums.length,
  };

  return result;
}
// #endregion

export const sortedSquares = (nums: readonly number[]): number[] => runTrace(traceSortedSquares(nums));

export default defineAlgo({
  meta: {
    slug: 'sorted-squares',
    title: 'Квадраты отсортированного массива',
    topic: 'two-pointers',
    summary: 'Возвести элементы в квадрат и сохранить сортировку за один проход, без пересортировки.',
    complexity: { time: 'O(n)', space: 'O(n)', growth: 'O(n)' },
    difficulty: 'easy',
    leetcode: { id: 977, title: 'squares-of-a-sorted-array' },
    tags: ['два указателя', 'массив', 'заполнение с конца'],
  },
  raw,
  presets: [
    {
      label: '[-4,-1,0,3,10]',
      args: [[-4, -1, 0, 3, 10]] as const,
      hint: 'Классика: максимум сначала слева (−4), потом переходит вправо.',
    },
    {
      label: '[-7,-3,2,3,11]',
      args: [[-7, -3, 2, 3, 11]] as const,
      hint: 'Указатели чередуются — видно, что решение не «сначала левые, потом правые».',
    },
    { label: '[1,2,3]', args: [[1, 2, 3]] as const, hint: 'Без отрицательных: работает только правый край.' },
    {
      label: '[-5,-4,-3]',
      args: [[-5, -4, -3]] as const,
      hint: 'Только отрицательные: порядок разворачивается целиком.',
    },
  ],
  trace: traceSortedSquares,
  formatResult: (result) => `[${result.join(', ')}]`,
});
