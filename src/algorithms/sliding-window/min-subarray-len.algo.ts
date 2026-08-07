import raw from './min-subarray-len.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Кратчайший подмассив с суммой не меньше target.
 *
 * Окно ПЕРЕМЕННОГО размера. Схема всегда одна:
 *   1. right расширяет окно, пока условие не выполнено;
 *   2. как только выполнено — left сжимает окно, пока оно ещё выполняется;
 *   3. на каждом сжатии обновляем ответ.
 *
 * Работает только на неотрицательных числах: расширение обязано делать
 * сумму больше, а сжатие — меньше. С отрицательными это неверно, и там
 * нужны префиксные суммы.
 */
export function* traceMinSubArrayLen(
  target: number,
  nums: readonly number[],
): AlgoTrace<VizState, number> {
  let left = 0;
  let sum = 0;
  let minLen = Infinity;

  // #hide
  const view = (right: number, marks: Record<number, MarkKind>, note: string): VizState => ({
    kind: 'array',
    data: nums,
    window: right >= left ? { from: left, to: right } : null,
    pointers: [
      { name: 'left', index: left, tone: 'l' },
      { name: 'right', index: right, tone: 'r' },
    ],
    marks,
    caption: `${note} · сумма ${sum}, лучший ответ ${minLen === Infinity ? '—' : minLen}`,
  });
  // #endhide

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right]; // @expand

    yield {
      state: view(right, { [right]: 'active' }, 'расширяем окно'),
      at: 'expand',
      note: `Добавили ${nums[right]}, сумма окна ${sum}. Нужно ≥ ${target}.`,
      metrics: { reads: 1 },
    };

    // Именно while, а не if: после одного сжатия условие может
    // всё ещё выполняться, и окно нужно сжимать дальше.
    while (sum >= target) {
      minLen = Math.min(minLen, right - left + 1); // @better

      yield {
        state: view(right, { [left]: 'target', [right]: 'target' }, `длина ${right - left + 1}`),
        at: 'better',
        note: `Условие выполнено, длина ${right - left + 1}. Лучший ответ ${minLen} — пробуем сжать ещё.`,
        metrics: { comparisons: 1 },
      };

      sum -= nums[left]; // @shrink
      yield {
        state: view(right, { [left]: 'excluded' }, 'сжимаем слева'),
        at: 'shrink',
        note: `Выбрасываем ${nums[left]} слева, сумма ${sum}.`,
        metrics: { reads: 1 },
      };
      left++;
    }
  }

  return minLen === Infinity ? 0 : minLen; // @result
}
// #endregion

export const minSubArrayLen = (target: number, nums: readonly number[]): number =>
  runTrace(traceMinSubArrayLen(target, nums));

export default defineAlgo({
  meta: {
    slug: 'min-subarray-len',
    title: 'Кратчайший подмассив с суммой ≥ target',
    topic: 'sliding-window',
    summary: 'Найти минимальную длину непрерывного отрезка, сумма которого не меньше target.',
    complexity: { time: 'O(n)', space: 'O(1)', growth: 'O(n)' },
    difficulty: 'medium',
    leetcode: { id: 209, title: 'minimum-size-subarray-sum' },
    tags: ['скользящее окно', 'переменный размер', 'сжатие'],
  },
  raw,
  presets: [
    { label: 'target=7, [2,3,1,2,4,3]', args: [7, [2, 3, 1, 2, 4, 3]] as const, hint: 'Ответ 2 — окно [4,3] в самом конце.' },
    { label: 'target=11, [1,1,1,1,1,1,1,1]', args: [11, [1, 1, 1, 1, 1, 1, 1, 1]] as const, hint: 'Суммы не хватает никогда — ответ 0.' },
    { label: 'target=4, [1,4,4]', args: [4, [1, 4, 4]] as const, hint: 'Ответ 1: одного элемента уже достаточно.' },
    { label: 'target=15, [1,2,3,4,5]', args: [15, [1, 2, 3, 4, 5]] as const, hint: 'Годится только весь массив целиком.' },
  ],
  trace: traceMinSubArrayLen,
  formatResult: (best) => (best === 0 ? 'подходящего отрезка нет' : `минимальная длина: ${best}`),
});
