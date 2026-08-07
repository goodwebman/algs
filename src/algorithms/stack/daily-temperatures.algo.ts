import raw from './daily-temperatures.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { VizState } from '@/viz/types';

// #region show
/**
 * Через сколько дней станет теплее (монотонный стек).
 *
 * Для каждого дня найти, через сколько дней впервые будет температура выше.
 * Наивно — вложенный цикл, O(n²).
 *
 * Инсайт: держим на стеке индексы дней, ДЛЯ КОТОРЫХ ОТВЕТ ЕЩЁ НЕ НАЙДЕН.
 * Температуры в таком стеке всегда убывают сверху вниз — иначе более
 * тёплый день уже закрыл бы более холодный. Когда приходит новая
 * температура, она закрывает разом все дни на вершине, что холоднее её.
 *
 * Каждый индекс кладётся и снимается ровно один раз → O(n), несмотря на
 * вложенный while.
 */
export function* traceDailyTemperatures(temps: readonly number[]): AlgoTrace<VizState, number[]> {
  const res = new Array<number>(temps.length).fill(0);
  const stack: number[] = [];

  // #hide
  const view = (index: number, note: string): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: 'температуры',
        view: {
          kind: 'array',
          data: temps,
          pointers: [{ name: 'i', index, tone: 'scan' }],
          marks: {
            ...Object.fromEntries(stack.map((i) => [i, 'compare' as const])),
            [index]: 'active',
          },
        },
      },
      {
        title: 'стек дней без ответа (температуры убывают к вершине)',
        view: { kind: 'stack', items: stack.map((i) => `${temps[i]} (день ${i})`) },
      },
      {
        title: 'ответ',
        view: {
          kind: 'array',
          data: res,
          marks: Object.fromEntries(res.map((v, i) => [i, v > 0 ? ('done' as const) : undefined])),
        },
      },
    ],
    caption: note,
  });
  // #endhide

  for (let i = 0; i < temps.length; i++) {
    // Все дни на вершине, что холоднее текущего, закрываются разом.
    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) { // @resolve
      const prevIndex = stack.pop()!;
      res[prevIndex] = i - prevIndex;

      yield {
        state: view(i, `день ${prevIndex} закрыт: ждать ${i - prevIndex}`),
        at: 'resolve',
        note: `${temps[i]} теплее, чем ${temps[prevIndex]} (день ${prevIndex}) — ответ для него ${i - prevIndex}.`,
        metrics: { comparisons: 1, writes: 1 },
      };
    }

    stack.push(i); // @push

    yield {
      state: view(i, `день ${i} ждёт ответа`),
      at: 'push',
      note: `Для дня ${i} (${temps[i]}°) ответ пока неизвестен — кладём на стек.`,
      metrics: { writes: 1 },
      memoryPeak: stack.length,
    };
  }

  yield {
    state: view(Math.max(0, temps.length - 1), 'готово'),
    note: `Дни, оставшиеся на стеке (${stack.length}), так и не дождались тепла — у них 0.`,
  };

  return res;
}
// #endregion

export const dailyTemperatures = (temps: readonly number[]): number[] =>
  runTrace(traceDailyTemperatures(temps));

export default defineAlgo({
  meta: {
    slug: 'daily-temperatures',
    title: 'Монотонный стек: сколько ждать тепла',
    topic: 'stack',
    summary: 'Для каждого дня найти, через сколько дней станет теплее, за один проход.',
    complexity: { time: 'O(n)', space: 'O(n)', growth: 'O(n)' },
    difficulty: 'medium',
    leetcode: { id: 739, title: 'daily-temperatures' },
    tags: ['стек', 'монотонный стек', 'следующий больший элемент'],
  },
  raw,
  presets: [
    { label: '[73,74,75,71,69,72,76,73]', args: [[73, 74, 75, 71, 69, 72, 76, 73]] as const, hint: 'Классика: видно, как 76 закрывает сразу три дня.' },
    { label: '[30,40,50,60]', args: [[30, 40, 50, 60]] as const, hint: 'Возрастающий ряд: стек никогда не растёт больше одного элемента.' },
    { label: '[60,50,40,30]', args: [[60, 50, 40, 30]] as const, hint: 'Убывающий: стек растёт до конца, ответы все нулевые.' },
    { label: '[50,50,50]', args: [[50, 50, 50]] as const, hint: 'Равные температуры не закрывают друг друга — сравнение строгое.' },
  ],
  trace: traceDailyTemperatures,
  formatResult: (result) => `[${result.join(', ')}]`,
});
