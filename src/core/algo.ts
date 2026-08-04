import type { AlgoTrace } from './trace';
import type { VizState } from '@/viz/types';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface AlgoMeta {
  slug: string;
  title: string;
  /** id темы из src/content/topics.ts */
  topic: string;
  /** Одна фраза: что делает алгоритм. Показывается в карточке и в поиске. */
  summary: string;
  complexity: {
    time: string;
    space: string;
    /** Класс роста для графика: с чем сравнивать замеры. */
    growth: GrowthClass;
  };
  difficulty: Difficulty;
  leetcode?: { id: number; title: string };
  /** Ключевые слова для поиска по учебнику. */
  tags?: readonly string[];
}

export type GrowthClass = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(2^n)';

export interface Preset<A extends readonly unknown[]> {
  label: string;
  args: A;
  /** Чем этот вход интересен — почему его стоит прогнать. */
  hint?: string;
}

/**
 * Полное описание алгоритма для учебника.
 *
 * `raw` — исходник самого файла через `?raw`, а не копия кода: листинг под
 * визуализацией физически не может разойтись с тем, что исполняется.
 */
export interface AlgoDefinition<A extends readonly unknown[] = readonly any[], R = unknown> {
  meta: AlgoMeta;
  raw: string;
  presets: readonly Preset<A>[];
  trace: (...args: A) => AlgoTrace<VizState, R>;
  /** Как показать итог под плеером. */
  formatResult?: (result: R) => string;
}

/** Хелпер: сужает типы аргументов пресетов по сигнатуре trace. */
export const defineAlgo = <A extends readonly unknown[], R>(
  def: AlgoDefinition<A, R>,
): AlgoDefinition<A, R> => def;
