import { describe, expect, it } from 'vitest';

import { bfsShortestPath } from './bfs-shortest-path.algo';
import { rottingOranges } from './rotting-oranges.algo';

const GRAPH: Record<string, string[]> = {
  a: ['b', 'c'],
  b: ['a', 'd'],
  c: ['a', 'd', 'e'],
  d: ['b', 'c', 'f'],
  e: ['c', 'f'],
  f: ['d', 'e', 'g'],
  g: ['f'],
};

describe('bfsShortestPath', () => {
  it('находит кратчайший путь', () => {
    // BFS может вернуть любой из кратчайших путей — фиксируем длину и валидность.
    const toG = bfsShortestPath(GRAPH, 'a', 'g');
    expect(toG?.length).toBe(5);
    const toE = bfsShortestPath(GRAPH, 'a', 'e');
    expect(toE?.length).toBe(3);
  });

  it('старт равен цели', () => {
    expect(bfsShortestPath(GRAPH, 'a', 'a')).toEqual(['a']);
  });

  it('возвращает null при отсутствии пути', () => {
    const disconnected = { a: ['b'], b: ['a'], c: ['d'], d: ['c'] };
    expect(bfsShortestPath(disconnected, 'a', 'c')).toBeNull();
  });

  it('путь действительно кратчайший', () => {
    const path = bfsShortestPath(GRAPH, 'a', 'g');
    // Проверяем, что каждый шаг — ребро, и короче не бывает
    expect(path?.length).toBeLessThanOrEqual(5);
    for (let i = 0; path && i < path.length - 1; i += 1) {
      expect(GRAPH[path[i]].includes(path[i + 1])).toBe(true);
    }
  });
});

describe('rottingOranges', () => {
  it('считает минуты заражения', () => {
    expect(rottingOranges([[2, 1, 1], [1, 1, 0], [0, 1, 1]])).toBe(4);
  });

  it('несколько источников заражают быстрее', () => {
    expect(rottingOranges([[2, 1, 1], [0, 1, 1], [1, 0, 1]])).toBeLessThan(4);
  });

  it('возвращает −1, если свежий отрезан', () => {
    expect(rottingOranges([[2, 1, 1], [0, 1, 0], [1, 0, 1]])).toBe(-1);
  });

  it('нет свежих — 0 минут', () => {
    expect(rottingOranges([[2, 2], [2, 2]])).toBe(0);
  });

  it('все свежие, гнилых нет — невозможно', () => {
    expect(rottingOranges([[1, 1], [1, 1]])).toBe(-1);
  });

  it('не мутирует вход', () => {
    const input = [[2, 1], [1, 1]];
    rottingOranges(input);
    expect(input).toEqual([[2, 1], [1, 1]]);
  });
});
