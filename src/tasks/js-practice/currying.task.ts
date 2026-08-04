import { defineTask } from '../types';

export default defineTask({
  slug: 'currying',
  title: 'Функциональный калькулятор',
  topic: 'js-practice',
  prompt:
    'Классическая задача на замыкания и каррирование.\n' +
    'Нужно, чтобы работало: seven(plus(five())) === 12 и four(minus(nine())) === -5.\n\n' +
    'Экспортируй calc(expression) — принимает строку вида "seven plus five"\n' +
    'и возвращает число. Внутри реализуй числа как функции и операции как каррированные.',
  exportName: 'calc',
  starter: `// Число вызывается двумя способами:
//   five()          → просто 5
//   five(plus(3))   → 3 + 5  ... или 5 + 3? Подумай, что придёт в аргументе.

function makeNumber(value) {}

function plus(b) {}
function minus(b) {}

export function calc(expression) {
  const [leftWord, opWord, rightWord] = expression.split(' ');
  // Собери из слов вызов вида left(op(right()))
}
`,
  solution: `const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

// Число — функция: без аргумента возвращает себя,
// с операцией применяет её к себе.
const makeNumber = (value) => (operation) => (operation ? operation(value) : value);

// Операция каррирована: сначала получает ПРАВЫЙ операнд (аргумент внешнего вызова),
// потом ЛЕВЫЙ (значение числа, которое её вызвало).
const plus = (b) => (a) => a + b;
const minus = (b) => (a) => a - b;

const NUMBERS = WORDS.map((_, index) => makeNumber(index));
const OPERATIONS = { plus, minus };

export function calc(expression) {
  const [leftWord, opWord, rightWord] = expression.split(' ');

  const left = NUMBERS[WORDS.indexOf(leftWord)];
  const right = NUMBERS[WORDS.indexOf(rightWord)];
  const operation = OPERATIONS[opWord];

  // seven(plus(five())) — right() даёт 5, plus(5) даёт (a) => a + 5,
  // seven применяет это к 7.
  return left(operation(right()));
}
`,
  cases: [
    { name: 'сложение', args: ['seven plus five'], expected: 12 },
    // Порядок операндов: four(minus(nine())) это 4 - 9, а не 9 - 4
    { name: 'вычитание — порядок важен', args: ['four minus nine'], expected: -5 },
    { name: 'вычитание положительное', args: ['nine minus four'], expected: 5 },
    { name: 'с нулём', args: ['zero plus three'], expected: 3 },
    { name: 'ноль справа', args: ['eight minus zero'], expected: 8 },
    { name: 'одинаковые числа', args: ['five minus five'], expected: 0 },
  ],
  hints: [
    'Число — это функция: five() возвращает 5, five(op) применяет операцию.',
    'Операция каррирована: plus(b) возвращает (a) => a + b.',
    'Проверь порядок в minus: four(minus(nine())) должно дать 4 - 9 = -5, не 5.',
  ],
});
