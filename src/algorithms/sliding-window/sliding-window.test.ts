import { describe, expect, it } from 'vitest';

import { longestKDistinct } from './longest-k-distinct.algo';
import { longestOnes } from './longest-ones.algo';
import { longestRepeatingReplacement } from './longest-repeating-replacement.algo';
import { maxSumFixed } from './max-sum-fixed.algo';
import { minSubArrayLen } from './min-subarray-len.algo';

describe('maxSumFixed', () => {
  it('находит максимальное окно', () => {
    expect(maxSumFixed([2, 1, 5, 1, 3, 2], 3)).toBe(9);
    expect(maxSumFixed([1, 2, 3, 4, 5], 2)).toBe(9);
  });

  it('работает с отрицательными числами', () => {
    expect(maxSumFixed([-1, -2, -3, -4], 2)).toBe(-3);
  });

  it('краевые k', () => {
    expect(maxSumFixed([5, 1, 1, 1], 4)).toBe(8);
    expect(maxSumFixed([1, 2], 5)).toBe(0);
    expect(maxSumFixed([1, 2], 0)).toBe(0);
  });
});

describe('minSubArrayLen', () => {
  it('находит кратчайший отрезок', () => {
    expect(minSubArrayLen(7, [2, 3, 1, 2, 4, 3])).toBe(2);
    expect(minSubArrayLen(4, [1, 4, 4])).toBe(1);
    expect(minSubArrayLen(15, [1, 2, 3, 4, 5])).toBe(5);
  });

  it('возвращает 0, когда суммы не хватает', () => {
    expect(minSubArrayLen(11, [1, 1, 1, 1, 1, 1, 1, 1])).toBe(0);
    expect(minSubArrayLen(1, [])).toBe(0);
  });
});

describe('longestOnes', () => {
  // Регрессия: в старой версии было right - left без +1,
  // и на этом входе возвращалось 5 вместо 6.
  it('учитывает оба конца окна', () => {
    expect(longestOnes([1, 1, 0, 1, 1, 1], 1)).toBe(6);
  });

  it('окно проезжает через блок нулей', () => {
    expect(longestOnes([1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2)).toBe(6);
  });

  it('краевые случаи', () => {
    expect(longestOnes([0, 0, 0], 0)).toBe(0);
    expect(longestOnes([1, 1, 1], 2)).toBe(3);
    expect(longestOnes([], 3)).toBe(0);
  });
});

describe('longestKDistinct', () => {
  it('ограничивает количество различных символов', () => {
    expect(longestKDistinct('eceba', 2)).toBe(3);
    expect(longestKDistinct('aa', 1)).toBe(2);
  });

  it('k = 0 даёт 0', () => {
    expect(longestKDistinct('abc', 0)).toBe(0);
  });

  it('k больше алфавита — вся строка', () => {
    expect(longestKDistinct('abc', 10)).toBe(3);
    expect(longestKDistinct('', 2)).toBe(0);
  });
});

describe('longestRepeatingReplacement', () => {
  // Регрессия: в старой версии счётчик уменьшался по индексу (counts.set(left, ...)),
  // а не по символу — окно не сжималось и ответ завышался.
  it('считает частоты по символу, а не по индексу', () => {
    expect(longestRepeatingReplacement('AABABBA', 1)).toBe(4);
    expect(longestRepeatingReplacement('ABCDE', 1)).toBe(2);
  });

  it('базовые случаи', () => {
    expect(longestRepeatingReplacement('ABAB', 2)).toBe(4);
    expect(longestRepeatingReplacement('AAAA', 0)).toBe(4);
    expect(longestRepeatingReplacement('', 2)).toBe(0);
  });
});
