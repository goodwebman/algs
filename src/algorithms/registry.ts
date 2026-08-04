import type { AlgoDefinition } from '@/core/algo';

/**
 * Реестр алгоритмов.
 *
 * Файлы подхватываются по соглашению `<slug>.algo.ts` — добавил файл,
 * алгоритм появился в учебнике. Ручного списка нет, потому что он гарантированно
 * разъедется с содержимым папки.
 *
 * Загрузка eager: определения — это чистые функции и текст исходника,
 * суммарно десятки килобайт. Ленивая загрузка сломала бы синхронный доступ
 * из MDX (`<Viz algo="two-sum-sorted" />`) ради экономии, которой не видно.
 */
const modules = import.meta.glob<{ default: AlgoDefinition<readonly any[], any> }>(
  './**/*.algo.ts',
  { eager: true },
);

const build = () => {
  const map = new Map<string, AlgoDefinition<readonly any[], any>>();

  for (const [path, module] of Object.entries(modules)) {
    const algo = module.default;
    if (!algo?.meta?.slug) {
      throw new Error(`${path}: ожидался default-экспорт defineAlgo({...})`);
    }
    if (map.has(algo.meta.slug)) {
      throw new Error(`Слаг «${algo.meta.slug}» занят двумя алгоритмами (${path})`);
    }
    map.set(algo.meta.slug, algo);
  }

  return map;
};

export const algorithms = build();

export const getAlgo = (slug: string) => algorithms.get(slug);

export const algorithmsByTopic = (topic: string) =>
  [...algorithms.values()].filter((algo) => algo.meta.topic === topic);
