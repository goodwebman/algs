import { defineTask } from '../types';

export default defineTask({
  slug: 'coin-change-greedy',
  title: 'Жадный размен монет',
  topic: 'greedy',
  prompt:
    'Разменяй сумму жадно: всегда бери самую крупную монету, которая помещается.\n' +
    'Верни массив взятых монет по убыванию. Если разменять не удалось — пустой массив.\n' +
    'Помни: этот алгоритм НЕ всегда оптимален — в этом и смысл задачи.',
  exportName: 'coinChangeGreedy',
  starter: `export function coinChangeGreedy(coins, amount) {
  // Отсортируй монеты по убыванию и бери каждую, пока помещается.
  // Вход мутировать нельзя.
}
`,
  solution: `export function coinChangeGreedy(coins, amount) {
  const sorted = [...coins].sort((a, b) => b - a);
  const taken = [];
  let left = amount;

  for (const coin of sorted) {
    while (left >= coin) {
      left -= coin;
      taken.push(coin);
    }
  }

  // Остаток не нулевой — жадность зашла в тупик.
  return left === 0 ? taken : [];
}
`,
  cases: [
    { name: 'канонический набор', args: [[25, 10, 5, 1], 63], expected: [25, 25, 10, 1, 1, 1] },
    // Жадность даёт 6 монет, хотя оптимум — 3. Тест фиксирует именно жадное поведение.
    { name: 'неканонический набор — жадность хуже оптимума', args: [[25, 10, 1], 30], expected: [25, 1, 1, 1, 1, 1] },
    { name: 'нулевая сумма', args: [[1, 5, 10], 0], expected: [] },
    { name: 'тупик — разменять нечем', args: [[7, 5], 11], expected: [] },
    { name: 'монета равна сумме', args: [[1, 5, 10], 10], expected: [10] },
    { name: 'только единицы', args: [[1], 3], expected: [1, 1, 1] },
    { name: 'не мутирует вход', args: [[1, 25, 10], 30], expected: [25, 1, 1, 1, 1, 1], noMutation: true },
  ],
  hints: [
    'Сортируй копию по убыванию: [...coins].sort((a, b) => b - a).',
    'Внутренний while берёт одну монету столько раз, сколько она помещается.',
    'Если после всех монет остаток не ноль — размен не удался, верни [].',
  ],
});
