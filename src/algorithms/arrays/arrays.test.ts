import { describe, expect, it } from 'vitest';

import { moveZeroes } from './move-zeroes.algo';
import { removeDuplicates } from './remove-duplicates.algo';

describe('removeDuplicates', () => {
  it('считает уникальные значения', () => {
    expect(removeDuplicates([1, 1, 2])).toBe(2);
    expect(removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4])).toBe(5);
    expect(removeDuplicates([1, 2, 3])).toBe(3);
  });

  // Регрессия: без раннего выхода slow = 0 давал бы длину 1 на пустом входе
  it('пустой массив даёт 0', () => {
    expect(removeDuplicates([])).toBe(0);
  });

  it('все одинаковые схлопываются в один', () => {
    expect(removeDuplicates([7, 7, 7, 7])).toBe(1);
  });

  it('один элемент', () => {
    expect(removeDuplicates([5])).toBe(1);
  });
});

describe('moveZeroes', () => {
  it('сдвигает нули в конец, сохраняя порядок', () => {
    expect(moveZeroes([0, 1, 0, 3, 12])).toEqual([1, 3, 12, 0, 0]);
    expect(moveZeroes([0, 5, 0, 3, 0, 1])).toEqual([5, 3, 1, 0, 0, 0]);
  });

  it('массив без нулей не меняется', () => {
    expect(moveZeroes([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('краевые входы', () => {
    expect(moveZeroes([])).toEqual([]);
    expect(moveZeroes([0, 0, 0])).toEqual([0, 0, 0]);
    expect(moveZeroes([0, 0, 1])).toEqual([1, 0, 0]);
  });

  it('не мутирует исходный массив вызывающего', () => {
    const input = [0, 1, 0, 3];
    moveZeroes(input);
    expect(input).toEqual([0, 1, 0, 3]);
  });
});
