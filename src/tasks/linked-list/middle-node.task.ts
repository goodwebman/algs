import { testTask } from '../test-derived';

export default testTask({
  slug: 'middle-node',
  title: 'Середина связного списка',
  topic: 'linked-list',
  prompt: 'Верни узел середины односвязного списка. Если узлов два, возвращай второй. Узел имеет поля { val, next }.',
  exportName: 'middleNode',
  solution: `export function middleNode(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}
`,
  cases: [
    { name: 'нечётная длина', args: [{ val: 1, next: { val: 2, next: { val: 3, next: { val: 4, next: { val: 5, next: null } } } } }], expected: { val: 3, next: { val: 4, next: { val: 5, next: null } } } },
    { name: 'чётная длина', args: [{ val: 1, next: { val: 2, next: { val: 3, next: { val: 4, next: null } } } }], expected: { val: 3, next: { val: 4, next: null } } },
    { name: 'один узел', args: [{ val: 7, next: null }], expected: { val: 7, next: null } },
  ],
  hints: ['slow идёт на один шаг, fast — на два.', 'Когда fast дошёл до конца, slow стоит в середине.'],
});
