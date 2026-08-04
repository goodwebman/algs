import { AnimatePresence, motion } from 'motion/react';

import { IDLE_CELL, MARK_BG } from './marks';
import { TreeView } from './TreeView';
import type { CallStackState } from './types';
import { cn } from '@/ui';

/**
 * Стек вызовов + дерево вызовов.
 *
 * Стек показывает, сколько кадров держится в памяти одновременно (это ответ
 * про O(глубина) по памяти и про stack overflow), дерево — сколько вызовов
 * сделано всего (это ответ про O(2ⁿ) по времени). Одно без другого объясняет
 * ровно половину.
 */
export const CallStackView = ({ state }: { state: CallStackState }) => {
  const { frames, tree, caption } = state;

  return (
    <figure className="flex w-full flex-col items-center gap-4 lg:flex-row lg:items-start lg:justify-center">
      <div className="w-full max-w-64">
        <p className="mb-1 text-center font-mono text-[11px] text-muted-foreground">
          стек вызовов (глубина {frames.length})
        </p>
        <div className="flex min-h-32 flex-col-reverse gap-1 rounded-lg border-2 border-b-4 border-border bg-muted/20 p-2">
          <AnimatePresence initial={false} mode="popLayout">
            {frames.map((frame) => (
              <motion.div
                key={frame.id}
                layout
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                className={cn(
                  'tnum flex items-center justify-between gap-2 rounded-md border-2 px-2 py-1 font-mono text-xs',
                  frame.mark ? MARK_BG[frame.mark] : IDLE_CELL,
                )}
              >
                <span className="truncate">{frame.label}</span>
                <span className="shrink-0 text-[10px]">
                  {frame.cached && <span className="text-viz-done">из кэша </span>}
                  {frame.returned !== undefined && `→ ${frame.returned}`}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {frames.length === 0 && (
            <p className="py-6 text-center text-xs text-muted-foreground">стек пуст</p>
          )}
        </div>
      </div>

      {tree && (
        <div className="w-full flex-1">
          <p className="mb-1 text-center font-mono text-[11px] text-muted-foreground">дерево вызовов</p>
          <TreeView state={{ root: tree }} />
        </div>
      )}

      {caption && <figcaption className="text-center text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
};
