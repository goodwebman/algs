import { testTask } from '../test-derived';

export default testTask({
  slug: 'max-profit',
  title: 'Максимальная прибыль с одной сделки',
  topic: 'dp',
  prompt: 'Дан массив цен. Купи и продай один раз так, чтобы прибыль была максимальной. Верни 0, если выгодной сделки нет.',
  exportName: 'maxProfit',
  solution: `export function maxProfit(prices) {
  let minPrice = Infinity;
  let best = 0;
  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    best = Math.max(best, price - minPrice);
  }
  return best;
}
`,
  cases: [
    { name: 'обычный случай', args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
    { name: 'цены падают', args: [[7, 6, 4, 3, 1]], expected: 0 },
    { name: 'короткий массив', args: [[2, 4]], expected: 2 },
  ],
  hints: ['Храни минимальную цену слева от текущей.', 'На каждом шаге сравни текущую прибыль с лучшей.'],
});
