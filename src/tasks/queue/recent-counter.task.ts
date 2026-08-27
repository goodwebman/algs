import { testTask } from '../test-derived';

export default testTask({
  slug: 'recent-counter',
  title: 'Счётчик недавних запросов',
  topic: 'queue',
  prompt: 'Для каждого ping(t) посчитай количество запросов во включённом интервале [t - 3000, t]. Верни массив ответов.',
  exportName: 'recentCounter',
  solution: `export function recentCounter(times) {
  const queue = [];
  const result = [];
  let head = 0;
  for (const time of times) {
    queue.push(time);
    while (queue[head] < time - 3000) head += 1;
    result.push(queue.length - head);
  }
  return result;
}
`,
  cases: [
    { name: 'пример', args: [[1, 100, 3001, 3002]], expected: [1, 2, 3, 3] },
    { name: 'далёкие запросы', args: [[1, 4001, 8001]], expected: [1, 1, 1] },
    { name: 'пустая история', args: [[]], expected: [] },
  ],
  hints: ['Времена приходят по возрастанию.', 'head указывает на первый запрос, который ещё входит в окно.'],
});
