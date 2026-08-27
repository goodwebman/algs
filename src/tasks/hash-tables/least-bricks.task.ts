import { testTask } from '../test-derived';

export default testTask({
  slug: 'least-bricks',
  title: 'Вертикальная линия через стену',
  topic: 'hash-tables',
  prompt: 'Проведи вертикальную линию через кирпичную стену так, чтобы она пересекла минимум кирпичей. По краям стены линию проводить нельзя.',
  exportName: 'leastBricks',
  solution: `export function leastBricks(wall) {
  const gaps = new Map();
  let best = 0;
  for (const row of wall) {
    let edge = 0;
    for (let i = 0; i < row.length - 1; i += 1) {
      edge += row[i];
      const count = (gaps.get(edge) ?? 0) + 1;
      gaps.set(edge, count);
      best = Math.max(best, count);
    }
  }
  return wall.length - best;
}
`,
  cases: [
    { name: 'классика', args: [[[1, 2, 2, 1], [3, 1, 2], [1, 3, 2], [2, 4], [3, 1, 2], [1, 3, 1, 1]]], expected: 2 },
    { name: 'один кирпич в ряду', args: [[[6], [6], [6]]], expected: 3 },
    { name: 'одинаковые швы', args: [[[1, 1], [1, 1]]], expected: 0 },
  ],
  hints: ['Сохраняй не кирпичи, а позиции внутренних швов.', 'Лучший шов пересекает wall.length - count кирпичей.'],
});
