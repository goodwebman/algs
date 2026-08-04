import { describe, expect, it } from 'vitest';

import { dailyTemperatures } from './daily-temperatures.algo';
import { decodeString } from './decode-string.algo';
import { isValidParentheses } from './valid-parentheses.algo';

describe('isValidParentheses', () => {
  it('принимает правильные последовательности', () => {
    expect(isValidParentheses('([{}])')).toBe(true);
    expect(isValidParentheses('()[]{}')).toBe(true);
    expect(isValidParentheses('')).toBe(true);
  });

  // Именно этот кейс отличает стек от счётчика: количество скобок сходится,
  // а вложенность нарушена.
  it('ловит неправильную вложенность', () => {
    expect(isValidParentheses('([)]')).toBe(false);
  });

  it('ловит незакрытые скобки', () => {
    expect(isValidParentheses('(((')).toBe(false);
    expect(isValidParentheses('([')).toBe(false);
  });

  it('ловит лишние закрывающие', () => {
    expect(isValidParentheses(')(')).toBe(false);
    expect(isValidParentheses(')')).toBe(false);
  });
});

describe('dailyTemperatures', () => {
  it('находит ожидание до потепления', () => {
    expect(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])).toEqual([1, 1, 4, 2, 1, 1, 0, 0]);
  });

  it('возрастающий ряд — всегда следующий день', () => {
    expect(dailyTemperatures([30, 40, 50, 60])).toEqual([1, 1, 1, 0]);
  });

  it('убывающий ряд — тепла не будет', () => {
    expect(dailyTemperatures([60, 50, 40, 30])).toEqual([0, 0, 0, 0]);
  });

  // Строгое сравнение: равная температура не считается «теплее»
  it('равные температуры не закрывают друг друга', () => {
    expect(dailyTemperatures([50, 50, 50])).toEqual([0, 0, 0]);
  });

  it('краевые входы', () => {
    expect(dailyTemperatures([])).toEqual([]);
    expect(dailyTemperatures([42])).toEqual([0]);
  });
});

describe('decodeString', () => {
  it('разворачивает простые блоки', () => {
    expect(decodeString('3[a]2[bc]')).toBe('aaabcbc');
    expect(decodeString('2[abc]3[cd]ef')).toBe('abcabccdcdcdef');
  });

  it('поддерживает вложенность', () => {
    expect(decodeString('3[a2[c]]')).toBe('accaccacc');
    expect(decodeString('2[2[2[a]]]')).toBe('aaaaaaaa');
  });

  // Регрессия: односимвольный разбор чисел дал бы 1 и 2 вместо 12
  it('понимает многозначные множители', () => {
    expect(decodeString('12[a]')).toBe('a'.repeat(12));
    expect(decodeString('100[x]').length).toBe(100);
  });

  it('строка без кодирования проходит как есть', () => {
    expect(decodeString('abc')).toBe('abc');
    expect(decodeString('')).toBe('');
  });

  it('нулевой множитель схлопывает блок', () => {
    expect(decodeString('0[abc]def')).toBe('def');
  });
});
