import { ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router';

import { algorithmsByTopic } from '@/algorithms/registry';
import { TOPICS, topicsByTrack } from '@/content/topics';
import { tasksByTopic } from '@/tasks/registry';
import { useProgress } from '@/store/progress';
import { UIBadge, UICard, cn } from '@/ui';

const TopicCard = ({
  id,
  order,
  title,
  subtitle,
  goal,
  done,
}: {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  goal: string;
  done: boolean;
}) => {
  const algos = algorithmsByTopic(id).length;
  const tasks = tasksByTopic(id).length;

  return (
    <Link to={`/t/${id}`} className="group focus-visible:outline-none">
      <UICard
        className={cn(
          'h-full transition-colors group-hover:border-primary/50 group-focus-visible:ring-2 group-focus-visible:ring-ring',
          done && 'border-primary/40',
        )}
      >
        <UICard.Header>
          <div className="flex items-start justify-between gap-3">
            <UICard.Title className="text-base">
              <span className="tnum mr-2 font-mono text-sm text-muted-foreground">
                {String(order).padStart(2, '0')}
              </span>
              {title}
            </UICard.Title>
            {done && <Check size={16} className="mt-1 shrink-0 text-primary" aria-label="пройдено" />}
          </div>
          <UICard.Description>{subtitle}</UICard.Description>
        </UICard.Header>
        <UICard.Content>
          <p className="text-sm text-muted-foreground">{goal}</p>
        </UICard.Content>
        <UICard.Footer className="gap-2">
          {algos > 0 && <UIBadge variant="outline">{algos} разбор(ов)</UIBadge>}
          {tasks > 0 && <UIBadge variant="outline">{tasks} задач(и)</UIBadge>}
          <ArrowRight
            size={16}
            className="ml-auto text-muted-foreground transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </UICard.Footer>
      </UICard>
    </Link>
  );
};

const HomePage = () => {
  const solved = useProgress((state) => state.solved);
  const solvedByTopic = (topicId: string) => {
    const slugs = tasksByTopic(topicId).map((task) => task.slug);
    return slugs.length > 0 && slugs.every((slug) => solved.includes(slug));
  };

  const totalTasks = TOPICS.reduce((sum, topic) => sum + tasksByTopic(topic.id).length, 0);

  return (
    <div className="flex flex-col gap-10">
      <section className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] leading-tight font-bold tracking-tight">
            Алгоритмы, которые видно
          </h1>
          <p className="mt-4 max-w-[60ch] text-lg text-muted-foreground">
            Каждый алгоритм здесь можно проиграть по шагам, посмотреть счётчики сравнений в реальном
            времени и тут же написать своё решение — оно прогонится по тестам прямо в браузере.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/t/complexity"
              className="inline-flex h-11 items-center gap-2 rounded-md bg-primary px-5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Начать с начала
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              to="/playground"
              className="inline-flex h-11 items-center rounded-md border border-border px-5 font-medium transition-colors hover:bg-muted"
            >
              Свободная песочница
            </Link>
          </div>
          <p className="tnum mt-5 font-mono text-sm text-muted-foreground">
            решено задач: {solved.length} / {totalTasks}
          </p>
        </div>

        <ul className="flex flex-col gap-3 rounded-xl border border-border bg-card/50 p-5 text-sm">
          <li className="flex gap-2">
            <span className="text-primary">01</span> Пошаговый плеер: указатели, окно, стек и дерево
            вызовов рисуются на каждом шаге.
          </li>
          <li className="flex gap-2">
            <span className="text-primary">02</span> Листинг — это сам исполняемый файл алгоритма,
            подсвечивается текущая строка.
          </li>
          <li className="flex gap-2">
            <span className="text-primary">03</span> Песочница с тестами и замером роста времени на
            реальных входах.
          </li>
          <li className="flex gap-2">
            <span className="text-primary">04</span> Разбор инварианта: почему приём работает, а не
            «запомни шаблон».
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Программа</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {topicsByTrack('algorithms').map((topic) => (
            <TopicCard key={topic.id} {...topic} done={solvedByTopic(topic.id)} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Отдельный трек</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {topicsByTrack('js').map((topic) => (
            <TopicCard key={topic.id} {...topic} done={solvedByTopic(topic.id)} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
