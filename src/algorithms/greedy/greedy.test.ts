import { describe, expect, it } from 'vitest';

import { coinChangeGreedy } from './coin-change-greedy.algo';
import { coinChangeDp } from '../dp/coin-change-dp.algo';

describe('coinChangeGreedy', () => {
  it('на каноническом наборе даёт оптимум', () => {
    const taken = coinChangeGreedy([25, 10, 5, 1], 63);
    expect(taken.reduce((sum, coin) => sum + coin, 0)).toBe(63);
    expect(taken).toHaveLength(6); // 25+25+10+1+1+1
  });

  it('нулевая сумма — монет не нужно', () => {
    expect(coinChangeGreedy([1, 5, 10], 0)).toEqual([]);
  });

  it('возвращает пустой массив, если разменять не удалось', () => {
    expect(coinChangeGreedy([7, 5], 11)).toEqual([]);
  });

  // Главный урок темы: жадность НЕ оптимальна на неканоническом наборе.
  // Этот тест фиксирует именно провал — он не баг, а свойство алгоритма.
  it('на неканоническом наборе жадность хуже оптимума', () => {
    const greedy = coinChangeGreedy([25, 10, 1], 30);
    const optimal = coinChangeDp([25, 10, 1], 30);

    expect(greedy.reduce((sum, coin) => sum + coin, 0)).toBe(30);
    expect(greedy.length).toBe(6); // 25 + 1×5
    expect(optimal).toBe(3); // 10 + 10 + 10
    expect(greedy.length).toBeGreaterThan(optimal);
  });

  it('не мутирует список монет', () => {
    const coins = [1, 25, 10];
    coinChangeGreedy(coins, 30);
    expect(coins).toEqual([1, 25, 10]);
  });
});
