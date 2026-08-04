import { IDLE_CELL, MARK_BG } from './marks';
import type { MatrixState } from './types';
import { cn } from '@/ui';

/**
 * Сетка. Работает и как поле (острова, гниющие апельсины), и как DP-таблица —
 * разница только в подписях осей.
 */
export const MatrixView = ({ state }: { state: MatrixState }) => {
  const { grid, marks = {}, rowLabels, colLabels, caption } = state;
  const width = grid[0]?.length ?? 0;

  return (
    <figure className="flex flex-col items-center gap-3">
      <div className="w-full overflow-x-auto">
        <table className="mx-auto w-max border-separate border-spacing-1">
          {colLabels && (
            <thead>
              <tr>
                {rowLabels && <th className="w-8" />}
                {colLabels.slice(0, width).map((label) => (
                  <th key={label} className="font-mono text-[10px] font-medium text-muted-foreground">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {grid.map((row, r) => (
              <tr key={r}>
                {rowLabels && (
                  <th
                    scope="row"
                    className="pr-1 text-right font-mono text-[10px] font-medium text-muted-foreground"
                  >
                    {rowLabels[r]}
                  </th>
                )}
                {row.map((value, c) => {
                  const mark = marks[`${r},${c}`];
                  return (
                    <td
                      key={c}
                      className={cn(
                        'tnum h-9 w-9 rounded-md border-2 text-center align-middle font-mono text-sm transition-colors',
                        mark ? MARK_BG[mark] : IDLE_CELL,
                      )}
                    >
                      {value}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <figcaption className="text-center text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
};
