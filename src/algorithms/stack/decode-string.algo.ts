import raw from './decode-string.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { VizState } from '@/viz/types';

// #region show
/**
 * Раскодировать строку вида `3[a2[c]]` → `accaccacc`.
 *
 * Вложенность произвольной глубины — это всегда сигнал «нужен стек или
 * рекурсия». Стек здесь удобнее: он явно хранит «отложенный контекст»
 * каждого незакрытого уровня.
 *
 * На стек кладём пару (накопленная строка снаружи, множитель). При «]»
 * достаём её и склеиваем: снаружи + внутренность × множитель.
 */
export function* traceDecodeString(input: string): AlgoTrace<VizState, string> {
  const chars = [...input];
  const stack: { text: string; count: number }[] = [];
  let current = '';
  let count = 0;

  const view = (index: number, note: string): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: 'вход',
        view: {
          kind: 'array',
          data: chars,
          pointers: [{ name: 'i', index, tone: 'scan' }],
          marks: {
            ...Object.fromEntries(chars.map((_, i) => [i, i < index ? ('visited' as const) : undefined])),
            [index]: 'active',
          },
        },
      },
      {
        title: 'стек отложенных уровней',
        view: { kind: 'stack', items: stack.map((f) => `"${f.text}" × ${f.count}`) },
      },
    ],
    caption: `${note} · собрано: "${current}"${count ? `, множитель ${count}` : ''}`,
  });

  for (let i = 0; i < chars.length; i += 1) {
    const char = chars[i];

    if (char >= '0' && char <= '9') {
      // Множитель может быть многозначным: 12[a] — это count = 12,
      // а не два отдельных числа.
      count = count * 10 + Number(char); // @digit

      yield {
        state: view(i, `цифра «${char}»`),
        at: 'digit',
        note: `Накапливаем множитель: он стал ${count}. Число может быть многозначным.`,
      };
      continue;
    }

    if (char === '[') {
      stack.push({ text: current, count }); // @open
      current = '';
      count = 0;

      yield {
        state: view(i, 'вход в блок'),
        at: 'open',
        note: 'Открылся блок: откладываем внешний контекст на стек и начинаем собирать новый.',
        metrics: { writes: 1 },
        memoryPeak: stack.length,
      };
      continue;
    }

    if (char === ']') {
      const frame = stack.pop()!;
      current = frame.text + current.repeat(frame.count); // @close

      yield {
        state: view(i, 'блок закрыт'),
        at: 'close',
        note: `Блок закрылся: повторили внутренность ${frame.count} раз и приклеили к внешнему контексту.`,
        metrics: { reads: 1, writes: 1 },
      };
      continue;
    }

    current += char; // @letter

    yield {
      state: view(i, `буква «${char}»`),
      at: 'letter',
      note: `Обычный символ — просто добавляем к текущему уровню.`,
    };
  }

  return current;
}
// #endregion

export const decodeString = (input: string): string => runTrace(traceDecodeString(input));

export default defineAlgo({
  meta: {
    slug: 'decode-string',
    title: 'Раскодировать вложенную строку',
    topic: 'stack',
    summary: 'Развернуть запись вида 3[a2[c]] в готовую строку, поддерживая любую вложенность.',
    complexity: { time: 'O(длины результата)', space: 'O(глубины вложенности)', growth: 'O(n)' },
    difficulty: 'medium',
    leetcode: { id: 394, title: 'decode-string' },
    tags: ['стек', 'вложенность', 'парсинг'],
  },
  raw,
  presets: [
    { label: '"3[a]2[bc]"', args: ['3[a]2[bc]'] as const, hint: 'Два блока подряд, без вложенности.' },
    { label: '"3[a2[c]]"', args: ['3[a2[c]]'] as const, hint: 'Вложенность — ради неё и нужен стек.' },
    { label: '"2[abc]3[cd]ef"', args: ['2[abc]3[cd]ef'] as const, hint: 'Хвост без множителя тоже должен попасть в ответ.' },
    { label: '"12[a]"', args: ['12[a]'] as const, hint: 'Двузначный множитель: цифры накапливаются, а не перезаписываются.' },
  ],
  trace: traceDecodeString,
  formatResult: (result) => `"${result}"`,
});
