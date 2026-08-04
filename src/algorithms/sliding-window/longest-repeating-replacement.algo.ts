import raw from './longest-repeating-replacement.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { VizState } from '@/viz/types';

// #region show
/**
 * Самая длинная подстрока из одинаковых букв, если разрешено заменить
 * не более k символов.
 *
 * Переформулировка: окно допустимо, если
 *   (длина окна) − (частота самого частого символа в окне) ≤ k,
 * то есть «всё, кроме доминирующего символа, помещается в бюджет замен».
 *
 * Тонкость реализации: частоты уменьшаются по СИМВОЛУ, а не по индексу.
 * Ошибка `counts.set(left, ...)` вместо `counts.set(chars[left], ...)`
 * выглядит безобидно, но кладёт в Map числовой ключ, счётчики символов
 * не убывают, и окно никогда не сжимается корректно.
 */
export function* traceLongestRepeating(input: string, k: number): AlgoTrace<VizState, number> {
  const chars = [...input];
  const counts = new Map<string, number>();
  let left = 0;
  let best = 0;
  let maxCount = 0;

  const view = (right: number, note: string): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: 'строка',
        view: {
          kind: 'array',
          data: chars,
          window: right >= left ? { from: left, to: right } : null,
          pointers: [
            { name: 'left', index: left, tone: 'l' },
            { name: 'right', index: right, tone: 'r' },
          ],
        },
      },
      {
        title: `частоты в окне · самый частый встречается ${maxCount} раз`,
        view: { kind: 'hashmap', entries: [...counts].map(([key, value]) => ({ key, value })) },
      },
    ],
    caption: `${note} · лучший ответ ${best}`,
  });

  for (let right = 0; right < chars.length; right += 1) {
    const char = chars[right];
    counts.set(char, (counts.get(char) ?? 0) + 1); // @expand
    maxCount = Math.max(maxCount, counts.get(char)!);

    yield {
      state: view(right, `вошёл «${char}»`),
      at: 'expand',
      note: `Добавили «${char}». Замен потребуется: ${right - left + 1 - maxCount}, бюджет ${k}.`,
      metrics: { reads: 1, writes: 1 },
    };

    // Заменить нужно всё, кроме доминирующего символа.
    while (right - left + 1 - maxCount > k) { // @shrink
      const leaving = chars[left];
      counts.set(leaving, counts.get(leaving)! - 1); // @decrement
      left += 1;

      yield {
        state: view(right, `вышел «${leaving}»`),
        at: 'shrink',
        note: `Бюджет замен превышен — уменьшаем счётчик «${leaving}» и двигаем left.`,
        metrics: { writes: 1 },
      };
    }

    if (right - left + 1 > best) { // @better
      best = right - left + 1;

      yield {
        state: view(right, `новый максимум ${best}`),
        at: 'better',
        note: `Окно длиной ${best} допустимо — это лучший ответ на данный момент.`,
        metrics: { comparisons: 1 },
      };
    }
  }

  return best;
}
// #endregion

export const longestRepeatingReplacement = (input: string, k: number): number =>
  runTrace(traceLongestRepeating(input, k));

export default defineAlgo({
  meta: {
    slug: 'longest-repeating-replacement',
    title: 'Одинаковые буквы при k заменах',
    topic: 'sliding-window',
    summary: 'Найти длину самой длинной подстроки из одинаковых букв, если разрешено k замен.',
    complexity: { time: 'O(n)', space: 'O(k)', growth: 'O(n)' },
    difficulty: 'medium',
    leetcode: { id: 424, title: 'longest-repeating-character-replacement' },
    tags: ['скользящее окно', 'частоты', 'доминирующий символ'],
  },
  raw,
  presets: [
    { label: '"ABAB", k=2', args: ['ABAB', 2] as const, hint: 'Ответ 4 — заменяем обе B на A.' },
    { label: '"AABABBA", k=1', args: ['AABABBA', 1] as const, hint: 'Ответ 4. Здесь окно реально сжимается.' },
    { label: '"AAAA", k=0', args: ['AAAA', 0] as const, hint: 'Замены не нужны — сжатий нет.' },
    { label: '"ABCDE", k=1', args: ['ABCDE', 1] as const, hint: 'Все разные: ответ 2, окно всё время упирается в бюджет.' },
  ],
  trace: traceLongestRepeating,
  formatResult: (best) => `максимальная длина: ${best}`,
});
