import { defineTask } from '../types';

export default defineTask({
  slug: 'valid-parentheses',
  title: 'Правильная скобочная последовательность',
  topic: 'stack',
  prompt:
    'Дана строка из символов ()[]{}.\n' +
    'Верни true, если скобки расставлены правильно и вложены корректно, иначе false.',
  exportName: 'isValidParentheses',
  starter: `export function isValidParentheses(input) {
  // Закрывающая скобка соответствует САМОЙ ПОСЛЕДНЕЙ незакрытой.
  // Открывающую кладём на стек, закрывающую сверяем с вершиной.
  // В конце стек должен быть пуст.
}
`,
  solution: `const PAIRS = { ')': '(', ']': '[', '}': '{' };

export function isValidParentheses(input) {
  const stack = [];

  for (const char of input) {
    if (!PAIRS[char]) {
      stack.push(char);
      continue;
    }

    if (stack.length === 0 || stack.pop() !== PAIRS[char]) return false;
  }

  return stack.length === 0;
}
`,
  cases: [
    { name: 'правильная вложенность', args: ['([{}])'], expected: true },
    { name: 'последовательные', args: ['()[]{}'], expected: true },
    { name: 'пустая строка', args: [''], expected: true },
    { name: 'неправильная вложенность', args: ['([)]'], expected: false },
    { name: 'незакрытые', args: ['((('], expected: false },
    { name: 'лишние закрывающие', args: [')('], expected: false },
    { name: 'одна пара', args: ['()'], expected: true },
    { name: 'незакрытая внутренняя', args: ['([)'], expected: false },
  ],
  hints: [
    'Карта «закрывающая → открывающая» заменяет три if.',
    'Пустой стек при закрывающей — это сразу false, не undefined из pop().',
    'После цикла проверь, что стек пуст: остаток — незакрытые скобки.',
  ],
});
