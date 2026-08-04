import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { BenchPoint } from './types';
import { axisProps, ChartFrame, ChartLegend, ChartTooltip } from '@/viz/ChartFrame';
import { CHART_SERIES, GRID_COLOR, GROWTH_FN } from '@/viz/chart-palette';
import type { GrowthKey } from '@/viz/chart-palette';
import { useReducedMotion } from '@/ui/lib/use-reduced-motion';

const MEASURED_COLOR = CHART_SERIES[0];
const REFERENCE_COLOR = 'var(--muted-foreground)';

const formatMs = (value: number) => (value >= 10 ? `${value.toFixed(0)} мс` : `${value.toFixed(2)} мс`);

interface BenchChartProps {
  points: readonly BenchPoint[];
  compareWith: readonly GrowthKey[];
}

/**
 * Замер против теории.
 *
 * Здесь не шесть равноправных серий, а одна измеренная кривая и несколько
 * опорных — поэтому опорные рисуются приглушённым пунктиром, а не отдельными
 * цветами: иначе глаз читает их как такие же данные.
 *
 * Опорные кривые нормированы так, чтобы пройти через последнюю измеренную
 * точку. Абсолютные значения O-нотации бессмысленны (константа неизвестна),
 * а форма — нет: если замер лёг на O(n²), это видно сразу.
 */
export const BenchChart = ({ points, compareWith }: BenchChartProps) => {
  const reducedMotion = useReducedMotion();

  const data = useMemo(() => {
    if (!points.length) return [];
    const anchor = points[points.length - 1];

    return points.map((point) => {
      const row: Record<string, number> = { n: point.n, measured: point.ms };
      for (const key of compareWith) {
        const scale = anchor.ms / (GROWTH_FN[key](anchor.n) || 1);
        row[key] = GROWTH_FN[key](point.n) * scale;
      }
      return row;
    });
  }, [points, compareWith]);

  if (!data.length) return null;

  return (
    <ChartFrame
      title="Реальное время против теории"
      description="Опорные кривые подогнаны к последней измеренной точке — сравнивать нужно форму, а не абсолютные значения."
      legend={
        <ChartLegend
          items={[
            { name: 'замер', color: MEASURED_COLOR },
            ...compareWith.map((key) => ({ name: key, color: REFERENCE_COLOR, dashed: true })),
          ]}
        />
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: 4 }}>
          <CartesianGrid stroke={GRID_COLOR} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="n" {...axisProps} scale="log" domain={['auto', 'auto']} type="number" />
          <YAxis {...axisProps} tickFormatter={formatMs} width={62} />
          <Tooltip
            cursor={{ stroke: 'var(--muted-foreground)', strokeDasharray: '3 3' }}
            content={({ active, payload, label }) =>
              active && payload?.length ? (
                <ChartTooltip
                  title={`n = ${label}`}
                  rows={payload.map((item) => ({
                    name: item.dataKey === 'measured' ? 'замер' : String(item.dataKey),
                    color: String(item.color),
                    value: formatMs(Number(item.value)),
                  }))}
                />
              ) : null
            }
          />

          {compareWith.map((key) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={REFERENCE_COLOR}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
              activeDot={false}
              isAnimationActive={!reducedMotion}
            />
          ))}

          <Line
            type="monotone"
            dataKey="measured"
            stroke={MEASURED_COLOR}
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 0, fill: MEASURED_COLOR }}
            activeDot={{ r: 5, strokeWidth: 0 }}
            isAnimationActive={!reducedMotion}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
};
