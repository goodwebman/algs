import raw from './topological-sort.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Топологическая сортировка (алгоритм Кана).
 *
 * Задача: расставить вершины ориентированного графа так, чтобы каждое ребро
 * шло слева направо. Это «порядок выполнения с учётом зависимостей»: сборка
 * модулей, порядок миграций, план курсов с пререквизитами, вычисление
 * формул в таблице.
 *
 * Алгоритм Кана: считаем входящие степени. Вершина с нулевой степенью не
 * зависит ни от чего — её можно брать. Взяли — удалили её рёбра, у кого-то
 * степень упала до нуля, повторяем.
 *
 * Если в какой-то момент вершин с нулевой степенью нет, а необработанные
 * остались — в графе ЦИКЛ, и порядок невозможен. Это одновременно и способ
 * обнаружить цикл.
 */
type DiGraph = Readonly<Record<string, readonly string[]>>;

export function* traceTopologicalSort(graph: DiGraph): AlgoTrace<VizState, string[] | null> {
  const nodes = Object.keys(graph);
  const indegree = new Map<string, number>(nodes.map((id) => [id, 0]));

  for (const from of nodes) {
    for (const to of graph[from]) {
      indegree.set(to, (indegree.get(to) ?? 0) + 1); // @count
    }
  }

  const order: string[] = [];
  const queue = nodes.filter((id) => indegree.get(id) === 0);
  let head = 0;

  const view = (note: string, activeId?: string): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: 'граф зависимостей',
        view: {
          kind: 'graph',
          directed: true,
          nodes: nodes.map((id) => ({
            id,
            mark: (id === activeId
              ? 'active'
              : order.includes(id)
                ? 'done'
                : undefined) as MarkKind | undefined,
          })),
          edges: nodes.flatMap((from) => graph[from].map((to) => ({ from, to }))),
        },
      },
      {
        title: 'входящие степени',
        view: {
          kind: 'hashmap',
          entries: nodes.map((id) => ({
            key: id,
            value: indegree.get(id) ?? 0,
            mark: (indegree.get(id) === 0 && !order.includes(id) ? 'target' : undefined) as MarkKind | undefined,
          })),
        },
      },
    ],
    caption: `${note} · порядок: [${order.join(', ')}]`,
  });

  yield {
    state: view('посчитали входящие степени'),
    at: 'count',
    note: `Вершины с нулевой степенью ни от кого не зависят: ${queue.join(', ') || 'таких нет'}.`,
    metrics: { reads: nodes.length },
  };

  while (head < queue.length) {
    const node = queue[head++]; // @take
    order.push(node);

    yield {
      state: view(`берём «${node}» — зависимостей не осталось`, node),
      at: 'take',
      note: `«${node}» готов к обработке: все его зависимости уже в порядке.`,
      metrics: { writes: 1 },
    };

    for (const next of graph[node]) { // @relax
      const left = (indegree.get(next) ?? 0) - 1;
      indegree.set(next, left);

      if (left === 0) {
        queue.push(next); // @unlock
        yield {
          state: view(`«${next}» освободился — зависимостей больше нет`),
          at: 'unlock',
          note: `Убрали ребро «${node}» → «${next}». Степень «${next}» упала до нуля — добавляем в очередь.`,
          metrics: { writes: 1 },
        };
      }
    }
  }

  // Обработали не всех — значит остался цикл.
  if (order.length !== nodes.length) { // @cycle
    yield {
      state: view('обработаны не все вершины — в графе цикл'),
      at: 'cycle',
      note: `Порядок содержит ${order.length} из ${nodes.length} вершин. Оставшиеся образуют цикл — топологический порядок невозможен.`,
    };
    return null;
  }

  yield {
    state: view('порядок построен'),
    note: `Все вершины упорядочены: ${order.join(' → ')}.`,
  };

  return order;
}
// #endregion

export const topologicalSort = (graph: DiGraph): string[] | null => runTrace(traceTopologicalSort(graph));

const BUILD: DiGraph = {
  config: ['types'],
  types: ['utils', 'api'],
  utils: ['ui'],
  api: ['ui'],
  ui: ['app'],
  app: [],
};

const CYCLIC: DiGraph = {
  a: ['b'],
  b: ['c'],
  c: ['a'],
};

export default defineAlgo({
  meta: {
    slug: 'topological-sort',
    title: 'Топологическая сортировка',
    topic: 'graphs',
    summary: 'Порядок выполнения с учётом зависимостей — и обнаружение цикла заодно.',
    complexity: { time: 'O(V + E)', space: 'O(V)', growth: 'O(n)' },
    difficulty: 'medium',
    leetcode: { id: 207, title: 'course-schedule' },
    tags: ['графы', 'топологическая сортировка', 'алгоритм Кана', 'циклы'],
  },
  raw,
  presets: [
    { label: 'сборка модулей', args: [BUILD] as const, hint: 'Реальный сценарий: порядок сборки пакетов по зависимостям.' },
    { label: 'циклический граф', args: [CYCLIC] as const, hint: 'a → b → c → a. Порядок невозможен — алгоритм это обнаруживает.' },
    { label: 'без зависимостей', args: [{ x: [], y: [], z: [] }] as const, hint: 'Все свободны сразу — любой порядок годится.' },
  ],
  trace: traceTopologicalSort,
  formatResult: (order) => (order ? order.join(' → ') : 'цикл — порядок невозможен'),
});
