import { AnimatePresence, motion } from 'motion/react';

import { IDLE_CELL, MARK_BG } from './marks';
import type { HashMapState } from './types';
import { cn } from '@/ui';

/** Содержимое Map/Set/объекта на текущем шаге: ключ → значение. */
export const HashMapView = ({ state }: { state: HashMapState }) => {
  const { entries, label, caption } = state;

  return (
    <figure className="flex w-full flex-col items-center gap-2">
      {label && <p className="font-mono text-xs text-muted-foreground">{label}</p>}

      <div className="flex w-full flex-wrap justify-center gap-1.5">
        <AnimatePresence initial={false}>
          {entries.map((entry) => (
            <motion.div
              key={entry.key}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className={cn(
                'tnum flex items-center gap-1.5 rounded-md border-2 px-2 py-1 font-mono text-xs',
                entry.mark ? MARK_BG[entry.mark] : IDLE_CELL,
              )}
            >
              <span className="text-muted-foreground">{entry.key}</span>
              <span aria-hidden="true" className="opacity-50">
                →
              </span>
              <span className="font-bold">{entry.value}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {entries.length === 0 && <p className="py-2 text-xs text-muted-foreground">пусто</p>}
      </div>

      {caption && <figcaption className="text-center text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
};
