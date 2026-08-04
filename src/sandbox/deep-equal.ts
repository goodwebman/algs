/**
 * Глубокое сравнение значений — им тест-раннер сверяет фактический результат
 * с ожидаемым.
 *
 * Отличия от наивной версии «сравнить JSON.stringify»:
 * порядок ключей объекта не важен, `NaN` равен `NaN` (иначе тест на среднее
 * от пустого массива никогда не пройдёт), `0` и `-0` различаются, массив не
 * равен объекту с числовыми ключами, `Map`/`Set`/`Date`/`RegExp` сравниваются
 * по содержимому, циклические ссылки не роняют стек.
 */
export const deepEqual = (a: unknown, b: unknown, seen = new WeakMap<object, object>()): boolean => {
  // Object.is отличает NaN/NaN (равны) и +0/-0 (не равны) — то, что нужно
  if (Object.is(a, b)) return true;

  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;

  // Циклы: если пару уже видели, считаем совпавшей — иначе бесконечная рекурсия
  if (seen.get(a) === b) return true;
  seen.set(a, b);

  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

  if (Array.isArray(a)) {
    const other = b as unknown[];
    return a.length === other.length && a.every((item, i) => deepEqual(item, other[i], seen));
  }

  if (a instanceof Date) return a.getTime() === (b as Date).getTime();
  if (a instanceof RegExp) return a.source === (b as RegExp).source && a.flags === (b as RegExp).flags;

  if (a instanceof Map) {
    const other = b as Map<unknown, unknown>;
    if (a.size !== other.size) return false;
    for (const [key, value] of a) {
      if (!other.has(key) || !deepEqual(value, other.get(key), seen)) return false;
    }
    return true;
  }

  if (a instanceof Set) {
    const other = b as Set<unknown>;
    if (a.size !== other.size) return false;
    // Set хранит по значению-ссылке, поэтому для объектов нужен полный перебор
    for (const value of a) {
      if (other.has(value)) continue;
      if (![...other].some((candidate) => deepEqual(value, candidate, seen))) return false;
    }
    return true;
  }

  const keysA = Reflect.ownKeys(a as object).filter((k) => typeof k === 'string');
  const keysB = Reflect.ownKeys(b as object).filter((k) => typeof k === 'string');
  if (keysA.length !== keysB.length) return false;

  return keysA.every(
    (key) =>
      Object.prototype.hasOwnProperty.call(b, key) &&
      deepEqual((a as Record<string, unknown>)[key as string], (b as Record<string, unknown>)[key as string], seen),
  );
};

/** Сравнение без учёта порядка верхнего уровня — для задач вида «вернуть все тройки». */
export const unorderedEqual = (a: unknown, b: unknown): boolean => {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  const rest = [...b];
  return a.every((item) => {
    const index = rest.findIndex((candidate) => deepEqual(item, candidate));
    if (index === -1) return false;
    rest.splice(index, 1);
    return true;
  });
};

/** Сравнение чисел с допуском — для задач на среднее/проценты. */
export const approxEqual = (a: unknown, b: unknown, epsilon = 1e-9): boolean =>
  typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) <= epsilon;

export type CompareStrategy = 'deep' | 'unordered' | 'approx';

export const compareBy = (strategy: CompareStrategy, actual: unknown, expected: unknown): boolean => {
  switch (strategy) {
    case 'unordered':
      return unorderedEqual(actual, expected);
    case 'approx':
      return approxEqual(actual, expected);
    case 'deep':
      return deepEqual(actual, expected);
  }
};
