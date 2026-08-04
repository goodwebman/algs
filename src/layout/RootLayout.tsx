import { MDXProvider } from '@mdx-js/react';
import { Suspense } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';

import { AuroraBackdrop } from './AuroraBackdrop';
import { Header } from './Header';
import { mdxComponents } from '@/content/MdxComponents';
import { UIToast, UISkeleton } from '@/ui';

const PageFallback = () => (
  <div className="flex flex-col gap-3">
    <UISkeleton className="h-8 w-2/3" />
    <UISkeleton className="h-4 w-full" />
    <UISkeleton className="h-4 w-5/6" />
    <UISkeleton className="h-64 w-full" />
  </div>
);

export const RootLayout = () => (
  <UIToast>
    <MDXProvider components={mdxComponents}>
      <AuroraBackdrop />

      <a
        href="#main"
        className="sr-only rounded-md bg-primary px-3 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[300]"
      >
        К содержимому
      </a>

      <Header />

      <main id="main" className="mx-auto min-h-[70dvh] w-full max-w-[1280px] px-6 py-8">
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="mt-12 border-t border-border py-6">
        <p className="mx-auto max-w-[1280px] px-6 text-xs text-muted-foreground">
          Учебник по алгоритмам на JavaScript. Весь код исполняется локально в браузере.
        </p>
      </footer>

      <ScrollRestoration />
    </MDXProvider>
  </UIToast>
);
