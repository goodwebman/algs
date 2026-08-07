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
 * На стек кладём два значения: накопленную строку снаружи и множитель.
 * При «]» снимаем их в обратном порядке и склеиваем: снаружи +
 * внутренность × множитель.
 */
export function* traceDecodeString(input: string): AlgoTrace<VizState, string> {
  const chars = [...input];
  // На стек уходят два значения подряд: строка снаружи и её множитель.
  // Отсюда смешанный тип и приведения при pop — цена такой формы стека.
  const stack: (string | number)[] = [];
  let currentStr = '';
  let currentNum = 0;

  // #hide
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
        view: { kind: 'stack', items: stack.map((item) => (typeof item === 'string' ? `"${item}"` : `× ${item}`)) },
      },
    ],
    caption: `${note} · собрано: "${currentStr}"${currentNum ? `, множитель ${currentNum}` : ''}`,
  });
  // #endhide

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];

    if (char >= '0' && char <= '9') {
      // Множитель может быть многозначным: 12[a] — это currentNum = 12,
      // а не два отдельных числа.
      currentNum = currentNum * 10 + Number(char); // @digit

      yield {
        state: view(i, `цифра «${char}»`),
        at: 'digit',
        note: `Накапливаем множитель: он стал ${currentNum}. Число может быть многозначным.`,
      };
      continue;
    }

    if (char === '[') {
      stack.push(currentStr); // @open
      stack.push(currentNum);

      currentStr = '';
      currentNum = 0;

      yield {
        state: view(i, 'вход в блок'),
        at: 'open',
        note: 'Открылся блок: откладываем внешний контекст на стек и начинаем собирать новый.',
        metrics: { writes: 2 },
        memoryPeak: stack.length,
      };
      continue;
    }

    if (char === ']') {
      // Снимаем в обратном порядке: сверху множитель, под ним внешняя строка.
      const num = stack.pop() as number;
      const prevStr = stack.pop() as string;

      currentStr = prevStr + currentStr.repeat(num); // @close

      yield {
        state: view(i, 'блок закрыт'),
        at: 'close',
        note: `Блок закрылся: повторили внутренность ${num} раз и приклеили к внешнему контексту.`,
        metrics: { reads: 2, writes: 1 },
      };
      continue;
    }

    currentStr += char; // @letter

    yield {
      state: view(i, `буква «${char}»`),
      at: 'letter',
      note: `Обычный символ — просто добавляем к текущему уровню.`,
    };
  }

  return currentStr;
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
