import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router';

import { algorithmsByTopic } from '@/algorithms/registry';
import { contentSlugs, loadContent } from '@/content/loader';
import { TOPICS, topicById } from '@/content/topics';
import { tasksByTopic } from '@/tasks/registry';
import { useProgress } from '@/store/progress';
import NotFoundPage from './NotFoundPage';
import { UIBadge, UICard, UISeparator } from '@/ui';

const TopicPage = () => {
  const { topicId = '' } = useParams();
  const topic = topicById.get(topicId);

  const Content = loadContent(topicId);
  const algos = useMemo(() => algorithmsByTopic(topicId), [topicId]);
  const tasks = useMemo(() => tasksByTopic(topicId), [topicId]);
  const slugs = useMemo(() => new Set(contentSlugs(topicId)), [topicId]);
  const solved = useProgress((state) => state.solved);

  if (!topic) return <NotFoundPage />;

  const index = TOPICS.findIndex((item) => item.id === topicId);
  const prev = TOPICS[index - 1];
  const next = TOPICS[index + 1];

  return (
    <article className="flex flex-col gap-8">
      <header>
        <p className="tnum font-mono text-sm text-muted-foreground">
          Тема {String(topic.order).padStart(2, '0')}
        </p>
        <h1 className="mt-1 text-3xl font-bold">{topic.title}</h1>
        <p className="mt-2 text-lg text-muted-foreground">{topic.subtitle}</p>
        <p className="mt-4 rounded-lg border-l-2 border-primary/60 bg-card/40 px-4 py-2 text-sm">
          <span className="font-semibold">Цель: </span>
          {topic.goal}
        </p>
      </header>

      {Content && (
        <div className="max-w-[72ch]">
          <Content />
        </div>
      )}

      {algos.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold">Разборы</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {algos
              .filter((algo) => slugs.has(algo.meta.slug))
              .map((algo) => (
                <Link key={algo.meta.slug} to={`/t/${topicId}/${algo.meta.slug}`} className="group">
                  <UICard className="h-full transition-colors group-hover:border-primary/50">
                    <UICard.Header>
                      <UICard.Title className="text-base">{algo.meta.title}</UICard.Title>
                      <UICard.Description>{algo.meta.summary}</UICard.Description>
                    </UICard.Header>
                    <UICard.Footer className="gap-2">
                      <UIBadge variant="outline">{algo.meta.complexity.time}</UIBadge>
                      <UIBadge variant="outline">{algo.meta.difficulty}</UIBadge>
                      <ArrowRight
                        size={15}
                        className="ml-auto text-muted-foreground transition-transform group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </UICard.Footer>
                  </UICard>
                </Link>
              ))}
          </div>
        </section>
      )}

      {tasks.length > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-semibold">Задачи темы</h2>
          <ul className="flex flex-col gap-2">
            {tasks.map((task) => (
              <li
                key={task.slug}
                className="flex items-center gap-2 rounded-md border border-border bg-card/40 px-3 py-2 text-sm"
              >
                {solved.includes(task.slug) ? (
                  <Check size={15} className="text-primary" aria-label="решено" />
                ) : (
                  <span aria-hidden="true" className="h-[15px] w-[15px] rounded-full border border-border" />
                )}
                {task.title}
              </li>
            ))}
          </ul>
        </section>
      )}

      <UISeparator />

      <nav aria-label="Соседние темы" className="flex flex-wrap justify-between gap-3 text-sm">
        {prev ? (
          <Link to={`/t/${prev.id}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft size={15} aria-hidden="true" />
            {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link to={`/t/${next.id}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            {next.title}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        )}
      </nav>
    </article>
  );
};

export default TopicPage;
