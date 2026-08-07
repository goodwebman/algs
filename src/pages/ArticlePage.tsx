import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router';

import { getAlgo } from '@/algorithms/registry';
import { loadContent } from '@/content/loader';
import { topicById } from '@/content/topics';
import NotFoundPage from './NotFoundPage';
import { UIBadge } from '@/ui';

const ArticlePage = () => {
  const { topicId = '', slug = '' } = useParams();
  const topic = topicById.get(topicId);
  const algo = getAlgo(slug);
  const Content = loadContent(topicId, slug);

  if (!topic || !Content) return <NotFoundPage />;

  return (
    <article className="flex flex-col gap-6">
      <nav aria-label="Хлебные крошки" className="text-sm">
        <Link
          to={`/t/${topicId}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          {topic.title}
        </Link>
      </nav>

      {algo && (
        <header>
          <h1 className="text-3xl font-bold">{algo.meta.title}</h1>
          <p className="mt-2 text-muted-foreground">{algo.meta.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <UIBadge variant="outline">время {algo.meta.complexity.time}</UIBadge>
            <UIBadge variant="outline">память {algo.meta.complexity.space}</UIBadge>
            <UIBadge variant="outline">{algo.meta.difficulty}</UIBadge>
          </div>
        </header>
      )}

      {/* Раскладка в mdx-body (tokens.css): текст в колонке фиксированной
          ширины с общим левым краем, интерактив выходит на всю ширину. */}
      <div className="mdx-body">
        <Content />
      </div>
    </article>
  );
};

export default ArticlePage;
