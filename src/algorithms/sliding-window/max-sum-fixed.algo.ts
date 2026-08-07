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
  // Правка против исходного решения: там был только guard k > nums.length,
  // и при k = 0 наружу уходила -Infinity вместо 0.
  if (k <= 0 || k > nums.length) return 0;

  let maxSum = -Infinity;
  let windowSum = 0;
  let left = 0;

  // #hide
  const view = (right: number, marks: Record<number, MarkKind>, note: string): VizState => ({
    kind: 'array',
    data: nums,
    window: right >= left ? { from: left, to: right } : null,
    marks,
    caption: `${note} · лучшая сумма ${maxSum === -Infinity ? '—' : maxSum}`,
  });
  // #endhide

  for (let right = 0; right < nums.length; right++) {
    windowSum += nums[right]; // @expand

    yield {
      state: view(right, { [right]: 'active' }, `вошло ${nums[right]}, сумма окна ${windowSum}`),
      at: 'expand',
      note: `Добавили ${nums[right]} справа: сумма окна ${windowSum}, ширина ${right - left + 1}.`,
      metrics: { reads: 1 },
    };

    // Окно доросло до k — сравниваем и сразу сдвигаем левую границу.
    if (right - left + 1 === k) { // @full
      maxSum = Math.max(maxSum, windowSum);

      yield {
        state: view(right, { [right]: 'target' }, `окно [${left}…${right}] = ${windowSum}`),
        at: 'full',
        note: `Полное окно [${left}…${right}] даёт ${windowSum}. Лучшая сумма: ${maxSum}.`,
        metrics: { comparisons: 1 },
      };

      windowSum -= nums[left]; // @slide
      left++;

      yield {
        state: view(right, { [left - 1]: 'excluded' }, `вышло ${nums[left - 1]}`),
        at: 'slide',
        note: `Вычли ${nums[left - 1]} слева — сумму следующего окна не пересчитываем с нуля.`,
        metrics: { reads: 1 },
      };
    }
  }

  return maxSum;
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
