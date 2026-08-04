import { useMemo } from 'react';

import { IDLE_CELL, MARK_BG, MARK_FILL } from './marks';
import type { HeapState, TreeNodeView } from './types';
import { layoutTree, NODE_RADIUS } from './layout/tree';
import { cn } from '@/ui';

/** Массив → дерево по правилу «дети узла i лежат в 2i+1 и 2i+2». */
const toTree = (items: readonly number[], index = 0): TreeNodeView | null => {
  if (index >= items.length) return null;
  const children = [toTree(items, 2 * index + 1), toTree(items, 2 * index + 2)].filter(
    (child): child is TreeNodeView => child !== null,
  );
  return { id: String(index), label: String(items[index]), children };
};

/**
 * Куча показывается двумя представлениями сразу — деревом и массивом.
 *
 * Это и есть главный инсайт темы: дерева физически не существует, есть
 * плоский массив, а «дети» — это арифметика по индексу. Пока их рисуют
 * порознь, связь не считывается.
 */
export const HeapView = ({ state }: { state: HeapState }) => {
  const { items, marks = {}, caption } = state;
  const layout = useMemo(() => layoutTree(toTree(items)), [items]);

  return (
    <figure className="flex w-full flex-col items-center gap-4">
      {layout.nodes.length > 0 && (
        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            width={layout.width}
            height={layout.height}
            className="mx-auto max-w-full"
            role="img"
            aria-label="Куча в виде дерева"
          >
            {layout.edges.map((edge) => (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={edge.x1}
                y1={edge.y1}
                x2={edge.x2}
                y2={edge.y2}
                stroke="var(--border)"
                strokeWidth={2}
              />
            ))}
            {layout.nodes.map((node) => {
              const mark = marks[Number(node.id)];
              const fill = mark ? MARK_FILL[mark] : 'var(--viz-idle)';
              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={NODE_RADIUS}
                    fill={fill}
                    fillOpacity={mark ? 0.3 : 0.6}
                    stroke={fill}
                    strokeWidth={2}
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="tnum fill-foreground font-mono text-[11px]"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      )}

      <div className="flex w-full flex-col items-center gap-1">
        <p className="font-mono text-[11px] text-muted-foreground">то же самое в памяти:</p>
        <div className="flex w-full justify-center gap-1 overflow-x-auto pb-1">
          {items.map((value, index) => (
            <div key={index} className="flex flex-col items-center gap-0.5">
              <div
                className={cn(
                  'tnum flex h-9 w-9 items-center justify-center rounded-md border-2 font-mono text-sm',
                  marks[index] ? MARK_BG[marks[index]] : IDLE_CELL,
                )}
              >
                {value}
              </div>
              <span className="tnum font-mono text-[10px] text-muted-foreground">{index}</span>
            </div>
          ))}
          {items.length === 0 && <p className="py-2 text-xs text-muted-foreground">куча пуста</p>}
        </div>
      </div>

      {caption && <figcaption className="text-center text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
};
