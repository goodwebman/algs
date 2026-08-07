import raw from './number-of-islands.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
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
 *
 * Отдельного множества visited нет: посещённая суша сразу превращается
 * в воду («0»). Это и есть пометка — второй раз в неё не зайдёшь.
 */
export function* traceNumberOfIslands(gridInput: readonly (readonly string[])[]): AlgoTrace<VizState, number> {
  // Правка против исходного решения: там заливка шла по массиву вызывающего
  // и после первого прогона от островов ничего не оставалось. Работаем на копии.
  const grid = gridInput.map((row) => [...row]);
  if (!grid.length) return 0;

  const rows = grid.length;
  const cols = grid[0].length;
  let count = 0;

  // #hide
  const marks: Record<string, MarkKind> = {};

  const view = (note: string): VizState => ({
    kind: 'matrix',
    grid,
    marks: { ...marks },
    caption: `${note} · островов найдено: ${count}`,
  });
  // #endhide

  // Четыре направления движения
  const directions = [
    [1, 0], // вниз
    [-1, 0], // вверх
    [0, 1], // вправо
    [0, -1], // влево
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') { // @scan
        count++; // @newIsland

        // Начинаем BFS
        const queue: Array<[number, number]> = [[r, c]];
        grid[r][c] = '0'; // помечаем посещённым
        // #hide
        marks[`${r},${c}`] = 'done';
        // #endhide

        yield {
          state: view(`нашли новый остров в [${r},${c}]`),
          at: 'newIsland',
          note: `[${r},${c}] — суша, в которой мы ещё не были. Это новый остров, номер ${count}.`,
          metrics: { comparisons: 1 },
        };

        while (queue.length > 0) {
          // shift() на очереди — O(n) на каждый вызов (см. разбор «Цена shift»).
          // На поле учебного размера это незаметно, на больших — уже нет.
          const [x, y] = queue.shift()!; // @pop

          for (const [dx, dy] of directions) { // @neighbors
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < rows && ny >= 0 && ny < cols && grid[nx][ny] === '1') {
              // помечаем посещённым
              grid[nx][ny] = '0'; // @visit
              // #hide
              marks[`${nx},${ny}`] = 'done';
              // #endhide
              queue.push([nx, ny]);

              yield {
                state: view(`заливаем остров #${count} с [${x},${y}]`),
                at: 'visit',
                note: `Сосед [${nx},${ny}] — та же суша. Топим его и кладём в очередь.`,
                metrics: { comparisons: 1, writes: 1 },
                memoryPeak: queue.length,
              };
            }
          }
        }
      }
    }
  }

  yield {
    state: view('обход завершён'),
    note: `Всего островов: ${count}.`,
  };

  return count;
}
// #endregion

export const numberOfIslands = (grid: readonly (readonly string[])[]): number =>
  runTrace(traceNumberOfIslands(grid));

export default defineAlgo({
  meta: {
    slug: 'number-of-islands',
    title: 'Количество островов',
    topic: 'graphs',
    summary: 'Подсчёт компонент связности в сетке через заливку BFS.',
    complexity: { time: 'O(rows · cols)', space: 'O(rows · cols)', growth: 'O(n)' },
    difficulty: 'medium',
    leetcode: { id: 200, title: 'number-of-islands' },
    tags: ['графы', 'BFS', 'компоненты связности', 'сетка'],
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
