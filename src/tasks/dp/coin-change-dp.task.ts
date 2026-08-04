import { defineTask } from '../types';

export default defineTask({
  slug: 'coin-change-dp',
  title: 'Размен монет через DP',
  topic: 'dp',
  prompt:
    'Верни МИНИМАЛЬНОЕ число монет, чтобы набрать сумму amount.\n' +
    'Если набрать невозможно — верни −1. Монеты можно брать сколько угодно раз.\n' +
    'Жадность здесь не подойдёт: на [25,10,1] и сумме 30 она даёт 6 вместо 3.',
  exportName: 'coinChangeDp',
  starter: `export function coinChangeDp(coins, amount) {
  // Состояние: dp[s] = минимум монет для суммы s.
  // Переход:   dp[s] = 1 + min(dp[s - coin]).
  // База:      dp[0] = 0.
}
`,
  solution: `export function coinChangeDp(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let sum = 1; sum <= amount; sum += 1) {
    for (const coin of coins) {
      if (coin > sum) continue;
      if (dp[sum - coin] === Infinity) continue;

      dp[sum] = Math.min(dp[sum], dp[sum - coin] + 1);
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}
`,
  cases: [
    // Ключевой кейс: жадность здесь дала бы 6
    { name: 'там, где жадность врёт', args: [[25, 10, 1], 30], expected: 3 },
    { name: 'канонический набор', args: [[1, 5, 10, 25], 63], expected: 6 },
    { name: 'оптимум не самая крупная монета', args: [[1, 3, 4], 6], expected: 2 },
    { name: 'нулевая сумма', args: [[1, 5], 0], expected: 0 },
    { name: 'набрать невозможно', args: [[2], 3], expected: -1 },
    { name: 'монета равна сумме', args: [[1, 5, 10], 10], expected: 1 },
    { name: 'пустой набор монет', args: [[], 5], expected: -1 },
    { name: 'пустой набор и нулевая сумма', args: [[], 0], expected: 0 },
  ],
  bench: {
    sizes: [100, 500, 2000, 8000, 20000],
    makeArgsSource: '(n) => [[1, 5, 10, 25], n]',
    compareWith: ['O(n)', 'O(n²)'],
  },
  hints: [
    'dp — массив длины amount + 1, заполненный Infinity, кроме dp[0] = 0.',
    'Внешний цикл по суммам, внутренний по монетам.',
    'Пропускай монеты крупнее текущей суммы и недостижимые подзадачи (Infinity).',
  ],
});
