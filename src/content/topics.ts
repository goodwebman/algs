export type Track = 'algorithms' | 'js';

export interface Topic {
  id: string;
  order: number;
  track: Track;
  title: string;
  /** Одна строка на карточке темы. */
  subtitle: string;
  /** Что конкретно ты будешь уметь после темы. Не «изучим стек», а проверяемый навык. */
  goal: string;
}

/**
 * Программа курса.
 *
 * Порядок не случаен: каждая тема опирается на предыдущие. Хеш-таблицы идут
 * до двух указателей, потому что «за O(n) с доп. памятью» — та планка, которую
 * два указателя потом бьют по памяти. Рекурсия идёт после стека, потому что
 * стек вызовов — это буквально тот же стек. DP идёт после рекурсии и жадных,
 * потому что это ответ на вопрос «а если жадность врёт, а перебор слишком
 * дорог».
 */
export const TOPICS: Topic[] = [
  {
    id: 'complexity',
    order: 1,
    track: 'algorithms',
    title: 'Сложность и Big-O',
    subtitle: 'Как считать, во что обойдётся код, не запуская его',
    goal: 'Оценивать время и память по коду и отличать O(n) от O(n log n) на глаз.',
  },
  {
    id: 'arrays',
    order: 2,
    track: 'algorithms',
    title: 'Массивы и строки в JS',
    subtitle: 'Что на самом деле делают push, shift, splice и sort',
    goal: 'Знать реальную цену операций массива в V8 и не писать O(n²) там, где просился O(n).',
  },
  {
    id: 'hash-tables',
    order: 3,
    track: 'algorithms',
    title: 'Хеш-таблицы: Map, Set, объект',
    subtitle: 'Обменять память на время — базовый приём',
    goal: 'Сводить квадратичный перебор к одному проходу через Map или Set.',
  },
  {
    id: 'two-pointers',
    order: 4,
    track: 'algorithms',
    title: 'Два указателя',
    subtitle: 'Один проход вместо вложенных циклов',
    goal: 'Видеть, когда отсортированность позволяет отбросить половину вариантов без перебора.',
  },
  {
    id: 'sliding-window',
    order: 5,
    track: 'algorithms',
    title: 'Скользящее окно',
    subtitle: 'Подотрезки без пересчёта с нуля',
    goal: 'Решать задачи о подстроках и подмассивах за O(n) вместо O(n²).',
  },
  {
    id: 'binary-search',
    order: 6,
    track: 'algorithms',
    title: 'Бинарный поиск',
    subtitle: 'Половина вариантов отбрасывается на каждом шаге',
    goal: 'Писать бинпоиск без off-by-one и применять его к ответу, а не только к массиву.',
  },
  {
    id: 'sorting',
    order: 7,
    track: 'algorithms',
    title: 'Сортировки',
    subtitle: 'От пузырька до TimSort внутри Array.prototype.sort',
    goal: 'Понимать, за что платишь при сортировке, и когда своя сортировка вообще нужна.',
  },
  {
    id: 'stack',
    order: 8,
    track: 'algorithms',
    title: 'Стек',
    subtitle: 'LIFO, скобки, монотонный стек и обход в глубину',
    goal: 'Узнавать задачи, где нужен стек, по формулировке — до того, как начал писать код.',
  },
  {
    id: 'queue',
    order: 9,
    track: 'algorithms',
    title: 'Очередь и дек',
    subtitle: 'FIFO, обход в ширину и почему shift() — ловушка',
    goal: 'Писать BFS без скрытого O(n²) из-за shift().',
  },
  {
    id: 'recursion',
    order: 10,
    track: 'algorithms',
    title: 'Рекурсия и мемоизация',
    subtitle: 'Стек вызовов, дерево вызовов и цена повторных вычислений',
    goal: 'Переводить рекурсию в итерацию и убивать экспоненту мемоизацией.',
  },
  {
    id: 'trees',
    order: 11,
    track: 'algorithms',
    title: 'Деревья',
    subtitle: 'Обходы, глубина, бинарное дерево поиска',
    goal: 'Свободно обходить дерево тремя способами и понимать, когда BST вырождается в список.',
  },
  {
    id: 'graphs',
    order: 12,
    track: 'algorithms',
    title: 'Графы',
    subtitle: 'DFS, BFS, топологическая сортировка, кратчайший путь',
    goal: 'Сводить задачу к графу и выбирать между DFS, BFS и Дейкстрой осознанно.',
  },
  {
    id: 'heap',
    order: 13,
    track: 'algorithms',
    title: 'Куча и очередь с приоритетом',
    subtitle: 'Дерево, которого не существует',
    goal: 'Решать задачи «k самых больших» за O(n log k) вместо сортировки всего.',
  },
  {
    id: 'greedy',
    order: 14,
    track: 'algorithms',
    title: 'Жадные алгоритмы',
    subtitle: 'Локально лучший выбор — и когда он врёт',
    goal: 'Доказывать применимость жадности, а не надеяться на неё.',
  },
  {
    id: 'dp',
    order: 15,
    track: 'algorithms',
    title: 'Динамическое программирование',
    subtitle: 'Перебор без повторов',
    goal: 'Находить состояние и переход, а дальше писать DP механически.',
  },
  {
    id: 'intervals',
    order: 16,
    track: 'algorithms',
    title: 'Интервалы и события',
    subtitle: 'Сортировка по началу — половина решения',
    goal: 'Решать задачи про отрезки, брони и расписания по одному шаблону.',
  },
  {
    id: 'linked-list',
    order: 17,
    track: 'algorithms',
    title: 'Связные списки',
    subtitle: 'Указатели next, быстрый и медленный бегунки, разворот и слияние узлов',
    goal: 'Свободно менять связи между узлами и выбирать технику для поиска, разворота и обнаружения цикла.',
  },
  {
    id: 'js-practice',
    order: 18,
    track: 'js',
    title: 'JS на собеседовании',
    subtitle: 'EventEmitter, retry, таймауты, глубокое сравнение, каррирование',
    goal: 'Уверенно писать типовые задачи на сам язык, а не на алгоритмы.',
  },
];

export const topicById = new Map(TOPICS.map((topic) => [topic.id, topic]));

export const topicsByTrack = (track: Track) =>
  TOPICS.filter((topic) => topic.track === track).sort((a, b) => a.order - b.order);
