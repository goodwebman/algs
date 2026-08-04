/**
 * Человекочитаемое представление значения для отчёта о тестах.
 *
 * `JSON.stringify` здесь не годится: он теряет `undefined`, превращает `NaN`
 * в `null`, роняется на циклических ссылках и на `BigInt`, а Map/Set
 * показывает как пустой объект — то есть ровно в тех случаях, когда и нужен
 * внятный diff.
 */
export const preview = (value: unknown, depth = 0): string => {
  if (depth > 4) return '…';

  if (value === null) return 'null';
  if (value === undefined) return 'undefined';

  switch (typeof value) {
    case 'string':
      return JSON.stringify(value);
    case 'number':
      return Object.is(value, -0) ? '-0' : String(value);
    case 'bigint':
      return `${value}n`;
    case 'boolean':
      return String(value);
    case 'function':
      return `[function ${value.name || 'anonymous'}]`;
    case 'symbol':
      return value.toString();
  }

  if (Array.isArray(value)) {
    const items = value.slice(0, 12).map((item) => preview(item, depth + 1));
    if (value.length > 12) items.push(`…ещё ${value.length - 12}`);
    return `[${items.join(', ')}]`;
  }

  if (value instanceof Date) return value.toISOString();
  if (value instanceof RegExp) return value.toString();
  if (value instanceof Error) return `${value.name}: ${value.message}`;

  if (value instanceof Map) {
    const entries = [...value].slice(0, 8).map(([k, v]) => `${preview(k, depth + 1)} => ${preview(v, depth + 1)}`);
    return `Map(${value.size}) {${entries.join(', ')}}`;
  }

  if (value instanceof Set) {
    const items = [...value].slice(0, 12).map((item) => preview(item, depth + 1));
    return `Set(${value.size}) {${items.join(', ')}}`;
  }

  try {
    const entries = Object.entries(value as Record<string, unknown>)
      .slice(0, 10)
      .map(([key, item]) => `${key}: ${preview(item, depth + 1)}`);
    return `{ ${entries.join(', ')} }`;
  } catch {
    return String(value);
  }
};
