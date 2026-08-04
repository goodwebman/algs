import { AnimatePresence, motion } from 'motion/react';

import { IDLE_CELL, MARK_BG } from './marks';
import type { StackState } from './types';
import { cn } from '@/ui';

/**
 * Стек рисуется снизу вверх — так же, как о нём думают: вершина сверху,
 * push/pop происходят там же. Горизонтальный «стек» путает LIFO с очередью.
 */
export const StackView = ({ state }: { state: StackState }) => {
  const { items, marks = {}, caption } = state;

  return (
    <figure className="flex flex-col items-center gap-3">
      <div className="flex min-h-32 w-full max-w-56 flex-col-reverse items-stretch gap-1 rounded-lg border-2 border-b-4 border-border bg-muted/20 p-2">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map((value, index) => (
            <motion.div
              key={`${index}-${value}`}
              layout
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className={cn(
                'tnum flex items-center justify-between rounded-md border-2 px-2 py-1.5 font-mono text-sm',
                marks[index] ? MARK_BG[marks[index]] : IDLE_CELL,
              )}
            >
              <span className="truncate">{value}</span>
              {index === items.length - 1 && (
                <span className="ml-2 shrink-0 text-[10px] text-viz-active">вершина</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <p className="py-6 text-center text-xs text-muted-foreground">стек пуст</p>
        )}
      </div>
      {caption && <figcaption className="text-center text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
};
