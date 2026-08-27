import { testTask } from '../test-derived';

export default testTask({
  slug: 'evaluate-rpn',
  title: 'Обратная польская запись',
  topic: 'stack',
  prompt: 'Вычисли выражение в обратной польской записи. Операции: +, -, *, /. Деление двух целых усекается к нулю.',
  exportName: 'evalRpn',
  solution: `export function evalRpn(expression) {
  const stack = [];
  for (const token of expression.split(' ')) {
    if (!['+', '-', '*', '/'].includes(token)) {
      stack.push(Number(token));
      continue;
    }
    const right = stack.pop();
    const left = stack.pop();
    if (token === '+') stack.push(left + right);
    if (token === '-') stack.push(left - right);
    if (token === '*') stack.push(left * right);
    if (token === '/') stack.push(Math.trunc(left / right));
  }
  return stack[0];
}
`,
  cases: [
    { name: 'три операции', args: ['2 1 + 3 *'], expected: 9 },
    { name: 'вычитание', args: ['4 13 5 / +'], expected: 6 },
    { name: 'отрицательный результат', args: ['10 6 - 3 /'], expected: 1 },
  ],
  hints: ['Числа кладутся в стек.', 'Оператор снимает сначала правый, затем левый операнд.'],
});
