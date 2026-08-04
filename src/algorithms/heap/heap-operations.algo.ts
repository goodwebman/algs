import raw from './heap-operations.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace, type Step } from '@/core/trace';
import type { MarkKind, VizState } from '@/viz/types';

// #region show
/**
 * Мин-куча: вставка и извлечение минимума.
 *
 * Куча — это «дерево», которого физически не существует. Есть плоский массив,
 * а родственные связи — арифметика по индексу:
 *   родитель узла i  →  (i - 1) / 2
 *   дети узла i      →  2i + 1 и 2i + 2
 *
 * Свойство кучи: родитель не больше любого из детей. Это СЛАБЕЕ сортировки —
 * между братьями порядка нет. Именно поэтому вставка стоит O(log n), а не
 * O(n): чинить нужно только один путь до корня, а не весь массив.
 *
 * Куча не даёт «второй по величине» за O(1) — только минимум. Нужен полный
 * порядок — нужна сортировка.
 */
export function* traceHeapOperations(values: readonly number[]): AlgoTrace<VizState, number[]> {
  const heap: number[] = [];

  const view = (marks: Record<number, MarkKind>, note: string): VizState => ({
    kind: 'heap',
    items: heap,
    marks,
    caption: note,
  });

  /** Просеивание вверх: новый элемент всплывает, пока меньше родителя. */
  function* siftUp(start: number): Generator<Step<VizState>, void, void> {
    let i = start;

    while (i > 0) {
      const parent = Math.floor((i - 1) / 2); // @parent
      if (heap[parent] <= heap[i]) break; // @stop

      [heap[parent], heap[i]] = [heap[i], heap[parent]]; // @swapUp

      yield {
        state: view({ [parent]: 'swap', [i]: 'swap' }, `${heap[parent]} всплыл выше ${heap[i]}`),
        at: 'swapUp',
        note: `${heap[parent]} меньше родителя — меняем местами и поднимаемся выше.`,
        metrics: { comparisons: 1, swaps: 1 },
      };

      i = parent;
    }
  }

  /** Просеивание вниз: корень тонет, пока больше меньшего из детей. */
  function* siftDown(): Generator<Step<VizState>, void, void> {
    let i = 0;

    for (;;) {
      const left = 2 * i + 1;
      const right = 2 * i + 2; // @children
      let smallest = i;

      if (left < heap.length && heap[left] < heap[smallest]) smallest = left;
      if (right < heap.length && heap[right] < heap[smallest]) smallest = right;
      if (smallest === i) break; // @settled

      [heap[i], heap[smallest]] = [heap[smallest], heap[i]]; // @swapDown

      yield {
        state: view({ [i]: 'swap', [smallest]: 'swap' }, `${heap[i]} утонул ниже`),
        at: 'swapDown',
        note: `Родитель больше ребёнка — меняем местами и опускаемся.`,
        metrics: { comparisons: 2, swaps: 1 },
      };

      i = smallest;
    }
  }

  for (const value of values) {
    heap.push(value); // @push

    yield {
      state: view({ [heap.length - 1]: 'active' }, `добавили ${value} в конец`),
      at: 'push',
      note: `${value} кладётся в конец массива — это самый левый свободный лист.`,
      metrics: { writes: 1 },
      memoryPeak: heap.length,
    };

    yield* siftUp(heap.length - 1);
  }

  const sorted: number[] = [];

  while (heap.length > 0) {
    const min = heap[0];

    // Извлечение: корень уходит, на его место встаёт последний лист.
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last; // @extract
      yield {
        state: view({ 0: 'active' }, `извлекли ${min}, наверх встал ${last}`),
        at: 'extract',
        note: `Минимум ${min} извлечён. Последний лист ${last} временно занял корень — теперь его нужно опустить.`,
        metrics: { reads: 1 },
      };
      yield* siftDown();
    }

    sorted.push(min);
  }

  yield {
    state: view({}, `куча опустела · извлечено: [${sorted.join(', ')}]`),
    note: `Извлечение минимумов подряд даёт отсортированный порядок: [${sorted.join(', ')}]. Это heapsort.`,
  };

  return sorted;
}
// #endregion

export const heapSort = (values: readonly number[]): number[] => runTrace(traceHeapOperations(values));

export default defineAlgo({
  meta: {
    slug: 'heap-operations',
    title: 'Мин-куча: вставка и извлечение',
    topic: 'heap',
    summary: 'Дерево, которого не существует: куча живёт в плоском массиве, связи — арифметика по индексу.',
    complexity: { time: 'O(log n) на операцию', space: 'O(n)', growth: 'O(n log n)' },
    difficulty: 'medium',
    tags: ['куча', 'приоритетная очередь', 'просеивание', 'heapsort'],
  },
  raw,
  presets: [
    { label: '[5,3,8,1,9,2]', args: [[5, 3, 8, 1, 9, 2]] as const, hint: 'Смотри на два представления сразу: дерево и массив — это одно и то же.' },
    { label: '[1,2,3,4]', args: [[1, 2, 3, 4]] as const, hint: 'Возрастающий вход: всплытий не происходит вообще.' },
    { label: '[4,3,2,1]', args: [[4, 3, 2, 1]] as const, hint: 'Убывающий: каждый новый элемент всплывает до корня.' },
  ],
  trace: traceHeapOperations,
  formatResult: (sorted) => `[${sorted.join(', ')}]`,
});
