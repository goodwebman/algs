import { defineTask } from '../types';

export default defineTask({
  slug: 'validate-bst',
  title: 'Проверка дерева поиска',
  topic: 'trees',
  prompt:
    'Дано бинарное дерево: { value, left?, right? }.\n' +
    'Верни true, если это корректное BST: ВСЁ левое поддерево строго меньше узла,\n' +
    'ВСЁ правое строго больше. Дубликаты не допускаются.',
  exportName: 'isValidBst',
  starter: `export function isValidBst(root) {
  // Локальная проверка "левый ребёнок меньше" НЕВЕРНА:
  // узел глубоко в правом поддереве тоже обязан быть больше корня.
  //
  // Передавай вниз диапазон допустимых значений.
}
`,
  solution: `export function isValidBst(root) {
  function check(node, min, max) {
    if (!node) return true;
    if (node.value <= min || node.value >= max) return false;

    // Влево: узел становится верхней границей.
    // Вправо: нижней.
    return check(node.left, min, node.value) && check(node.right, node.value, max);
  }

  return check(root, -Infinity, Infinity);
}
`,
  cases: [
    {
      name: 'корректный BST',
      args: [
        {
          value: 4,
          left: { value: 2, left: { value: 1 }, right: { value: 3 } },
          right: { value: 6, left: { value: 5 }, right: { value: 7 } },
        },
      ],
      expected: true,
    },
    // Ключевой кейс: локальная проверка его пропустит
    {
      name: 'нарушение через поддерево (3 справа от 5)',
      args: [{ value: 5, left: { value: 1 }, right: { value: 6, left: { value: 3 }, right: { value: 7 } } }],
      expected: false,
    },
    { name: 'нарушение у прямого ребёнка', args: [{ value: 2, left: { value: 3 } }], expected: false },
    { name: 'один узел', args: [{ value: 1 }], expected: true },
    { name: 'пустое дерево', args: [null], expected: true },
    { name: 'дубликаты не допускаются', args: [{ value: 2, left: { value: 2 } }], expected: false },
    {
      name: 'вырожденное дерево — всё ещё BST',
      args: [{ value: 1, right: { value: 2, right: { value: 3 } } }],
      expected: true,
    },
    {
      name: 'отрицательные значения',
      args: [{ value: 0, left: { value: -5 }, right: { value: 5 } }],
      expected: true,
    },
  ],
  hints: [
    'Вспомогательная функция check(node, min, max) с диапазоном.',
    'Стартовый вызов: check(root, -Infinity, Infinity).',
    'Влево передавай (min, node.value), вправо — (node.value, max).',
  ],
});
