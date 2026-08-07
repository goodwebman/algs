import raw from './bfs-shortest-path.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { VizState } from '@/viz/types';

type Graph = Readonly<Record<string, readonly string[]>>;

// #region show
/**
 * Кратчайший путь в невзвешенном графе через BFS.
 *
 * BFS (обход в ширину) гарантированно находит кратчайший путь в графе БЕЗ
 * весов рёбер, потому что идёт «волнами»: сначала все вершины на расстоянии 1,
 * потом 2, и так далее. Как только дошли до цели — это расстояние минимально.
 *
 * Ключевая деталь — parent-карта: без неё мы узнаем расстояние, но не сам
 * маршрут. Путь восстанавливается с конца, от цели к старту.
 *
 * Очередь здесь на shift() — читается проще всего. Цена этого разобрана
 * отдельно в «Цене shift»: на больших графах нужен head-указатель.
 */
const buildPath = (parent: Record<string, string | null>, end: string): string[] => {
  const path: string[] = [];
  let cur: string | null = end;

  while (cur !== null) {
    path.push(cur);
    cur = parent[cur];
  }

  return path.reverse();
};

export function* traceBfsPath(graph: Graph, start: string, end: string): AlgoTrace<VizState, string[] | null> {
  if (start === end) {
    yield {
      state: {
        kind: 'graph',
        nodes: [{ id: start, mark: 'target' }],
        edges: [],
        caption: 'старт и цель совпадают',
      } satisfies VizState,
      note: `Старт и цель — одна вершина «${start}». Путь из одного элемента.`,
    };
    return [start];
  }

  const visited = new Set<string>();
  const queue: string[] = [start];
  const parent: Record<string, string | null> = {};

  visited.add(start);
  parent[start] = null;

  // #hide
  const view = (note: string): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: 'граф',
        view: {
          kind: 'graph',
          nodes: Object.keys(graph).map((id) => ({ id, mark: visited.has(id) ? ('done' as const) : undefined })),
          edges: Object.entries(graph).flatMap(([from, tos]) =>
            tos.map((to) => ({ from, to, mark: to in parent ? ('done' as const) : undefined })),
          ),
          directed: false,
        },
      },
      {
        title: 'очередь',
        view: { kind: 'queue', items: queue, head: 0 },
      },
    ],
    caption: note,
  });
  // #endhide

  while (queue.length) {
    const node = queue.shift()!; // @dequeue

    yield {
      state: view(`обрабатываем «${node}»`),
      at: 'dequeue',
      note: `Достаём «${node}» из головы очереди.`,
      metrics: { reads: 1 },
    };

    for (const neighbor of graph[node]) { // @neighbors
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        parent[neighbor] = node;
        queue.push(neighbor); // @enqueue

        yield {
          state: view(`нашли «${neighbor}», расстояние на 1 больше`),
          at: 'enqueue',
          note: `«${neighbor}» не посещён — добавляем в очередь, запоминаем предка «${node}».`,
          metrics: { writes: 1 },
          memoryPeak: queue.length,
        };

        if (neighbor === end) { // @found
          const path = buildPath(parent, end);

          yield {
            state: view(`цель «${end}» достигнута за ${path.length - 1} шагов`),
            note: `Дошли до «${end}». Восстанавливаем путь по карте предков: ${path.join(' → ')}.`,
          };

          return path;
        }
      }
    }
  }

  yield {
    state: view(`«${end}» недостижима из «${start}»`),
    note: 'Очередь опустела, а цели так и не достигли — пути нет.',
  };

  return null;
}
// #endregion

export const bfsShortestPath = (graph: Graph, start: string, end: string): string[] | null =>
  runTrace(traceBfsPath(graph, start, end));

const GRAPH: Graph = {
  a: ['b', 'c'],
  b: ['a', 'd'],
  c: ['a', 'd', 'e'],
  d: ['b', 'c', 'f'],
  e: ['c', 'f'],
  f: ['d', 'e', 'g'],
  g: ['f'],
};

export default defineAlgo({
  meta: {
    slug: 'bfs-shortest-path',
    title: 'Кратчайший путь через BFS',
    topic: 'queue',
    summary: 'Обход в ширину находит кратчайший путь в невзвешенном графе и восстанавливает маршрут.',
    complexity: { time: 'O(V + E)', space: 'O(V)', growth: 'O(n)' },
    difficulty: 'medium',
    tags: ['очередь', 'BFS', 'графы', 'кратчайший путь'],
  },
  raw,
  presets: [
    { label: 'a → g', args: [GRAPH, 'a', 'g'] as const, hint: 'Видна «волна»: BFS расширяется по уровням расстояния.' },
    { label: 'a → e', args: [GRAPH, 'a', 'e'] as const, hint: 'Кратчайший путь через c — BFS находит именно его.' },
    { label: 'a → a (та же вершина)', args: [GRAPH, 'a', 'a'] as const, hint: 'Старт равен цели — путь из одной вершины.' },
  ],
  trace: traceBfsPath,
  formatResult: (path) => (path ? path.join(' → ') : 'пути нет'),
});
