import type { Metrics } from '@/core/trace';

const FIELDS: { key: keyof Metrics; label: string; title: string }[] = [
  { key: 'comparisons', label: 'сравнений', title: 'Сколько раз алгоритм сравнил два элемента' },
  { key: 'swaps', label: 'обменов', title: 'Сколько раз элементы поменялись местами' },
  { key: 'reads', label: 'чтений', title: 'Обращений к элементам структуры' },
  { key: 'writes', label: 'записей', title: 'Записей в структуру' },
  { key: 'extraMemory', label: 'доп. памяти', title: 'Пик дополнительной памяти в элементах' },
];

/**
 * Счётчики в реальном времени.
 *
 * Это единственный способ показать разницу между O(n) и O(n²) не на словах:
 * прогнал два алгоритма на одном входе — увидел 12 сравнений против 78.
 * Поля с нулём скрыты, чтобы не создавать шум там, где метрика неприменима.
 */
export const MetricsBar = ({ metrics }: { metrics: Metrics }) => {
  const shown = FIELDS.filter((field) => metrics[field.key] > 0);
  if (!shown.length) return null;

  return (
    <dl className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
      {shown.map((field) => (
        <div key={field.key} className="flex items-baseline gap-1.5" title={field.title}>
          <dt className="text-xs text-muted-foreground">{field.label}</dt>
          <dd className="tnum font-mono text-sm font-bold text-foreground">{metrics[field.key]}</dd>
        </div>
      ))}
    </dl>
  );
};
