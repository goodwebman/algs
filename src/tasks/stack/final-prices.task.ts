import { testTask } from '../test-derived';

export default testTask({
  slug: 'final-prices',
  title: 'Цены со скидкой',
  topic: 'stack',
  prompt: 'Для каждой цены вычти первую следующую цену, которая не больше текущей. Если скидки нет, цена остаётся прежней.',
  exportName: 'finalPrices',
  solution: `export function finalPrices(prices) {
  const result = [...prices];
  const stack = [];
  for (let i = 0; i < prices.length; i += 1) {
    while (stack.length && prices[i] <= prices[stack.at(-1)]) {
      const index = stack.pop();
      result[index] -= prices[i];
    }
    stack.push(i);
  }
  return result;
}
`,
  cases: [
    { name: 'скидки', args: [[8, 4, 6, 2, 3]], expected: [4, 2, 4, 2, 3] },
    { name: 'возрастание', args: [[1, 2, 3, 4]], expected: [1, 2, 3, 4] },
    { name: 'равные цены', args: [[10, 1, 1, 6]], expected: [9, 0, 1, 6] },
  ],
  hints: ['Стек хранит индексы цен без найденной скидки.', 'Сравнивай цены, но меняй результат по индексу из стека.'],
});
