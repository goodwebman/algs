import raw from './first-true.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Поиск ГРАНИЦЫ: первый индекс, начиная с которого условие истинно.
 *
 * Это гораздо более полезная форма бинарного поиска, чем «найти элемент».
 * Она отвечает на вопросы «первое вхождение в массиве с дубликатами»,
 * «куда вставить, чтобы не сломать порядок», «минимальная скорость,
 * при которой успеваем» — то есть на любую задачу, где ответ монотонен:
 *
 *     F F F F T T T T
 *             ^ ищем эту границу
 *
 * Условие обязано быть монотонным: один раз став истинным, оно не может
 * снова стать ложным. Без монотонности бинарный поиск неприменим.
 */
export function* traceFirstTrue(nums: readonly number[], threshold: number): AlgoTrace<VizState, number> {
  // Правая граница на единицу за массивом: ответ «такого нет»
  // должен быть выразим, а не сливаться с «последний элемент».
  let left = 0;
  let right = nums.length; // @init

  const predicate = (index: number) => nums[index] >= threshold;

  const view = (mid: number | null, marks: Record<number, MarkKind>, note: string): VizState => ({
    kind: 'array',
    data: nums,
    pointers: [
      { name: 'left', index: left, tone: 'l', outOfRange: left >= nums.length },
      ...(mid === null ? [] : [{ name: 'mid', index: mid, tone: 'scan' as const }]),
      { name: 'right', index: right, tone: 'r', outOfRange: right >= nums.length },
    ],
    marks: {
      ...Object.fromEntries(
        nums.map((_, i) => [i, i < left || i >= right ? ('excluded' as const) : undefined]),
      ),
      ...marks,
    },
    caption: `${note} · ищем первый элемент ≥ ${threshold}`,
  });

  yield {
    state: view(null, {}, 'старт'),
    at: 'init',
    note: `Отрезок поиска [0, ${nums.length}]. Правая граница за массивом — так выразим ответ «такого нет».`,
  };

  // Строгое <, а не <=: right не индекс элемента, а граница отрезка.
  while (left < right) { // @loop
    const mid = left + Math.floor((right - left) / 2);
    const ok = predicate(mid); // @check

    yield {
      state: view(mid, { [mid]: ok ? 'target' : 'compare' }, ok ? 'условие истинно' : 'условие ложно'),
      at: 'check',
      note: `nums[${mid}] = ${nums[mid]} ${ok ? '≥' : '<'} ${threshold} → ${ok ? 'истина' : 'ложь'}.`,
      metrics: { comparisons: 1, reads: 1 },
    };

    if (ok) {
      // mid может быть ответом — не выбрасываем его.
      right = mid; // @keep
      yield {
        state: view(null, {}, 'сужаем справа'),
        at: 'keep',
        note: `Раз здесь уже истина, ответ не правее mid. right = ${mid}, сам mid остаётся кандидатом.`,
      };
    } else {
      left = mid + 1; // @drop
      yield {
        state: view(null, {}, 'сужаем слева'),
        at: 'drop',
        note: `Здесь ложь, значит ответ строго правее. left = ${mid + 1}.`,
      };
    }
  }

  yield {
    state: view(null, left < nums.length ? { [left]: 'target' } : {}, 'граница найдена'),
    note:
      left < nums.length
        ? `Границы сошлись на индексе ${left} — это первый элемент ≥ ${threshold}.`
        : `Границы сошлись за массивом: элементов ≥ ${threshold} нет.`,
  };

  return left;
}
// #endregion

export const firstTrue = (nums: readonly number[], threshold: number): number =>
  runTrace(traceFirstTrue(nums, threshold));

export default defineAlgo({
  meta: {
    slug: 'first-true',
    title: 'Поиск границы (lower bound)',
    topic: 'binary-search',
    summary: 'Найти первый индекс, начиная с которого выполняется монотонное условие.',
    complexity: { time: 'O(log n)', space: 'O(1)', growth: 'O(log n)' },
    difficulty: 'medium',
    leetcode: { id: 35, title: 'search-insert-position' },
    tags: ['бинарный поиск', 'граница', 'монотонность', 'lower bound'],
  },
  raw,
  presets: [
    { label: '[1,3,5,6], ≥5', args: [[1, 3, 5, 6], 5] as const, hint: 'Ответ 2 — элемент существует.' },
    { label: '[1,3,5,6], ≥2', args: [[1, 3, 5, 6], 2] as const, hint: 'Элемента нет, но позиция вставки есть — индекс 1.' },
    { label: '[1,3,5,6], ≥7', args: [[1, 3, 5, 6], 7] as const, hint: 'Ответ 4 — за массивом. Ради этого right и стартует с length.' },
    { label: '[2,2,2,5], ≥2', args: [[2, 2, 2, 5], 2] as const, hint: 'Дубликаты: возвращается ПЕРВОЕ вхождение, а не любое.' },
  ],
  trace: traceFirstTrue,
  formatResult: (index) => `граница на индексе ${index}`,
});
