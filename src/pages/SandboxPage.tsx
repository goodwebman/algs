import { Play, Square } from 'lucide-react';
import { useState } from 'react';

import { CodeEditor } from '@/sandbox/CodeEditor';
import { useSandbox } from '@/sandbox/useSandbox';
import { useProgress } from '@/store/progress';
import { UIButton, cn } from '@/ui';

const FREE_SLUG = '__sandbox__';

const STARTER = `// Свободная песочница. Код исполняется в отдельном потоке,
// поэтому бесконечный цикл не повесит вкладку — он прервётся по таймауту.
//
// Всё, что вернёт default-экспорт, покажется как результат.
// console.log попадёт в панель вывода.

const twoSum = (nums, target) => {
  const seen = new Map();

  for (let i = 0; i < nums.length; i += 1) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }

  return null;
};

export default function main() {
  console.log('проверяем...');
  return twoSum([2, 7, 11, 15], 9);
}
`;

const SandboxPage = () => {
  const draft = useProgress((state) => state.drafts[FREE_SLUG]);
  const saveDraft = useProgress((state) => state.saveDraft);
  const code = draft ?? STARTER;

  const sandbox = useSandbox();
  const [ran, setRan] = useState(false);
  const running = sandbox.status === 'running';

  const run = () => {
    setRan(true);
    sandbox.runFree(code);
  };

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-3xl font-bold">Песочница</h1>
        <p className="mt-2 max-w-[70ch] text-muted-foreground">
          Обычный ES-модуль на JavaScript. Работают <code className="font-mono">import</code> из других
          модулей нет, зато есть всё остальное. Сеть заблокирована — код исполняется только локально.
        </p>
      </header>

      <CodeEditor
        value={code}
        onChange={(value) => saveDraft(FREE_SLUG, value)}
        minHeight="26rem"
        ariaLabel="Свободная песочница"
      />

      <div className="flex flex-wrap items-center gap-2">
        <UIButton onClick={run} loading={running} disabled={running}>
          <Play size={16} aria-hidden="true" />
          Запустить
        </UIButton>
        {running && (
          <UIButton variant="outline" onClick={sandbox.stop}>
            <Square size={16} aria-hidden="true" />
            Стоп
          </UIButton>
        )}
        <UIButton variant="ghost" onClick={() => saveDraft(FREE_SLUG, STARTER)} disabled={running}>
          Вернуть пример
        </UIButton>
      </div>

      {sandbox.status === 'timeout' && (
        <p role="status" className="rounded-md bg-warning/15 px-3 py-2 text-sm text-warning-emphasis">
          Прервано по таймауту — код не завершился за 3 секунды. Вкладка при этом жива.
        </p>
      )}

      {sandbox.failure && (
        <p role="status" className="rounded-md bg-destructive/15 px-3 py-2 text-sm text-destructive-emphasis">
          <span className="font-semibold">Ошибка: </span>
          <span className="font-mono text-xs">{sandbox.failure}</span>
        </p>
      )}

      {sandbox.execValue && (
        <div className="rounded-md border border-border bg-card/50 px-3 py-2">
          <p className="text-xs text-muted-foreground">
            результат ({sandbox.execValue.durationMs.toFixed(2)} мс)
          </p>
          <p className="mt-1 font-mono text-sm break-all">{sandbox.execValue.value}</p>
        </div>
      )}

      <div>
        <p className="mb-1 text-sm font-semibold">Вывод</p>
        <pre
          className={cn(
            'max-h-72 min-h-20 overflow-auto rounded-lg border border-border bg-background/60 p-3 font-mono text-xs',
            !sandbox.output.length && 'text-muted-foreground',
          )}
        >
          {sandbox.output.length
            ? sandbox.output.map((line, index) => (
                <div
                  key={index}
                  className={cn(
                    line.level === 'error' && 'text-destructive-emphasis',
                    line.level === 'warn' && 'text-warning-emphasis',
                  )}
                >
                  {line.text}
                </div>
              ))
            : ran
              ? 'console.log ничего не вывел'
              : 'console.log появится здесь'}
        </pre>
      </div>
    </div>
  );
};

export default SandboxPage;
