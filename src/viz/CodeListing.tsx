import { useEffect, useMemo, useRef } from 'react';

import { tokenize, TOKEN_CLASS } from './highlight';
import { cn } from '@/ui';
import type { ParsedSource } from '@/core/source';

interface CodeListingProps {
  source: ParsedSource;
  /** Подсвечиваемая строка, 1-based. 0 — ничего не подсвечивать. */
  activeLine: number;
}

/**
 * Листинг алгоритма с подсветкой текущей строки.
 *
 * Это не копия кода из статьи, а сам файл алгоритма, импортированный через
 * `?raw` — разойтись с исполняемым кодом он не может физически.
 */
export const CodeListing = ({ source, activeLine }: CodeListingProps) => {
  const lines = useMemo(() => tokenize(source.lines.join('\n')), [source]);
  const activeRef = useRef<HTMLDivElement>(null);

  // Скролл списка к активной строке — синхронизация с внешней системой (DOM),
  // законный эффект. `block: 'nearest'` не дёргает страницу, если строка видна.
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeLine]);

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-background/60 py-2 font-mono text-[13px] leading-6">
      {lines.map((tokens, index) => {
        const lineNumber = index + 1;
        const active = lineNumber === activeLine;

        return (
          <div
            key={lineNumber}
            ref={active ? activeRef : undefined}
            className={cn(
              'flex w-max min-w-full gap-3 px-3 transition-colors',
              active && 'bg-viz-active/12 shadow-[inset_3px_0_0_var(--viz-active)]',
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'tnum w-6 shrink-0 text-right select-none',
                active ? 'text-viz-active' : 'text-muted-foreground/50',
              )}
            >
              {lineNumber}
            </span>
            <code className="whitespace-pre">
              {tokens.length === 0 ? (
                ' '
              ) : (
                tokens.map((token, i) => (
                  <span key={i} className={TOKEN_CLASS[token.kind]}>
                    {token.text}
                  </span>
                ))
              )}
            </code>
          </div>
        );
      })}
    </div>
  );
};
