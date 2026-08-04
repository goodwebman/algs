import raw from './rotting-oranges.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Гниющие апельсины (многоисточниковый BFS).
 *
 * В сетке 0 — пусто, 1 — свежий апельсин, 2 — гнилой. Каждую минуту гнилой
 * заражает соседей. За сколько минут сгниют все?
 *
 * Инсайт: это BFS, но с НЕСКОЛЬКИМИ источниками одновременно. Все гнилые
 * апельсины — это стартовая волна BFS. Кладём их в очередь разом и обходим
 * по уровням: минута = один уровень волны.
 *
 * Проверка «остался ли свежий» обязательна: если свежий отрезан гнилыми
 * навсегда, ответ −1, а не время последней волны.
 */
const FRESH = 1;
const ROTTEN = 2;

export function* traceRottingOranges(gridInput: readonly (readonly number[])[]): AlgoTrace<VizState, number> {
  const grid = gridInput.map((row) => [...row]);
  const rows = grid.length;
  const cols = grid[0].length;

  const queue: Array<[number, number]> = [];
  let fresh = 0;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] === ROTTEN) queue.push([r, c]); // @seed
      else if (grid[r][c] === FRESH) fresh += 1;
    }
  }

  let head = 0;
  let minutes = 0;

  const view = (marks: Record<string, MarkKind>, note: string): VizState => ({
    kind: 'matrix',
    grid,
    marks,
    caption: `${note} · минут прошло: ${minutes}, свежих осталось: ${fresh}`,
  });

  yield {
    state: view(Object.fromEntries(queue.map(([r, c]) => [`${r},${c}`, 'active' as const])), 'стартовая волна'),
    at: 'seed',
    note: `Гнилых в очереди: ${queue.length}. Свежих на поле: ${fresh}.`,
    metrics: { reads: rows * cols },
  };

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (head < queue.length) {
    const waveSize = queue.length - head;

    for (let i = 0; i < waveSize; i += 1) {
      const [r, c] = queue[head++]; // @rotten

      for (const [dr, dc] of directions) { // @spread
        const nr = r + dr;
        const nc = c + dc;

        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (grid[nr][nc] !== FRESH) continue;

        grid[nr][nc] = ROTTEN;
        fresh -= 1;
        queue.push([nr, nc]); // @infect

        yield {
          state: view({ [`${nr},${nc}`]: 'swap' }, `заразили [${nr},${nc}]`),
          at: 'infect',
          note: `Гнилой апельсин [${r},${c}] заразил свежий [${nr},${nc}].`,
          metrics: { comparisons: 1, writes: 1 },
          memoryPeak: queue.length,
        };
      }
    }

    // Волна прошла. Если в очереди ещё есть заражённые — минута увеличивается.
    if (head < queue.length) minutes += 1; // @tick
  }

  if (fresh > 0) { // @stuck
    yield {
      state: view({}, 'остались свежие'),
      note: `После всех волн осталось ${fresh} свежих апельсинов — они отрезаны, заразить нельзя.`,
    };
    return -1;
  }

  yield {
    state: view(Object.fromEntries(queue.map(([r, c]) => [`${r},${c}`, 'done' as const])), 'всё сгнило'),
    note: `Все свежие заражены за ${minutes} минут.`,
  };

  return minutes;
}
// #endregion

export const rottingOranges = (grid: readonly (readonly number[])[]): number =>
  runTrace(traceRottingOranges(grid));

export default defineAlgo({
  meta: {
    slug: 'rotting-oranges',
    title: 'Гниющие апельсины',
    topic: 'queue',
    summary: 'Многоисточниковый BFS по уровням: за сколько шагов волна заражения накроет всё поле.',
    complexity: { time: 'O(rows · cols)', space: 'O(rows · cols)', growth: 'O(n)' },
    difficulty: 'medium',
    leetcode: { id: 994, title: 'rotting-oranges' },
    tags: ['очередь', 'BFS', 'многоисточниковый', 'сетка'],
  },
  raw,
  presets: [
    {
      label: 'классика 3×3',
      args: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]] as const,
      hint: 'Один гнилой в углу — волна расползается 4 минуты.',
    },
    {
      label: 'два источника',
      args: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]] as const,
      hint: 'Два гнилых стартуют одновременно — волна доходит быстрее.',
    },
    {
      label: 'отрезанный свежий',
      args: [[[2, 1, 1], [0, 1, 0], [1, 0, 1]]] as const,
      hint: 'Один свежий отрезан — ответ −1.',
    },
    { label: 'нет свежих', args: [[[2, 2], [2, 2]]] as const, hint: 'Заражать некого — 0 минут.' },
  ],
  trace: traceRottingOranges,
  formatResult: (minutes) => (minutes === -1 ? 'невозможно — есть отрезанные свежие' : `${minutes} минут`),
});
