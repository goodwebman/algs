import { testTask } from '../test-derived';

export default testTask({
  slug: 'shuffle',
  title: 'Перемешивание Фишера — Йейтса',
  topic: 'arrays',
  prompt: 'Перемешай массив на месте так, чтобы каждая перестановка имела одинаковый шанс.',
  exportName: 'shuffle',
  solution: `export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
`,
  cases: [
    { name: 'сохраняет элементы', args: [[1, 2, 3, 4]], expected: [1, 2, 3, 4], compare: 'unordered' },
    { name: 'один элемент', args: [[7]], expected: [7] },
    { name: 'пустой массив', args: [[]], expected: [] },
  ],
  hints: ['Иди справа налево.', 'Для позиции i выбирай случайный индекс от 0 до i включительно.'],
});
