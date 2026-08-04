import raw from './validate-bst.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace, type Step } from '@/core/trace';
import type { TreeNodeView, VizState } from '@/viz/types';

// #region show
/**
 * Проверка, является ли бинарное дерево деревом поиска (BST).
 *
 * Наивная проверка «левый ребёнок меньше, правый больше» НЕВЕРНА. Она
 * локальна, а свойство BST — глобальное: КАЖДЫЙ узел левого поддерева должен
 * быть меньше корня, а не только непосредственный ребёнок.
 *
 * Контрпример, который ломает наивную проверку:
 *
 *        5
 *      /   \
 *     1     6
 *          / \
 *         3   7      ← 3 меньше 5, но лежит в правом поддереве!
 *
 * Правильный подход: спускаясь вниз, передавать ДИАПАЗОН допустимых значений.
 * Уходя влево — сужаем сверху, вправо — снизу.
 */
interface BinaryNode {
  id: string;
  value: number;
  left?: BinaryNode;
  right?: BinaryNode;
}

export function* traceValidateBst(root: BinaryNode | undefined): AlgoTrace<VizState, boolean> {
  const checked = new Set<string>();
  let failedId: string | null = null;

  const decorate = (node: BinaryNode | undefined, activeId?: string): TreeNodeView | null => {
    if (!node) return null;
    const children = [decorate(node.left, activeId), decorate(node.right, activeId)].filter(
      (child): child is TreeNodeView => child !== null,
    );
    return {
      id: node.id,
      label: String(node.value),
      mark:
        node.id === failedId
          ? 'swap'
          : node.id === activeId
            ? 'active'
            : checked.has(node.id)
              ? 'done'
              : undefined,
      children,
    };
  };

  const view = (note: string, activeId?: string): VizState => ({
    kind: 'tree',
    root: decorate(root, activeId),
    caption: note,
  });

  const fmt = (bound: number) => (Number.isFinite(bound) ? String(bound) : bound > 0 ? '+∞' : '−∞');

  function* check(
    node: BinaryNode | undefined,
    min: number, // @range
    max: number,
  ): Generator<Step<VizState>, boolean, void> {
    if (!node) return true; // @base

    yield {
      state: view(`проверяем ${node.value}: допустимо (${fmt(min)}, ${fmt(max)})`, node.id),
      at: 'range',
      note: `Узел ${node.value} обязан лежать строго между ${fmt(min)} и ${fmt(max)}.`,
      metrics: { comparisons: 1 },
    };

    // Строгие неравенства: дубликаты в классическом BST не допускаются.
    if (node.value <= min || node.value >= max) { // @violation
      failedId = node.id;
      yield {
        state: view(`${node.value} вне диапазона (${fmt(min)}, ${fmt(max)}) — не BST`, node.id),
        at: 'violation',
        note: `${node.value} нарушает границы — дерево не является BST.`,
      };
      return false;
    }

    checked.add(node.id);

    // Влево: верхняя граница становится значением узла.
    if (!(yield* check(node.left, min, node.value))) return false; // @left
    // Вправо: нижняя граница становится значением узла.
    if (!(yield* check(node.right, node.value, max))) return false; // @right

    return true;
  }

  const ok = yield* check(root, -Infinity, Infinity);

  yield {
    state: view(ok ? 'все узлы в допустимых границах — это BST' : 'найдено нарушение'),
    note: ok ? 'Каждый узел уложился в свой диапазон — дерево поиска корректно.' : 'Дерево не является BST.',
  };

  return ok;
}
// #endregion

export const isValidBst = (root: BinaryNode | undefined): boolean => runTrace(traceValidateBst(root));

const VALID: BinaryNode = {
  id: 'a',
  value: 4,
  left: { id: 'b', value: 2, left: { id: 'd', value: 1 }, right: { id: 'e', value: 3 } },
  right: { id: 'c', value: 6, left: { id: 'f', value: 5 }, right: { id: 'g', value: 7 } },
};

// Классический контрпример: 3 меньше корня 5, но лежит справа.
const SNEAKY: BinaryNode = {
  id: 'a',
  value: 5,
  left: { id: 'b', value: 1 },
  right: { id: 'c', value: 6, left: { id: 'd', value: 3 }, right: { id: 'e', value: 7 } },
};

export default defineAlgo({
  meta: {
    slug: 'validate-bst',
    title: 'Проверка дерева поиска',
    topic: 'trees',
    summary: 'Почему локальная проверка «левый меньше» неверна и как передавать диапазон вниз.',
    complexity: { time: 'O(n)', space: 'O(h)', growth: 'O(n)' },
    difficulty: 'medium',
    leetcode: { id: 98, title: 'validate-binary-search-tree' },
    tags: ['деревья', 'BST', 'диапазон', 'рекурсия'],
  },
  raw,
  presets: [
    { label: 'корректный BST', args: [VALID] as const, hint: 'Каждый узел укладывается в свой диапазон.' },
    {
      label: 'ловушка: 3 справа от 5',
      args: [SNEAKY] as const,
      hint: 'Локальная проверка «левый < родителя» пропустила бы это дерево.',
    },
    { label: 'один узел', args: [{ id: 'x', value: 1 }] as const, hint: 'Тривиально корректен.' },
  ],
  trace: traceValidateBst,
  formatResult: (ok) => (ok ? 'это BST' : 'это не BST'),
});
