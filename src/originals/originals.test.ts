import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { originals } from './registry';

/**
 * Гарантия, что ни один исходник из первой версии репозитория не потерялся.
 *
 * Файлы в `originals/` — это код как он был написан изначально, извлечённый
 * из коммита e98cac6. Разборы в `src/algorithms/` переписаны под визуализацию
 * и неизбежно отличаются, поэтому оригиналы показываются отдельным блоком.
 *
 * Тест ловит два случая: файл добавили в originals, но не сослались на него
 * ни с одной страницы (и он невидим), либо сослались на несуществующий.
 */
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

const referenced = () =>
  new Set([...readAllContent().matchAll(/<OriginalSource\s+file="([^"]+)"/g)].map((m) => m[1]));

describe('оригинальные решения', () => {
  it('извлечены все файлы из старого репозитория', () => {
    // 64 файла с кодом в коммите e98cac6 (68 всего минус 3 README и .md-конспект)
    expect(originals.size).toBe(64);
  });

  it('каждый оригинал показан хотя бы на одной странице', () => {
    const shown = referenced();
    const orphans = [...originals.keys()].filter((path) => !shown.has(path));
    expect(orphans).toEqual([]);
  });

  it('каждая ссылка ведёт на существующий файл', () => {
    const broken = [...referenced()].filter((path) => !originals.has(path));
    expect(broken).toEqual([]);
  });

  it('исходники не пустые', () => {
    const empty = [...originals.values()].filter((o) => o.code.trim().length < 10);
    expect(empty.map((o) => o.path)).toEqual([]);
  });

  it('код сохранён дословно — без правок под визуализацию', () => {
    // В оригиналах не должно быть ничего от нового формата
    const contaminated = [...originals.values()].filter(
      (o) => o.code.includes('yield {') || o.code.includes('#region show') || o.code.includes('defineAlgo'),
    );
    expect(contaminated.map((o) => o.path)).toEqual([]);
  });
});
