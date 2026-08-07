import { AnimatePresence, motion } from 'motion/react';

import { IDLE_CELL, MARK_BG, POINTER_COLOR } from './marks';
import type { ArrayState, Pointer } from './types';
import { cn } from '@/ui';

const MAX_BAR_HEIGHT = 120;

/**
 * Стопка указателей над одной ячейкой.
 *
 * Указатели часто сходятся на одном индексе (встреча left и right, slow
 * догнал fast). Каждый рисуется абсолютно, поэтому при совпадении они
 * накладывались бы друг на друга — вместо этого выкладываем их в столбик,
 * а стрелку рисуем только у нижнего: она указывает на ячейку, и двух
 * стрелок в одну точку быть не должно.
 */
const PointerStack = ({ pointers }: { pointers: Pointer[] }) => (
  <div className="pointer-events-none absolute bottom-full left-1/2 flex -translate-x-1/2 flex-col items-center pb-0.5">
    {pointers.map((pointer, index) => (
      <span
        key={pointer.name}
        className="font-mono text-[11px] leading-tight font-bold whitespace-nowrap"
        style={{ color: POINTER_COLOR[pointer.tone ?? 'scan'] }}
      >
        {pointer.name}
        {index === pointers.length - 1 && (
          <svg
            width="10"
            height="6"
            viewBox="0 0 10 6"
            aria-hidden="true"
            className="mx-auto block"
            style={{ color: POINTER_COLOR[pointer.tone ?? 'scan'] }}
          >
            <path d="M5 6 0 0h10z" fill="currentColor" />
          </svg>
        )}
      </span>
    ))}
  </div>
);

/**
 * Массив с указателями, окном и подсветкой ролей ячеек — самый частый
 * рендерер в учебнике: на нём живут два указателя, окно, бинпоиск и сортировки.
 */
export const ArrayView = ({ state }: { state: ArrayState }) => {
  const { data, ids, pointers = [], window: win, marks = {}, bars = false, caption } = state;

  const numeric = data.filter((v): v is number => typeof v === 'number');
  const maxAbs = numeric.length ? Math.max(...numeric.map((v) => Math.abs(v)), 1) : 1;

  // Указатели группируются по индексу: два указателя на одной ячейке — норма
  // (схлопывание в бинпоиске, встреча left и right), и они не должны наезжать.
  const byIndex = new Map<number, Pointer[]>();
  for (const pointer of pointers) {
    const list = byIndex.get(pointer.index) ?? [];
    list.push(pointer);
    byIndex.set(pointer.index, list);
  }

  const outside = pointers.filter((p) => p.index < 0 || p.index >= data.length);
  const maxStack = Math.max(0, ...[...byIndex.values()].map((list) => list.length));

  return (
    <figure className="flex flex-col items-center gap-3">
      {/* Отступ сверху рассчитан на самую высокую стопку указателей:
          у каждого ~14px строки, плюс стрелка. */}
      <div
        className="w-full overflow-x-auto pb-1"
        style={{ paddingTop: `${12 + maxStack * 14}px` }}
      >
        <div className="mx-auto flex w-max items-end gap-1.5 px-2">
          <AnimatePresence initial={false}>
            {data.map((value, index) => {
              const mark = marks[index];
              const inWindow = win && index >= win.from && index <= win.to;
              const cellPointers = byIndex.get(index) ?? [];
              const height = bars
                ? Math.max(6, (Math.abs(Number(value)) / maxAbs) * MAX_BAR_HEIGHT)
                : undefined;

              return (
                <motion.div
                  key={ids?.[index] ?? index}
                  layout
                  transition={{ type: 'spring', stiffness: 320, damping: 30 }}
                  className="relative flex flex-col items-center gap-1"
                >
                  {cellPointers.length > 0 && <PointerStack pointers={cellPointers} />}

                  <div
                    className={cn(
                      'tnum flex items-end justify-center rounded-md border-2 font-mono text-sm transition-colors',
                      bars ? 'w-9 pb-1' : 'h-11 w-11 items-center',
                      mark ? MARK_BG[mark] : IDLE_CELL,
                      inWindow && !mark && 'border-viz-window/70 bg-viz-window/10',
                    )}
                    style={height ? { height } : undefined}
                  >
                    {value}
                  </div>

                  <span className="tnum font-mono text-[10px] text-muted-foreground">{index}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {win && (
        <p className="font-mono text-xs text-viz-window">
          окно [{win.from}…{win.to}], длина {Math.max(0, win.to - win.from + 1)}
        </p>
      )}

      {outside.length > 0 && (
        <p className="font-mono text-xs text-muted-foreground">
          за границей массива: {outside.map((p) => `${p.name}=${p.index}`).join(', ')}
        </p>
      )}

      {caption && <figcaption className="text-center text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
};
