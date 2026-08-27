import { defineTask, type TaskDefinition } from './types';

type TestTaskInput = Omit<TaskDefinition, 'starter'> & { starter?: string };

/** Компактный конструктор для задач, перенесённых из test.js. */
export const testTask = (input: TestTaskInput): TaskDefinition =>
  defineTask({
    ...input,
    starter:
      input.starter ??
      `export function ${input.exportName}(...args) {\n  // Реализуйте задачу.\n}\n`,
  });
