import type { ApiGroup } from './types';

/** Set: коллекция уникальных значений с O(1) проверкой вхождения. */
export const SETS: ApiGroup = {
  id: 'sets',
  title: 'Set',
  intro:
    'Set хранит уникальные значения в порядке добавления. Главное, ради чего его берут: has() за O(1) вместо includes() за O(n) — именно это превращает квадратичный алгоритм в линейный. Уникальность определяется как ===, но с одной поправкой: NaN равен NaN.',
  sections: [
    {
      title: 'Основа',
      host: 'Set.prototype',
      entries: [
        {
          sig: 'new Set(iterable?)',
          key: 'constructor',
          summary: 'Создаёт множество, сразу отбрасывая дубликаты из переданного итерируемого.',
          examples: [
            `const s = new Set([1, 2, 2, 3]);
s.size;          // → 3
[...s];          // → [1, 2, 3]

new Set('hello').size;   // → 4 — h, e, l, o`,
            `// дедупликация массива — самое частое применение
[...new Set([3, 1, 3, 2, 1])];   // → [3, 1, 2] — порядок первого появления сохраняется`,
            `// сколько уникальных посетителей и были ли повторы
const visits = ['u1', 'u2', 'u1', 'u3'];
new Set(visits).size;                     // → 3
new Set(visits).size !== visits.length;   // → true — дубли есть

// уникальные значения поля из списка объектов
const rows = [{ city: 'мск' }, { city: 'спб' }, { city: 'мск' }];
[...new Set(rows.map((r) => r.city))];   // → ['мск', 'спб']`,
            `// Set из Set — копия, а не ссылка: без неё React не увидит изменения
const base = new Set([1, 2]);
const copy = new Set(base);
copy.add(3);

[...base];   // → [1, 2]
[...copy];   // → [1, 2, 3]`,
          ],
        },
        {
          sig: 'set.add(value)',
          key: 'add',
          summary: 'Добавляет значение. Повторное добавление ничего не меняет.',
          returns: 'тот же Set — вызовы цепочкой',
          mutates: true,
          complexity: 'O(1)',
          examples: [
            `const s = new Set();
s.add('a').add('b').add('a');
s.size;   // → 2
[...s];   // → ['a', 'b']`,
            `// объекты сравниваются по ссылке, а не по содержимому
const s = new Set();
s.add({ id: 1 });
s.add({ id: 1 });
s.size;   // → 2 — это два разных объекта`,
            `// «уже обрабатывали?» — идемпотентность обработчика событий
const processed = new Set();
const handle = (id) => {
  if (processed.has(id)) return 'пропуск';
  processed.add(id);
  return 'обработано';
};

handle('evt-1');   // → 'обработано'
handle('evt-1');   // → 'пропуск' — повторная доставка не навредит
processed.size;    // → 1`,
          ],
        },
        {
          sig: 'set.has(value)',
          key: 'has',
          summary: 'Есть ли значение. Ради этого метода Set обычно и заводят.',
          returns: 'boolean',
          complexity: 'O(1)',
          examples: [
            `const seen = new Set([1, 2]);
seen.has(1);     // → true
seen.has('1');   // → false — без приведения типов
seen.has(9);     // → false`,
            `// поиск первого дубликата за один проход — классика собеседований
const firstDup = (arr) => {
  const seen = new Set();
  for (const x of arr) {
    if (seen.has(x)) return x;
    seen.add(x);
  }
  return null;
};
firstDup([1, 2, 3, 2, 1]);   // → 2
firstDup([1, 2, 3]);         // → null`,
            `// NaN находится, в отличие от indexOf
new Set([NaN]).has(NaN);   // → true
[NaN].indexOf(NaN);        // → -1`,
            `// пометить прочитанные сообщения: has вместо includes в каждой строке списка
const readIds = new Set(['m1', 'm3']);
const messages = [{ id: 'm1' }, { id: 'm2' }, { id: 'm3' }];

const view = messages.map((m) => ({ ...m, read: readIds.has(m.id) }));
view.filter((m) => !m.read).length;   // → 1 — столько непрочитанных
view[0].read;                         // → true`,
          ],
        },
        {
          sig: 'set.delete(value)',
          key: 'delete',
          summary: 'Удаляет значение. Возвращает, было ли оно там.',
          returns: 'boolean',
          mutates: true,
          complexity: 'O(1)',
          examples: [
            `const s = new Set(['a', 'b']);
s.delete('a');   // → true
s.delete('a');   // → false — уже удалено
s.size;          // → 1`,
            `// возвращаемое значение говорит, нужен ли запрос на бэк
const subscribed = new Set(['news', 'sales']);

subscribed.delete('sales');   // → true — реально отписали, шлём DELETE
subscribed.delete('sales');   // → false — второй клик ничего не меняет
[...subscribed];              // → ['news']

// toggle в одну строку: delete вернул false → значит не было
const toggle = (set, v) => { if (!set.delete(v)) set.add(v); return set; };
[...toggle(new Set(['a']), 'b')];   // → ['a', 'b']`,
          ],
        },
        {
          sig: 'set.clear()',
          key: 'clear',
          summary: 'Выкидывает всё.',
          mutates: true,
          examples: [
            `const s = new Set([1, 2, 3]);
s.clear();
s.size;   // → 0`,
          ],
        },
        {
          sig: 'set.size',
          key: 'size',
          summary: 'Количество значений. Свойство, а не метод — скобок нет.',
          returns: 'number',
          complexity: 'O(1)',
          examples: [
            `const s = new Set([1, 2]);
s.size;              // → 2
typeof s.size;       // → 'number'
s.length;            // → undefined — у Set нет length`,
            `// счётчик выбранного и состояние кнопки массового действия
const selected = new Set(['a', 'b']);

selected.size;                       // → 2
selected.size > 0;                   // → true — кнопка «Удалить выбранное» активна
'Выбрано: ' + selected.size;         // → 'Выбрано: 2'`,
          ],
        },
      ],
    },
    {
      title: 'Перебор',
      host: 'Set.prototype',
      entries: [
        {
          sig: 'for..of / [...set] / set.forEach(fn)',
          key: 'forEach',
          summary: 'Обход в порядке добавления. Set итерируемый, поэтому спред и for..of работают напрямую.',
          complexity: 'O(n)',
          examples: [
            `const s = new Set(['a', 'b']);

const out = [];
for (const v of s) out.push(v);
out;        // → ['a', 'b']

[...s];              // → ['a', 'b']
Array.from(s);       // → ['a', 'b']`,
            `// у forEach колбэк получает значение дважды — так сохранена совместимость с Map
const pairs = [];
new Set(['x']).forEach((value, key) => pairs.push([value, key]));
pairs;   // → [['x', 'x']]`,
            `// методов массива у Set нет — сначала разворачивай
const s = new Set([1, 2, 3]);
[...s].filter((n) => n > 1);   // → [2, 3]
[...s].reduce((a, b) => a + b, 0);   // → 6`,
            `// рендер набора тегов и иммутабельное обновление
const tags = new Set(['js', 'ts']);
[...tags].map((t) => '#' + t);   // → ['#js', '#ts']

const next = new Set(tags);
next.delete('js');
[...next];   // → ['ts']
[...tags];   // → ['js', 'ts'] — прежнее состояние цело`,
          ],
        },
        {
          sig: 'set.values() / keys() / entries()',
          key: 'values',
          summary: 'Итераторы. У Set keys — синоним values, а entries отдаёт пары [v, v] — всё ради единого интерфейса с Map.',
          examples: [
            `const s = new Set(['a']);

[...s.values()];    // → ['a']
[...s.keys()];      // → ['a']
[...s.entries()];   // → [['a', 'a']]`,
          ],
        },
      ],
    },
    {
      title: 'Операции над множествами',
      host: 'Set.prototype',
      entries: [
        {
          sig: 'set.union(other) / intersection / difference / symmetricDifference',
          key: 'union',
          summary: 'Объединение, пересечение, разность и симметрическая разность — новым множеством.',
          returns: 'новый Set',
          since: 'ES2025',
          examples: [
            `const a = new Set([1, 2, 3]);
const b = new Set([3, 4]);

[...a.union(b)];                  // → [1, 2, 3, 4]
[...a.intersection(b)];           // → [3]
[...a.difference(b)];             // → [1, 2]
[...a.symmetricDifference(b)];    // → [1, 2, 4]
[...a];                           // → [1, 2, 3] — исходники не тронуты`,
            `// как это писали до ES2025 — и как всё ещё пишут для старых сред
const a = new Set([1, 2, 3]);
const b = new Set([3, 4]);

new Set([...a, ...b]);                          // объединение
[...a].filter((x) => b.has(x));                 // → [3]
[...a].filter((x) => !b.has(x));                // → [1, 2]`,
          ],
          gotcha:
            'Свежие методы: Chrome 122+, Firefox 127+, Safari 17+, Node 22+. В старых средах — фильтром через has, как во втором примере.',
        },
        {
          sig: 'set.isSubsetOf(other) / isSupersetOf / isDisjointFrom',
          key: 'isSubsetOf',
          summary: 'Проверки отношений между множествами без ручных циклов.',
          returns: 'boolean',
          since: 'ES2025',
          examples: [
            `const small = new Set([1, 2]);
const big = new Set([1, 2, 3]);
const other = new Set([9]);

small.isSubsetOf(big);        // → true
big.isSupersetOf(small);      // → true
small.isDisjointFrom(other);  // → true — общих элементов нет
small.isDisjointFrom(big);    // → false`,
          ],
        },
      ],
    },
    {
      title: 'Когда что брать',
      host: null,
      entries: [
        {
          sig: 'Set против массива',
          key: null,
          summary: 'Единственная причина брать Set — проверка вхождения в цикле. Разница видна на глаз уже на тысячах элементов.',
          examples: [
            `// O(n·m): для каждого элемента линейный поиск по второму массиву
const slow = (a, b) => a.filter((x) => b.includes(x));

// O(n + m): построили индекс один раз, дальше O(1) на проверку
const fast = (a, b) => {
  const index = new Set(b);
  return a.filter((x) => index.has(x));
};

slow([1, 2, 3], [2, 3, 4]);   // → [2, 3]
fast([1, 2, 3], [2, 3, 4]);   // → [2, 3]`,
          ],
          gotcha:
            'Set не даёт доступа по индексу и не сортируется. Нужен порядок или произвольный доступ — массив, а Set держи рядом как индекс.',
        },
        {
          sig: 'WeakSet',
          key: null,
          summary: 'Множество только для объектов, не удерживающее их от сборки мусора. Не итерируется и не имеет size.',
          examples: [
            `const visited = new WeakSet();
const node = { id: 1 };

visited.add(node);
visited.has(node);          // → true
visited.has({ id: 1 });     // → false — другой объект

// перебрать нельзя: ни size, ни forEach, ни спреда
typeof visited.size;        // → 'undefined'`,
          ],
          gotcha:
            'Реальный сценарий один: пометить объекты, которые тебе не принадлежат (обход графа с циклами, кеш по DOM-узлу), не мешая сборщику мусора их удалить.',
        },
      ],
    },
    {
      title: 'Боевые сценарии',
      host: null,
      entries: [
        {
          sig: 'Права доступа и фичефлаги',
          key: null,
          summary: 'Проверка «хватает ли прав» — это операция над множествами, а не цикл с флагом.',
          examples: [
            `const required = new Set(['orders.read', 'orders.write']);
const granted = new Set(['orders.read', 'users.read']);

granted.isSupersetOf(required);                   // → false — доступ закрыт
required.intersection(granted).size;              // → 1
[...required].filter((p) => !granted.has(p));     // → ['orders.write'] — что показать в отказе`,
            `// фичефлаги с бэка: включена ли хоть одна из группы
const enabled = new Set(['new-checkout', 'dark-theme']);
const experiment = new Set(['new-checkout', 'new-search']);

enabled.isDisjointFrom(experiment);   // → false — пользователь в эксперименте
[...enabled.intersection(experiment)];   // → ['new-checkout']`,
          ],
        },
        {
          sig: 'Выделение строк в таблице',
          key: null,
          summary: 'Классический чекбокс-селект: toggle, «выбрать всё» и промежуточное состояние заголовка.',
          examples: [
            `const ids = [1, 2, 3];
let selected = new Set([1]);

// иммутабельно, иначе React не увидит изменения: новая ссылка на каждый toggle
const toggle = (set, id) => {
  const next = new Set(set);
  if (!next.delete(id)) next.add(id);
  return next;
};

selected = toggle(selected, 2);
[...selected];   // → [1, 2]
selected = toggle(selected, 1);
[...selected];   // → [2]

const all = ids.every((id) => selected.has(id));
const some = ids.some((id) => selected.has(id));
all;             // → false
some && !all;    // → true — чекбокс в шапке рисуем indeterminate`,
            `// «выбрать всё на странице» и снять выделение
const pageIds = [4, 5];
const selected = new Set([1]);
const selectAll = new Set([...selected, ...pageIds]);
[...selectAll];   // → [1, 4, 5]

const cleared = selectAll.difference(new Set(pageIds));
[...cleared];     // → [1] — выбор с других страниц сохранён`,
          ],
          gotcha:
            'Мутировать Set из state (`selected.add(id)`) бесполезно: ссылка не изменилась, перерисовки не будет. Всегда `new Set(prev)`.',
        },
        {
          sig: 'Обход графа и защита от циклов',
          key: null,
          summary: 'Дерево комментариев, граф зависимостей, связанные сущности с бэка — везде возможен цикл, и без visited это зависание вкладки.',
          examples: [
            `const graph = { a: ['b'], b: ['c'], c: ['a'] };   // цикл c → a

const visit = (start) => {
  const visited = new Set();
  const order = [];
  const stack = [start];

  while (stack.length > 0) {
    const node = stack.pop();
    if (visited.has(node)) continue;
    visited.add(node);
    order.push(node);
    stack.push(...(graph[node] ?? []));
  }
  return order;
};

visit('a');   // → ['a', 'b', 'c'] — обход конечен несмотря на цикл`,
            `// поиск циклической зависимости: узел встретился на текущем пути
const deps = { app: ['ui'], ui: ['utils'], utils: ['ui'] };

const hasCycle = (node, path = new Set()) => {
  if (path.has(node)) return true;
  path.add(node);
  const found = (deps[node] ?? []).some((next) => hasCycle(next, path));
  path.delete(node);
  return found;
};

hasCycle('app');   // → true`,
          ],
        },
        {
          sig: 'Фасетные фильтры и значения для выпадашки',
          key: null,
          summary: 'Фильтр по тегам в двух режимах — «хотя бы один» и «все» — и список уникальных значений колонки.',
          examples: [
            `const products = [
  { id: 1, tags: ['sale', 'new'] },
  { id: 2, tags: ['new'] },
  { id: 3, tags: ['b2b'] },
];
const selected = new Set(['sale', 'new']);

// ИЛИ: хотя бы один выбранный тег
products.filter((p) => p.tags.some((t) => selected.has(t))).map((p) => p.id);   // → [1, 2]

// И: все выбранные теги
const withAll = products.filter((p) => [...selected].every((t) => p.tags.includes(t)));
withAll.map((p) => p.id);   // → [1]`,
            `// уникальные значения колонки для фильтра — с сортировкой по локали
const rows = [{ city: 'спб' }, { city: 'мск' }, { city: 'спб' }];
[...new Set(rows.map((r) => r.city))].sort((a, b) => a.localeCompare(b, 'ru'));
// → ['мск', 'спб']

// счётчик рядом с каждым значением фильтра
const counts = new Map();
for (const r of rows) counts.set(r.city, (counts.get(r.city) ?? 0) + 1);
counts.get('спб');   // → 2`,
          ],
        },
        {
          sig: 'Синхронизация набора с бэком (теги, роли, подписки)',
          key: null,
          summary: 'Сохранённое состояние против отредактированного: что привязать, что отвязать, и есть ли изменения вообще.',
          examples: [
            `const saved = new Set(['js', 'ts']);
const edited = new Set(['ts', 'go']);

[...edited.difference(saved)];              // → ['go'] — POST /attach
[...saved.difference(edited)];              // → ['js'] — DELETE /detach
edited.symmetricDifference(saved).size;     // → 2

// ничего не менялось — запрос отправлять не нужно
const same = new Set(['js', 'ts']);
saved.symmetricDifference(same).size === 0;   // → true`,
          ],
          gotcha:
            'Не отправляй весь набор целиком «на всякий случай»: параллельная правка с другого устройства будет затёрта. Отправляй дельту.',
        },
      ],
    },
  ],
};
