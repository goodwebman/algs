import { useMemo } from 'react';

import { layoutGraph } from './layout/graph';
import { MARK_FILL } from './marks';
import type { GraphState } from './types';

const RADIUS = 20;

/** Граф в SVG. Позиции вершин фиксированы структурой — между шагами меняются только цвета. */
export const GraphView = ({ state }: { state: GraphState }) => {
  const { nodes, edges, directed = false, caption } = state;
  const layout = useMemo(() => layoutGraph(nodes, edges), [nodes, edges]);

  if (!nodes.length) {
    return <p className="py-6 text-center text-sm text-muted-foreground">граф пуст</p>;
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
          aria-label="Граф"
        >
          {directed && (
            <defs>
              <marker
                id="graph-arrow"
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0 0 8 4 0 8z" fill="var(--border)" />
              </marker>
            </defs>
          )}

          {edges.map((edge) => {
            const from = layout.points.get(edge.from);
            const to = layout.points.get(edge.to);
            if (!from || !to) return null;

            // Линию укорачиваем на радиус, иначе стрелка утыкается в центр круга.
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const length = Math.hypot(dx, dy) || 1;
            const shrink = RADIUS + (directed ? 6 : 2);
            const x2 = to.x - (dx / length) * shrink;
            const y2 = to.y - (dy / length) * shrink;
            const stroke = edge.mark ? MARK_FILL[edge.mark] : 'var(--border)';

            return (
              <g key={`${edge.from}->${edge.to}`}>
                <line
                  x1={from.x + (dx / length) * RADIUS}
                  y1={from.y + (dy / length) * RADIUS}
                  x2={x2}
                  y2={y2}
                  stroke={stroke}
                  strokeWidth={edge.mark ? 3 : 2}
                  markerEnd={directed ? 'url(#graph-arrow)' : undefined}
                />
                {edge.weight !== undefined && (
                  <text
                    x={(from.x + to.x) / 2}
                    y={(from.y + to.y) / 2 - 6}
                    textAnchor="middle"
                    className="tnum fill-muted-foreground font-mono text-[10px]"
                  >
                    {edge.weight}
                  </text>
                )}
              </g>
            );
          })}

          {nodes.map((node) => {
            const point = layout.points.get(node.id);
            if (!point) return null;
            const fill = node.mark ? MARK_FILL[node.mark] : 'var(--viz-idle)';

            return (
              <g key={node.id}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={RADIUS}
                  fill={fill}
                  fillOpacity={node.mark ? 0.3 : 0.6}
                  stroke={fill}
                  strokeWidth={2}
                />
                <text
                  x={point.x}
                  y={point.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-foreground font-mono text-[11px]"
                >
                  {node.label ?? node.id}
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
