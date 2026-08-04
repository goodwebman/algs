import { AnimatePresence, motion } from 'motion/react';

import { IDLE_CELL, MARK_BG } from './marks';
import type { QueueState } from './types';
import { cn } from '@/ui';

/**
 * Очередь: вход справа, выход слева.
 *
 * Если задан `head`, показываем реализацию с указателем — съеденные элементы
 * остаются на месте приглушёнными. Это ровно та картинка, которая объясняет,
 * почему `shift()` даёт O(n), а head-указатель — O(1): в первом случае вся
 * лента физически сдвигается, во втором двигается одна стрелка.
 */
export const QueueView = ({ state }: { state: QueueState }) => {
  const { items, head, marks = {}, caption } = state;
  const start = head ?? 0;
  const live = items.slice(start);

  return (
    <figure className="flex flex-col items-center gap-3">
      <div className="flex w-full items-center gap-2 overflow-x-auto py-1">
        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
          ← dequeue
        </span>

        <div className="flex min-h-12 flex-1 items-center justify-center gap-1 rounded-lg border-2 border-border bg-muted/20 px-2 py-1.5">
          <AnimatePresence initial={false} mode="popLayout">
            {items.map((value, index) => {
              const consumed = index < start;
              return (
                <motion.div
                  key={`${index}-${value}`}
                  layout
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: consumed ? 0.3 : 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  className={cn(
                    'tnum flex h-9 min-w-9 items-center justify-center rounded-md border-2 px-2 font-mono text-sm',
                    consumed && 'border-dashed',
                    marks[index] ? MARK_BG[marks[index]] : IDLE_CELL,
                  )}
                >
                  {value}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {live.length === 0 && <p className="px-4 text-xs text-muted-foreground">очередь пуста</p>}
        </div>

        <span className="shrink-0 font-mono text-[10px] text-muted-foreground">enqueue →</span>
      </div>

      {head !== undefined && (
        <p className="font-mono text-xs text-muted-foreground">
          head = {head}, длина = {live.length} (элементы слева от head не удаляются, указатель просто
          сдвинут)
        </p>
      )}

      {caption && <figcaption className="text-center text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
};
