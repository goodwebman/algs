import { MARK_FILL, MARK_LABEL, POINTER_COLOR } from './marks';
import type { MarkKind, Pointer, VizState } from './types';

/** Собирает роли и указатели, реально встреченные в трассировке. */
const collect = (states: readonly VizState[]) => {
  const marks = new Set<MarkKind>();
  const pointers = new Map<string, Pointer>();

  const walk = (state: VizState) => {
    switch (state.kind) {
      case 'array':
        for (const pointer of state.pointers ?? []) pointers.set(pointer.name, pointer);
        Object.values(state.marks ?? {}).forEach((m) => m && marks.add(m));
        break;
      case 'matrix':
      case 'stack':
      case 'queue':
      case 'heap':
        Object.values(state.marks ?? {}).forEach((m) => m && marks.add(m));
        break;
      case 'hashmap':
        state.entries.forEach((e) => e.mark && marks.add(e.mark));
        break;
      case 'graph':
        state.nodes.forEach((n) => n.mark && marks.add(n.mark));
        state.edges.forEach((e) => e.mark && marks.add(e.mark));
        break;
      case 'callstack':
        state.frames.forEach((f) => f.mark && marks.add(f.mark));
        break;
      case 'composite':
        state.panels.forEach((p) => walk(p.view));
        break;
      case 'tree':
        break;
    }
  };

  states.forEach(walk);
  return { marks: [...marks], pointers: [...pointers.values()] };
};

/**
 * Легенда строится по всей трассировке, а не по текущему кадру: иначе она
 * дёргается на каждом шаге и читать её невозможно.
 */
export const Legend = ({ states }: { states: readonly VizState[] }) => {
  const { marks, pointers } = collect(states);
  if (!marks.length && !pointers.length) return null;

  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
      {pointers.map((pointer) => (
        <li key={pointer.name} className="flex items-center gap-1.5">
          <svg width="9" height="7" viewBox="0 0 10 7" aria-hidden="true">
            <path d="M5 7 0 0h10z" fill={POINTER_COLOR[pointer.tone ?? 'scan']} />
          </svg>
          <span className="font-mono">{pointer.name}</span>
        </li>
      ))}
      {marks.map((mark) => (
        <li key={mark} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="inline-block h-3 w-3 rounded-sm border-2"
            style={{ borderColor: MARK_FILL[mark], backgroundColor: `color-mix(in oklch, ${MARK_FILL[mark]} 25%, transparent)` }}
          />
          {MARK_LABEL[mark]}
        </li>
      ))}
    </ul>
  );
};
