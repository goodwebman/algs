import type { GraphState } from '../types';

export interface GraphPoint {
  id: string;
  x: number;
  y: number;
}

const LEVEL_GAP = 110;
const NODE_GAP = 74;
const PADDING = 34;

/**
 * Раскладка графа по уровням BFS от первой вершины.
 *
 * Force-directed сознательно не берём: он даёт «пляшущий» граф, где узлы
 * переезжают между кадрами плеера, и следить за обходом невозможно.
 * Здесь позиция вершины зависит только от структуры графа — при любом шаге
 * трассировки картинка одна и та же, двигаются только цвета.
 */
export const layoutGraph = (
  nodes: GraphState['nodes'],
  edges: GraphState['edges'],
): { points: Map<string, GraphPoint>; width: number; height: number } => {
  const adjacency = new Map<string, string[]>();
  for (const node of nodes) adjacency.set(node.id, []);
  for (const edge of edges) {
    adjacency.get(edge.from)?.push(edge.to);
    // связность считаем по неориентированной версии, иначе часть вершин
    // «повиснет» и уедет в отдельную колонку без причины
    adjacency.get(edge.to)?.push(edge.from);
  }

  const level = new Map<string, number>();
  const order: string[] = [];

  for (const node of nodes) {
    if (level.has(node.id)) continue;
    level.set(node.id, 0);
    const queue = [node.id];
    for (let head = 0; head < queue.length; head += 1) {
      const current = queue[head];
      order.push(current);
      for (const neighbour of adjacency.get(current) ?? []) {
        if (level.has(neighbour)) continue;
        level.set(neighbour, (level.get(current) ?? 0) + 1);
        queue.push(neighbour);
      }
    }
  }

  const columns = new Map<number, string[]>();
  for (const id of order) {
    const depth = level.get(id) ?? 0;
    const column = columns.get(depth) ?? [];
    column.push(id);
    columns.set(depth, column);
  }

  const tallest = Math.max(...[...columns.values()].map((c) => c.length), 1);
  const points = new Map<string, GraphPoint>();

  for (const [depth, ids] of columns) {
    const offset = (tallest - ids.length) / 2;
    ids.forEach((id, i) => {
      points.set(id, {
        id,
        x: PADDING + depth * LEVEL_GAP,
        y: PADDING + (offset + i) * NODE_GAP,
      });
    });
  }

  return {
    points,
    width: PADDING * 2 + (columns.size - 1) * LEVEL_GAP,
    height: PADDING * 2 + (tallest - 1) * NODE_GAP,
  };
};
