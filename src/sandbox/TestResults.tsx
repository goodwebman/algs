import { Check, X } from 'lucide-react';

import type { TestResult } from './types';
import { cn } from '@/ui';

/** Отчёт о прогоне: что упало, с чем сравнивали и что получилось. */
export const TestResults = ({ results }: { results: readonly TestResult[] }) => {
  if (!results.length) return null;

  const passed = results.filter((result) => result.passed).length;
  const allPassed = passed === results.length;

  return (
    <div className="flex flex-col gap-2">
      <p
        className={cn(
          'rounded-md px-3 py-2 text-sm font-semibold',
          allPassed ? 'bg-success/15 text-success-emphasis' : 'bg-destructive/15 text-destructive-emphasis',
        )}
        role="status"
      >
        {allPassed
          ? `Все тесты пройдены (${passed}/${results.length})`
          : `Пройдено ${passed} из ${results.length}`}
      </p>

      <ul className="flex flex-col gap-1">
        {results.map((result) => (
          <li
            key={result.name}
            className={cn(
              'rounded-md border px-3 py-2 text-sm',
              result.passed ? 'border-border bg-muted/20' : 'border-destructive/40 bg-destructive/8',
            )}
          >
            <div className="flex items-center gap-2">
              {/* Иконка + текст, а не только цвет: статус не должен читаться исключительно по цвету */}
              {result.passed ? (
                <Check size={15} className="shrink-0 text-success-emphasis" aria-hidden="true" />
              ) : (
                <X size={15} className="shrink-0 text-destructive-emphasis" aria-hidden="true" />
              )}
              <span className="flex-1">{result.name}</span>
              <span className="tnum shrink-0 font-mono text-[11px] text-muted-foreground">
                {result.durationMs.toFixed(2)} мс
              </span>
            </div>

            {!result.passed && (
              <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 font-mono text-xs">
                {result.error ? (
                  <>
                    <dt className="text-muted-foreground">ошибка</dt>
                    <dd className="break-all text-destructive-emphasis">{result.error}</dd>
                  </>
                ) : (
                  <>
                    <dt className="text-muted-foreground">ожидалось</dt>
                    <dd className="break-all text-success-emphasis">{result.expected}</dd>
                    <dt className="text-muted-foreground">получено</dt>
                    <dd className="break-all text-destructive-emphasis">{result.actual}</dd>
                  </>
                )}
                {result.mutated && (
                  <>
                    <dt className="text-muted-foreground">мутация</dt>
                    <dd className="text-warning-emphasis">
                      функция изменила входные аргументы — в этой задаче так нельзя
                    </dd>
                  </>
                )}
              </dl>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
