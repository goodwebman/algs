import raw from './move-zeroes.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Перенести все нули в конец, сохранив порядок остальных элементов.
 *
 * Та же схема «медленный и быстрый», но с обменом вместо записи: slow
 * показывает на первую позицию, где стоит ноль, fast ищет следующее
 * ненулевое значение.
 *
 * Инвариант: слева от slow нулей нет, между slow и fast — только нули.
 * Обмен этот инвариант сохраняет и заодно сохраняет относительный порядок
 * ненулевых элементов — ради этого и нужен обмен, а не сдвиг.
 */
export function* traceMoveZeroes(input: readonly number[]): AlgoTrace<VizState, number[]> {
  const nums = [...input];
  let slow = 0;

  const ids = nums.map((value, i) => `${value}#${i}`);

  const view = (fast: number, marks: Record<number, MarkKind>, note: string): VizState => ({
    kind: 'array',
    data: nums,
    ids,
    pointers: [
      { name: 'slow', index: slow, tone: 'l', outOfRange: slow >= nums.length },
      { name: 'fast', index: fast, tone: 'r', outOfRange: fast >= nums.length },
    ],
    marks,
    caption: note,
  });

  for (let fast = 0; fast < nums.length; fast += 1) {
    if (nums[fast] === 0) { // @check
      yield {
        state: view(fast, { [fast]: 'excluded' }, 'ноль — пропускаем'),
        at: 'check',
        note: `nums[${fast}] = 0. Ноль остаётся на месте, fast идёт дальше.`,
        metrics: { comparisons: 1, reads: 1 },
      };
      continue;
    }

    if (slow !== fast) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]]; // @swap
      [ids[slow], ids[fast]] = [ids[fast], ids[slow]];

      yield {
        state: view(fast, { [slow]: 'swap', [fast]: 'swap' }, `меняем ${slow} и ${fast}`),
        at: 'swap',
        note: `Ненулевое ${nums[slow]} переезжает в позицию ${slow}, ноль уходит вправо.`,
        metrics: { comparisons: 1, swaps: 1 },
      };
    } else {
      yield {
        state: view(fast, { [fast]: 'done' }, 'уже на месте'),
        at: 'swap',
        note: `nums[${fast}] = ${nums[fast]} уже стоит правильно — обмен не нужен.`,
        metrics: { comparisons: 1 },
      };
    }

    slow += 1;
  }

  yield {
    state: view(nums.length - 1, {}, 'готово'),
    note: 'Все нули сдвинуты в конец, порядок остальных элементов сохранён.',
  };

  return nums;
}
// #endregion

export const moveZeroes = (nums: readonly number[]): number[] => runTrace(traceMoveZeroes(nums));

export default defineAlgo({
  meta: {
    slug: 'move-zeroes',
    title: 'Перенос нулей в конец',
    topic: 'arrays',
    summary: 'Сдвинуть все нули вправо, сохранив относительный порядок остальных элементов.',
    complexity: { time: 'O(n)', space: 'O(1)', growth: 'O(n)' },
    difficulty: 'easy',
    leetcode: { id: 283, title: 'move-zeroes' },
    tags: ['массив', 'быстрый и медленный указатель', 'стабильность'],
  },
  raw,
  presets: [
    { label: '[0,1,0,3,12]', args: [[0, 1, 0, 3, 12]] as const, hint: 'Классика: видно, как ненулевые «протискиваются» влево.' },
    { label: '[1,2,3]', args: [[1, 2, 3]] as const, hint: 'Нулей нет — обменов не происходит вообще.' },
    { label: '[0,0,1]', args: [[0, 0, 1]] as const, hint: 'Единственное ненулевое переезжает через два нуля.' },
    { label: '[0,0,0]', args: [[0, 0, 0]] as const, hint: 'Все нули — slow не двигается ни разу.' },
  ],
  trace: traceMoveZeroes,
  formatResult: (result) => `[${result.join(', ')}]`,
});
