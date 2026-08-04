import raw from './tree-traversals.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace, type Step } from '@/core/trace';
import type { TreeNodeView, VizState } from '@/viz/types';

// #region show
/**
 * Три обхода бинарного дерева в глубину: pre-order, in-order, post-order.
 *
 * Отличие ровно одно — КОГДА обрабатывается сам узел относительно детей:
 *   pre-order:  узел → левое → правое   (копирование дерева, сериализация)
 *   in-order:   левое → узел → правое   (для BST даёт отсортированный порядок)
 *   post-order: левое → правое → узел   (удаление дерева, вычисление размеров)
 *
 * Порядок посещения детей одинаков всегда. Меняется только позиция строки
 * «обработать узел» — три строки в разном порядке, три разных алгоритма.
 */
interface BinaryNode {
  id: string;
  value: number;
  left?: BinaryNode;
  right?: BinaryNode;
}

type Order = 'pre' | 'in' | 'post';

const ORDER_LABEL: Record<Order, string> = {
  pre: 'pre-order (узел → левое → правое)',
  in: 'in-order (левое → узел → правое)',
  post: 'post-order (левое → правое → узел)',
};

export function* traceTraversal(root: BinaryNode, order: Order): AlgoTrace<VizState, number[]> {
  const result: number[] = [];
  const visited = new Set<string>();

  const decorate = (node: BinaryNode | undefined, activeId?: string): TreeNodeView | null => {
    if (!node) return null;
    const children = [decorate(node.left, activeId), decorate(node.right, activeId)].filter(
      (child): child is TreeNodeView => child !== null,
    );
    return {
      id: node.id,
      label: String(node.value),
      mark: node.id === activeId ? 'active' : visited.has(node.id) ? 'done' : undefined,
      children,
    };
  };

  const view = (activeId?: string): VizState => ({
    kind: 'tree',
    root: decorate(root, activeId),
    caption: `${ORDER_LABEL[order]} · собрано: [${result.join(', ')}]`,
  });

  function* emit(node: BinaryNode): Generator<Step<VizState>, void, void> {
    result.push(node.value);
    visited.add(node.id); // @emit

    yield {
      state: view(node.id),
      at: 'emit',
      note: `Обрабатываем узел ${node.value} — добавляем в результат.`,
      metrics: { writes: 1 },
    };
  }

  function* walk(node: BinaryNode | undefined): Generator<Step<VizState>, void, void> {
    if (!node) return; // @base

    if (order === 'pre') yield* emit(node); // @pre
    yield* walk(node.left); // @left
    if (order === 'in') yield* emit(node); // @in
    yield* walk(node.right); // @right
    if (order === 'post') yield* emit(node); // @post
  }

  yield* walk(root);

  yield {
    state: view(),
    note: `Готово: [${result.join(', ')}]`,
  };

  return result;
}
// #endregion

export const traverse = (root: BinaryNode, order: Order): number[] =>
  runTrace(traceTraversal(root, order));

/**
 * Дерево-BST: in-order обязан вернуть отсортированную последовательность.
 *
 *        4
 *      /   \
 *     2     6
 *    / \   / \
 *   1   3 5   7
 */
const BST: BinaryNode = {
  id: 'n4',
  value: 4,
  left: {
    id: 'n2',
    value: 2,
    left: { id: 'n1', value: 1 },
    right: { id: 'n3', value: 3 },
  },
  right: {
    id: 'n6',
    value: 6,
    left: { id: 'n5', value: 5 },
    right: { id: 'n7', value: 7 },
  },
};

export default defineAlgo({
  meta: {
    slug: 'tree-traversals',
    title: 'Три обхода дерева в глубину',
    topic: 'trees',
    summary: 'Pre-, in- и post-order отличаются одной строкой — позицией обработки узла.',
    complexity: { time: 'O(n)', space: 'O(h)', growth: 'O(n)' },
    difficulty: 'easy',
    tags: ['деревья', 'DFS', 'обход', 'BST'],
  },
  raw,
  presets: [
    { label: 'pre-order', args: [BST, 'pre'] as const, hint: 'Корень первым: 4, 2, 1, 3, 6, 5, 7.' },
    { label: 'in-order', args: [BST, 'in'] as const, hint: 'На BST даёт отсортированный порядок: 1…7.' },
    { label: 'post-order', args: [BST, 'post'] as const, hint: 'Корень последним: сначала все потомки.' },
  ],
  trace: traceTraversal,
  formatResult: (result) => `[${result.join(', ')}]`,
});
