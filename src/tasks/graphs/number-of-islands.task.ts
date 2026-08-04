import { defineTask } from '../types';

export default defineTask({
  slug: 'number-of-islands',
  title: 'Количество островов',
  topic: 'graphs',
  prompt:
    "В сетке '1' — суша, '0' — вода. Остров — группа клеток суши, связанных ПО СТОРОНЕ\n" +
    '(диагональ не считается). Верни количество островов.\n' +
    'Вход мутировать нельзя.',
  exportName: 'numberOfIslands',
  starter: `export function numberOfIslands(grid) {
  // Для каждой непосещённой суши: счётчик += 1 и залить всю компоненту.
  // Заливка — DFS через стек или BFS через очередь, без разницы.
  // Соседи считаются арифметикой по координатам.
}
`,
  solution: `export function numberOfIslands(grid) {
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const visited = new Set();
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  let islands = 0;

  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (grid[r][c] !== '1' || visited.has(r + ',' + c)) continue;

      islands += 1;

      // Заливка компоненты через явный стек — рекурсия
      // на большой сплошной сетке переполнила бы стек вызовов.
      const stack = [[r, c]];
      visited.add(r + ',' + c);

      while (stack.length > 0) {
        const [cr, cc] = stack.pop();

        for (const [dr, dc] of dirs) {
          const nr = cr + dr;
          const nc = cc + dc;
          const key = nr + ',' + nc;

          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (grid[nr][nc] !== '1' || visited.has(key)) continue;

          visited.add(key);
          stack.push([nr, nc]);
        }
      }
    }
  }

  return islands;
}
`,
  cases: [
    {
      name: 'два острова',
      args: [[['1', '1', '0', '0'], ['1', '0', '0', '1'], ['0', '0', '1', '1']]],
      expected: 2,
    },
    { name: 'вся суша связна', args: [[['1', '1', '1'], ['1', '1', '1']]], expected: 1 },
    { name: 'только вода', args: [[['0', '0'], ['0', '0']]], expected: 0 },
    // Диагональ НЕ соединяет
    { name: 'диагональ не соединяет', args: [[['1', '0'], ['0', '1']]], expected: 2 },
    { name: 'одна клетка суши', args: [[['1']]], expected: 1 },
    { name: 'одна клетка воды', args: [[['0']]], expected: 0 },
    {
      name: 'не мутирует вход',
      args: [[['1', '0'], ['0', '1']]],
      expected: 2,
      noMutation: true,
    },
  ],
  hints: [
    'Внешний цикл ищет непосещённую сушу, внутренняя заливка красит всю компоненту.',
    'visited отмечай ПРИ ДОБАВЛЕНИИ в стек, иначе ячейка попадёт туда несколько раз.',
    'Ключ для Set — строка вида r + "," + c.',
  ],
});
