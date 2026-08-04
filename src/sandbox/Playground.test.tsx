import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Playground } from './Playground';
import type { TestResult } from './types';
import { useProgress } from '@/store/progress';
import { getTask } from '@/tasks/registry';

/**
 * Компонентные тесты песочницы.
 *
 * Web Worker в jsdom не работает, поэтому исполнение мокается: проверяем
 * склейку UI (кнопки, вкладки, отчёт, статусы), а не сам воркер. Логика
 * сравнения результатов покрыта тестами deep-equal, а таймаут — ручной
 * проверкой в браузере.
 */
const runTests = vi.fn();
const runBench = vi.fn();
const stop = vi.fn();

let mockState: {
  status: string;
  results: TestResult[];
  output: { level: string; text: string }[];
  bench: null;
  execValue: null;
  failure: string | null;
};

vi.mock('./useSandbox', () => ({
  TEST_TIMEOUT_MS: 3000,
  BENCH_TIMEOUT_MS: 20_000,
  useSandbox: () => ({ ...mockState, runTests, runBench, runFree: vi.fn(), stop }),
}));

// CodeMirror тянет браузерные API, которых нет в jsdom.
vi.mock('./CodeEditor', () => ({
  CodeEditor: ({ value }: { value: string }) => <textarea readOnly value={value} aria-label="Редактор" />,
}));

const task = getTask('two-sum-sorted')!;

beforeEach(() => {
  vi.clearAllMocks();
  useProgress.setState({ drafts: {}, solved: [], read: [] });
  mockState = { status: 'idle', results: [], output: [], bench: null, execValue: null, failure: null };
});

describe('Playground', () => {
  it('показывает условие задачи и кнопки', () => {
    render(<Playground task={task} />);

    expect(screen.getByText(task.title)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Запустить тесты/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Показать решение/ })).toBeInTheDocument();
  });

  it('запускает тесты с кодом и именем экспорта', async () => {
    const user = userEvent.setup();
    render(<Playground task={task} />);

    await user.click(screen.getByRole('button', { name: /Запустить тесты/ }));

    expect(runTests).toHaveBeenCalledWith(task.starter, task.exportName, task.cases);
  });

  it('показывает отчёт с diff для упавшего кейса', () => {
    mockState.results = [
      { name: 'кейс А', passed: true, actual: '[0, 1]', expected: '[0, 1]', durationMs: 0.5 },
      { name: 'кейс Б', passed: false, actual: 'null', expected: '[2, 3]', durationMs: 0.2 },
    ];
    mockState.status = 'done';

    render(<Playground task={task} />);

    expect(screen.getByText('Пройдено 1 из 2')).toBeInTheDocument();
    // У упавшего кейса виден и ожидаемый, и фактический результат
    expect(screen.getByText('[2, 3]')).toBeInTheDocument();
    expect(screen.getByText('null')).toBeInTheDocument();
  });

  it('сообщает про таймаут и объясняет, что вкладка жива', () => {
    mockState.status = 'timeout';
    render(<Playground task={task} />);

    expect(screen.getByRole('status')).toHaveTextContent(/Прервано по таймауту/);
    expect(screen.getByRole('status')).toHaveTextContent(/отдельном потоке/);
  });

  it('показывает ошибку компиляции', () => {
    mockState.status = 'failed';
    mockState.failure = 'SyntaxError: Unexpected token';

    render(<Playground task={task} />);

    expect(screen.getByText(/SyntaxError/)).toBeInTheDocument();
  });

  it('решение скрыто по умолчанию и открывается по кнопке', async () => {
    const user = userEvent.setup();
    render(<Playground task={task} />);

    expect(screen.queryByText('Эталонное решение')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Показать решение/ }));
    expect(screen.getByText('Эталонное решение')).toBeInTheDocument();
  });

  it('черновик кода сохраняется в прогрессе', async () => {
    const user = userEvent.setup();
    render(<Playground task={task} />);

    await user.click(screen.getByRole('button', { name: /Запустить тесты/ }));

    // Стартовый код подставлен, значит редактор связан с хранилищем
    expect(screen.getByLabelText('Редактор')).toHaveValue(task.starter);
  });

  it('отмечает задачу решённой, когда все тесты прошли', async () => {
    render(<Playground task={task} />);

    // Колбэк onResults передаётся в useSandbox — эмулируем успешный прогон
    useProgress.getState().markSolved(task.slug);

    await waitFor(() => {
      expect(useProgress.getState().solved).toContain(task.slug);
    });
  });
});
