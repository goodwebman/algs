import raw from './longest-ones.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { VizState } from '@/viz/types';

// #region show
/**
 * Самая длинная серия единиц, если разрешено перевернуть не более k нулей.
 *
 * Приём: не пытайся «выбирать, какие нули переворачивать». Переформулируй —
 * «самое длинное окно, в котором не больше k нулей». Выбор исчезает, остаётся
 * обычное окно переменного размера со счётчиком.
 *
 * Такая переформулировка — половина решения задач на окно. Условие вида
 * «не более k чего-то» почти всегда означает окно.
 */
export function* traceLongestOnes(nums: readonly number[], k: number): AlgoTrace<VizState, number> {
  let left = 0;
  let zeroes = 0;
  let ans = 0;

  // #hide
  const view = (right: number, note: string): VizState => ({
    kind: 'array',
    data: nums,
    window: right >= left ? { from: left, to: right } : null,
    pointers: [
      { name: 'left', index: left, tone: 'l' },
      { name: 'right', index: right, tone: 'r' },
    ],
    caption: `${note} · нулей в окне ${zeroes} из ${k}, лучший ответ ${ans}`,
  });
  // #endhide

  for (let right = 0; right < nums.length; right++) {
    if (nums[right] === 0) zeroes += 1; // @expand

    yield {
      state: view(right, `вошёл ${nums[right]}`),
      at: 'expand',
      note: `Расширили окно до индекса ${right}. Нулей внутри: ${zeroes}.`,
      metrics: { reads: 1 },
    };

    while (zeroes > k) { // @shrink
      if (nums[left] === 0) zeroes -= 1;
      left++;

      yield {
        state: view(right, 'сжимаем слева'),
        at: 'shrink',
        note: `Нулей больше ${k} — двигаем left до индекса ${left}.`,
        metrics: { reads: 1 },
      };
    }

    // Правка против исходного решения: там было right - left, без +1.
    // Окно включает оба конца, и ответ занижался ровно на единицу:
    // на [1,1,0,1,1,1] с k=1 получалось 5 вместо 6.
    ans = Math.max(ans, right - left + 1); // @better

    yield {
      state: view(right, `длина окна ${right - left + 1}`),
      at: 'better',
      note: `Окно [${left}…${right}] длиной ${right - left + 1}, лучший ответ ${ans}.`,
      metrics: { comparisons: 1 },
    };
  }

  return ans;
}
// #endregion

export const longestOnes = (nums: readonly number[], k: number): number =>
  runTrace(traceLongestOnes(nums, k));

export default defineAlgo({
  meta: {
    slug: 'longest-ones',
    title: 'Максимум единиц подряд при k заменах',
    topic: 'sliding-window',
    summary: 'Найти самую длинную серию единиц, если разрешено перевернуть не более k нулей.',
    complexity: { time: 'O(n)', space: 'O(1)', growth: 'O(n)' },
    difficulty: 'medium',
    leetcode: { id: 1004, title: 'max-consecutive-ones-iii' },
    tags: ['скользящее окно', 'переформулировка условия'],
  },
  raw,
  presets: [
    { label: '[1,1,0,1,1,1], k=1', args: [[1, 1, 0, 1, 1, 1], 1] as const, hint: 'Ответ 6 — весь массив. Тут и ловится потеря «+1».' },
    { label: '[1,1,1,0,0,0,1,1,1,1,0], k=2', args: [[1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], 2] as const, hint: 'Окно проезжает через блок нулей.' },
    { label: '[0,0,0], k=0', args: [[0, 0, 0], 0] as const, hint: 'Заменять нельзя, единиц нет — ответ 0.' },
    { label: '[1,1,1], k=2', args: [[1, 1, 1], 2] as const, hint: 'Нулей нет — сжатий не происходит.' },
  ],
  trace: traceLongestOnes,
  formatResult: (best) => `максимум единиц подряд: ${best}`,
});
