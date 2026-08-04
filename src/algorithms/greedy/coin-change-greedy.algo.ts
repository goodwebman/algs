import raw from './coin-change-greedy.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Размен суммы монетами — и почему жадность иногда врёт.
 *
 * Жадный алгоритм: берём самую крупную монету, которая помещается, повторяем.
 * Быстро, просто и на привычных наборах монет даёт оптимум.
 *
 * Но оптимальность НЕ СЛЕДУЕТ из алгоритма — она следует из свойств набора.
 * Набор называется каноническим, если жадность на нём всегда оптимальна.
 * [25, 10, 5, 1] — канонический. [25, 10, 1] — НЕТ:
 *
 *   сумма 30, жадно: 25 + 1×5  = 6 монет
 *   оптимально:      10 + 10 + 10 = 3 монеты
 *
 * Жадность взяла 25, и дальше выкручиваться пришлось единицами. Это общий
 * механизм провала: локально лучший выбор закрывает доступ к глобально
 * лучшему решению.
 */
export function* traceCoinChangeGreedy(
  coins: readonly number[],
  amount: number,
): AlgoTrace<VizState, number[]> {
  const sorted = [...coins].sort((a, b) => b - a);
  const taken: number[] = [];
  let left = amount;

  const view = (marks: Record<number, MarkKind>, note: string): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: 'монеты (по убыванию)',
        view: { kind: 'array', data: sorted, marks },
      },
      {
        title: 'взяли',
        view: { kind: 'array', data: taken.length ? taken : ['—'], marks: {} },
      },
    ],
    caption: `${note} · осталось разменять: ${left}`,
  });

  for (let i = 0; i < sorted.length; i += 1) { // @skip
    const coin = sorted[i];

    while (left >= coin) { // @take
      left -= coin;
      taken.push(coin);

      yield {
        state: view({ [i]: 'active' }, `берём ${coin}`),
        at: 'take',
        note: `${coin} помещается в остаток — берём. Осталось ${left}.`,
        metrics: { comparisons: 1, writes: 1 },
      };
    }

    yield {
      state: view({ [i]: 'excluded' }, `${coin} больше не помещается`),
      at: 'skip',
      note: `${coin} больше остатка ${left} — переходим к следующему номиналу.`,
      metrics: { comparisons: 1 },
    };
  }

  yield {
    state: view({}, left === 0 ? 'сумма разменяна' : 'разменять не удалось'),
    note:
      left === 0
        ? `Итог: ${taken.length} монет — ${taken.join(' + ')}. Но оптимален ли этот ответ, зависит от набора номиналов.`
        : `Осталось ${left}, а подходящих монет нет. Жадность зашла в тупик — это ещё один её недостаток.`,
  };

  return left === 0 ? taken : [];
}
// #endregion

export const coinChangeGreedy = (coins: readonly number[], amount: number): number[] =>
  runTrace(traceCoinChangeGreedy(coins, amount));

export default defineAlgo({
  meta: {
    slug: 'coin-change-greedy',
    title: 'Жадный размен монет',
    topic: 'greedy',
    summary: 'Когда «бери самое крупное» даёт оптимум, а когда молча врёт.',
    complexity: { time: 'O(n log n + количество монет)', space: 'O(1)', growth: 'O(n)' },
    difficulty: 'easy',
    tags: ['жадные алгоритмы', 'контрпример', 'канонический набор'],
  },
  raw,
  presets: [
    {
      label: '[25,10,5,1], 63 — оптимум',
      args: [[25, 10, 5, 1], 63] as const,
      hint: 'Канонический набор: жадность даёт минимальное число монет.',
    },
    {
      label: '[25,10,1], 30 — жадность врёт',
      args: [[25, 10, 1], 30] as const,
      hint: 'Жадно: 25+1×5 = 6 монет. Оптимально: 10+10+10 = 3. Контрпример.',
    },
    {
      label: '[7,5], 11 — тупик',
      args: [[7, 5], 11] as const,
      hint: 'Жадность берёт 7, остаётся 4 — разменять нечем, хотя 5+5+... тоже не даёт 11.',
    },
    { label: '[1,5,10,25], 0', args: [[1, 5, 10, 25], 0] as const, hint: 'Нулевая сумма — монет не нужно.' },
  ],
  trace: traceCoinChangeGreedy,
  formatResult: (taken) =>
    taken.length ? `${taken.length} монет: ${taken.join(' + ')}` : 'разменять не удалось',
});
