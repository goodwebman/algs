import { describe, expect, it } from 'vitest';

import { numberOfIslands } from './number-of-islands.algo';
import { topologicalSort } from './topological-sort.algo';

describe('numberOfIslands', () => {
  it('считает компоненты связности', () => {
    expect(
      numberOfIslands([
        ['1', '1', '0', '0'],
        ['1', '0', '0', '1'],
        ['0', '0', '1', '1'],
      ]),
    ).toBe(2);
  });

  it('вся суша связна — один остров', () => {
    expect(numberOfIslands([['1', '1', '1'], ['1', '1', '1']])).toBe(1);
  });

  it('только вода — ноль островов', () => {
    expect(numberOfIslands([['0', '0'], ['0', '0']])).toBe(0);
  });

  // Диагональное соседство НЕ считается связью
  it('диагональ не соединяет острова', () => {
    expect(numberOfIslands([['1', '0'], ['0', '1']])).toBe(2);
  });

  it('одна ячейка', () => {
    expect(numberOfIslands([['1']])).toBe(1);
    expect(numberOfIslands([['0']])).toBe(0);
  });

  it('не мутирует вход', () => {
    const grid = [['1', '0'], ['0', '1']];
    numberOfIslands(grid);
    expect(grid).toEqual([['1', '0'], ['0', '1']]);
  });
});

describe('topologicalSort', () => {
  it('строит корректный порядок зависимостей', () => {
    const graph = { config: ['types'], types: ['utils'], utils: ['app'], app: [] };
    expect(topologicalSort(graph)).toEqual(['config', 'types', 'utils', 'app']);
  });

  it('порядок уважает все рёбра', () => {
    const graph: Record<string, string[]> = {
      config: ['types'],
      types: ['utils', 'api'],
      utils: ['ui'],
      api: ['ui'],
      ui: ['app'],
      app: [],
    };
    const order = topologicalSort(graph);
    expect(order).not.toBeNull();

    const position = new Map(order!.map((id, i) => [id, i]));
    for (const [from, tos] of Object.entries(graph)) {
      for (const to of tos) {
        expect(position.get(from)!).toBeLessThan(position.get(to)!);
      }
    }
  });

  // Обнаружение цикла — побочный, но очень полезный эффект алгоритма Кана
  it('возвращает null при цикле', () => {
    expect(topologicalSort({ a: ['b'], b: ['c'], c: ['a'] })).toBeNull();
  });

  it('граф без рёбер — все вершины в любом порядке', () => {
    const order = topologicalSort({ x: [], y: [], z: [] });
    expect(order).toHaveLength(3);
    expect(new Set(order)).toEqual(new Set(['x', 'y', 'z']));
  });

  it('пустой граф', () => {
    expect(topologicalSort({})).toEqual([]);
  });

  it('самопетля — это цикл', () => {
    expect(topologicalSort({ a: ['a'] })).toBeNull();
  });
});
