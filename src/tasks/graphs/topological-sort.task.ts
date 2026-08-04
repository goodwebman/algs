import { defineTask } from '../types';

export default defineTask({
  slug: 'topological-sort',
  title: 'Топологическая сортировка',
  topic: 'graphs',
  prompt:
    'Дан ориентированный граф зависимостей: ребро A → B значит «A выполняется до B».\n' +
    'Верни массив вершин в корректном порядке.\n' +
    'Если в графе есть цикл — верни null.\n' +
    'Порядков может быть несколько: бери вершины в том порядке, в каком они освобождаются.',
  exportName: 'topologicalSort',
  starter: `export function topologicalSort(graph) {
  // Алгоритм Кана: посчитай входящие степени,
  // положи в очередь вершины со степенью 0,
  // бери по одной и уменьшай степени соседей.
  //
  // Если обработал не все вершины — значит цикл.
}
`,
  solution: `export function topologicalSort(graph) {
  const nodes = Object.keys(graph);
  const indegree = new Map(nodes.map((id) => [id, 0]));

  for (const from of nodes) {
    for (const to of graph[from]) {
      indegree.set(to, (indegree.get(to) ?? 0) + 1);
    }
  }

  const queue = nodes.filter((id) => indegree.get(id) === 0);
  const order = [];
  let head = 0;

  while (head < queue.length) {
    const node = queue[head++];
    order.push(node);

    for (const next of graph[node]) {
      const left = indegree.get(next) - 1;
      indegree.set(next, left);
      if (left === 0) queue.push(next);
    }
  }

  // Обработали не всех — оставшиеся образуют цикл.
  return order.length === nodes.length ? order : null;
}
`,
  cases: [
    {
      name: 'линейная цепочка',
      args: [{ config: ['types'], types: ['utils'], utils: ['app'], app: [] }],
      expected: ['config', 'types', 'utils', 'app'],
    },
    { name: 'цикл — null', args: [{ a: ['b'], b: ['c'], c: ['a'] }], expected: null },
    { name: 'самопетля — цикл', args: [{ a: ['a'] }], expected: null },
    { name: 'пустой граф', args: [{}], expected: [] },
    {
      name: 'граф без рёбер',
      args: [{ x: [], y: [], z: [] }],
      expected: ['x', 'y', 'z'],
    },
    {
      name: 'ромб зависимостей',
      args: [{ a: ['b', 'c'], b: ['d'], c: ['d'], d: [] }],
      expected: ['a', 'b', 'c', 'd'],
    },
    {
      name: 'цикл в части графа',
      args: [{ a: ['b'], b: [], x: ['y'], y: ['x'] }],
      expected: null,
    },
  ],
  hints: [
    'Входящая степень = сколько рёбер входит в вершину.',
    'Стартовая очередь — все вершины со степенью 0.',
    'После цикла сравни order.length с количеством вершин: меньше — значит был цикл.',
  ],
});
