import { describe, expect, it } from 'vitest';

import { insertionSort } from './insertion-sort.algo';
import { mergeSort } from './merge-sort.algo';
import { quickSort } from './quick-sort.algo';

const SORTS = { mergeSort, quickSort, insertionSort };

const CASES: { name: string; input: number[] }[] = [
  { name: 'обычный вход', input: [5, 2, 4, 6, 1, 3] },
  { name: 'уже отсортирован', input: [1, 2, 3, 4, 5] },
  { name: 'обратный порядок', input: [5, 4, 3, 2, 1] },
  { name: 'все элементы равны', input: [3, 3, 3, 3] },
  { name: 'пустой массив', input: [] },
  { name: 'один элемент', input: [42] },
  { name: 'два элемента', input: [2, 1] },
  { name: 'отрицательные и нули', input: [0, -5, 3, -5, 0, 7] },
  { name: 'дубликаты вперемешку', input: [3, 1, 3, 1, 2, 2] },
];

describe.each(Object.entries(SORTS))('%s', (_name, sort) => {
  it.each(CASES)('сортирует: $name', ({ input }) => {
    const expected = [...input].sort((a, b) => a - b);
    expect(sort(input)).toEqual(expected);
  });

  it('не мутирует вход', () => {
    const input = [3, 1, 2];
    sort(input);
    expect(input).toEqual([3, 1, 2]);
  });

  it('совпадает со встроенной сортировкой на случайных данных', () => {
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const size = Math.floor(Math.random() * 40);
      const input = Array.from({ length: size }, () => Math.floor(Math.random() * 50) - 25);
      expect(sort(input)).toEqual([...input].sort((a, b) => a - b));
    }
  });
});

// Стабильность на массиве чисел проверить нельзя: два одинаковых числа
// неразличимы. Она проявляется только на объектах с ключом сортировки,
// а здесь сортировки принимают number[] — поэтому свойство описано в
// разборе, а тестом покрыт результат сортировки как таковой.
