import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Link } from 'react-router';

import { getAlgo } from '@/algorithms/registry';
import { ComplexityChart } from '@/viz/ComplexityChart';
import { TracePlayer } from '@/viz/TracePlayer';
import { Playground } from '@/sandbox/Playground';
import { getTask } from '@/tasks/registry';
import { cn } from '@/ui';

const Missing = ({ what }: { what: string }) => (
  <p className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive-emphasis">
    Не найдено: {what}
  </p>
);

/** Интерактивная визуализация алгоритма прямо в тексте разбора. */
export const Viz = ({ algo }: { algo: string }) => {
  const definition = getAlgo(algo);
  return definition ? <TracePlayer algo={definition} /> : <Missing what={`алгоритм «${algo}»`} />;
};

/** Задача с песочницей прямо в тексте разбора. */
export const Task = ({ slug }: { slug: string }) => {
  const task = getTask(slug);
  return task ? <Playground task={task} /> : <Missing what={`задача «${slug}»`} />;
};

type NoteTone = 'info' | 'warning' | 'trap';

const NOTE_STYLE: Record<NoteTone, string> = {
  info: 'border-info/40 bg-info/8',
  warning: 'border-warning/40 bg-warning/8',
  trap: 'border-destructive/40 bg-destructive/8',
};

const NOTE_TITLE: Record<NoteTone, string> = {
  info: 'Важно',
  warning: 'Осторожно',
  trap: 'Ловушка',
};

export const Note = ({
  tone = 'info',
  title,
  children,
}: {
  tone?: NoteTone;
  title?: string;
  children: ReactNode;
}) => (
  <aside className={cn('my-5 rounded-lg border-l-4 px-4 py-3 text-sm', NOTE_STYLE[tone])}>
    <p className="mb-1 font-semibold">{title ?? NOTE_TITLE[tone]}</p>
    <div className="flex flex-col gap-2 text-muted-foreground">{children}</div>
  </aside>
);

/** Сравнение двух подходов бок о бок — «наивно» против «как надо». */
export const Compare = ({ children }: { children: ReactNode }) => (
  <div className="my-5 grid gap-4 md:grid-cols-2">{children}</div>
);

export { ComplexityChart };

const headingClass = 'scroll-mt-24 font-semibold text-foreground';

export const mdxComponents: MDXComponents = {
  h1: (props) => <h1 {...props} className={cn(headingClass, 'mt-2 mb-4 text-3xl')} />,
  h2: (props) => <h2 {...props} className={cn(headingClass, 'mt-10 mb-3 text-2xl')} />,
  h3: (props) => <h3 {...props} className={cn(headingClass, 'mt-7 mb-2 text-lg')} />,
  h4: (props) => <h4 {...props} className={cn(headingClass, 'mt-5 mb-2 text-base')} />,
  p: (props) => <p {...props} className="my-3 leading-7 text-foreground/90" />,
  ul: (props) => <ul {...props} className="my-3 flex list-disc flex-col gap-1.5 pl-6 text-foreground/90" />,
  ol: (props) => <ol {...props} className="my-3 flex list-decimal flex-col gap-1.5 pl-6 text-foreground/90" />,
  li: (props) => <li {...props} className="leading-7" />,
  strong: (props) => <strong {...props} className="font-semibold text-foreground" />,
  blockquote: (props) => (
    <blockquote {...props} className="my-4 border-l-2 border-primary/60 pl-4 text-muted-foreground italic" />
  ),
  hr: () => <hr className="my-8 border-border" />,
  a: ({ href = '', ...props }: ComponentPropsWithoutRef<'a'>) =>
    href.startsWith('/') ? (
      <Link to={href} {...props} className="text-primary underline underline-offset-2 hover:opacity-80" />
    ) : (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        {...props}
        className="text-primary underline underline-offset-2 hover:opacity-80"
      />
    ),
  code: (props) => (
    <code
      {...props}
      className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[0.875em] text-foreground"
    />
  ),
  pre: (props) => (
    <pre
      {...props}
      className="my-4 overflow-x-auto rounded-lg border border-border bg-background/60 p-3 font-mono text-[13px] leading-6 [&_code]:bg-transparent [&_code]:p-0"
    />
  ),
  table: (props) => (
    <div className="my-5 overflow-x-auto">
      <table {...props} className="w-full border-collapse text-sm" />
    </div>
  ),
  th: (props) => (
    <th {...props} className="border-b border-border px-3 py-2 text-left font-semibold whitespace-nowrap" />
  ),
  td: (props) => <td {...props} className="border-b border-border/50 px-3 py-2 align-top" />,

  Viz,
  Task,
  Note,
  Compare,
  ComplexityChart,
};
