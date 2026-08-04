/**
 * Состояния визуализаций.
 *
 * Рендереры не знают ни одного алгоритма — они умеют рисовать «массив с
 * указателями», «сетку», «дерево». Алгоритм, наоборот, не знает ни одного
 * компонента — он отдаёт снимок состояния. Стыкует их тег `kind`.
 */

/** Роль ячейки на текущем шаге. Цвета берутся из --viz-* токенов. */
export type MarkKind =
  | 'active' /* элемент, с которым работаем прямо сейчас */
  | 'compare' /* участвует в сравнении */
  | 'swap' /* меняется местами / перезаписывается */
  | 'visited' /* уже обработан, назад не вернёмся */
  | 'done' /* стоит на финальной позиции */
  | 'target' /* искомое значение / ответ */
  | 'excluded'; /* отброшен (правая половина при бинпоиске) */

/** Тон указателя. Разные тона обязаны отличаться не только цветом, но и подписью. */
export type PointerTone = 'l' | 'r' | 'scan' | 'aux';

export interface Pointer {
  /** Подпись: `left`, `i`, `mid`. Это не декор — по ней читают указатель дальтоники. */
  name: string;
  index: number;
  tone?: PointerTone;
  /** Указатель ушёл за границу массива — рисуем на краю, приглушённо. */
  outOfRange?: boolean;
}

export type Cell = number | string;

export interface ArrayState {
  data: readonly Cell[];
  /**
   * Стабильные идентификаторы элементов. Нужны сортировкам: без них React
   * привяжет ключи к индексам, и обмен двух элементов отрисуется как
   * «значения моргнули на месте» вместо перелёта друг через друга.
   */
  ids?: readonly string[];
  pointers?: readonly Pointer[];
  /** Полуинтервал текущего окна [from, to] включительно. */
  window?: { from: number; to: number } | null;
  /** Индекс → роль. */
  marks?: Readonly<Record<number, MarkKind | undefined>>;
  /** Рисовать столбиками (для сортировок наглядно), а не ячейками. */
  bars?: boolean;
  /** Подпись под массивом: промежуточный результат, сумма и т.п. */
  caption?: string;
}

export interface MatrixState {
  grid: readonly (readonly Cell[])[];
  /** Ключ — `"row,col"`. */
  marks?: Readonly<Record<string, MarkKind | undefined>>;
  rowLabels?: readonly string[];
  colLabels?: readonly string[];
  caption?: string;
}

export interface StackState {
  /** Дно списка — индекс 0, вершина — последний. */
  items: readonly Cell[];
  marks?: Readonly<Record<number, MarkKind | undefined>>;
  caption?: string;
}

export interface QueueState {
  items: readonly Cell[];
  /** Показывать head/tail-указатели (реализация без `shift`). */
  head?: number;
  marks?: Readonly<Record<number, MarkKind | undefined>>;
  caption?: string;
}

export interface TreeNodeView {
  id: string;
  label: string;
  children?: readonly TreeNodeView[];
  mark?: MarkKind;
}

export interface TreeState {
  root: TreeNodeView | null;
  caption?: string;
}

export interface GraphState {
  nodes: readonly { id: string; label?: string; mark?: MarkKind }[];
  edges: readonly { from: string; to: string; weight?: number; mark?: MarkKind }[];
  directed?: boolean;
  caption?: string;
}

export interface HeapState {
  /** Куча всегда живёт в массиве — показываем оба представления сразу. */
  items: readonly number[];
  marks?: Readonly<Record<number, MarkKind | undefined>>;
  caption?: string;
}

export interface HashMapState {
  entries: readonly { key: string; value: Cell; mark?: MarkKind }[];
  label?: string;
  caption?: string;
}

export interface CallStackFrameView {
  id: string;
  label: string;
  /** Значение, которое кадр вернул (если уже вернул). */
  returned?: Cell;
  mark?: MarkKind;
  /** Кадр взят из мемо-кэша, а не посчитан заново. */
  cached?: boolean;
}

export interface CallStackState {
  frames: readonly CallStackFrameView[];
  /** Дерево вызовов целиком — на нём виден взрыв 2ⁿ. */
  tree?: TreeNodeView | null;
  caption?: string;
}

export type VizState =
  | ({ kind: 'array' } & ArrayState)
  | ({ kind: 'matrix' } & MatrixState)
  | ({ kind: 'stack' } & StackState)
  | ({ kind: 'queue' } & QueueState)
  | ({ kind: 'tree' } & TreeState)
  | ({ kind: 'graph' } & GraphState)
  | ({ kind: 'heap' } & HeapState)
  | ({ kind: 'hashmap' } & HashMapState)
  | ({ kind: 'callstack' } & CallStackState)
  | { kind: 'composite'; panels: readonly { title: string; view: VizState }[]; caption?: string };
