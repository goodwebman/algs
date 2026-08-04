import { defineTask } from '../types';

export default defineTask({
  slug: 'bfs-shortest-path',
  title: 'Кратчайший путь через BFS',
  topic: 'queue',
  prompt:
    'Дан невзвешенный граф списком смежности и вершины start и end.\n' +
    'Верни кратчайший путь как массив вершин от start до end.\n' +
    'Если пути нет — верни null. shift() использовать нельзя: O(n²) на больших графах.',
  exportName: 'bfsShortestPath',
  starter: `export function bfsShortestPath(graph, start, end) {
  // Очередь с head-указателем (без shift!).
  // visited + parent: parent для восстановления пути в конце.
}
`,
  solution: `export function bfsShortestPath(graph, start, end) {
  if (start === end) return [start];

  const visited = new Set([start]);
  const parent = new Map([[start, null]]);
  const queue = [start];
  let head = 0;

  while (head < queue.length) {
    const node = queue[head++];

    for (const neighbor of graph[node] ?? []) {
      if (visited.has(neighbor)) continue;

      visited.add(neighbor);
      parent.set(neighbor, node);
      queue.push(neighbor);

      if (neighbor === end) {
        const path = [];
        let cur = end;
        while (cur !== null) {
          path.push(cur);
          cur = parent.get(cur);
        }
        return path.reverse();
      }
    }
  }

  return null;
}
`,
  cases: [
    {
      name: 'путь через граф',
      args: [{ a: ['b', 'c'], b: ['a', 'd'], c: ['a', 'd'], d: ['b', 'c', 'e'], e: ['d'] }, 'a', 'e'],
      expected: ['a', 'b', 'd', 'e'],
    },
    {
      name: 'старт равен цели',
      args: [{ a: ['b'], b: ['a'] }, 'a', 'a'],
      expected: ['a'],
    },
    {
      name: 'пути нет',
      args: [{ a: ['b'], b: ['a'], c: ['d'], d: ['c'] }, 'a', 'c'],
      expected: null,
    },
    {
      name: 'соседняя вершина',
      args: [{ a: ['b'], b: ['a'] }, 'a', 'b'],
      expected: ['a', 'b'],
    },
    {
      name: 'кратчайший путь длины 2',
      args: [{ a: ['b', 'c'], b: ['a', 'd'], c: ['a', 'd'], d: ['b', 'c'] }, 'a', 'd'],
      expected: ['a', 'b', 'd'],
    },
    {
      name: 'не мутирует граф',
      args: [{ a: ['b'], b: ['a'] }, 'a', 'b'],
      expected: ['a', 'b'],
      noMutation: true,
    },
  ],
  hints: [
    'visited отмечай ПРИ ДОБАВЛЕНИИ в очередь, не при обработке.',
    'parent.set(neighbor, node) — потом восстановишь путь от конца к началу.',
    'Цикл while (head < queue.length), dequeue = queue[head++]. Никакого shift.',
  ],
});
