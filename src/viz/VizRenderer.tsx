import { ArrayView } from './ArrayView';
import { CallStackView } from './CallStackView';
import { GraphView } from './GraphView';
import { HashMapView } from './HashMapView';
import { HeapView } from './HeapView';
import { MatrixView } from './MatrixView';
import { QueueView } from './QueueView';
import { StackView } from './StackView';
import { TreeView } from './TreeView';
import type { VizState } from './types';

/**
 * Диспетчер по тегу состояния. Алгоритм не импортирует ни одного компонента,
 * компонент не знает ни одного алгоритма — связь только через `kind`.
 */
export const VizRenderer = ({ state }: { state: VizState }) => {
  switch (state.kind) {
    case 'array':
      return <ArrayView state={state} />;
    case 'matrix':
      return <MatrixView state={state} />;
    case 'stack':
      return <StackView state={state} />;
    case 'queue':
      return <QueueView state={state} />;
    case 'tree':
      return <TreeView state={state} />;
    case 'graph':
      return <GraphView state={state} />;
    case 'heap':
      return <HeapView state={state} />;
    case 'hashmap':
      return <HashMapView state={state} />;
    case 'callstack':
      return <CallStackView state={state} />;
    case 'composite':
      return (
        <div className="flex w-full flex-col gap-5">
          {state.panels.map((panel) => (
            <section key={panel.title} className="flex flex-col gap-2">
              <h4 className="text-center text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                {panel.title}
              </h4>
              <VizRenderer state={panel.view} />
            </section>
          ))}
          {state.caption && (
            <p className="text-center text-sm text-muted-foreground">{state.caption}</p>
          )}
        </div>
      );
  }
};
