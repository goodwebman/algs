import { defineTask } from '../types';

export default defineTask({
  slug: 'three-sum',
  title: 'Три числа с нулевой суммой',
  topic: 'two-pointers',
  prompt:
    'Верни все УНИКАЛЬНЫЕ тройки чисел, дающие в сумме ноль.\n' +
    'Порядок троек в ответе не важен, внутри тройки — по возрастанию.\n' +
    'Дубликаты троек недопустимы. Вход мутировать нельзя.',
  exportName: 'threeSum',
  starter: `export function threeSum(input) {
  // Отсортируй копию, зафиксируй первый элемент,
  // а для остальных двух используй два указателя.
  //
  // Самое сложное — уникальность. Дубликаты пропускаются в ТРЁХ местах.
}
`,
  solution: `export function threeSum(input) {
  const nums = [...input].sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i += 1) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;  // пропуск 1
    if (nums[i] > 0) break;                          // ранний выход

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];

      if (sum < 0) {
        left += 1;
      } else if (sum > 0) {
        right -= 1;
      } else {
        result.push([nums[i], nums[left], nums[right]]);

        while (left < right && nums[left] === nums[left + 1]) left += 1;    // пропуск 2
        while (left < right && nums[right] === nums[right - 1]) right -= 1; // пропуск 3

        left += 1;
        right -= 1;
      }
    }
  }

  return result;
}
`,
  cases: [
    {
      name: 'эталонный вход — ровно две тройки',
      args: [[-1, 0, 1, 2, -1, -4]],
      expected: [
        [-1, -1, 2],
        [-1, 0, 1],
      ],
      compare: 'unordered',
    },
    { name: 'все нули — одна тройка', args: [[0, 0, 0, 0]], expected: [[0, 0, 0]], compare: 'unordered' },
    { name: 'троек нет', args: [[1, 2, 3]], expected: [], compare: 'unordered' },
    { name: 'пустой массив', args: [[]], expected: [], compare: 'unordered' },
    { name: 'меньше трёх элементов', args: [[0, 0]], expected: [], compare: 'unordered' },
    {
      name: 'повторы значений в разных тройках',
      args: [[-2, 0, 1, 1, 2]],
      expected: [
        [-2, 0, 2],
        [-2, 1, 1],
      ],
      compare: 'unordered',
    },
    {
      name: 'не мутирует вход',
      args: [[-1, 0, 1, 2, -1, -4]],
      expected: [
        [-1, -1, 2],
        [-1, 0, 1],
      ],
      compare: 'unordered',
      noMutation: true,
    },
  ],
  hints: [
    'Сортируй копию: [...input].sort((a, b) => a - b). Без компаратора sort сравнивает строки.',
    'Пропуск 1: если nums[i] равен nums[i-1], все тройки с этим значением уже собраны.',
    'Пропуски 2 и 3 — сразу после того, как тройка добавлена, для обоих указателей.',
  ],
});
