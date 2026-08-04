import raw from './coin-change-dp.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Размен монет через DP — там, где жадность врёт.
 *
 * Жадность на наборе [25,10,1] и сумме 30 даёт 6 монет вместо 3. DP даёт
 * гарантированный оптимум на ЛЮБОМ наборе.
 *
 * Состояние: dp[s] = минимальное число монет для суммы s.
 * Переход:   dp[s] = 1 + min(dp[s - coin]) по всем монетам, что помещаются.
 * База:      dp[0] = 0 — нулевую сумму разменивают нулём монет.
 *
 * Ключ к любому DP — найти эти три вещи. Дальше код пишется механически.
 * Здесь мы решаем каждую подзадачу ровно один раз, поэтому и получается
 * полином вместо экспоненты перебора.
 */
const IMPOSSIBLE = Infinity;

export function* traceCoinChangeDp(
  coins: readonly number[],
  amount: number,
): AlgoTrace<VizState, number> {
  const dp = new Array<number>(amount + 1).fill(IMPOSSIBLE);
  dp[0] = 0; // @base

  const cell = (value: number) => (value === IMPOSSIBLE ? '∞' : value);

  const view = (marks: Record<string, MarkKind>, note: string): VizState => ({
    kind: 'matrix',
    grid: [dp.map(cell)],
    colLabels: dp.map((_, i) => String(i)),
    rowLabels: ['монет'],
    marks,
    caption: note,
  });

  yield {
    state: view({ '0,0': 'done' }, 'база: dp[0] = 0'),
    at: 'base',
    note: 'Нулевую сумму можно разменять нулём монет — это точка опоры для всего остального.',
  };

  for (let sum = 1; sum <= amount; sum += 1) {
    for (const coin of coins) { // @coins
      if (coin > sum) continue;
      if (dp[sum - coin] === IMPOSSIBLE) continue;

      const candidate = dp[sum - coin] + 1; // @relax

      if (candidate < dp[sum]) {
        dp[sum] = candidate;

        yield {
          state: view({ [`0,${sum}`]: 'active', [`0,${sum - coin}`]: 'compare' }, `dp[${sum}] = ${candidate}`),
          at: 'relax',
          note: `Монетой ${coin} сводим сумму ${sum} к уже решённой ${sum - coin}: ${dp[sum - coin]} + 1 = ${candidate}.`,
          metrics: { comparisons: 1, writes: 1 },
        };
      }
    }
  }

  const answer = dp[amount];

  yield {
    state: view(
      Object.fromEntries(dp.map((_, i) => [`0,${i}`, i === amount ? ('target' as const) : ('done' as const)])),
      answer === IMPOSSIBLE ? 'разменять невозможно' : `оптимум: ${answer} монет`,
    ),
    note:
      answer === IMPOSSIBLE
        ? `Сумму ${amount} этими номиналами не разменять.`
        : `Минимум ${answer} монет. В отличие от жадности, это гарантированный оптимум.`,
    memoryPeak: dp.length,
  };

  return answer === IMPOSSIBLE ? -1 : answer;
}
// #endregion

export const coinChangeDp = (coins: readonly number[], amount: number): number =>
  runTrace(traceCoinChangeDp(coins, amount));

export default defineAlgo({
  meta: {
    slug: 'coin-change-dp',
    title: 'Размен монет через DP',
    topic: 'dp',
    summary: 'Минимальное число монет для суммы — гарантированный оптимум на любом наборе.',
    complexity: { time: 'O(amount · монет)', space: 'O(amount)', growth: 'O(n)' },
    difficulty: 'medium',
    leetcode: { id: 322, title: 'coin-change' },
    tags: ['динамическое программирование', 'состояние', 'переход'],
  },
  raw,
  presets: [
    {
      label: '[25,10,1], 30 — там где жадность врала',
      args: [[25, 10, 1], 30] as const,
      hint: 'DP находит 3 монеты (10+10+10), жадность нашла 6.',
    },
    { label: '[1,5,10,25], 63', args: [[1, 5, 10, 25], 63] as const, hint: 'Канонический набор: DP согласен с жадностью.' },
    { label: '[2], 3 — невозможно', args: [[2], 3] as const, hint: 'Нечётную сумму двойками не собрать — ответ −1.' },
    { label: '[1,3,4], 6', args: [[1, 3, 4], 6] as const, hint: 'Оптимум 3+3 = 2 монеты, жадность взяла бы 4+1+1 = 3.' },
  ],
  trace: traceCoinChangeDp,
  formatResult: (count) => (count === -1 ? 'разменять невозможно' : `минимум ${count} монет`),
});
