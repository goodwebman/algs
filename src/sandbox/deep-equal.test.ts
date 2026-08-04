import { describe, expect, it } from 'vitest';

import { approxEqual, deepEqual, unorderedEqual } from './deep-equal';

describe('deepEqual', () => {
  it('сравнивает примитивы', () => {
    expect(deepEqual(1, 1)).toBe(true);
    expect(deepEqual('a', 'a')).toBe(true);
    expect(deepEqual(1, '1')).toBe(false);
  });

  // JSON.stringify считает NaN равным null и теряет это различие
  it('NaN равен NaN, но +0 не равен -0', () => {
    expect(deepEqual(NaN, NaN)).toBe(true);
    expect(deepEqual(0, -0)).toBe(false);
  });

  it('порядок ключей объекта не важен', () => {
    expect(deepEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  it('массив не равен объекту с числовыми ключами', () => {
    expect(deepEqual([1, 2], { 0: 1, 1: 2 })).toBe(false);
  });

  it('сравнивает вложенные структуры', () => {
    expect(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] })).toBe(true);
    expect(deepEqual({ a: [1, { b: 2 }] }, { a: [1, { b: 3 }] })).toBe(false);
  });

  it('различает undefined и отсутствующий ключ', () => {
    expect(deepEqual({ a: undefined }, {})).toBe(false);
  });

  it('сравнивает Map, Set, Date и RegExp по содержимому', () => {
    expect(deepEqual(new Map([['a', 1]]), new Map([['a', 1]]))).toBe(true);
    expect(deepEqual(new Set([1, 2]), new Set([2, 1]))).toBe(true);
    expect(deepEqual(new Date(0), new Date(0))).toBe(true);
    expect(deepEqual(/x/g, /x/g)).toBe(true);
    expect(deepEqual(/x/g, /x/i)).toBe(false);
  });

  it('сравнивает Set объектов по значению', () => {
    expect(deepEqual(new Set([{ a: 1 }]), new Set([{ a: 1 }]))).toBe(true);
  });

  it('не уходит в бесконечную рекурсию на циклах', () => {
    const a: Record<string, unknown> = { name: 'a' };
    const b: Record<string, unknown> = { name: 'a' };
    a.self = a;
    b.self = b;
    expect(deepEqual(a, b)).toBe(true);
  });
});

describe('unorderedEqual', () => {
  it('игнорирует порядок верхнего уровня', () => {
    expect(unorderedEqual([[1, 2], [3]], [[3], [1, 2]])).toBe(true);
  });

  it('учитывает количество повторов', () => {
    expect(unorderedEqual([1, 1, 2], [1, 2, 2])).toBe(false);
  });
});

describe('approxEqual', () => {
  it('прощает погрешность плавающей точки', () => {
    expect(approxEqual(0.1 + 0.2, 0.3)).toBe(true);
    expect(approxEqual(1, 1.5)).toBe(false);
  });
});
