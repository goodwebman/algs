import { testTask } from '../test-derived';

export default testTask({
  slug: 'unique-email-count',
  title: 'Уникальные нормализованные email',
  topic: 'hash-tables',
  prompt: 'В локальной части email удали точки и всё после плюса. Посчитай уникальные адреса.',
  exportName: 'numUniqueEmails',
  solution: `export function numUniqueEmails(emails) {
  const unique = new Set();
  for (const email of emails) {
    const [local, domain] = email.split('@');
    unique.add(local.replaceAll('.', '').split('+')[0] + '@' + domain);
  }
  return unique.size;
}
`,
  cases: [
    { name: 'точки и плюс', args: [['test.email+alex@leetcode.com', 'test.e.mail+bob@leetcode.com']], expected: 1 },
    { name: 'один адрес', args: [['a@b.com', 'a+tag@b.com']], expected: 1 },
    { name: 'разные домены', args: [['a@b.com', 'a@c.com']], expected: 2 },
  ],
  hints: ['Нормализуй адрес до добавления в Set.', 'Плюс обрабатывается только в локальной части.'],
});
