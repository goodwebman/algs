import type { TestCase } from '@/sandbox/types';

export interface TaskBench {
  sizes: readonly number[];
  /**
   * Исходник функции `(n) => unknown[]` в виде строки — она уезжает в воркер,
   * а функции через postMessage не передаются. Строится массив аргументов
   * размера n для замера роста времени.
   */
  makeArgsSource: string;
  /** С какими теоретическими кривыми сравнивать замер. */
  compareWith: readonly ('O(n)' | 'O(n log n)' | 'O(n²)' | 'O(log n)')[];
}

export interface TaskDefinition {
  slug: string;
  title: string;
  topic: string;
  /** Условие задачи. Поддерживает переносы строк, показывается как есть. */
  prompt: string;
  /** Имя функции, которую ждём от решения. */
  exportName: string;
  starter: string;
  /** Эталонное решение — открывается по кнопке, а не сразу. */
  solution: string;
  cases: readonly TestCase[];
  bench?: TaskBench;
  hints?: readonly string[];
}

export const defineTask = (task: TaskDefinition): TaskDefinition => task;
