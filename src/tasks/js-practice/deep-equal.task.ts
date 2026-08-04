import { defineTask } from '../types';

export default defineTask({
  slug: 'deep-equal',
  title: 'Глубокое сравнение',
  topic: 'js-practice',
  prompt:
    'Реализуй deepEqual(a, b) — глубокое сравнение значений.\n\n' +
    'Требования, которые ломают наивные решения:\n' +
    '• NaN равен NaN, но +0 не равен −0;\n' +
    '• порядок ключей объекта не важен;\n' +
    '• массив не равен объекту с числовыми ключами;\n' +
    '• Date и RegExp сравниваются по содержимому;\n' +
    '• циклические ссылки не должны ронять стек.',
  exportName: 'deepEqual',
  starter: `export function deepEqual(a, b, seen = new WeakMap()) {
  // JSON.stringify не подойдёт: теряет undefined, ломается на циклах,
  // превращает NaN в null и зависит от порядка ключей.
  //
  // Начни с Object.is — он правильно обрабатывает NaN и -0.
}
`,
  solution: `export function deepEqual(a, b, seen = new WeakMap()) {
  // Object.is: NaN === NaN даёт true, +0 === -0 даёт false. То что нужно.
  if (Object.is(a, b)) return true;

  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;

  // Циклы: если пару уже видели — считаем совпавшей, иначе бесконечная рекурсия.
  if (seen.get(a) === b) return true;
  seen.set(a, b);

  // Разные прототипы — разные типы. Отсекает массив против объекта.
  if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;

  if (Array.isArray(a)) {
    return a.length === b.length && a.every((item, i) => deepEqual(item, b[i], seen));
  }

  if (a instanceof Date) return a.getTime() === b.getTime();
  if (a instanceof RegExp) return a.source === b.source && a.flags === b.flags;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(
    (key) => Object.prototype.hasOwnProperty.call(b, key) && deepEqual(a[key], b[key], seen),
  );
}
`,
  cases: [
    { name: 'примитивы', args: [1, 1], expected: true },
    { name: 'разные типы', args: [1, '1'], expected: false },
    // JSON.stringify превратил бы оба NaN в null и вернул true случайно
    { name: 'NaN равен NaN', args: [NaN, NaN], expected: true },
    { name: 'вложенные объекты', args: [{ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }], expected: true },
    { name: 'отличие в глубине', args: [{ a: [1, { b: 2 }] }, { a: [1, { b: 3 }] }], expected: false },
    { name: 'порядок ключей не важен', args: [{ a: 1, b: 2 }, { b: 2, a: 1 }], expected: true },
    { name: 'массив не равен объекту', args: [[1, 2], { 0: 1, 1: 2 }], expected: false },
    { name: 'разное число ключей', args: [{ a: 1 }, { a: 1, b: 2 }], expected: false },
    { name: 'Date по содержимому', args: [new Date(0), new Date(0)], expected: true },
    { name: 'разные Date', args: [new Date(0), new Date(1000)], expected: false },
    { name: 'null против объекта', args: [null, {}], expected: false },
    { name: 'пустые объекты', args: [{}, {}], expected: true },
    { name: 'пустые массивы', args: [[], []], expected: true },
  ],
  hints: [
    'Object.is(a, b) в начале решает случаи NaN и ±0 разом.',
    'Object.getPrototypeOf сравнивает «тип» — так массив не совпадёт с объектом.',
    'WeakMap для уже сравнённых пар защищает от циклических ссылок.',
  ],
});
