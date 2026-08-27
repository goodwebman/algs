import { testTask } from '../test-derived';

export default testTask({
  slug: 'queue-time',
  title: 'Время обслуживания в кассах',
  topic: 'queue',
  prompt: 'Покупатели идут по кругу к n кассам. Найди время, за которое обслужатся все покупатели.',
  exportName: 'queueTime',
  solution: `export function queueTime(customers, n) {
  const tills = Array(Math.min(customers.length, n)).fill(0);
  for (const customer of customers) {
    const index = tills.indexOf(Math.min(...tills));
    tills[index] += customer;
  }
  return Math.max(0, ...tills);
}
`,
  cases: [
    { name: 'две кассы', args: [[10, 2, 3, 3], 2], expected: 10 },
    { name: 'одна касса', args: [[2, 2, 3, 3], 1], expected: 10 },
    { name: 'пустая очередь', args: [[], 3], expected: 0 },
  ],
  hints: ['Храни суммарное время каждой кассы.', 'Следующего покупателя отправляй к кассе с минимумом.'],
});
