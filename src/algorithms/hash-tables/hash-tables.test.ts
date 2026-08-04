import { describe, expect, it } from 'vitest';

import { firstUniqueChar } from './first-unique.algo';
import { groupAnagrams } from './group-anagrams.algo';
import { twoSum } from './two-sum.algo';

describe('twoSum', () => {
  it('находит пару в неотсортированном массиве', () => {
    expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
    expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
  });

  it('работает с одинаковыми числами', () => {
    expect(twoSum([3, 3], 6)).toEqual([0, 1]);
  });

  // Регрессия: запись в Map ДО проверки заставила бы элемент найти сам себя
  it('не использует один элемент дважды', () => {
    expect(twoSum([3], 6)).toBeNull();
    expect(twoSum([1, 5, 9], 2)).toBeNull();
  });

  it('возвращает null, когда пары нет', () => {
    expect(twoSum([], 5)).toBeNull();
    expect(twoSum([1, 5, 9], 100)).toBeNull();
  });

  it('работает с отрицательными числами', () => {
    expect(twoSum([-3, 4, 3, 90], 0)).toEqual([0, 2]);
  });
});

describe('groupAnagrams', () => {
  it('группирует перестановки', () => {
    const groups = groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);
    expect(groups).toHaveLength(3);
    expect(groups).toContainEqual(['eat', 'tea', 'ate']);
    expect(groups).toContainEqual(['tan', 'nat']);
    expect(groups).toContainEqual(['bat']);
  });

  it('пустой вход даёт пустой результат', () => {
    expect(groupAnagrams([])).toEqual([]);
  });

  it('слова без анаграмм остаются по одному', () => {
    expect(groupAnagrams(['abc', 'xyz'])).toEqual([['abc'], ['xyz']]);
  });

  it('пустая строка — валидный ключ', () => {
    expect(groupAnagrams(['', ''])).toEqual([['', '']]);
  });
});

describe('firstUniqueChar', () => {
  it('находит первый уникальный символ', () => {
    expect(firstUniqueChar('leetcode')).toBe(0);
    expect(firstUniqueChar('loveleetcode')).toBe(2);
  });

  it('возвращает −1, когда уникальных нет', () => {
    expect(firstUniqueChar('aabb')).toBe(-1);
    expect(firstUniqueChar('')).toBe(-1);
  });

  it('работает с не-ASCII', () => {
    expect(firstUniqueChar('алгоритм')).toBe(0);
    expect(firstUniqueChar('аба')).toBe(1);
  });
});
