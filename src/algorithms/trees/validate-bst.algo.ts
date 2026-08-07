import raw from './validate-bst.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
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
 * Приём: in-order обход (левое → узел → правое) выдаёт значения BST строго
 * по возрастанию. Значит достаточно идти обходом и сравнивать каждый узел
 * с ПРЕДЫДУЩИМ — первое же невозрастание означает, что это не BST.
 *
 * Обход итеративный, на явном стеке: рекурсия на вырожденном дереве
 * (список из миллиона узлов) переполнит стек вызовов.
 */
interface BinaryNode {
  id: string;
  value: number;
  left?: BinaryNode;
  right?: BinaryNode;
}

export function* traceValidateBst(root: BinaryNode | undefined): AlgoTrace<VizState, boolean> {
  // #hide
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
  // #endhide

  // #hide
  const view = (note: string, activeId?: string): VizState => ({
    kind: 'tree',
    root: decorate(root, activeId),
    caption: note,
  });
  // #endhide

  // #hide
  const fmt = (bound: number) => (Number.isFinite(bound) ? String(bound) : '−∞');
  // #endhide

  const stack: BinaryNode[] = [];
  let prev = -Infinity;
  let current = root;

  while (stack.length || current) {
    // Спускаемся влево до упора: самый левый узел — начало in-order обхода.
    while (current) { // @descend
      stack.push(current);

      yield {
        state: view(`уходим влево от ${current.value}`, current.id),
        at: 'descend',
        note: `Кладём ${current.value} на стек и идём в левого ребёнка — сначала обходится всё левое поддерево.`,
        metrics: { writes: 1 },
        memoryPeak: stack.length,
      };

      current = current.left;
    }

    current = stack.pop()!; // @pop

    // Строгое <=: дубликаты в классическом BST не допускаются.
    if (current.value <= prev) { // @violation
      // #hide
      failedId = current.id;
      // #endhide

      yield {
        state: view(`${current.value} ≤ ${fmt(prev)} — обход не возрастает`, current.id),
        at: 'violation',
        note: `In-order выдал ${current.value} после ${fmt(prev)} — последовательность не возрастает, это не BST.`,
        metrics: { comparisons: 1 },
      };
      return false;
    }

    // #hide
    checked.add(current.id);
    // #endhide

    yield {
      state: view(`${current.value} больше предыдущего — идём вправо`, current.id),
      at: 'prev',
      note: `${current.value} > ${fmt(prev)} — порядок не нарушен. Запоминаем значение как предыдущее и переходим в правое поддерево.`,
      metrics: { comparisons: 1 },
    };

    prev = current.value; // @prev
    current = current.right;
  }

  yield {
    state: view('обход дошёл до конца, значения строго возрастали'),
    note: 'In-order выдал строго возрастающую последовательность — дерево поиска корректно.',
  };

  return true;
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
    summary: 'Почему локальная проверка «левый меньше» неверна и как её заменяет in-order обход.',
    complexity: { time: 'O(n)', space: 'O(h)', growth: 'O(n)' },
    difficulty: 'medium',
    leetcode: { id: 98, title: 'validate-binary-search-tree' },
    tags: ['деревья', 'BST', 'in-order', 'явный стек'],
  },
  raw,
  presets: [
    { label: 'корректный BST', args: [VALID] as const, hint: 'In-order выдаёт 1, 2, 3, 4, 5, 6, 7 — строго по возрастанию.' },
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
