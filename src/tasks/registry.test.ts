import { describe, expect, it } from 'vitest';

import { tasks } from './registry';
import { compareBy } from '@/sandbox/deep-equal';

/**
 * Проверка ВСЕХ задач разом: эталонное решение обязано проходить собственные
 * тесты, а стартовый код — хотя бы компилироваться.
 *
 * Без этого теста задача с опечаткой в ожидаемом значении выглядит рабочей до
 * тех пор, пока кто-то не решит её правильно и не увидит красный тест на
 * верном ответе. Здесь это ловится сразу.
 *
 * Код задач — обычный JS в виде строки (он предназначен для воркера), поэтому
 * здесь он собирается через `new Function`: убираем `export` и возвращаем
 * нужную функцию.
 */
const compile = (source: string, exportName: string): ((...args: any[]) => unknown) => {
  const body = source.replace(/^\s*export\s+default\s+/gm, 'const __default__ = ').replace(/^\s*export\s+/gm, '');
  const factory = new Function(`${body}\nreturn typeof ${exportName} !== 'undefined' ? ${exportName} : __default__;`);
  return factory() as (...args: any[]) => unknown;
};

describe('реестр задач', () => {
  it('не пустой', () => {
    expect(tasks.size).toBeGreaterThan(0);
  });

  for (const [slug, task] of tasks) {
    describe(slug, () => {
      it('стартовый код синтаксически корректен', () => {
        expect(() => compile(task.starter, task.exportName)).not.toThrow();
      });

      it('есть хотя бы три тест-кейса', () => {
        expect(task.cases.length).toBeGreaterThanOrEqual(3);
      });

      it('эталонное решение проходит все кейсы', async () => {
        const solution = compile(task.solution, task.exportName);
        expect(typeof solution).toBe('function');

        for (const testCase of task.cases) {
          const args = structuredClone(testCase.args) as unknown[];
          const before = testCase.noMutation ? structuredClone(args) : null;
          // await нужен для async-решений (retry, таймауты): воркер их тоже ждёт.
          const actual = await solution(...args);

          expect(
            compareBy(testCase.compare ?? 'deep', actual, testCase.expected),
            `кейс «${testCase.name}»: ожидалось ${JSON.stringify(testCase.expected)}, получено ${JSON.stringify(actual)}`,
          ).toBe(true);

          if (before) {
            expect(args, `кейс «${testCase.name}»: решение мутировало аргументы`).toEqual(before);
          }
        }
      });

      if (task.bench) {
        it('генератор данных для бенчмарка возвращает массив аргументов', () => {
          const makeArgs = new Function(`return (${task.bench!.makeArgsSource});`)() as (n: number) => unknown[];
          const args = makeArgs(8);
          expect(Array.isArray(args)).toBe(true);
          expect(args.length).toBeGreaterThan(0);
        });

        it('эталонное решение отрабатывает на бенч-данных', () => {
          const solution = compile(task.solution, task.exportName);
          const makeArgs = new Function(`return (${task.bench!.makeArgsSource});`)() as (n: number) => unknown[];
          expect(() => solution(...makeArgs(64))).not.toThrow();
        });
      }
    });
  }
});
