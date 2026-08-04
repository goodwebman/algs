import { lazy, type ComponentType } from 'react';

/**
 * MDX-контент подгружается лениво: страница темы тянет только свой файл.
 *
 * Файлы лежат в /content и остаются обычным markdown — их видно на GitHub,
 * а приложение подмешивает в них интерактив через MDXProvider.
 */
const pages = import.meta.glob<{ default: ComponentType }>('/content/**/*.mdx');

const keyOf = (topicId: string, slug?: string) => `/content/${topicId}/${slug ?? 'index'}.mdx`;

export const hasContent = (topicId: string, slug?: string) => keyOf(topicId, slug) in pages;

/**
 * Кэш ленивых компонентов.
 *
 * `lazy()` создаёт НОВЫЙ тип компонента на каждый вызов. Без кэша React
 * считал бы страницу другим компонентом при каждом рендере: размонтировал
 * бы её, потерял состояние вложенных плееров и заново дёрнул бы импорт.
 */
const cache = new Map<string, ComponentType>();

export const loadContent = (topicId: string, slug?: string): ComponentType | null => {
  const key = keyOf(topicId, slug);

  const cached = cache.get(key);
  if (cached) return cached;

  const loader = pages[key];
  if (!loader) return null;

  const component = lazy(loader);
  cache.set(key, component);
  return component;
};

/** Все slug'и разборов внутри темы (без index). */
export const contentSlugs = (topicId: string) =>
  Object.keys(pages)
    .filter((path) => path.startsWith(`/content/${topicId}/`) && !path.endsWith('/index.mdx'))
    .map((path) => path.split('/').pop()!.replace(/\.mdx$/, ''));
