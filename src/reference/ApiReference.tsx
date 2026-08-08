import { Search } from 'lucide-react';
import { memo, useDeferredValue, useMemo, useState } from 'react';

import { API_GROUPS } from './index';
import type { ApiEntry, ApiGroup } from './types';
import { TOKEN_CLASS, tokenize } from '@/viz/highlight';
import { UIAccordion, UIBadge, UIInput, UITabs } from '@/ui';

/** Пример кода с подсветкой. Токенизация кешируется — блоков на странице сотни. */
const CodeBlock = memo(({ code }: { code: string }) => {
  const lines = useMemo(() => tokenize(code), [code]);

  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-background/60 px-3 py-2.5 font-mono text-[12.5px] leading-[1.7]">
      <code>
        {lines.map((tokens, index) => (
          <div key={index}>
            {tokens.length === 0
              ? ' '
              : tokens.map((token, i) => (
                  <span key={i} className={TOKEN_CLASS[token.kind]}>
                    {token.text}
                  </span>
                ))}
          </div>
        ))}
      </code>
    </pre>
  );
});
CodeBlock.displayName = 'CodeBlock';

const EntryCard = memo(({ entry, id }: { entry: ApiEntry; id: string }) => (
  <UIAccordion.Item value={id}>
    <UIAccordion.Trigger className="items-start gap-4 py-3.5">
      <span className="flex min-w-0 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-2">
          <code className="font-mono text-[13px] text-foreground">{entry.sig}</code>
          {entry.mutates && <UIBadge variant="destructive">мутирует</UIBadge>}
          {entry.since && <UIBadge variant="outline">{entry.since}</UIBadge>}
        </span>
        <span className="text-xs font-normal text-muted-foreground">{entry.summary}</span>
      </span>
    </UIAccordion.Trigger>

    <UIAccordion.Content className="flex flex-col gap-3">
      {(entry.returns ?? entry.complexity) && (
        <p className="flex flex-wrap gap-x-5 gap-y-1 text-xs">
          {entry.returns && (
            <span>
              Возвращает: <span className="font-mono text-foreground">{entry.returns}</span>
            </span>
          )}
          {entry.complexity && (
            <span>
              Сложность: <span className="font-mono text-foreground">{entry.complexity}</span>
            </span>
          )}
        </p>
      )}

      {entry.examples.map((example, i) => (
        <CodeBlock key={i} code={example} />
      ))}

      {entry.gotcha && (
        <aside className="rounded-lg border-l-4 border-warning/50 bg-warning/8 px-3 py-2 text-xs">
          <span className="font-semibold text-foreground">Ловушка. </span>
          {entry.gotcha}
        </aside>
      )}
    </UIAccordion.Content>
  </UIAccordion.Item>
));
EntryCard.displayName = 'EntryCard';

const matches = (entry: ApiEntry, query: string): boolean =>
  entry.sig.toLowerCase().includes(query) ||
  entry.summary.toLowerCase().includes(query) ||
  entry.examples.some((example) => example.toLowerCase().includes(query));

/** Группа со списком секций и уже отфильтрованными записями. */
interface FilteredGroup {
  readonly group: ApiGroup;
  readonly sections: readonly { readonly title: string; readonly entries: readonly ApiEntry[] }[];
  readonly total: number;
}

const filterGroup = (group: ApiGroup, query: string): FilteredGroup => {
  const sections = group.sections
    .map((section) => ({
      title: section.title,
      entries: query ? section.entries.filter((entry) => matches(entry, query)) : section.entries,
    }))
    .filter((section) => section.entries.length > 0);

  return { group, sections, total: sections.reduce((sum, s) => sum + s.entries.length, 0) };
};

/**
 * Справочник по встроенным API: вкладки по типам, поиск по всем группам сразу.
 *
 * Пока поле поиска пустое, показывается активная вкладка целиком. Как только
 * в поиске что-то есть — вкладки игнорируются и выводятся совпадения из всех
 * групп: искать `reduce`, стоя на вкладке «Строки», иначе бессмысленно.
 */
export const ApiReference = () => {
  const [activeGroup, setActiveGroup] = useState(API_GROUPS[0].id);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<readonly string[]>([]);

  // ввод не должен дёргаться на перерисовке сотен блоков кода
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());

  const visible = useMemo(() => {
    const groups = deferredQuery
      ? API_GROUPS
      : API_GROUPS.filter((group) => group.id === activeGroup);

    return groups
      .map((group) => filterGroup(group, deferredQuery))
      .filter((filtered) => filtered.total > 0);
  }, [activeGroup, deferredQuery]);

  const found = visible.reduce((sum, filtered) => sum + filtered.total, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <UITabs value={activeGroup} onValueChange={setActiveGroup} className="sm:flex-1">
          <UITabs.List className="flex-wrap">
            {API_GROUPS.map((group) => (
              <UITabs.Tab key={group.id} value={group.id}>
                {group.title}
              </UITabs.Tab>
            ))}
          </UITabs.List>
        </UITabs>

        <div className="sm:w-72">
          <UIInput
            type="search"
            value={query}
            placeholder="Поиск по всем методам…"
            aria-label="Поиск по справочнику"
            leftSlot={<Search className="size-4" />}
            onChange={(e) => { setQuery(e.target.value); }}
          />
        </div>
      </div>

      {deferredQuery && (
        <p className="text-sm text-muted-foreground">
          {found === 0 ? 'Ничего не найдено.' : `Найдено методов: ${found} — по всем группам.`}
        </p>
      )}

      {visible.map(({ group, sections }) => (
        <section key={group.id} className="flex flex-col gap-3">
          <div>
            <h3 className="text-lg font-semibold">{group.title}</h3>
            {!deferredQuery && <p className="mt-1 text-sm text-muted-foreground">{group.intro}</p>}
          </div>

          {sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-1.5">
              <h4 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {section.title}
              </h4>
              <UIAccordion
                strategy="multiple"
                value={open}
                onValueChange={(next) => { setOpen(typeof next === 'string' ? [next] : next); }}
              >
                {section.entries.map((entry) => (
                  <EntryCard key={entry.sig} entry={entry} id={`${group.id}:${entry.sig}`} />
                ))}
              </UIAccordion>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
};
