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
 * Две детали, без которых BFS ломается:
 *   1. очередь без shift() — иначе O(n²) из-за dequeue;
 *   2. parent-карта для восстановления пути — без неё узнаем расстояние,
 *      но не сам маршрут.
 */
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

  const visited = new Set<string>([start]);
  const parent = new Map<string, string | null>([[start, null]]);
  const queueItems: string[] = [start];
  let head = 0;

  const view = (note: string): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: 'граф',
        view: {
          kind: 'graph',
          nodes: Object.keys(graph).map((id) => ({ id, mark: visited.has(id) ? ('done' as const) : undefined })),
          edges: Object.entries(graph).flatMap(([from, tos]) =>
            tos.map((to) => ({ from, to, mark: parent.has(to) ? ('done' as const) : undefined })),
          ),
          directed: false,
        },
      },
      {
        title: 'очередь (head-указатель, без shift)',
        view: { kind: 'queue', items: queueItems, head },
      },
    ],
    caption: note,
  });

  while (head < queueItems.length) {
    const node = queueItems[head]; // @dequeue

    yield {
      state: view(`обрабатываем «${node}»`),
      at: 'dequeue',
      note: `Достаём «${node}» из головы очереди (head двигается, элементы не сдвигаются).`,
      metrics: { reads: 1 },
    };

    for (const neighbor of graph[node]) { // @neighbors
      if (visited.has(neighbor)) continue;

      visited.add(neighbor);
      parent.set(neighbor, node);
      queueItems.push(neighbor); // @enqueue

      yield {
        state: view(`нашли «${neighbor}», расстояние на 1 больше`),
        at: 'enqueue',
        note: `«${neighbor}» не посещён — добавляем в очередь, запоминаем предка «${node}».`,
        metrics: { writes: 1 },
        memoryPeak: queueItems.length - head,
      };

      if (neighbor === end) {
        // Восстанавливаем путь от конца к началу через parent-карту
        const path: string[] = [];
        let cur: string | null = end;
        while (cur !== null) {
          path.push(cur);
          cur = parent.get(cur) ?? null;
        }
        path.reverse();

        yield {
          state: view(`цель «${end}» достигнута за ${path.length - 1} шагов`),
          note: `Дошли до «${end}». Восстанавливаем путь по карте предков: ${path.join(' → ')}.`,
        };

        return path; // @found
      }
    }

    head += 1;
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
