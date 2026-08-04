import { useMemo } from 'react';

import { layoutTree, NODE_RADIUS } from './layout/tree';
import { MARK_FILL } from './marks';
import type { TreeState } from './types';

/** Дерево в SVG: рёбра линиями, узлы кружками, роль узла — заливкой. */
export const TreeView = ({ state }: { state: TreeState }) => {
  const { root, caption } = state;
  const layout = useMemo(() => layoutTree(root), [root]);

  if (!layout.nodes.length) {
    return <p className="py-6 text-center text-sm text-muted-foreground">дерево пусто</p>;
  }

  return (
    <figure className="flex w-full flex-col items-center gap-3">
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          width={layout.width}
          height={layout.height}
          className="mx-auto max-w-full"
          role="img"
          aria-label="Дерево"
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
            const fill = node.mark ? MARK_FILL[node.mark] : 'var(--viz-idle)';
            return (
              <g key={node.id} style={{ transition: 'opacity 150ms' }}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_RADIUS}
                  fill={fill}
                  fillOpacity={node.mark ? 0.3 : 0.6}
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
      {caption && <figcaption className="text-center text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
};
