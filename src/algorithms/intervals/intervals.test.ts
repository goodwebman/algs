import { describe, expect, it } from 'vitest';

import { mergeIntervals } from './merge-intervals.algo';

describe('mergeIntervals', () => {
  it('сливает пересекающиеся', () => {
    expect(mergeIntervals([[1, 3], [2, 6], [8, 10], [15, 18]])).toEqual([
      [1, 6],
      [8, 10],
      [15, 18],
    ]);
  });

  // Касание считается пересечением
  it('касание сливается', () => {
    expect(mergeIntervals([[1, 4], [4, 5]])).toEqual([[1, 5]]);
  });

  // Вложенный интервал не должен «укоротить» внешний
  it('вложенный интервал не двигает конец назад', () => {
    expect(mergeIntervals([[1, 10], [2, 3]])).toEqual([[1, 10]]);
  });

  it('сортирует вход перед слиянием', () => {
    expect(mergeIntervals([[5, 6], [1, 2]])).toEqual([
      [1, 2],
      [5, 6],
    ]);
  });

  it('краевые входы', () => {
    expect(mergeIntervals([])).toEqual([]);
    expect(mergeIntervals([[1, 5]])).toEqual([[1, 5]]);
  });

  it('ничего не пересекается', () => {
    expect(mergeIntervals([[1, 2], [3, 4], [5, 6]])).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it('всё сливается в один', () => {
    expect(mergeIntervals([[1, 4], [2, 5], [3, 6]])).toEqual([[1, 6]]);
  });

  // Регрессия: старая версия писала в prevIntervals[1], мутируя вход
  it('не мутирует вход', () => {
    const input: [number, number][] = [[1, 3], [2, 6]];
    mergeIntervals(input);
    expect(input).toEqual([[1, 3], [2, 6]]);
  });
});
