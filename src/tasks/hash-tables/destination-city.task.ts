import { testTask } from '../test-derived';

export default testTask({
  slug: 'destination-city',
  title: 'Город назначения',
  topic: 'hash-tables',
  prompt: 'В цепочке маршрутов найди город, из которого больше нет исходящего маршрута.',
  exportName: 'destCity',
  solution: `export function destCity(paths) {
  const from = new Set(paths.map(([city]) => city));
  for (const [, city] of paths) if (!from.has(city)) return city;
}
`,
  cases: [
    { name: 'линейный маршрут', args: [[['London', 'New York'], ['New York', 'Lima'], ['Lima', 'Sao Paulo']]], expected: 'Sao Paulo' },
    { name: 'два города', args: [[['B', 'C'], ['D', 'B'], ['C', 'A']]], expected: 'A' },
    { name: 'короткий маршрут', args: [[['A', 'B']]], expected: 'B' },
  ],
  hints: ['Сохрани все города-источники.', 'Город назначения не входит в множество from.'],
});
