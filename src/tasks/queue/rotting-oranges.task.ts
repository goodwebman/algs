import { defineTask } from '../types';

export default defineTask({
  slug: 'rotting-oranges',
  title: 'Гниющие апельсины',
  topic: 'queue',
  prompt:
    'В сетке 0 — пусто, 1 — свежий, 2 — гнилой. Каждую минуту гнилой заражает\n' +
    'соседей (4 направления). Верни число минут, через которые сгниют все.\n' +
    'Если какой-то свежий недостижим — верни −1.',
  exportName: 'rottingOranges',
  starter: `export function rottingOranges(grid) {
  // Многоисточниковый BFS: все гнилые в очередь СРАЗУ.
  // Обход по волнам: минута = один уровень очереди.
  // В конце проверить, не осталось ли свежих.
}
`,
  solution: `export function rottingOranges(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const queue = [];
  let fresh = 0;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) fresh += 1;
    }
  }

  let head = 0;
  let minutes = 0;
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

  while (head < queue.length) {
    const waveSize = queue.length - head;

    for (let i = 0; i < waveSize; i += 1) {
      const [r, c] = queue[head++];

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
        if (grid[nr][nc] !== 1) continue;

        grid[nr][nc] = 2;
        fresh -= 1;
        queue.push([nr, nc]);
      }
    }

    if (head < queue.length) minutes += 1;
  }

  return fresh > 0 ? -1 : minutes;
}
`,
  cases: [
    { name: 'классика 3×3', args: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 },
    { name: 'отрезанный свежий', args: [[[2, 1, 1], [0, 1, 0], [1, 0, 1]]], expected: -1 },
    { name: 'нет свежих', args: [[[2, 2], [2, 2]]], expected: 0 },
    { name: 'все свежие без гнилых', args: [[[1, 1], [1, 1]]], expected: -1 },
    { name: 'один свежий рядом', args: [[[2, 1]]], expected: 1 },
    { name: 'два источника быстрее', args: [[[2, 1, 1], [1, 1, 1], [1, 1, 2]]], expected: 2 },
  ],
  hints: [
    'Все гнилые кладутся в очередь до цикла — это многоисточниковый старт.',
    'Фиксируй waveSize в начале минуты и обрабатывай ровно столько.',
    'Минуту увеличивай, только если после волны очередь не пуста.',
  ],
});
