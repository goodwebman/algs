import { ExternalLink } from 'lucide-react';

import { tokenize, TOKEN_CLASS } from './highlight';
import { getOriginal, githubUrl } from '@/originals/registry';

/**
 * Исходное решение из первой версии репозитория — статичным блоком,
 * без правок под визуализацию.
 *
 * Код в разборе выше переписан в генератор, и это меняет его форму.
 * Здесь видно, как задача была решена изначально.
 */
export const OriginalSource = ({ file, note }: { file: string; note?: string }) => {
  const original = getOriginal(file);

  if (!original) {
    return (
      <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive-emphasis">
        Не найден исходник: {file}
      </p>
    );
  }

  const lines = tokenize(original.code);

  return (
    <figure className="my-5 flex flex-col gap-2">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">Исходное решение</span>
        <a
          href={githubUrl(original.originalPath)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground"
        >
          {original.originalPath}
          <ExternalLink size={12} aria-hidden="true" />
        </a>
      </figcaption>

      {note && <p className="text-sm text-muted-foreground">{note}</p>}

      <div className="overflow-auto rounded-lg border border-border bg-background/60 py-2 font-mono text-[12.5px] leading-[1.55]">
        {lines.map((tokens, index) => (
          <div key={index} className="flex w-max min-w-full gap-3 px-3">
            <span aria-hidden="true" className="tnum w-6 shrink-0 text-right text-muted-foreground/40 select-none">
              {index + 1}
            </span>
            <code className="whitespace-pre">
              {tokens.length === 0
                ? ' '
                : tokens.map((token, i) => (
                    <span key={i} className={TOKEN_CLASS[token.kind]}>
                      {token.text}
                    </span>
                  ))}
            </code>
          </div>
        ))}
      </div>
    </figure>
  );
};
