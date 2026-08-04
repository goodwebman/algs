import type { ReactNode } from 'react';

import { AXIS_COLOR } from './chart-palette';

export const axisProps = {
  stroke: AXIS_COLOR,
  tick: { fill: AXIS_COLOR, fontSize: 11, fontFamily: 'var(--font-mono)' },
  tickLine: false,
  axisLine: { stroke: 'var(--border)' },
} as const;

interface TooltipRow {
  name: string;
  color: string;
  value: string;
}

/** Единый тултип для всех графиков: значения моноширинно, подписи — текстовым токеном. */
export const ChartTooltip = ({ title, rows }: { title: string; rows: TooltipRow[] }) => (
  <div className="rounded-md border border-border bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur-sm">
    <p className="mb-1 font-mono text-muted-foreground">{title}</p>
    <ul className="flex flex-col gap-0.5">
      {rows.map((row) => (
        <li key={row.name} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: row.color }}
          />
          <span className="text-muted-foreground">{row.name}</span>
          <span className="tnum ml-auto font-mono font-semibold text-foreground">{row.value}</span>
        </li>
      ))}
    </ul>
  </div>
);

/** Легенда: цвет несёт только идентичность, подпись — текстовым токеном. */
export const ChartLegend = ({ items }: { items: { name: string; color: string; dashed?: boolean }[] }) => (
  <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
    {items.map((item) => (
      <li key={item.name} className="flex items-center gap-1.5">
        <svg width="16" height="4" aria-hidden="true">
          <line
            x1="0"
            y1="2"
            x2="16"
            y2="2"
            stroke={item.color}
            strokeWidth="2"
            strokeDasharray={item.dashed ? '4 3' : undefined}
          />
        </svg>
        <span className="font-mono">{item.name}</span>
      </li>
    ))}
  </ul>
);

export const ChartFrame = ({
  title,
  description,
  controls,
  children,
  legend,
}: {
  title: string;
  description?: string;
  controls?: ReactNode;
  children: ReactNode;
  legend?: ReactNode;
}) => (
  <figure className="flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-4">
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {controls}
    </header>
    <div className="h-64 w-full">{children}</div>
    {legend}
  </figure>
);
