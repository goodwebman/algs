import type { TaskDefinition } from './types';

const modules = import.meta.glob<{ default: TaskDefinition }>('./**/*.task.ts', { eager: true });

const build = () => {
  const map = new Map<string, TaskDefinition>();

  for (const [path, module] of Object.entries(modules)) {
    const task = module.default;
    if (!task?.slug) throw new Error(`${path}: ожидался default-экспорт defineTask({...})`);
    if (map.has(task.slug)) throw new Error(`Слаг задачи «${task.slug}» занят дважды (${path})`);
    map.set(task.slug, task);
  }

  return map;
};

export const tasks = build();

export const getTask = (slug: string) => tasks.get(slug);

export const tasksByTopic = (topic: string) => [...tasks.values()].filter((task) => task.topic === topic);
