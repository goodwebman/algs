import { Eye, Gauge, Play, RotateCcw, Square } from 'lucide-react';
import { useCallback, useState } from 'react';

import { BenchChart } from './BenchChart';
import { CodeEditor } from './CodeEditor';
import { TestResults } from './TestResults';
import { useSandbox } from './useSandbox';
import type { TestResult } from './types';
import { useProgress } from '@/store/progress';
import type { TaskDefinition } from '@/tasks/types';
import { UIBadge, UIButton, UITabs, cn } from '@/ui';

const STATUS_TEXT: Record<string, string> = {
  running: 'Выполняется…',
  timeout: 'Прервано по таймауту',
  failed: 'Код не запустился',
};

/**
 * Песочница: редактор, прогон тестов и замер производительности.
 *
 * Код исполняется в Web Worker с жёстким таймаутом — бесконечный цикл в
 * решении не вешает вкладку, а честно показывается как «прервано по таймауту».
 */
export const Playground = ({ task }: { task: TaskDefinition }) => {
  const draft = useProgress((state) => state.drafts[task.slug]);
  const solved = useProgress((state) => state.solved.includes(task.slug));
  const saveDraft = useProgress((state) => state.saveDraft);
  const clearDraft = useProgress((state) => state.clearDraft);
  const markSolved = useProgress((state) => state.markSolved);

  const code = draft ?? task.starter;
  const [showSolution, setShowSolution] = useState(false);
  const [tab, setTab] = useState('tests');

  const onResults = useCallback(
    (results: TestResult[]) => {
      if (results.length && results.every((result) => result.passed)) markSolved(task.slug);
    },
    [markSolved, task.slug],
  );

  const sandbox = useSandbox(onResults);
  const running = sandbox.status === 'running';

  const runTests = () => {
    setTab('tests');
    sandbox.runTests(code, task.exportName, task.cases);
  };

  const runBench = () => {
    if (!task.bench) return;
    setTab('bench');
    sandbox.runBench(code, task.exportName, task.bench.sizes, task.bench.makeArgsSource);
  };

  return (
    <section className="flex flex-col gap-4 rounded-xl border border-border bg-card/60 p-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-base font-semibold">
            {task.title}
            {solved && <UIBadge variant="outline">решено</UIBadge>}
          </h3>
          <p className="mt-1 text-sm whitespace-pre-line text-muted-foreground">{task.prompt}</p>
        </div>
      </header>

      <p className="rounded-md bg-muted/40 px-3 py-2 font-mono text-xs text-muted-foreground">
        Экспортируй функцию <span className="text-foreground">{task.exportName}</span> — это обычный
        JavaScript-модуль, TypeScript здесь не компилируется.
      </p>

      <CodeEditor
        value={code}
        onChange={(value) => saveDraft(task.slug, value)}
        ariaLabel={`Решение задачи: ${task.title}`}
      />

      <div className="flex flex-wrap items-center gap-2">
        <UIButton onClick={runTests} loading={running} disabled={running}>
          <Play size={16} aria-hidden="true" />
          Запустить тесты
        </UIButton>

        {task.bench && (
          <UIButton variant="secondary" onClick={runBench} disabled={running}>
            <Gauge size={16} aria-hidden="true" />
            Замерить рост
          </UIButton>
        )}

        {running && (
          <UIButton variant="outline" onClick={sandbox.stop}>
            <Square size={16} aria-hidden="true" />
            Стоп
          </UIButton>
        )}

        <UIButton variant="ghost" onClick={() => clearDraft(task.slug)} disabled={running}>
          <RotateCcw size={16} aria-hidden="true" />
          Сбросить код
        </UIButton>

        <UIButton variant="ghost" onClick={() => setShowSolution((value) => !value)}>
          <Eye size={16} aria-hidden="true" />
          {showSolution ? 'Скрыть решение' : 'Показать решение'}
        </UIButton>
      </div>

      {sandbox.status in STATUS_TEXT && (
        <p
          role="status"
          className={cn(
            'rounded-md px-3 py-2 text-sm',
            sandbox.status === 'running' && 'bg-muted/40 text-muted-foreground',
            sandbox.status === 'timeout' && 'bg-warning/15 text-warning-emphasis',
            sandbox.status === 'failed' && 'bg-destructive/15 text-destructive-emphasis',
          )}
        >
          {STATUS_TEXT[sandbox.status]}
          {sandbox.status === 'timeout' &&
            ' — скорее всего, цикл не завершается. Вкладка при этом жива: код исполнялся в отдельном потоке.'}
          {sandbox.failure && <span className="mt-1 block font-mono text-xs">{sandbox.failure}</span>}
        </p>
      )}

      <UITabs value={tab} onValueChange={setTab}>
        <UITabs.List>
          <UITabs.Tab value="tests">Тесты</UITabs.Tab>
          <UITabs.Tab value="console">Вывод ({sandbox.output.length})</UITabs.Tab>
          {task.bench && <UITabs.Tab value="bench">Рост</UITabs.Tab>}
          {task.hints?.length ? <UITabs.Tab value="hints">Подсказки</UITabs.Tab> : null}
        </UITabs.List>

        <UITabs.Panel value="tests">
          {sandbox.results.length ? (
            <TestResults results={sandbox.results} />
          ) : (
            <p className="py-4 text-sm text-muted-foreground">
              Тестов ещё не было. Всего кейсов: {task.cases.length}.
            </p>
          )}
        </UITabs.Panel>

        <UITabs.Panel value="console">
          {sandbox.output.length ? (
            <pre className="max-h-64 overflow-auto rounded-md bg-background/60 p-3 font-mono text-xs">
              {sandbox.output.map((line, index) => (
                <div
                  key={index}
                  className={cn(
                    line.level === 'error' && 'text-destructive-emphasis',
                    line.level === 'warn' && 'text-warning-emphasis',
                  )}
                >
                  {line.text}
                </div>
              ))}
            </pre>
          ) : (
            <p className="py-4 text-sm text-muted-foreground">
              Пусто. Всё, что выведешь через console.log, попадёт сюда.
            </p>
          )}
        </UITabs.Panel>

        {task.bench && (
          <UITabs.Panel value="bench">
            {sandbox.bench ? (
              <BenchChart points={sandbox.bench} compareWith={task.bench.compareWith} />
            ) : (
              <p className="py-4 text-sm text-muted-foreground">
                Нажми «Замерить рост» — решение прогонится на входах размера{' '}
                {task.bench.sizes.join(', ')} и результат ляжет поверх теоретических кривых.
              </p>
            )}
          </UITabs.Panel>
        )}

        {task.hints?.length ? (
          <UITabs.Panel value="hints">
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-muted-foreground">
              {task.hints.map((hint) => (
                <li key={hint}>{hint}</li>
              ))}
            </ol>
          </UITabs.Panel>
        ) : null}
      </UITabs>

      {showSolution && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold">Эталонное решение</p>
          <pre className="overflow-auto rounded-lg border border-border bg-background/60 p-3 font-mono text-xs">
            {task.solution}
          </pre>
        </div>
      )}
    </section>
  );
};
