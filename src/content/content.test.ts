import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { TOPICS } from './topics';
import { algorithms } from '@/algorithms/registry';
import { tasks } from '@/tasks/registry';

/** Весь текст MDX-страниц одной строкой — для проверки ссылок и вставок. */
const readAllContent = (): string => {
  const root = join(process.cwd(), 'content');
  const chunks: string[] = [];

  for (const topic of readdirSync(root, { withFileTypes: true })) {
    if (!topic.isDirectory()) continue;
    for (const file of readdirSync(join(root, topic.name))) {
      if (file.endsWith('.mdx')) chunks.push(readFileSync(join(root, topic.name, file), 'utf8'));
    }
  }

  return chunks.join('\n');
};

/**
 * Проверка целостности учебника.
 *
 * Ловит рассинхрон между тремя источниками: список тем, файлы алгоритмов,
 * файлы задач и MDX-страницы. Без этого теста легко добавить алгоритм и
 * забыть страницу — на сайте он просто не появится, и никто не заметит.
 */
const contentFiles = import.meta.glob('/content/**/*.mdx');
const contentPaths = new Set(Object.keys(contentFiles));

const topicIds = new Set(TOPICS.map((topic) => topic.id));

describe('целостность учебника', () => {
  it('у каждой темы есть index.mdx', () => {
    const missing = TOPICS.filter((topic) => !contentPaths.has(`/content/${topic.id}/index.mdx`)).map(
      (topic) => topic.id,
    );
    expect(missing).toEqual([]);
  });

  it('порядок тем не содержит дубликатов и пропусков', () => {
    const orders = TOPICS.map((topic) => topic.order).sort((a, b) => a - b);
    expect(orders).toEqual(orders.map((_, i) => i + 1));
  });

  it('каждый алгоритм привязан к существующей теме', () => {
    const orphans = [...algorithms.values()]
      .filter((algo) => !topicIds.has(algo.meta.topic))
      .map((algo) => `${algo.meta.slug} → ${algo.meta.topic}`);
    expect(orphans).toEqual([]);
  });

  it('каждая задача привязана к существующей теме', () => {
    const orphans = [...tasks.values()]
      .filter((task) => !topicIds.has(task.topic))
      .map((task) => `${task.slug} → ${task.topic}`);
    expect(orphans).toEqual([]);
  });

  it('у каждого алгоритма есть страница разбора', () => {
    const missing = [...algorithms.values()]
      .filter((algo) => !contentPaths.has(`/content/${algo.meta.topic}/${algo.meta.slug}.mdx`))
      .map((algo) => `${algo.meta.topic}/${algo.meta.slug}.mdx`);
    expect(missing).toEqual([]);
  });

  it('каждая задача вставлена в какой-то MDX через <Task slug=...>', () => {
    const allText = readAllContent();
    const missing = [...tasks.keys()].filter((slug) => !allText.includes(`slug="${slug}"`));
    expect(missing).toEqual([]);
  });

  it('каждая визуализация в MDX ссылается на существующий алгоритм', () => {
    const referenced = [...readAllContent().matchAll(/<Viz\s+algo="([^"]+)"/g)].map((m) => m[1]);
    const broken = [...new Set(referenced)].filter((slug) => !algorithms.has(slug));
    expect(broken).toEqual([]);
  });

  it('внутренние ссылки в MDX ведут на существующие темы и разборы', () => {
    const links = [...readAllContent().matchAll(/\]\(\/t\/([a-z-]+)(?:\/([a-z-]+))?\)/g)];
    const broken = links
      .filter(([, topic, slug]) => !topicIds.has(topic) || (slug && !algorithms.has(slug)))
      .map(([full]) => full);

    expect([...new Set(broken)]).toEqual([]);
  });
});
