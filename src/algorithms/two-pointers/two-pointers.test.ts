import { describe, expect, it } from 'vitest';

import { sortedSquares } from './sorted-squares.algo';
import { threeSum } from './three-sum.algo';
import { twoSumSorted } from './two-sum-sorted.algo';
import { isPalindrome } from './valid-palindrome.algo';

describe('twoSumSorted', () => {
  it('находит пару', () => {
    expect(twoSumSorted([2, 7, 11, 15], 9)).toEqual([0, 1]);
    expect(twoSumSorted([1, 3, 4, 5, 7, 11], 9)).toEqual([2, 3]);
  });

  it('возвращает null, когда пары нет', () => {
    expect(twoSumSorted([1, 2, 3], 100)).toBeNull();
    expect(twoSumSorted([], 5)).toBeNull();
    expect(twoSumSorted([5], 10)).toBeNull();
  });

  // Регрессия: в старой версии условие было `left <= right`, и элемент
  // складывался сам с собой — [4] с target 8 давал ложное [0, 0].
  it('не использует один элемент дважды', () => {
    expect(twoSumSorted([4], 8)).toBeNull();
    expect(twoSumSorted([1, 2, 4], 8)).toBeNull();
  });

  it('не мутирует вход', () => {
    const input = [1, 2, 3, 4];
    twoSumSorted(input, 7);
    expect(input).toEqual([1, 2, 3, 4]);
  });
});

describe('sortedSquares', () => {
  it('сохраняет сортировку', () => {
    expect(sortedSquares([-4, -1, 0, 3, 10])).toEqual([0, 1, 9, 16, 100]);
    expect(sortedSquares([-7, -3, 2, 3, 11])).toEqual([4, 9, 9, 49, 121]);
  });

  it('работает на краевых входах', () => {
    expect(sortedSquares([])).toEqual([]);
    expect(sortedSquares([5])).toEqual([25]);
    expect(sortedSquares([-5, -4, -3])).toEqual([9, 16, 25]);
  });

  it('результат всегда неубывающий', () => {
    const result = sortedSquares([-9, -5, -2, 0, 1, 6, 8]);
    expect(result.every((value, i) => i === 0 || result[i - 1] <= value)).toBe(true);
  });
});

describe('threeSum', () => {
  // Регрессия: старая версия не пропускала дубликаты и возвращала
  // [-1,0,1] дважды на этом самом входе.
  it('не возвращает дубликаты троек', () => {
    const result = threeSum([-1, 0, 1, 2, -1, -4]);
    expect(result).toHaveLength(2);
    expect(result).toContainEqual([-1, -1, 2]);
    expect(result).toContainEqual([-1, 0, 1]);
  });

  it('все нули дают ровно одну тройку', () => {
    expect(threeSum([0, 0, 0, 0])).toEqual([[0, 0, 0]]);
  });

  it('возвращает пустой массив, когда троек нет', () => {
    expect(threeSum([1, 2, 3])).toEqual([]);
    expect(threeSum([])).toEqual([]);
  });

  it('каждая тройка действительно даёт ноль', () => {
    for (const triplet of threeSum([-4, -2, -2, 0, 1, 2, 2, 3, 4])) {
      expect(triplet[0] + triplet[1] + triplet[2]).toBe(0);
    }
  });

  it('не мутирует вход', () => {
    const input = [-1, 0, 1, 2, -1, -4];
    threeSum(input);
    expect(input).toEqual([-1, 0, 1, 2, -1, -4]);
  });
});

describe('isPalindrome', () => {
  it('игнорирует регистр и пунктуацию', () => {
    expect(isPalindrome('A man, a plan, a canal: Panama')).toBe(true);
    expect(isPalindrome('race a car')).toBe(false);
  });

  // Регрессия: старая регулярка [^a-z0-9а-я] вырезала «ё» вместе с мусором.
  it('работает с кириллицей, включая ё', () => {
    expect(isPalindrome('А роза упала на лапу Азора')).toBe(true);
    expect(isPalindrome('ёжё')).toBe(true);
    expect(isPalindrome('ёжик')).toBe(false);
  });

  it('пустая строка и строка из знаков — палиндромы', () => {
    expect(isPalindrome('')).toBe(true);
    expect(isPalindrome('.,!')).toBe(true);
  });
});
