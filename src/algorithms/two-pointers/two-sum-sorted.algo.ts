import raw from './two-sum-sorted.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { VizState } from '@/viz/types';

type Result = readonly [number, number] | null;

// #region show
/**
 * Два числа с заданной суммой в ОТСОРТИРОВАННОМ массиве.
 *
 * Инвариант: ответ, если он есть, всегда лежит внутри отрезка [left, right].
 * Когда сумма меньше цели, увеличить её можно только сдвигом left вправо —
 * ни одна пара с текущим left левее не даст больше. Значит left отбрасывается
 * законно, а не «на удачу». Симметрично для right.
 */
export function* traceTwoSumSorted(
  nums: readonly number[],
  target: number,
): AlgoTrace<VizState, Result> {
  let left = 0;
  let right = nums.length - 1;

  // Правка против исходного решения: там условие было left <= right, и на
  // входе [4] с target 8 элемент складывался сам с собой — ложное «нашли».
  // #hide
  const view = (marks: Record<number, 'compare' | 'target' | 'excluded'>, note: string) =>
    ({
      kind: 'array' as const,
      data: nums,
      pointers: [
        { name: 'left', index: left, tone: 'l' as const },
        { name: 'right', index: right, tone: 'r' as const },
      ],
      marks,
      caption: note,
    }) satisfies VizState;
  // #endhide

  while (left < right) {
    const sum = nums[left] + nums[right]; // @sum

    yield {
      state: view({ [left]: 'compare', [right]: 'compare' }, `${nums[left]} + ${nums[right]} = ${sum}`),
      at: 'sum',
      note: `Сумма краёв: ${nums[left]} + ${nums[right]} = ${sum}. Цель ${target}.`,
      metrics: { comparisons: 1, reads: 2 },
    };

    if (sum === target) { // @found
      yield {
        state: view({ [left]: 'target', [right]: 'target' }, `нашли: ${left} и ${right}`),
        at: 'found',
        note: `Совпало — индексы ${left} и ${right}.`,
      };
      return [left, right];
    }

    if (sum < target) {
      left += 1; // @moveLeft
      yield {
        state: view({ [left - 1]: 'excluded' }, `сумма мала — двигаем left`),
        at: 'moveLeft',
        note: `${sum} < ${target}: любая пара с индексом ${left - 1} даст ещё меньше. Сдвигаем left.`,
      };
    } else {
      right -= 1; // @moveRight
      yield {
        state: view({ [right + 1]: 'excluded' }, `сумма велика — двигаем right`),
        at: 'moveRight',
        note: `${sum} > ${target}: любая пара с индексом ${right + 1} даст ещё больше. Сдвигаем right.`,
      };
    }
  }

  // @notFound
  return null;
}
// #endregion

/** Та же логика без шагов — для тестов, бенчей и импорта из задач. */
export const twoSumSorted = (nums: readonly number[], target: number): Result =>
  runTrace(traceTwoSumSorted(nums, target));

export default defineAlgo({
  meta: {
    slug: 'two-sum-sorted',
    title: 'Два числа с заданной суммой',
    topic: 'two-pointers',
    summary: 'Найти пару элементов отсортированного массива, дающих в сумме target, за один проход.',
    complexity: { time: 'O(n)', space: 'O(1)', growth: 'O(n)' },
    difficulty: 'easy',
    leetcode: { id: 167, title: 'two-sum-ii-input-array-is-sorted' },
    tags: ['два указателя', 'массив', 'сортированный массив'],
  },
  raw,
  presets: [
    {
      label: '[2,7,11,15], 9',
      args: [[2, 7, 11, 15], 9] as const,
      hint: 'Базовый случай: ответ находится сразу.',
    },
    {
      label: '[1,3,4,5,7,11], 9',
      args: [[1, 3, 4, 5, 7, 11], 9] as const,
      hint: 'Указатели идут навстречу несколько шагов — видно, как отбрасываются половины.',
    },
    {
      label: '[1,2,3], 100',
      args: [[1, 2, 3], 100] as const,
      hint: 'Ответа нет: указатели встречаются, цикл завершается без результата.',
    },
    {
      label: '[-4,-1,0,3,10], -1',
      args: [[-4, -1, 0, 3, 10], -1] as const,
      hint: 'Отрицательные числа ничего не ломают — важна только отсортированность.',
    },
  ],
  trace: traceTwoSumSorted,
  formatResult: (result) => (result ? `[${result[0]}, ${result[1]}]` : 'null — такой пары нет'),
});
