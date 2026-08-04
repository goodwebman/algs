import raw from './max-sum-fixed.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Максимальная сумма подмассива фиксированной длины k.
 *
 * Окно фиксированного размера — простейший случай приёма. Инсайт в том, что
 * соседние окна отличаются ровно двумя элементами: одно значение вошло
 * справа, одно вышло слева. Значит пересчитывать сумму с нуля не нужно —
 * достаточно двух операций вместо k.
 *
 * Это и есть разница между O(n·k) и O(n).
 */
export function* traceMaxSumFixed(nums: readonly number[], k: number): AlgoTrace<VizState, number> {
  if (k <= 0 || k > nums.length) return 0;

  let sum = 0;
  for (let i = 0; i < k; i += 1) sum += nums[i]; // @build

  let best = sum;
  let bestStart = 0;

  const view = (from: number, to: number, marks: Record<number, MarkKind>, note: string): VizState => ({
    kind: 'array',
    data: nums,
    window: { from, to },
    marks: {
      ...Object.fromEntries(
        nums.map((_, i) => [i, i >= bestStart && i < bestStart + k ? ('done' as const) : undefined]),
      ),
      ...marks,
    },
    caption: `${note} · лучшая сумма ${best}`,
  });

  yield {
    state: view(0, k - 1, {}, `первое окно, сумма ${sum}`),
    at: 'build',
    note: `Собрали первое окно из ${k} элементов: сумма ${sum}.`,
    metrics: { reads: k },
  };

  for (let right = k; right < nums.length; right += 1) {
    const left = right - k;
    sum += nums[right] - nums[left]; // @slide

    yield {
      state: view(left + 1, right, { [right]: 'active', [left]: 'excluded' }, `сумма ${sum}`),
      at: 'slide',
      note: `Вошло ${nums[right]}, вышло ${nums[left]} → сумма ${sum}. Две операции вместо ${k}.`,
      metrics: { reads: 2, comparisons: 1 },
    };

    if (sum > best) {
      best = sum;
      bestStart = left + 1; // @better

      yield {
        state: view(left + 1, right, { [right]: 'target' }, `новый максимум ${best}`),
        at: 'better',
        note: `${sum} больше прежнего максимума — запоминаем окно [${left + 1}…${right}].`,
      };
    }
  }

  return best;
}
// #endregion

export const maxSumFixed = (nums: readonly number[], k: number): number =>
  runTrace(traceMaxSumFixed(nums, k));

export default defineAlgo({
  meta: {
    slug: 'max-sum-fixed',
    title: 'Максимальная сумма окна длины k',
    topic: 'sliding-window',
    summary: 'Найти подмассив фиксированной длины с наибольшей суммой за один проход.',
    complexity: { time: 'O(n)', space: 'O(1)', growth: 'O(n)' },
    difficulty: 'easy',
    tags: ['скользящее окно', 'фиксированный размер', 'префиксная сумма'],
  },
  raw,
  presets: [
    { label: '[2,1,5,1,3,2], k=3', args: [[2, 1, 5, 1, 3, 2], 3] as const, hint: 'Максимум найдётся не сразу — окно проедет дальше.' },
    { label: '[1,2,3,4,5], k=2', args: [[1, 2, 3, 4, 5], 2] as const, hint: 'Возрастающий массив: максимум всегда в конце.' },
    { label: '[-1,-2,-3,-4], k=2', args: [[-1, -2, -3, -4], 2] as const, hint: 'Только отрицательные — максимум это «наименее плохое» окно.' },
    { label: '[5,1,1,1], k=4', args: [[5, 1, 1, 1], 4] as const, hint: 'Окно во весь массив — сдвигов не будет.' },
  ],
  trace: traceMaxSumFixed,
  formatResult: (best) => `максимальная сумма: ${best}`,
});
