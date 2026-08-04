import raw from './queue-cost.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace } from '@/core/trace';
import type { VizState } from '@/viz/types';

// #region show
/**
 * Сравнение двух реализаций очереди: через shift() и через head-указатель.
 *
 * shift() не «удаляет первый элемент» — он сдвигает весь хвост на позицию
 * влево. Это O(n) на каждый dequeue, и BFS на n элементах превращается в O(n²).
 *
 * head-указатель ничего не двигает: удалённые элементы остаются в массиве,
 * просто указатель головы сдвигается. Dequeue становится O(1). «Мусор»
 * слева от head не волнует — очередь живут своей жизнью.
 *
 * Платы за память нет: массив того же размера, что и при shift().
 */
export function* traceQueueCost(input: readonly number[]): AlgoTrace<VizState, void> {
  const view = (
    shiftQueue: readonly number[],
    headQueue: readonly number[],
    head: number,
    note: string,
  ): VizState => ({
    kind: 'composite',
    panels: [
      {
        title: 'shift(): каждый dequeue сдвигает весь хвост',
        view: { kind: 'queue', items: shiftQueue, caption: `длина ${shiftQueue.length}` },
      },
      {
        title: 'head-указатель: двигается одна стрелка',
        view: { kind: 'queue', items: headQueue, head, caption: `head = ${head}, живых ${Math.max(0, headQueue.length - head)}` },
      },
    ],
    caption: note,
  });

  const shiftQueue = [...input];
  const headQueue = [...input];
  let head = 0;
  let shiftReads = 0;
  let headReads = 0;
  let shiftWrites = 0;

  for (let step = 0; step < input.length; step += 1) {
    // shift() обязан переписать n-step-1 элементов
    shiftQueue.shift(); // @shift
    shiftReads += input.length - step - 1;
    shiftWrites += input.length - step - 1;

    // head-указатель: одна операция
    head += 1; // @head
    headReads += 1;

    yield {
      state: view(
        shiftQueue,
        headQueue,
        head,
        `шаг ${step + 1}: shift() переписал ${input.length - step - 1} элементов, head — сдвинулся на 1`,
      ),
      at: 'shift',
      note:
        input.length - step - 1 > 5
          ? `shift() переписал ${input.length - step - 1} элементов (хвост уехал влево). head просто сдвинулся — 0 копирований.`
          : `В конце разница невелика, но в начале shift() копировал почти весь массив.`,
      metrics: {
        comparisons: 0,
        reads: shiftReads - headReads,
        writes: shiftWrites,
      },
    };
  }
}
// #endregion

export const queueCost = (input: readonly number[]): void => runTrace(traceQueueCost(input));

export default defineAlgo({
  meta: {
    slug: 'queue-cost',
    title: 'shift() против head-указателя',
    topic: 'queue',
    summary: 'Почему shift() превращает BFS в O(n²) и как head-указатель делает dequeue за O(1).',
    complexity: { time: 'O(1) амортизированно при head-указателе', space: 'O(n)', growth: 'O(n)' },
    difficulty: 'medium',
    tags: ['очередь', 'FIFO', 'производительность', 'shift'],
  },
  raw,
  presets: [
    { label: '10 элементов', args: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]] as const, hint: 'Видно, как shift переписывает почти весь массив на первом шаге.' },
    { label: '5 элементов', args: [[10, 20, 30, 40, 50]] as const, hint: 'Короткая очередь — разница в счётчиках чтений/записей.' },
  ],
  trace: traceQueueCost,
  formatResult: () => 'обе очереди опустошены — но shift() сделал это за O(n²), а head за O(n)',
});
