import { testTask } from '../test-derived';

export default testTask({
  slug: 'has-cycle',
  title: 'Цикл в связном списке',
  topic: 'linked-list',
  prompt: 'Проверь, есть ли цикл. В тестах список задан как { values, pos }, где pos — индекс узла, на который указывает последний узел, или -1.',
  exportName: 'hasCycle',
  solution: `export function hasCycle(input) {
  const nodes = input.values.map((val) => ({ val, next: null }));
  nodes.forEach((node, index) => { node.next = nodes[index + 1] ?? null; });
  if (input.pos >= 0) nodes[nodes.length - 1].next = nodes[input.pos];
  let slow = nodes[0] ?? null;
  let fast = nodes[0] ?? null;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}
`,
  cases: [
    { name: 'цикл в середину', args: [{ values: [3, 2, 0, -4], pos: 1 }], expected: true },
    { name: 'цикл в голову', args: [{ values: [1, 2], pos: 0 }], expected: true },
    { name: 'без цикла', args: [{ values: [1, 2, 3], pos: -1 }], expected: false },
    { name: 'пустой список', args: [{ values: [], pos: -1 }], expected: false },
  ],
  hints: ['Медленный указатель идёт на один шаг, быстрый на два.', 'При встрече указателей внутри списка цикл доказан.'],
});
