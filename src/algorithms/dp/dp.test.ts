import { describe, expect, it } from 'vitest';

import { coinChangeDp } from './coin-change-dp.algo';

describe('coinChangeDp', () => {
  it('находит оптимум там, где жадность врёт', () => {
    // Жадно было бы 25 + 1×5 = 6 монет
    expect(coinChangeDp([25, 10, 1], 30)).toBe(3);
    expect(coinChangeDp([1, 3, 4], 6)).toBe(2);
  });

  it('на каноническом наборе согласен с жадностью', () => {
    expect(coinChangeDp([1, 5, 10, 25], 63)).toBe(6);
  });

  it('нулевая сумма — ноль монет', () => {
    expect(coinChangeDp([1, 5], 0)).toBe(0);
  });

  it('возвращает −1, когда разменять невозможно', () => {
    expect(coinChangeDp([2], 3)).toBe(-1);
    expect(coinChangeDp([5, 7], 1)).toBe(-1);
  });

  it('монета равна сумме', () => {
    expect(coinChangeDp([1, 5, 10], 10)).toBe(1);
  });

  it('пустой набор монет', () => {
    expect(coinChangeDp([], 5)).toBe(-1);
    expect(coinChangeDp([], 0)).toBe(0);
  });
});
