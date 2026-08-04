import type { TreeNodeView } from '../types';

export interface PositionedNode {
  id: string;
  label: string;
  mark: TreeNodeView['mark'];
  x: number;
  y: number;
}

export interface TreeLayout {
  nodes: PositionedNode[];
  edges: { from: string; to: string; x1: number; y1: number; x2: number; y2: number }[];
  width: number;
  height: number;
}

export const NODE_RADIUS = 18;
const LEVEL_HEIGHT = 68;
const LEAF_GAP = 52;
const PADDING = 28;

/**
 * Компактная раскладка дерева (упрощённый Reingold–Tilford).
 *
 * Листья расставляются слева направо с фиксированным шагом, внутренний узел
 * встаёт по середине между крайними детьми. Для учебных деревьев (десятки
 * узлов) этого достаточно и, в отличие от force-directed, картинка
 * детерминирована: один и тот же вход всегда даёт один и тот же рисунок,
 * поэтому при шаге плеера узлы не разбегаются.
 */
export const layoutTree = (root: TreeNodeView | null): TreeLayout => {
  if (!root) return { nodes: [], edges: [], width: 0, height: 0 };

  const nodes: PositionedNode[] = [];
  const edges: TreeLayout['edges'] = [];
  const positions = new Map<string, { x: number; y: number }>();
  let nextLeafX = 0;

  const place = (node: TreeNodeView, depth: number): number => {
    const children = node.children ?? [];
    const y = PADDING + depth * LEVEL_HEIGHT;

    let x: number;
    if (children.length === 0) {
      x = PADDING + nextLeafX * LEAF_GAP;
      nextLeafX += 1;
    } else {
      const childXs = children.map((child) => place(child, depth + 1));
      x = (childXs[0] + childXs[childXs.length - 1]) / 2;
    }

    positions.set(node.id, { x, y });
    nodes.push({ id: node.id, label: node.label, mark: node.mark, x, y });

    for (const child of children) {
      const childPos = positions.get(child.id);
      if (childPos) edges.push({ from: node.id, to: child.id, x1: x, y1: y, x2: childPos.x, y2: childPos.y });
    }

    return x;
  };

  place(root, 0);

  const width = Math.max(...nodes.map((n) => n.x)) + PADDING;
  const height = Math.max(...nodes.map((n) => n.y)) + PADDING;
  return { nodes, edges, width, height };
};
