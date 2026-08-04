import { fileURLToPath, URL } from 'node:url';

import mdx from '@mdx-js/rollup';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
// vitest/config — тот же defineConfig, но с полем `test` в типах
import { defineConfig } from 'vitest/config';

const resolvePath = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  base: './',
  plugins: [
    // enforce: 'pre' обязателен — mdx должен отработать до plugin-react,
    // иначе react получит .mdx и не поймёт, что с ним делать.
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug], providerImportSource: '@mdx-js/react' }) },
    react({ include: /\.(jsx|tsx|mdx)$/ }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolvePath('./src'),
      '@content': resolvePath('./content'),
    },
  },
  build: {
    target: 'es2022',
    // Единственный чанк за лимитом — codemirror (~508 КБ, 171 КБ gzip).
    // Он грузится лениво, только на страницах с песочницей, поэтому
    // на первую загрузку не влияет. Порог поднят, чтобы предупреждение
    // не шумело на каждой сборке и не маскировало реальный рост.
    chunkSizeWarningLimit: 550,
    rollupOptions: {
      output: {
        // CodeMirror и recharts тяжёлые и нужны не на каждой странице —
        // выносим в отдельные чанки, чтобы первая загрузка не тащила их.
        // Функция, а не объект: в Vite 8 (rolldown) объектная форма
        // manualChunks не поддерживается.
        manualChunks: (id: string) => {
          if (id.includes('codemirror') || id.includes('@lezer')) return 'codemirror';
          if (id.includes('recharts') || id.includes('d3-')) return 'charts';
          if (id.includes('node_modules/motion') || id.includes('framer-motion')) return 'motion';

          // Реестры алгоритмов и задач грузятся eager (их нужен синхронный
          // доступ из MDX), а вместе с ними — текст исходников через ?raw.
          // Отдельным чанком, чтобы главная не тащила их в первом байте.
          if (id.includes('/src/algorithms/') || id.includes('/src/tasks/')) return 'catalog';

          return null;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/algorithms/**', 'src/core/**', 'src/sandbox/**'],
    },
  },
});
