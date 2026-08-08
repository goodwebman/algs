import { describe, expect, it } from 'vitest';

import { API_GROUPS } from './index';
import { deepEqual } from '@/sandbox/deep-equal';
import type { ApiEntry } from './types';

/**
 * Справочник проверяется исполнением, а не глазами.
 *
 * Каждая строка примера вида `выражение; // → значение` превращается в
 * настоящую проверку равенства и выполняется. Соврать в примере нельзя:
 * ошибочное значение или несуществующий метод роняют тест.
 */

/** `выражение;  // → ожидаемое` — жадная точка ловит последнюю `;` перед комментарием. */
const CHECK_RE = /^(.*);\s*\/\/ → (.+)$/;

/**
 * Строки, которые нельзя обернуть в вызов: объявления, управляющие конструкции,
 * а также продолжения многострочного выражения — `.map(...)` с точки и закрывающая скобка.
 */
const NOT_EXPRESSION_RE = /^\s*(const|let|var|return|function|class|if|else|for|while|do|switch|case|break|continue|throw|import|export|await|[).}\]]|\/\/)/;

/** Прозу после значения отрезаем: `// → 42 — потому что …`. */
const stripProse = (expected: string): string => expected.split(' — ')[0].trim();

const parsesAsExpression = (source: string): boolean => {
  try {
    new Function(`return (${source});`);
    return true;
  } catch {
    return false;
  }
};


/**
 * Переписывает пример в исполняемый код: проверяемые строки — в вызовы `__eq`,
 * остальные остаются как есть (они создают контекст для следующих строк).
 */
const compileExample = (code: string): { source: string; assertions: number } => {
  let assertions = 0;

  const source = code
    .split('\n')
    .map((line) => {
      const match = CHECK_RE.exec(line);
      if (!match || NOT_EXPRESSION_RE.test(line)) return line;

      const expected = stripProse(match[2]);
      if (!parsesAsExpression(expected)) return line;

      assertions += 1;
      return `__eq(${match[1]}, (${expected}), ${JSON.stringify(line.trim())});`;
    })
    .join('\n');

  return { source, assertions };
};

const runExample = (code: string): number => {
  const { source, assertions } = compileExample(code);

  const eq = (actual: unknown, expected: unknown, line: string) => {
    if (!deepEqual(actual, expected)) {
      throw new Error(
        `${line}\n  фактически: ${JSON.stringify(actual) ?? String(actual)}\n  ожидалось:  ${JSON.stringify(expected) ?? String(expected)}`,
      );
    }
  };

  new Function('__eq', source)(eq);
  return assertions;
};

/** Где искать метод: сам объект и его конструктор/прототип — статики и методы экземпляра вперемешку. */
const HOSTS: Record<string, readonly object[]> = {
  'String.prototype': [String.prototype, String],
  'Array.prototype': [Array.prototype, Array],
  Object: [Object, Object.prototype],
  'Set.prototype': [Set.prototype, Set],
  'Map.prototype': [Map.prototype, Map],
  JSON: [JSON],
};

const allEntries: { group: string; section: string; host: string | null; entry: ApiEntry }[] =
  API_GROUPS.flatMap((group) =>
    group.sections.flatMap((section) =>
      section.entries.map((entry) => ({
        group: group.title,
        section: section.title,
        host: section.host,
        entry,
      })),
    ),
  );

describe('справочник по встроенным API', () => {
  it('хосты секций известны', () => {
    const unknown = [...new Set(allEntries.map((e) => e.host))].filter(
      (host) => host !== null && !(host in HOSTS),
    );
    expect(unknown).toEqual([]);
  });

  it('каждый описанный метод существует в рантайме', () => {
    const missing = allEntries
      .filter(({ host, entry }) => {
        if (host === null || entry.key === null) return false;
        return !HOSTS[host].some((candidate) => entry.key! in candidate);
      })
      .map(({ entry }) => entry.sig);

    expect(missing).toEqual([]);
  });

  it('нет дублей сигнатур', () => {
    const sigs = allEntries.map((e) => e.entry.sig);
    expect(sigs.length).toBe(new Set(sigs).size);
  });

  it.each(allEntries.map(({ group, entry }) => [`${group}: ${entry.sig}`, entry] as const))(
    'примеры исполняются и дают обещанный результат — %s',
    (_name, entry) => {
      for (const example of entry.examples) {
        expect(() => runExample(example)).not.toThrow();
      }
    },
  );

  it('в справочнике достаточно проверяемых примеров', () => {
    const assertions = allEntries
      .flatMap(({ entry }) => entry.examples)
      .reduce((sum, example) => sum + compileExample(example).assertions, 0);

    // страховка от «примеров без единого `// →`»: сверяемых строк должно быть много
    expect(assertions).toBeGreaterThan(1000);
  });
});
