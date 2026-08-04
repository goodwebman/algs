/**
 * Ядро трассировки.
 *
 * Каждый алгоритм в учебнике написан ОДИН раз — как генератор, который на
 * интересных местах отдаёт снимок состояния. Из того же генератора получается
 * обычная функция (`runTrace`), которую гоняют юнит-тесты. Поэтому код в
 * статье, код в анимации и код под тестами физически один и тот же —
 * разойтись им негде.
 */

/** Счётчики, которые плеер показывает в реальном времени. */
export interface Metrics {
  /** Сравнений элементов. */
  comparisons: number;
  /** Обменов/перестановок. */
  swaps: number;
  /** Чтений из структуры. */
  reads: number;
  /** Записей в структуру. */
  writes: number;
  /** Пик дополнительной памяти в «элементах» (не в байтах — важен порядок). */
  extraMemory: number;
}

export const emptyMetrics = (): Metrics => ({
  comparisons: 0,
  swaps: 0,
  reads: 0,
  writes: 0,
  extraMemory: 0,
});

/** Один шаг алгоритма. */
export interface Step<S> {
  /** Снимок состояния для рендерера. Должен быть иммутабельным. */
  state: S;
  /**
   * Имя якоря в исходнике (`// @compare` в конце строки) — подсвечиваемая
   * строка вычисляется из него. Именно якорь, а не номер строки: номера
   * разъезжаются при первой же правке кода, якорь живёт внутри той строки,
   * к которой относится.
   */
  at?: string;
  /** Что происходит — человеческим языком, показывается под визуализацией. */
  note: string;
  /** Прирост счётчиков на этом шаге (не абсолютные значения). */
  metrics?: Partial<Metrics>;
  /** Пик доп. памяти — не приращение, а текущее значение. */
  memoryPeak?: number;
}

export type AlgoTrace<S, R> = Generator<Step<S>, R, void>;

/** Материализованный кадр: шаг + накопленные метрики + позиция. */
export interface Frame<S> extends Step<S> {
  index: number;
  totals: Metrics;
}

export interface TraceRun<S, R> {
  frames: Frame<S>[];
  result: R;
  /** true, если генератор упёрся в лимит шагов и был оборван. */
  truncated: boolean;
}

/**
 * Предохранитель: учебные входы дают десятки—сотни шагов. Если генератор
 * выдал больше, это почти наверняка бесконечный цикл в коде алгоритма —
 * обрываем, иначе повесим вкладку прямо на рендере страницы.
 */
export const MAX_STEPS = 20_000;

/** Прогоняет генератор до конца и отдаёт только результат. */
export const runTrace = <S, R>(gen: AlgoTrace<S, R>): R => {
  let steps = 0;
  let next = gen.next();

  while (!next.done) {
    if (++steps > MAX_STEPS) {
      throw new Error(`Трассировка превысила ${MAX_STEPS} шагов — похоже на бесконечный цикл`);
    }
    next = gen.next();
  }

  return next.value;
};

/**
 * Материализует всю трассировку в массив кадров.
 *
 * Кадры считаются один раз и хранятся целиком — поэтому «шаг назад» и
 * перемотка слайдером стоят O(1) и всегда возвращают ровно то состояние,
 * которое было. Альтернатива (перезапуск генератора с нуля до нужного шага)
 * дала бы O(n) на каждое движение ползунка и рассинхрон при любом
 * недетерминизме.
 */
export const collectFrames = <S, R>(gen: AlgoTrace<S, R>): TraceRun<S, R> => {
  const frames: Frame<S>[] = [];
  const totals = emptyMetrics();
  let truncated = false;

  let next = gen.next();
  while (!next.done) {
    const step = next.value;

    if (step.metrics) {
      totals.comparisons += step.metrics.comparisons ?? 0;
      totals.swaps += step.metrics.swaps ?? 0;
      totals.reads += step.metrics.reads ?? 0;
      totals.writes += step.metrics.writes ?? 0;
    }
    if (step.memoryPeak !== undefined) {
      totals.extraMemory = Math.max(totals.extraMemory, step.memoryPeak);
    }

    frames.push({ ...step, index: frames.length, totals: { ...totals } });

    if (frames.length >= MAX_STEPS) {
      truncated = true;
      break;
    }
    next = gen.next();
  }

  // Если оборвали по лимиту — результата у нас нет, но и врать нельзя.
  const result = (next.done ? next.value : undefined) as R;
  return { frames, result, truncated };
};
