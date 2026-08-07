import raw from './two-sum.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

type Result = readonly [number, number] | null;

// #region show
/**
 * Пара с заданной суммой в НЕотсортированном массиве.
 *
 * Два указателя тут не работают: без сортировки нельзя доказать, что край
 * можно выбросить. Меняем память на время — запоминаем всё, что уже видели.
 *
 * Инсайт: не нужно искать пару. Достаточно на каждом элементе спросить
 * «а видел ли я раньше ровно то число, которого мне не хватает». Ответ на
 * этот вопрос Map даёт за O(1).
 */
export function* traceTwoSum(nums: readonly number[], target: number): AlgoTrace<VizState, Result> {
  const map = new Map<number, number>();

  // #hide
  const view = (index: number, marks: Record<number, MarkKind>, highlightKey?: number): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: 'массив',
        view: {
          kind: 'array',
          data: nums,
          pointers: [{ name: 'i', index, tone: 'scan' }],
          marks,
        },
      },
      {
        title: 'что уже видели: значение → индекс',
        view: {
          kind: 'hashmap',
          entries: [...map].map(([key, value]) => ({
            key: String(key),
            value,
            mark: key === highlightKey ? ('target' as const) : undefined,
          })),
        },
      },
    ],
  });
  // #endhide

  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i]; // @need

    yield {
      state: view(i, { [i]: 'active' }),
      at: 'need',
      note: `Взяли ${nums[i]}. Чтобы получить ${target}, не хватает ${diff}. Видели такое?`,
      metrics: { reads: 1 },
      memoryPeak: map.size,
    };

    if (map.has(diff)) { // @hit
      yield {
        state: view(i, { [map.get(diff)!]: 'target', [i]: 'target' }, diff),
        at: 'hit',
        note: `Да — ${diff} лежит на индексе ${map.get(diff)}. Ответ: [${map.get(diff)}, ${i}].`,
        metrics: { comparisons: 1 },
      };
      return [map.get(diff)!, i];
    }

    // Кладём ПОСЛЕ проверки: иначе элемент найдёт сам себя
    // и на входе [3], target 6 вернётся неверная пара.
    map.set(nums[i], i); // @remember

    yield {
      state: view(i, { [i]: 'visited' }),
      at: 'remember',
      note: `Нет. Запоминаем ${nums[i]} → индекс ${i} и идём дальше.`,
      metrics: { writes: 1 },
      memoryPeak: map.size,
    };
  }

  // В исходном решении функция просто заканчивалась (undefined).
  // Тип ответа — пара или null, поэтому «пары нет» — это null.
  return null;
}
// #endregion

export const twoSum = (nums: readonly number[], target: number): Result =>
  runTrace(traceTwoSum(nums, target));

export default defineAlgo({
  meta: {
    slug: 'two-sum',
    title: 'Пара с заданной суммой через Map',
    topic: 'hash-tables',
    summary: 'Найти два числа с суммой target в неотсортированном массиве за один проход.',
    complexity: { time: 'O(n)', space: 'O(n)', growth: 'O(n)' },
    difficulty: 'easy',
    leetcode: { id: 1, title: 'two-sum' },
    tags: ['хеш-таблица', 'Map', 'один проход'],
  },
  raw,
  presets: [
    { label: '[2,7,11,15], 9', args: [[2, 7, 11, 15], 9] as const, hint: 'Ответ находится на втором шаге.' },
    {
      label: '[3,2,4], 6',
      args: [[3, 2, 4], 6] as const,
      hint: 'Проверка до записи: иначе 3 нашла бы саму себя.',
    },
    { label: '[3,3], 6', args: [[3, 3], 6] as const, hint: 'Два одинаковых числа — Map перезаписал бы ключ, но ответ найдётся раньше.' },
    { label: '[1,5,9], 100', args: [[1, 5, 9], 100] as const, hint: 'Ответа нет — виден полный проход и размер Map.' },
  ],
  trace: traceTwoSum,
  formatResult: (result) => (result ? `[${result[0]}, ${result[1]}]` : 'null — такой пары нет'),
});
