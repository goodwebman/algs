import { useMemo } from 'react';
import { Link } from 'react-router';

import { algorithms } from '@/algorithms/registry';
import { topicById } from '@/content/topics';
import { ComplexityChart } from '@/viz/ComplexityChart';
import { UIBadge } from '@/ui';

const STRUCTURES = [
  { name: 'Массив: доступ по индексу', time: 'O(1)', note: 'Прямая адресация' },
  { name: 'Массив: push / pop', time: 'O(1)*', note: 'Амортизированно — иногда происходит перевыделение' },
  { name: 'Массив: shift / unshift', time: 'O(n)', note: 'Сдвигается вся лента индексов' },
  { name: 'Массив: splice в середину', time: 'O(n)', note: 'Хвост переезжает' },
  { name: 'Массив: indexOf / includes', time: 'O(n)', note: 'Линейный перебор' },
  { name: 'Array.prototype.sort', time: 'O(n log n)', note: 'В V8 — TimSort, стабильная' },
  { name: 'Map / Set: get, set, has, delete', time: 'O(1)*', note: 'Амортизированно, при плохих ключах хуже' },
  { name: 'Объект: доступ по ключу', time: 'O(1)*', note: 'Пока форма объекта стабильна' },
  { name: 'Стек: push / pop', time: 'O(1)', note: 'Массив с конца' },
  { name: 'Очередь через shift()', time: 'O(n)', note: 'Ловушка: BFS превращается в O(n²)' },
  { name: 'Очередь через head-указатель', time: 'O(1)', note: 'Правильная реализация' },
  { name: 'Куча: insert / extract', time: 'O(log n)', note: 'Просеивание по высоте дерева' },
  { name: 'Куча: peek', time: 'O(1)', note: 'Корень лежит в items[0]' },
  { name: 'BST сбалансированное: поиск', time: 'O(log n)', note: 'Вырожденное — O(n)' },
  { name: 'Обход графа DFS / BFS', time: 'O(V + E)', note: 'Каждая вершина и ребро по разу' },
];

const CheatsheetPage = () => {
  const rows = useMemo(
    () =>
      [...algorithms.values()].sort((a, b) => {
        const orderA = topicById.get(a.meta.topic)?.order ?? 99;
        const orderB = topicById.get(b.meta.topic)?.order ?? 99;
        return orderA - orderB || a.meta.title.localeCompare(b.meta.title);
      }),
    [],
  );

  return (
    <div className="flex flex-col gap-10">
      <header>
        <h1 className="text-3xl font-bold">Шпаргалка</h1>
        <p className="mt-2 text-muted-foreground">
          Сложности операций и всех разобранных алгоритмов в одном месте.
        </p>
      </header>

      <ComplexityChart
        title="Классы роста"
        description="Сравни, во что превращается разница в сложности при увеличении входа."
      />

      <section>
        <h2 className="mb-3 text-xl font-semibold">Операции структур данных</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-border px-3 py-2 text-left font-semibold">Операция</th>
                <th className="border-b border-border px-3 py-2 text-left font-semibold">Время</th>
                <th className="border-b border-border px-3 py-2 text-left font-semibold">Почему</th>
              </tr>
            </thead>
            <tbody>
              {STRUCTURES.map((row) => (
                <tr key={row.name}>
                  <td className="border-b border-border/50 px-3 py-2">{row.name}</td>
                  <td className="tnum border-b border-border/50 px-3 py-2 font-mono">{row.time}</td>
                  <td className="border-b border-border/50 px-3 py-2 text-muted-foreground">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">* — амортизированная сложность.</p>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Разобранные алгоритмы</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th className="border-b border-border px-3 py-2 text-left font-semibold">Алгоритм</th>
                <th className="border-b border-border px-3 py-2 text-left font-semibold">Тема</th>
                <th className="border-b border-border px-3 py-2 text-left font-semibold">Время</th>
                <th className="border-b border-border px-3 py-2 text-left font-semibold">Память</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((algo) => (
                <tr key={algo.meta.slug}>
                  <td className="border-b border-border/50 px-3 py-2">
                    <Link
                      to={`/t/${algo.meta.topic}/${algo.meta.slug}`}
                      className="text-primary underline underline-offset-2"
                    >
                      {algo.meta.title}
                    </Link>
                  </td>
                  <td className="border-b border-border/50 px-3 py-2 text-muted-foreground">
                    {topicById.get(algo.meta.topic)?.title ?? algo.meta.topic}
                  </td>
                  <td className="tnum border-b border-border/50 px-3 py-2 font-mono">
                    {algo.meta.complexity.time}
                  </td>
                  <td className="tnum border-b border-border/50 px-3 py-2 font-mono">
                    {algo.meta.complexity.space}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <UIBadge variant="outline">пока пусто</UIBadge>}
      </section>
    </div>
  );
};

export default CheatsheetPage;
