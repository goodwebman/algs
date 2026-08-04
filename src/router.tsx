import { lazy } from 'react';
import { createHashRouter } from 'react-router';

import { RootLayout } from './layout/RootLayout';

const HomePage = lazy(() => import('./pages/HomePage'));
const TopicPage = lazy(() => import('./pages/TopicPage'));
const ArticlePage = lazy(() => import('./pages/ArticlePage'));
const CheatsheetPage = lazy(() => import('./pages/CheatsheetPage'));
const SandboxPage = lazy(() => import('./pages/SandboxPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/**
 * Хеш-роутер, а не browser: учебник — статика, которую можно открыть
 * с GitHub Pages, из подпапки или вообще с диска. Browser-роутер потребовал
 * бы серверного fallback на index.html, которого на статическом хостинге нет,
 * и прямая ссылка на разбор отдавала бы 404.
 */
export const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 't/:topicId', element: <TopicPage /> },
      { path: 't/:topicId/:slug', element: <ArticlePage /> },
      { path: 'cheatsheet', element: <CheatsheetPage /> },
      { path: 'playground', element: <SandboxPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
