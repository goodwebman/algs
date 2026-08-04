/**
 * Палитра графиков.
 *
 * Значения НЕ подобраны на глаз и не взяты из токенов интерфейса напрямую:
 * цвета интерфейса Aurora слишком светлые (OKLCH L 0.74–0.88) и на графике
 * сливаются между собой. Эти шесть — те же тона, сведённые в диапазон
 * L 0.48–0.67 и проверенные валидатором: разделимость при дейтеранопии/
 * тританопии ΔE ≥ 8, контраст к поверхности карточки ≥ 3:1.
 *
 * Порядок фиксирован. Слот привязан к сущности (классу сложности), а не к
 * позиции в текущей выборке — если часть кривых скрыть, оставшиеся не
 * перекрашиваются.
 */
export const CHART_SERIES = ['#00b152', '#d446a1', '#cd7d00', '#009ec6', '#9754ed', '#db4241'] as const;

export type GrowthKey = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(2^n)';

export const GROWTH_COLOR: Record<GrowthKey, string> = {
  'O(1)': CHART_SERIES[0],
  'O(log n)': CHART_SERIES[1],
  'O(n)': CHART_SERIES[2],
  'O(n log n)': CHART_SERIES[3],
  'O(n²)': CHART_SERIES[4],
  'O(2^n)': CHART_SERIES[5],
};

/** Сколько «операций» делает алгоритм этого класса на входе размера n. */
export const GROWTH_FN: Record<GrowthKey, (n: number) => number> = {
  'O(1)': () => 1,
  'O(log n)': (n) => Math.log2(Math.max(n, 1)),
  'O(n)': (n) => n,
  'O(n log n)': (n) => n * Math.log2(Math.max(n, 2)),
  'O(n²)': (n) => n * n,
  'O(2^n)': (n) => 2 ** n,
};

export const GROWTH_KEYS = Object.keys(GROWTH_COLOR) as GrowthKey[];

/** Оси и сетка — служебные, они не должны спорить с данными. */
export const AXIS_COLOR = 'var(--muted-foreground)';
export const GRID_COLOR = 'color-mix(in oklch, var(--border) 70%, transparent)';
