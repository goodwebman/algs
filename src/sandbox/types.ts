import type { CompareStrategy } from './deep-equal';

export interface TestCase {
  name: string;
  args: readonly unknown[];
  expected: unknown;
  compare?: CompareStrategy;
  /** Проверяется, что функция не мутировала входные аргументы. */
  noMutation?: boolean;
}

export interface TestResult {
  name: string;
  passed: boolean;
  /** Готовые к показу строки — значения могут быть не клонируемыми. */
  actual: string;
  expected: string;
  durationMs: number;
  error?: string;
  mutated?: boolean;
}

export interface BenchPoint {
  n: number;
  ms: number;
}

export interface ConsoleLine {
  level: 'log' | 'warn' | 'error';
  text: string;
}

export type WorkerRequest =
  | {
      type: 'run';
      code: string;
      exportName: string;
      cases: readonly TestCase[];
    }
  | {
      type: 'bench';
      code: string;
      exportName: string;
      sizes: readonly number[];
      /** Исходник функции `(n) => unknown[]`, строящей аргументы размера n. */
      makeArgsSource: string;
    }
  /** Свободный запуск: выполнить модуль и показать, что вернул default-экспорт. */
  | { type: 'exec'; code: string };

export type WorkerResponse =
  | { type: 'console'; line: ConsoleLine }
  | { type: 'results'; results: TestResult[] }
  | { type: 'bench'; points: BenchPoint[] }
  | { type: 'exec'; value: string; durationMs: number }
  | { type: 'failure'; message: string };
