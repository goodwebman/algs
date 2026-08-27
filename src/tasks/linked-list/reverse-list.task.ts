import { testTask } from '../test-derived';

export default testTask({
  slug: 'reverse-list',
  title: 'Разворот связного списка',
  topic: 'linked-list',
  prompt: 'Разверни односвязный список на месте и верни новую голову.',
  exportName: 'reverseList',
  solution: `export function reverseList(head) {
  let previous = null;
  let current = head;
  while (current !== null) {
    const next = current.next;
    current.next = previous;
    previous = current;
    current = next;
  }
  return previous;
}
`,
  cases: [
    { name: 'несколько узлов', args: [{ val: 1, next: { val: 2, next: { val: 3, next: null } } }], expected: { val: 3, next: { val: 2, next: { val: 1, next: null } } } },
    { name: 'один узел', args: [{ val: 5, next: null }], expected: { val: 5, next: null } },
    { name: 'пустой список', args: [null], expected: null },
  ],
  hints: ['Сохрани старый next до переподключения.', 'После разворота previous становится головой.'],
});
