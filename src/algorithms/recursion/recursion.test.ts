import { describe, expect, it } from 'vitest';

import { fibonacci } from './fibonacci.algo';
import { flattenTree } from './flatten-tree.algo';

describe('fibonacci (наивная рекурсия)', () => {
  it('считает классические значения', () => {
    expect(fibonacci(0)).toBe(0);
    expect(fibonacci(1)).toBe(1);
    expect(fibonacci(2)).toBe(1);
    expect(fibonacci(6)).toBe(8);
    expect(fibonacci(10)).toBe(55);
  });

  it('отрицательное n даёт 0', () => {
    expect(fibonacci(-5)).toBe(0);
  });

  // Только до 15: без мемоизации число вызовов растёт экспоненциально,
  // и на n ≈ 20 трассировка упирается в лимит шагов. Это не баг теста,
  // а ровно тот факт, ради которого задача и стоит в теме рекурсии.
  it('совпадает с итеративной формулой', () => {
    const iter = (n: number) => {
      if (n <= 1) return n;
      let a = 0;
      let b = 1;
      for (let i = 2; i <= n; i += 1) [a, b] = [b, a + b];
      return b;
    };
    for (let n = 0; n <= 15; n += 1) {
      expect(fibonacci(n)).toBe(iter(n));
    }
  });
});

describe('flattenTree', () => {
  it('собирает значения pre-order', () => {
    const tree = {
      id: 'a',
      value: 1,
      children: [
        { id: 'b', value: 2, children: [{ id: 'd', value: 4 }, { id: 'e', value: 5 }] },
        { id: 'c', value: 3 },
      ],
    };
    expect(flattenTree(tree)).toEqual([1, 2, 4, 5, 3]);
  });

  it('один узел', () => {
    expect(flattenTree({ id: 'x', value: 42 })).toEqual([42]);
  });

  it('лист с детьми без внуков', () => {
    expect(flattenTree({ id: 'r', value: 1, children: [{ id: 'a', value: 2 }, { id: 'b', value: 3 }] })).toEqual([
      1,
      2,
      3,
    ]);
  });
});
