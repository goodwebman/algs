import { defineTask } from '../types';

export default defineTask({
  slug: 'tree-traversals',
  title: 'Обход дерева in-order',
  topic: 'trees',
  prompt:
    'Дано бинарное дерево: { value, left?, right? }.\n' +
    'Верни массив значений в порядке in-order: левое поддерево → узел → правое.\n' +
    'На BST этот обход даёт отсортированную последовательность.',
  exportName: 'inorderTraversal',
  starter: `export function inorderTraversal(root) {
  // Порядок ровно такой: walk(left), взять узел, walk(right).
  // Базовый случай — пустой узел.
}
`,
  solution: `export function inorderTraversal(root) {
  const result = [];

  function walk(node) {
    if (!node) return;

    walk(node.left);
    result.push(node.value);
    walk(node.right);
  }

  walk(root);
  return result;
}
`,
  cases: [
    {
      name: 'BST даёт отсортированный порядок',
      args: [
        {
          value: 4,
          left: { value: 2, left: { value: 1 }, right: { value: 3 } },
          right: { value: 6, left: { value: 5 }, right: { value: 7 } },
        },
      ],
      expected: [1, 2, 3, 4, 5, 6, 7],
    },
    { name: 'один узел', args: [{ value: 42 }], expected: [42] },
    { name: 'пустое дерево', args: [null], expected: [] },
    {
      name: 'только левая ветвь',
      args: [{ value: 3, left: { value: 2, left: { value: 1 } } }],
      expected: [1, 2, 3],
    },
    {
      name: 'только правая ветвь',
      args: [{ value: 1, right: { value: 2, right: { value: 3 } } }],
      expected: [1, 2, 3],
    },
    {
      name: 'несбалансированное дерево',
      args: [{ value: 2, left: { value: 1 }, right: { value: 3, right: { value: 4 } } }],
      expected: [1, 2, 3, 4],
    },
  ],
  hints: [
    'Базовый случай: if (!node) return.',
    'Порядок строк критичен: walk(left) → push → walk(right).',
    'Аккумулятор result держи снаружи walk.',
  ],
});
