import raw from './three-sum.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

type Triplet = [number, number, number];

// #region show
/**
 * Все уникальные тройки с нулевой суммой.
 *
 * Схема: зафиксировали первый элемент — и задача свелась к «найти пару с
 * суммой −nums[i]» в оставшемся хвосте, то есть к двум указателям.
 *
 * Главная сложность здесь не в поиске, а в УНИКАЛЬНОСТИ. Пропуски дубликатов
 * нужны в трёх местах, и забытый пропуск — самая частая ошибка в этой задаче:
 * на входе [-1,0,1,2,-1,-4] тройка [-1,0,1] иначе вернётся дважды.
 */
export function* traceThreeSum(input: readonly number[]): AlgoTrace<VizState, Triplet[]> {
  const nums = [...input].sort((a, b) => a - b); // @sort
  const result: Triplet[] = [];

  const view = (marks: Record<number, MarkKind>, note: string): VizState => ({
    kind: 'array',
    data: nums,
    marks,
    caption: `${note}${result.length ? ` · найдено: ${result.map((t) => `[${t}]`).join(' ')}` : ''}`,
  });

  yield {
    state: view({}, 'массив отсортирован'),
    at: 'sort',
    note: 'Сортируем — без неё ни два указателя, ни пропуск дубликатов не работают.',
    metrics: { comparisons: nums.length },
  };

  for (let i = 0; i < nums.length - 2; i += 1) {
    // Первый элемент уже был на прошлой итерации — все его тройки уже найдены.
    if (i > 0 && nums[i] === nums[i - 1]) { // @skipFirst
      yield {
        state: view({ [i]: 'excluded' }, `nums[${i}] = ${nums[i]} — дубликат, пропускаем`),
        at: 'skipFirst',
        note: `nums[${i}] равен предыдущему: все тройки с этим значением уже собраны.`,
      };
      continue;
    }

    // Массив отсортирован: если самый маленький элемент положителен,
    // дальше сумма только растёт — искать больше нечего.
    if (nums[i] > 0) break; // @earlyExit

    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]; // @sum

      yield {
        state: view({ [i]: 'active', [left]: 'compare', [right]: 'compare' }, `сумма = ${sum}`),
        at: 'sum',
        note: `${nums[i]} + ${nums[left]} + ${nums[right]} = ${sum}.`,
        metrics: { comparisons: 1, reads: 3 },
      };

      if (sum < 0) {
        left += 1;
      } else if (sum > 0) {
        right -= 1;
      } else {
        result.push([nums[i], nums[left], nums[right]]); // @found

        yield {
          state: view({ [i]: 'target', [left]: 'target', [right]: 'target' }, 'тройка найдена'),
          at: 'found',
          note: `Нашли тройку [${nums[i]}, ${nums[left]}, ${nums[right]}].`,
        };

        // Сдвигаем оба указателя мимо всех повторов найденных значений.
        while (left < right && nums[left] === nums[left + 1]) left += 1; // @skipLeft
        while (left < right && nums[right] === nums[right - 1]) right -= 1; // @skipRight
        left += 1;
        right -= 1;
      }
    }
  }

  return result;
}
// #endregion

export const threeSum = (nums: readonly number[]): Triplet[] => runTrace(traceThreeSum(nums));

export default defineAlgo({
  meta: {
    slug: 'three-sum',
    title: 'Три числа с нулевой суммой',
    topic: 'two-pointers',
    summary: 'Найти все уникальные тройки, дающие в сумме ноль, без дубликатов в ответе.',
    complexity: { time: 'O(n²)', space: 'O(n)', growth: 'O(n²)' },
    difficulty: 'medium',
    leetcode: { id: 15, title: '3sum' },
    tags: ['два указателя', 'сортировка', 'дубликаты'],
  },
  raw,
  presets: [
    {
      label: '[-1,0,1,2,-1,-4]',
      args: [[-1, 0, 1, 2, -1, -4]] as const,
      hint: 'Эталонный вход: без пропуска дубликатов тройка [-1,0,1] вернулась бы дважды.',
    },
    { label: '[0,0,0,0]', args: [[0, 0, 0, 0]] as const, hint: 'Все нули: ответ ровно один — [0,0,0].' },
    { label: '[1,2,3]', args: [[1, 2, 3]] as const, hint: 'Ранний выход: минимум уже положителен.' },
    {
      label: '[-2,0,1,1,2]',
      args: [[-2, 0, 1, 1, 2]] as const,
      hint: 'Две разные тройки, одна из них с повтором значения.',
    },
  ],
  trace: traceThreeSum,
  formatResult: (result) => (result.length ? result.map((t) => `[${t.join(',')}]`).join(' ') : 'троек нет'),
});
