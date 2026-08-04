import { defineTask } from '../types';

export default defineTask({
  slug: 'merge-intervals',
  title: 'Слияние интервалов',
  topic: 'intervals',
  prompt:
    'Дан массив интервалов [start, end]. Слей все пересекающиеся\n' +
    'и верни массив непересекающихся, отсортированный по началу.\n' +
    'Касание считается пересечением: [1,4] и [4,5] дают [1,5].\n' +
    'Вход мутировать нельзя.',
  exportName: 'mergeIntervals',
  starter: `export function mergeIntervals(intervals) {
  // Отсортируй КОПИЮ по началу — дальше хватит одного прохода.
  // Сравнивай каждый интервал только с последним в результате.
  // Не забудь Math.max: вложенный интервал не должен укоротить внешний.
}
`,
  solution: `export function mergeIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const merged = [];

  for (const [start, end] of sorted) {
    const last = merged[merged.length - 1];

    if (last && start <= last[1]) {
      // Math.max обязателен: [2,3] внутри [1,10] не должен дать [1,3].
      merged[merged.length - 1] = [last[0], Math.max(last[1], end)];
    } else {
      merged.push([start, end]);
    }
  }

  return merged;
}
`,
  cases: [
    {
      name: 'классика',
      args: [[[1, 3], [2, 6], [8, 10], [15, 18]]],
      expected: [[1, 6], [8, 10], [15, 18]],
    },
    { name: 'касание сливается', args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
    // Без Math.max этот кейс вернёт [[1,3]]
    { name: 'вложенный интервал', args: [[[1, 10], [2, 3]]], expected: [[1, 10]] },
    { name: 'вход не отсортирован', args: [[[5, 6], [1, 2]]], expected: [[1, 2], [5, 6]] },
    { name: 'пустой массив', args: [[]], expected: [] },
    { name: 'один интервал', args: [[[1, 5]]], expected: [[1, 5]] },
    { name: 'ничего не пересекается', args: [[[1, 2], [3, 4]]], expected: [[1, 2], [3, 4]] },
    { name: 'всё сливается в один', args: [[[1, 4], [2, 5], [3, 6]]], expected: [[1, 6]] },
    {
      name: 'не мутирует вход',
      args: [[[1, 3], [2, 6]]],
      expected: [[1, 6]],
      noMutation: true,
    },
  ],
  bench: {
    sizes: [500, 2000, 10000, 40000, 100000],
    makeArgsSource: '(n) => [Array.from({ length: n }, (_, i) => [i * 2, i * 2 + 3])]',
    compareWith: ['O(n log n)', 'O(n²)'],
  },
  hints: [
    'Сортируй КОПИЮ: [...intervals].sort((a, b) => a[0] - b[0]).',
    'Условие пересечения после сортировки: start <= last[1].',
    'При слиянии конец = Math.max(last[1], end), иначе вложенный интервал всё сломает.',
  ],
});
