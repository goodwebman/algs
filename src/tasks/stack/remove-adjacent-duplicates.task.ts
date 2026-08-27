import { testTask } from '../test-derived';

export default testTask({
  slug: 'remove-adjacent-duplicates',
  title: 'Удаление соседних дубликатов',
  topic: 'stack',
  prompt: 'Удаляй пары одинаковых соседних символов, пока строка не перестанет изменяться.',
  exportName: 'removeDuplicates',
  solution: `export function removeDuplicates(s) {
  const stack = [];
  for (const char of s) {
    if (stack.at(-1) === char) stack.pop();
    else stack.push(char);
  }
  return stack.join('');
}
`,
  cases: [
    { name: 'цепная реакция', args: ['abbaca'], expected: 'ca' },
    { name: 'всё удалилось', args: ['azxxzy'], expected: 'ay' },
    { name: 'нет пар', args: ['abc'], expected: 'abc' },
  ],
  hints: ['Вершина стека — последний символ уже очищенной строки.', 'После pop следующий символ может образовать новую пару.'],
});
