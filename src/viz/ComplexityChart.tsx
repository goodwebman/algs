import { useMemo, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { axisProps, ChartFrame, ChartLegend, ChartTooltip } from './ChartFrame';
import { GRID_COLOR, GROWTH_COLOR, GROWTH_FN, GROWTH_KEYS, type GrowthKey } from './chart-palette';
import { useReducedMotion } from '@/ui/lib/use-reduced-motion';
import { cn } from '@/ui';

const formatOps = (value: number) => {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}·10¹²`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)} млрд`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)} млн`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)} тыс`;
  return value.toFixed(value < 10 ? 1 : 0);
};

interface ComplexityChartProps {
  /** Какие классы показать. По умолчанию все шесть. */
  keys?: readonly GrowthKey[];
  /** Максимальное n на оси. */
  maxN?: number;
  title?: string;
  description?: string;
}

/**
 * Кривые роста.
 *
 * Линейная шкала показывает, насколько катастрофически расходятся классы;
 * логарифмическая — что O(1) и O(log n) вообще-то тоже разные, чего на
 * линейной не видно (обе прижаты к нулю). Поэтому переключатель обязателен:
 * один график из двух врёт в любую сторону.
 */
export const ComplexityChart = ({
  keys = GROWTH_KEYS,
  maxN = 64,
  title = 'Как растёт число операций',
  description = 'Один и тот же вход, разные классы сложности.',
}: ComplexityChartProps) => {
  const [logScale, setLogScale] = useState(true);
  const reducedMotion = useReducedMotion();

  const data = useMemo(() => {
    const points = [];
    // Шаг не единичный: 64 точки рисуются мгновенно, а на 2^n дальше 40
    // числа выходят за пределы double и кривая обрывается мусором.
    const step = Math.max(1, Math.round(maxN / 48));
    for (let n = 1; n <= maxN; n += step) {
      const row: Record<string, number> = { n };
      for (const key of keys) {
        const value = GROWTH_FN[key](n);
        if (Number.isFinite(value) && value < 1e15) row[key] = value;
      }
      points.push(row);
    }
    return points;
  }, [keys, maxN]);

  return (
    <ChartFrame
      title={title}
      description={description}
      controls={
        <button
          type="button"
          onClick={() => setLogScale((value) => !value)}
          className={cn(
            'cursor-pointer rounded-md border border-border px-2.5 py-1 text-xs transition-colors hover:bg-muted',
            logScale && 'border-primary/60 bg-primary/10',
          )}
        >
          шкала Y: {logScale ? 'логарифмическая' : 'линейная'}
        </button>
      }
      legend={<ChartLegend items={keys.map((key) => ({ name: key, color: GROWTH_COLOR[key] }))} />}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="n" {...axisProps} label={undefined} />
          <YAxis
            {...axisProps}
            scale={logScale ? 'log' : 'linear'}
            domain={logScale ? [1, 'auto'] : [0, 'auto']}
            allowDataOverflow
            tickFormatter={formatOps}
            width={54}
          />
          <Tooltip
            cursor={{ stroke: 'var(--muted-foreground)', strokeDasharray: '3 3' }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <ChartTooltip
                  title={`n = ${label}`}
                  rows={payload
                    .slice()
                    .sort((a, b) => Number(b.value) - Number(a.value))
                    .map((item) => ({
                      name: String(item.dataKey),
                      color: String(item.color),
                      value: formatOps(Number(item.value)),
                    }))}
                />
              ) : null
            }
          />
          {keys.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={GROWTH_COLOR[key]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              isAnimationActive={!reducedMotion}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
};
