import type { MarkKind, PointerTone } from './types';

/**
 * Единственное место, где роль ячейки превращается в цвет.
 * Ни один рендерер не хардкодит палитру — иначе перекрасить визуализации
 * означало бы обойти девять компонентов.
 */
export const MARK_BG: Record<MarkKind, string> = {
  active: 'bg-viz-active/25 border-viz-active text-foreground',
  compare: 'bg-viz-compare/20 border-viz-compare text-foreground',
  swap: 'bg-viz-swap/25 border-viz-swap text-foreground',
  visited: 'bg-viz-visited/15 border-viz-visited/60 text-muted-foreground',
  done: 'bg-viz-done/25 border-viz-done text-foreground',
  target: 'bg-viz-target/30 border-viz-target text-foreground',
  excluded: 'bg-transparent border-border/40 text-muted-foreground/50 line-through',
};

export const MARK_FILL: Record<MarkKind, string> = {
  active: 'var(--viz-active)',
  compare: 'var(--viz-compare)',
  swap: 'var(--viz-swap)',
  visited: 'var(--viz-visited)',
  done: 'var(--viz-done)',
  target: 'var(--viz-target)',
  excluded: 'var(--viz-idle)',
};

/** Подписи ролей — для легенды и для screen reader'ов. */
export const MARK_LABEL: Record<MarkKind, string> = {
  active: 'текущий',
  compare: 'сравнивается',
  swap: 'обмен',
  visited: 'обработан',
  done: 'на месте',
  target: 'ответ',
  excluded: 'отброшен',
};

export const POINTER_COLOR: Record<PointerTone, string> = {
  l: 'var(--viz-pointer-l)',
  r: 'var(--viz-pointer-r)',
  scan: 'var(--viz-active)',
  aux: 'var(--viz-window)',
};

export const IDLE_CELL = 'bg-muted/40 border-border text-foreground';
