import { defineTask } from '../types';

export default defineTask({
  slug: 'flatten-tree',
  title: 'Уплощение дерева',
  topic: 'recursion',
  prompt:
    'Дано n-арное дерево: { value, children?: [] }.\n' +
    'Верни массив значений всех узлов в порядке pre-order: узел, затем поддеревья слева направо.',
  exportName: 'flattenTree',
  starter: `export function flattenTree(root) {
  // Рекурсия: добавить своё значение, потом обойти детей.
  // Аккумулятор можно держать снаружи или собирать через возврат.
}
`,
  solution: `export function flattenTree(root) {
  const result = [];

  function walk(node) {
    if (!node) return;
    result.push(node.value);
    for (const child of node.children ?? []) walk(child);
  }

  walk(root);
  return result;
}
`,
  cases: [
    {
      name: 'дерево 6 узлов',
      args: [
        {
          value: 1,
          children: [
            { value: 2, children: [{ value: 4 }, { value: 5 }] },
            { value: 3, children: [{ value: 6 }] },
          ],
        },
      ],
      expected: [1, 2, 4, 5, 3, 6],
    },
    { name: 'один узел', args: [{ value: 42 }], expected: [42] },
    {
      name: 'корень с двумя детьми',
      args: [{ value: 1, children: [{ value: 2 }, { value: 3 }] }],
      expected: [1, 2, 3],
    },
    {
      name: 'глубокая левая ветвь',
      args: [{ value: 1, children: [{ value: 2, children: [{ value: 3, children: [{ value: 4 }] }] }] }],
      expected: [1, 2, 3, 4],
    },
    { name: 'пустое дерево (null)', args: [null], expected: [] },
    { name: 'лист без поля children', args: [{ value: 7 }], expected: [7] },
  ],
  hints: [
    'Базовый случай: !node → return. Лист обрабатывается сам собой (нет детей → цикл не выполняется).',
    'Аккумулятор result снаружи walk — проще, чем собирать через возврат.',
    'Обходи children в прямом порядке, чтобы сохранить left-to-right.',
  ],
});
