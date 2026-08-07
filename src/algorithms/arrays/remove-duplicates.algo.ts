import raw from './remove-duplicates.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Удаление дубликатов из отсортированного массива НА МЕСТЕ.
 *
 * Схема «медленный и быстрый»: fast читает, slow отмечает, куда писать.
 * Всё левее slow — уже готовый ответ, всё правее — мусор, который нас
 * больше не интересует.
 *
 * Возвращается новая длина, а не новый массив: удалить элемент из середины
 * массива нельзя дешевле, чем за O(n), поэтому вместо удаления мы
 * перезаписываем префикс.
 */
export function* traceRemoveDuplicates(input: readonly number[]): AlgoTrace<VizState, number> {
  const nums = [...input];
  if (nums.length === 0) return 0;

  let slow = 0; // @slow

  // #hide
  const view = (fast: number, marks: Record<number, MarkKind>, note: string): VizState => ({
    kind: 'array',
    data: nums,
    pointers: [
      { name: 'slow', index: slow, tone: 'l' },
      { name: 'fast', index: fast, tone: 'r' },
    ],
    marks: {
      ...Object.fromEntries(nums.map((_, i) => [i, i <= slow ? ('done' as const) : undefined])),
      ...marks,
    },
    caption: `${note} · длина ответа: ${slow + 1}`,
  });
  // #endhide

  for (let fast = 1; fast < nums.length; fast += 1) {
    if (nums[fast] === nums[slow]) { // @compare
      yield {
        state: view(fast, { [fast]: 'excluded' }, `${nums[fast]} уже есть`),
        at: 'compare',
        note: `nums[${fast}] = ${nums[fast]} совпал с последним уникальным — пропускаем.`,
        metrics: { comparisons: 1, reads: 2 },
      };
      continue;
    }

    slow += 1;
    nums[slow] = nums[fast]; // @write

    yield {
      state: view(fast, { [slow]: 'swap' }, `${nums[fast]} — новый уникальный`),
      at: 'write',
      note: `Новое значение ${nums[fast]}: пишем его в позицию ${slow}.`,
      metrics: { comparisons: 1, writes: 1 },
    };
  }

  yield {
    state: view(nums.length - 1, {}, 'готово'),
    note: `Первые ${slow + 1} элементов — уникальные. Остальное — мусор, который никого не волнует.`,
  };

  return slow + 1;
}
// #endregion

export const removeDuplicates = (nums: readonly number[]): number => runTrace(traceRemoveDuplicates(nums));

export default defineAlgo({
  meta: {
    slug: 'remove-duplicates',
    title: 'Удаление дубликатов на месте',
    topic: 'arrays',
    summary: 'Схлопнуть повторы в отсортированном массиве, не создавая новый массив.',
    complexity: { time: 'O(n)', space: 'O(1)', growth: 'O(n)' },
    difficulty: 'easy',
    leetcode: { id: 26, title: 'remove-duplicates-from-sorted-array' },
    tags: ['массив', 'быстрый и медленный указатель', 'на месте'],
  },
  raw,
  presets: [
    { label: '[1,1,2]', args: [[1, 1, 2]] as const, hint: 'Минимальный случай с одним дубликатом.' },
    {
      label: '[0,0,1,1,1,2,2,3,3,4]',
      args: [[0, 0, 1, 1, 1, 2, 2, 3, 3, 4]] as const,
      hint: 'Видно, как slow сильно отстаёт от fast — это и есть сэкономленные записи.',
    },
    { label: '[1,2,3]', args: [[1, 2, 3]] as const, hint: 'Дубликатов нет — указатели идут вплотную.' },
    { label: '[7,7,7,7]', args: [[7, 7, 7, 7]] as const, hint: 'Все одинаковые — ни одной записи.' },
  ],
  trace: traceRemoveDuplicates,
  formatResult: (length) => `новая длина: ${length}`,
});
