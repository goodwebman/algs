import { describe, expect, it } from 'vitest';

import { algorithms } from './registry';
import { parseSource } from '@/core/source';
import { collectFrames } from '@/core/trace';

/**
 * Структурные тесты по ВСЕМ алгоритмам разом.
 *
 * Они ловят самый вероятный класс поломок в учебнике: якорь переименовали в
 * коде, но не в yield — и подсветка строки молча перестаёт работать, а на
 * странице это заметно не сразу. Каждый новый алгоритм попадает сюда
 * автоматически, потому что реестр строится по glob.
 */
describe('реестр алгоритмов', () => {
  it('не пустой', () => {
    expect(algorithms.size).toBeGreaterThan(0);
  });

  for (const [slug, algo] of algorithms) {
    describe(slug, () => {
      const source = parseSource(algo.raw);

      it('исходник содержит показываемый регион', () => {
        expect(source.lines.length).toBeGreaterThan(3);
      });

      it('meta.slug совпадает с ключом реестра', () => {
        expect(algo.meta.slug).toBe(slug);
      });

      it('есть хотя бы один пресет', () => {
        expect(algo.presets.length).toBeGreaterThan(0);
      });

      for (const preset of algo.presets) {
        it(`пресет «${preset.label}»: трассировка завершается и все якоря существуют`, () => {
          const run = collectFrames(algo.trace(...preset.args));

          expect(run.truncated).toBe(false);
          expect(run.frames.length).toBeGreaterThan(0);

          const missing = run.frames
            .map((frame) => frame.at)
            .filter((anchor): anchor is string => Boolean(anchor))
            .filter((anchor) => !source.anchors.has(anchor));

          expect([...new Set(missing)]).toEqual([]);

          // Пустая подпись шага означает, что визуализацию нечем объяснить.
          expect(run.frames.every((frame) => frame.note.trim().length > 0)).toBe(true);
        });
      }
    });
  }
});
