import { describe, expect, it } from 'vitest';

import { traverse } from './tree-traversals.algo';
import { isValidBst } from './validate-bst.algo';

const BST = {
  id: 'n4',
  value: 4,
  left: { id: 'n2', value: 2, left: { id: 'n1', value: 1 }, right: { id: 'n3', value: 3 } },
  right: { id: 'n6', value: 6, left: { id: 'n5', value: 5 }, right: { id: 'n7', value: 7 } },
};

describe('обходы дерева', () => {
  it('pre-order: корень первым', () => {
    expect(traverse(BST, 'pre')).toEqual([4, 2, 1, 3, 6, 5, 7]);
  });

  // Ключевое свойство: in-order на BST даёт отсортированную последовательность
  it('in-order на BST даёт отсортированный порядок', () => {
    expect(traverse(BST, 'in')).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('post-order: корень последним', () => {
    expect(traverse(BST, 'post')).toEqual([1, 3, 2, 5, 7, 6, 4]);
  });

  it('один узел — одинаково во всех обходах', () => {
    const single = { id: 'x', value: 42 };
    expect(traverse(single, 'pre')).toEqual([42]);
    expect(traverse(single, 'in')).toEqual([42]);
    expect(traverse(single, 'post')).toEqual([42]);
  });

  it('вырожденное дерево (только левые дети)', () => {
    const chain = { id: 'a', value: 3, left: { id: 'b', value: 2, left: { id: 'c', value: 1 } } };
    expect(traverse(chain, 'in')).toEqual([1, 2, 3]);
  });
});

describe('isValidBst', () => {
  it('принимает корректный BST', () => {
    expect(isValidBst(BST)).toBe(true);
  });

  // Регрессия на классическую ошибку: локальная проверка «левый < родителя»
  // пропустила бы это дерево — 3 меньше корня 5, но лежит в правом поддереве.
  it('ловит нарушение через поддерево, а не через прямого ребёнка', () => {
    const sneaky = {
      id: 'a',
      value: 5,
      left: { id: 'b', value: 1 },
      right: { id: 'c', value: 6, left: { id: 'd', value: 3 }, right: { id: 'e', value: 7 } },
    };
    expect(isValidBst(sneaky)).toBe(false);
  });

  it('ловит нарушение у прямого ребёнка', () => {
    expect(isValidBst({ id: 'a', value: 2, left: { id: 'b', value: 3 } })).toBe(false);
  });

  it('один узел и пустое дерево корректны', () => {
    expect(isValidBst({ id: 'x', value: 1 })).toBe(true);
    expect(isValidBst(undefined)).toBe(true);
  });

  // Строгие неравенства: дубликаты в классическом BST не допускаются
  it('дубликаты не допускаются', () => {
    expect(isValidBst({ id: 'a', value: 2, left: { id: 'b', value: 2 } })).toBe(false);
  });
});
