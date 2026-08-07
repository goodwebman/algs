import raw from './flatten-tree.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace, type Step } from '@/core/trace';
import type { TreeNodeView, VizState } from '@/viz/types';

// #region show
/**
 * Уплощение дерева: рекурсия как «обработай детей, потом себя».
 *
 * Дерево — рекурсивная структура по определению: узел содержит детей, каждый
 * из которых сам узел. Поэтому обход дерева — это самый естественный случай
 * для рекурсии: что называют, то и обрабатываем.
 *
 * Здесь — собрать все значения узлов в плоский массив (pre-order: узел,
 * затем дети слева направо).
 *
 * Аккумулятор передаётся вторым аргументом со значением по умолчанию:
 * рекурсия дописывает в один и тот же массив, а не склеивает промежуточные.
 */
interface TreeNode {
  id: string;
  value: number;
  children?: TreeNode[];
}

export function* traceFlattenTree(root: TreeNode): AlgoTrace<VizState, number[]> {
  // #hide
  const visited = new Set<string>();
  let result: number[] = [];

  const view = (note: string, activeId?: string): VizState => {
    const decorate = (node: TreeNode): TreeNodeView => {
      const isActive = node.id === activeId;
      const mark = isActive ? ('active' as const) : visited.has(node.id) ? ('done' as const) : undefined;
      return {
        id: node.id,
        label: String(node.value),
        mark,
        children: node.children?.map(decorate),
      };
    };
    return { kind: 'tree', root: decorate(root), caption: `${note} · собрано: [${result.join(', ')}]` };
  };
  // #endhide

  function* flatten(
    list: readonly TreeNode[],
    acc: number[] = [],
  ): Generator<Step<VizState>, number[], void> {
    // #hide
    result = acc;
    // #endhide

    for (const node of list) { // @loop
      yield { state: view(`посещаем узел ${node.value}`, node.id), note: `Заходим в узел ${node.value}.` };

      acc.push(node.value); // @emit

      // #hide
      visited.add(node.id);
      // #endhide

      yield { state: view(`добавили ${node.value}`), at: 'emit', note: `Добавляем ${node.value} в результат.`, metrics: { writes: 1 } };

      if (node.children?.length) { // @recurse
        yield* flatten(node.children, acc);
      }
    }

    return acc;
  }

  const flat = yield* flatten([root]);
  yield { state: view('обход завершён'), note: `Все узлы собраны: [${flat.join(', ')}]` };

  return flat;
}
// #endregion

export const flattenTree = (root: TreeNode): number[] => runTrace(traceFlattenTree(root));

const SAMPLE: TreeNode = {
  id: 'a',
  value: 1,
  children: [
    { id: 'b', value: 2, children: [{ id: 'd', value: 4 }, { id: 'e', value: 5 }] },
    { id: 'c', value: 3, children: [{ id: 'f', value: 6 }] },
  ],
};

export default defineAlgo({
  meta: {
    slug: 'flatten-tree',
    title: 'Уплощение дерева (рекурсивный обход)',
    topic: 'recursion',
    summary: 'Обход n-арного дерева рекурсией: обработать детей, потом себя.',
    complexity: { time: 'O(n)', space: 'O(h)', growth: 'O(n)' },
    difficulty: 'easy',
    tags: ['рекурсия', 'деревья', 'обход', 'pre-order'],
  },
  raw,
  presets: [
    { label: 'дерево 6 узлов', args: [SAMPLE] as const, hint: 'Pre-order: корень, затем поддеревья слева направо.' },
  ],
  trace: traceFlattenTree,
  formatResult: (result) => `[${result.join(', ')}]`,
});
