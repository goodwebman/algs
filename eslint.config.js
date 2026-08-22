import js from '@eslint/js';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // originals/ — код первой версии репозитория, сохранённый дословно.
  // Линтер там прав по существу (не определённый console, неиспользуемые
  // объявления, `ev` без стрелки в event-emitter), но править эти файлы
  // нельзя: они показываются на сайте как исторический исходник.
  // test.js в корне — черновик для ручной практики, а не часть сборки.
  { ignores: ['dist', 'coverage', 'node_modules', 'src/ui/**', 'originals/**', 'test.js'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Именно flat.recommended: у пресета `recommended-latest` в v7
  // поле plugins задано массивом строк — flat config такого не принимает.
  reactHooks.configs.flat.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      globals: { ...globals.browser, ...globals.worker },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // Воркер песочницы намеренно переопределяет console и работает с eval-подобным
    // импортом Blob-модуля — общие правила здесь только мешают.
    files: ['src/sandbox/**'],
    rules: { 'no-console': 'off', '@typescript-eslint/no-explicit-any': 'off' },
  },
  {
    // Маппинг MDX-элементов: содержимое заголовков и ссылок приходит из
    // props.children, которых правило не видит статически. Проверить
    // непустоту здесь невозможно — это делает автор .mdx-файла.
    files: ['src/content/MdxComponents.tsx'],
    rules: {
      'jsx-a11y/heading-has-content': 'off',
      'jsx-a11y/anchor-has-content': 'off',
    },
  },
  {
    // Реестры и плеер работают с алгоритмами любой сигнатуры: тип аргументов
    // и результата у каждого свой, а хранить их нужно в одной коллекции.
    files: ['src/algorithms/registry.ts', 'src/core/algo.ts', 'src/viz/TracePlayer.tsx'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
  {
    // Страницы получают MDX-компонент из loadContent. Правило видит вызов
    // функции в теле рендера и считает, что компонент создаётся заново —
    // на деле loadContent отдаёт закэшированный по пути lazy-компонент,
    // то есть ссылка стабильна между рендерами.
    files: ['src/pages/TopicPage.tsx', 'src/pages/ArticlePage.tsx'],
    rules: { 'react-hooks/static-components': 'off' },
  },
  {
    files: ['**/*.test.{ts,tsx}', 'vitest.setup.ts'],
    languageOptions: { globals: globals.node },
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
);
