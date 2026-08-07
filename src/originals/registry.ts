/**
 * Оригинальные решения из первой версии репозитория.
 *
 * Код в `src/algorithms/` переписан под визуализацию: генератор, yield на
 * каждом шаге, снимки состояния. Из-за этого он неизбежно отличается от
 * того, что было написано изначально.
 *
 * Здесь лежат исходники как есть — без правок, прямо из коммита e98cac6.
 * Они показываются под каждым разбором отдельным блоком, чтобы было видно,
 * с чего всё начиналось и что именно изменилось.
 */
const files = import.meta.glob<string>('/originals/**/*.{js,ts}', {
  query: '?raw',
  import: 'default',
  eager: true,
});

/**
 * Путь в проекте → исходный путь в старом репозитории (с русскими папками).
 * Нужен, чтобы дать ссылку на файл в GitHub первой версии.
 */
const pathIndex: Record<string, string> = JSON.parse(
  Object.values(
    import.meta.glob<string>('/originals/_index.json', { query: '?raw', import: 'default', eager: true }),
  )[0] ?? '{}',
);

export interface Original {
  /** Путь к файлу в папке originals. */
  path: string;
  /** Исходный путь в первой версии репозитория (с русскими папками). */
  originalPath: string;
  code: string;
}

const byName = new Map<string, Original>();

for (const [path, code] of Object.entries(files)) {
  const key = path.replace('/originals/', '');
  byName.set(key, {
    path: key,
    originalPath: pathIndex[`originals/${key}`] ?? key,
    code: code.trimEnd(),
  });
}

export const getOriginal = (path: string): Original | undefined => byName.get(path);

export const originals = byName;

/** Ссылка на файл в GitHub первой версии. */
export const githubUrl = (originalPath: string) =>
  `https://github.com/goodwebman/algs/blob/main/${originalPath
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;
