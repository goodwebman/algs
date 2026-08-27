import { testTask } from '../test-derived';

export default testTask({
  slug: 'set-matrix-zeroes',
  title: 'Обнуление строк и столбцов',
  topic: 'arrays',
  prompt: 'Если элемент матрицы равен нулю, обнули всю его строку и столбец. Работай с O(1) дополнительной памятью.',
  exportName: 'setZeroes',
  solution: `export function setZeroes(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  let firstCol = false;
  for (let r = 0; r < rows; r += 1) {
    if (matrix[r][0] === 0) firstCol = true;
    for (let c = 1; c < cols; c += 1) {
      if (matrix[r][c] === 0) matrix[r][0] = matrix[0][c] = 0;
    }
  }
  for (let r = 1; r < rows; r += 1)
    for (let c = 1; c < cols; c += 1)
      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;
  if (matrix[0][0] === 0) for (let c = 0; c < cols; c += 1) matrix[0][c] = 0;
  if (firstCol) for (let r = 0; r < rows; r += 1) matrix[r][0] = 0;
  return matrix;
}
`,
  cases: [
    { name: 'ноль внутри', args: [[[1, 1, 1], [1, 0, 1], [1, 1, 1]]], expected: [[1, 0, 1], [0, 0, 0], [1, 0, 1]] },
    { name: 'ноль в углу', args: [[[0, 1], [1, 1]]], expected: [[0, 0], [0, 1]] },
    { name: 'без нулей', args: [[[1, 2], [3, 4]]], expected: [[1, 2], [3, 4]] },
  ],
  hints: ['Используй первую строку и первый столбец как маркеры.', 'Флаг firstCol нужен, чтобы не потерять исходное состояние первого столбца.'],
});
