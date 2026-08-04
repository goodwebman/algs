import { describe, expect, it } from 'vitest';

import { heapSort } from './heap-operations.algo';

describe('куча (heapSort через извлечение минимумов)', () => {
  it('извлечение минимумов даёт отсортированный порядок', () => {
    expect(heapSort([5, 3, 8, 1, 9, 2])).toEqual([1, 2, 3, 5, 8, 9]);
  });

  it('уже отсортированный вход', () => {
    expect(heapSort([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
  });

  it('обратный порядок', () => {
    expect(heapSort([4, 3, 2, 1])).toEqual([1, 2, 3, 4]);
  });

  it('дубликаты', () => {
    expect(heapSort([3, 1, 3, 1])).toEqual([1, 1, 3, 3]);
  });

  it('краевые входы', () => {
    expect(heapSort([])).toEqual([]);
    expect(heapSort([42])).toEqual([42]);
  });

  it('отрицательные числа', () => {
    expect(heapSort([0, -5, 3, -5])).toEqual([-5, -5, 0, 3]);
  });

  it('совпадает со встроенной сортировкой на случайных данных', () => {
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const size = Math.floor(Math.random() * 30);
      const input = Array.from({ length: size }, () => Math.floor(Math.random() * 50) - 25);
      expect(heapSort(input)).toEqual([...input].sort((a, b) => a - b));
    }
  });
});
