import { testTask } from '../test-derived';

export default testTask({
  slug: 'time-required-to-buy',
  title: 'Время до покупки билетов',
  topic: 'queue',
  prompt: 'Люди стоят в очереди и покупают по одному билету за круг. Верни время, когда человек с индексом k купит последний билет.',
  exportName: 'timeRequiredToBuy',
  solution: `export function timeRequiredToBuy(tickets, k) {
  let time = 0;
  for (let i = 0; i < tickets.length; i += 1) {
    time += Math.min(tickets[i], tickets[k] - (i > k ? 1 : 0));
  }
  return time;
}
`,
  cases: [
    { name: 'классика', args: [[2, 3, 2], 2], expected: 6 },
    { name: 'цель в начале', args: [[5, 1, 1, 1], 0], expected: 8 },
    { name: 'цель в конце', args: [[1, 1, 1, 4], 3], expected: 7 },
  ],
  hints: ['Люди слева от k могут купить tickets[k] раз.', 'Люди справа успеют сделать не больше tickets[k] - 1 покупок.'],
});
