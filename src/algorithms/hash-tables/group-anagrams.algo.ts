import raw from './group-anagrams.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { VizState } from '@/viz/types';

// #region show
/**
 * Группировка анаграмм.
 *
 * Инсайт: нужен КАНОНИЧЕСКИЙ ВИД — представление, одинаковое у всех слов
 * одной группы и разное у слов из разных. Тогда задача сводится к «сложить
 * по ключу в Map», то есть к одному проходу.
 *
 * Здесь канонический вид — отсортированные буквы: «eat», «tea» и «ate» дают
 * «aet». Это O(k log k) на слово. Можно и за O(k) — счётчиком букв,
 * но читается такой ключ хуже, а выигрыш заметен только на длинных словах.
 */
export function* traceGroupAnagrams(words: readonly string[]): AlgoTrace<VizState, string[][]> {
  const groups = new Map<string, string[]>();

  const view = (index: number, activeKey?: string): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: 'слова',
        view: {
          kind: 'array',
          data: words,
          pointers: [{ name: 'i', index, tone: 'scan' }],
          marks: Object.fromEntries(words.map((_, i) => [i, i < index ? ('visited' as const) : undefined])),
        },
      },
      {
        title: 'группы: канонический вид → слова',
        view: {
          kind: 'hashmap',
          entries: [...groups].map(([key, list]) => ({
            key,
            value: list.join(', '),
            mark: key === activeKey ? ('active' as const) : undefined,
          })),
        },
      },
    ],
  });

  for (let i = 0; i < words.length; i += 1) {
    const key = [...words[i]].sort().join(''); // @key

    yield {
      state: view(i, key),
      at: 'key',
      note: `Слово «${words[i]}» → канонический вид «${key}».`,
      metrics: { reads: 1 },
    };

    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(words[i]); // @append
      yield {
        state: view(i, key),
        at: 'append',
        note: `Такой ключ уже есть — «${words[i]}» падает в существующую группу.`,
        metrics: { writes: 1 },
      };
    } else {
      groups.set(key, [words[i]]); // @create
      yield {
        state: view(i, key),
        at: 'create',
        note: `Ключа «${key}» ещё не было — заводим новую группу.`,
        metrics: { writes: 1 },
        memoryPeak: groups.size,
      };
    }
  }

  return [...groups.values()];
}
// #endregion

export const groupAnagrams = (words: readonly string[]): string[][] =>
  runTrace(traceGroupAnagrams(words));

export default defineAlgo({
  meta: {
    slug: 'group-anagrams',
    title: 'Группировка анаграмм',
    topic: 'hash-tables',
    summary: 'Разложить слова по группам так, чтобы в группе были перестановки одних и тех же букв.',
    complexity: { time: 'O(n · k log k)', space: 'O(n · k)', growth: 'O(n log n)' },
    difficulty: 'medium',
    leetcode: { id: 49, title: 'group-anagrams' },
    tags: ['хеш-таблица', 'канонический вид', 'группировка'],
  },
  raw,
  presets: [
    {
      label: '["eat","tea","tan","ate","nat","bat"]',
      args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']] as const,
      hint: 'Классика: три группы, видно как ключи переиспользуются.',
    },
    { label: '["a"]', args: [['a']] as const, hint: 'Одно слово — одна группа.' },
    {
      label: '["abc","cba","xyz"]',
      args: [['abc', 'cba', 'xyz']] as const,
      hint: 'Две группы, обе создаются на первых шагах.',
    },
  ],
  trace: traceGroupAnagrams,
  formatResult: (groups) => groups.map((group) => `[${group.join(',')}]`).join(' '),
});
