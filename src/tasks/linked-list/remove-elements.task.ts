import { testTask } from '../test-derived';

export default testTask({
  slug: 'remove-elements',
  title: 'Удаление узлов по значению',
  topic: 'linked-list',
  prompt: 'Удаляй из списка все узлы со значением val и верни новую голову.',
  exportName: 'removeElements',
  solution: `export function removeElements(head, val) {
  const dummy = { val: 0, next: head };
  let current = dummy;
  while (current.next !== null) {
    if (current.next.val === val) current.next = current.next.next;
    else current = current.next;
  }
  return dummy.next;
}
`,
  cases: [
    { name: 'удалить несколько', args: [{ val: 1, next: { val: 2, next: { val: 6, next: { val: 3, next: { val: 4, next: { val: 5, next: { val: 6, next: null } } } } } } }, 6], expected: { val: 1, next: { val: 2, next: { val: 3, next: { val: 4, next: { val: 5, next: null } } } } } },
    { name: 'удалить голову', args: [{ val: 7, next: { val: 7, next: { val: 1, next: null } } }, 7], expected: { val: 1, next: null } },
    { name: 'всё удалить', args: [{ val: 2, next: { val: 2, next: null } }, 2], expected: null },
  ],
  hints: ['Фиктивная голова одинаково обрабатывает удаление первого узла.', 'После удаления не двигай current: следующий узел тоже может подойти.'],
});
