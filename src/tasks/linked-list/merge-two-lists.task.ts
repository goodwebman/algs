import { testTask } from '../test-derived';

export default testTask({
  slug: 'merge-two-lists',
  title: 'Слияние двух отсортированных списков',
  topic: 'linked-list',
  prompt: 'Слей два отсортированных односвязных списка в один отсортированный список, переиспользуя их узлы.',
  exportName: 'mergeTwoLists',
  solution: `export function mergeTwoLists(list1, list2) {
  const dummy = { val: 0, next: null };
  let current = dummy;
  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      current.next = list1;
      list1 = list1.next;
    } else {
      current.next = list2;
      list2 = list2.next;
    }
    current = current.next;
  }
  current.next = list1 ?? list2;
  return dummy.next;
}
`,
  cases: [
    { name: 'два списка', args: [{ val: 1, next: { val: 2, next: { val: 4, next: null } } }, { val: 1, next: { val: 3, next: { val: 4, next: null } } }], expected: { val: 1, next: { val: 1, next: { val: 2, next: { val: 3, next: { val: 4, next: { val: 4, next: null } } } } } } },
    { name: 'один пустой', args: [null, { val: 0, next: null }], expected: { val: 0, next: null } },
    { name: 'оба пустые', args: [null, null], expected: null },
  ],
  hints: ['Фиктивный узел упрощает подключение головы.', 'На каждом шаге подключай меньшую голову и двигай её список.'],
});
