import raw from './number-of-islands.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace, type Step } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Количество островов: подсчёт компонент связности в сетке.
 *
 * Сетка — это неявный граф: ячейка — вершина, соседство по стороне — ребро.
 * Отдельного списка смежности строить не нужно, соседи вычисляются
 * арифметикой по координатам.
 *
 * Схема любой задачи «сколько компонент связности»:
 *   для каждой непосещённой вершины → запустить обход → счётчик += 1
 * Обход помечает всю компоненту целиком, поэтому второй раз мы в неё
 * не зайдём. DFS или BFS — без разницы, компоненту нужно просто «залить».
 */
const LAND = '1';

export function* traceNumberOfIslands(gridInput: readonly (readonly string[])[]): AlgoTrace<VizState, number> {
  const grid = gridInput.map((row) => [...row]);
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const visited = new Set<string>();
  let islands = 0;

  const marks: Record<string, MarkKind> = {};

  const view = (note: string): VizState => ({
    kind: 'matrix',
    grid,
    marks: { ...marks },
    caption: `${note} · островов найдено: ${islands}`,
  });

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ] as const;

  /** Заливка компоненты: помечаем всю сушу, достижимую отсюда. */
  function* flood(startRow: number, startCol: number): Generator<Step<VizState>, void, void> {
    const stack: Array<[number, number]> = [[startRow, startCol]];
    visited.add(`${startRow},${startCol}`);

    while (stack.length > 0) {
      const [r, c] = stack.pop()!; // @pop
      marks[`${r},${c}`] = 'done';

      yield {
        state: view(`заливаем остров #${islands} с [${r},${c}]`),
        at: 'pop',
        note: `Ячейка [${r},${c}] принадлежит острову #${islands}.`,
        metrics: { reads: 1 },
      };

      for (const [dr, dc] of directions) { // @neighbors
        const nr = r + dr;
        const nc = c + dc;
        const key = `${nr},${nc}`;

        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (grid[nr][nc] !== LAND || visited.has(key)) continue;

        // Помечаем при ДОБАВЛЕНИИ в стек, а не при обработке — иначе
        // одна и та же ячейка попадёт в стек несколько раз.
        visited.add(key); // @visit
        stack.push([nr, nc]);
      }
    }
  }

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] !== LAND || visited.has(`${r},${c}`)) continue; // @scan

      islands += 1; // @newIsland

      yield {
        state: view(`нашли новый остров в [${r},${c}]`),
        at: 'newIsland',
        note: `[${r},${c}] — суша, в которой мы ещё не были. Это новый остров, номер ${islands}.`,
        metrics: { comparisons: 1 },
      };

      yield* flood(r, c);
    }
  }

  yield {
    state: view('обход завершён'),
    note: `Всего островов: ${islands}.`,
  };

  return islands;
}
// #endregion

export const numberOfIslands = (grid: readonly (readonly string[])[]): number =>
  runTrace(traceNumberOfIslands(grid));

export default defineAlgo({
  meta: {
    slug: 'number-of-islands',
    title: 'Количество островов',
    topic: 'graphs',
    summary: 'Подсчёт компонент связности в сетке через заливку DFS.',
    complexity: { time: 'O(rows · cols)', space: 'O(rows · cols)', growth: 'O(n)' },
    difficulty: 'medium',
    leetcode: { id: 200, title: 'number-of-islands' },
    tags: ['графы', 'DFS', 'компоненты связности', 'сетка'],
  },
  raw,
  presets: [
    {
      label: 'три острова',
      args: [
        [
          ['1', '1', '0', '0'],
          ['1', '0', '0', '1'],
          ['0', '0', '1', '1'],
        ],
      ] as const,
      hint: 'Диагональ не соединяет: соседство только по стороне.',
    },
    {
      label: 'один большой',
      args: [
        [
          ['1', '1', '1'],
          ['1', '1', '1'],
        ],
      ] as const,
      hint: 'Вся суша связна — заливка накрывает всё за один заход.',
    },
    {
      label: 'только вода',
      args: [
        [
          ['0', '0'],
          ['0', '0'],
        ],
      ] as const,
      hint: 'Ноль островов.',
    },
  ],
  trace: traceNumberOfIslands,
  formatResult: (count) => `островов: ${count}`,
});
