import type { ApiGroup } from './types';

/** Map: словарь с ключами любого типа и честным порядком вставки. */
export const MAPS: ApiGroup = {
  id: 'maps',
  title: 'Map',
  intro:
    'Map — это словарь, где ключом может быть что угодно: объект, функция, NaN. Порядок обхода строго по вставке, размер берётся за O(1), а ключи не смешиваются со свойствами прототипа. Именно поэтому под динамические ключи от пользователя Map безопаснее обычного объекта.',
  sections: [
    {
      title: 'Основа',
      host: 'Map.prototype',
      entries: [
        {
          sig: 'new Map(entries?)',
          key: 'constructor',
          summary: 'Создаёт словарь, при желании — сразу из массива пар.',
          examples: [
            `const m = new Map([
  ['a', 1],
  ['b', 2],
]);
m.size;        // → 2
m.get('a');    // → 1
[...m];        // → [['a', 1], ['b', 2]]`,
            `// из объекта и обратно
const obj = { x: 1, y: 2 };
const m = new Map(Object.entries(obj));
m.get('x');                     // → 1
Object.fromEntries(m);          // → { x: 1, y: 2 }`,
            `// индекс по id прямо из ответа бэка
const users = [
  { id: 'u1', name: 'Аня' },
  { id: 'u2', name: 'Борис' },
];
const byId = new Map(users.map((u) => [u.id, u]));

byId.get('u1').name;   // → 'Аня'
byId.get('нет');       // → undefined
byId.size;             // → 2
[...byId.keys()];      // → ['u1', 'u2'] — порядок с бэка сохранён`,
          ],
        },
        {
          sig: 'map.set(key, value)',
          key: 'set',
          summary: 'Кладёт значение по ключу. Возвращает саму Map — можно цепочкой.',
          returns: 'та же Map',
          mutates: true,
          complexity: 'O(1)',
          examples: [
            `const m = new Map();
m.set('a', 1).set('b', 2);
m.size;   // → 2`,
            `// ключ — любое значение, включая объект и NaN
const keyObj = { id: 1 };
const m = new Map();
m.set(keyObj, 'по объекту');
m.set(NaN, 'по NaN');
m.set(1, 'число');
m.set('1', 'строка');

m.get(keyObj);       // → 'по объекту'
m.get({ id: 1 });    // → undefined — другой объект, другая ссылка
m.get(NaN);          // → 'по NaN'
m.get(1);            // → 'число'
m.get('1');          // → 'строка' — 1 и '1' разные ключи, в отличие от объекта`,
            `// конфиг колонок таблицы: порядок вставки = порядок колонок
const columns = new Map()
  .set('name', { title: 'Имя', width: 200 })
  .set('city', { title: 'Город', width: 120 });

columns.get('name').title;   // → 'Имя'
columns.size;                // → 2
[...columns.keys()];         // → ['name', 'city']

// перезапись по существующему ключу не меняет позицию
columns.set('name', { title: 'ФИО', width: 240 });
[...columns.keys()];         // → ['name', 'city']
columns.get('name').title;   // → 'ФИО'`,
          ],
        },
        {
          sig: 'map.get(key)',
          key: 'get',
          summary: 'Значение по ключу или undefined.',
          complexity: 'O(1)',
          examples: [
            `const m = new Map([['a', 1]]);
m.get('a');        // → 1
m.get('нет');      // → undefined
m.get('нет') ?? 0; // → 0 — дефолт через ??`,
            `// счётчик — самый частый паттерн
const counts = new Map();
for (const ch of 'банан') {
  counts.set(ch, (counts.get(ch) ?? 0) + 1);
}
counts.get('а');   // → 2
counts.get('н');   // → 2
[...counts.keys()];   // → ['б', 'а', 'н']`,
            `// дефолт при чтении и пара get+set при накоплении
const cache = new Map([['a', 1]]);

cache.get('a') ?? 0;   // → 1
cache.get('b') ?? 0;   // → 0 — ключа нет, но код не падает

cache.set('b', (cache.get('b') ?? 0) + 5);
cache.get('b');   // → 5`,
            `// get по ключу, которого может не быть в индексе, — с запасным значением
const titles = new Map([['new', 'Новый'], ['done', 'Готов']]);
const label = (status) => titles.get(status) ?? status;

label('new');          // → 'Новый'
label('неизвестный');  // → 'неизвестный' — вместо пустой ячейки в таблице`,
          ],
        },
        {
          sig: 'map.has(key)',
          key: 'has',
          summary: 'Есть ли ключ. Отличает «нет ключа» от «значение undefined» — get этого не умеет.',
          returns: 'boolean',
          complexity: 'O(1)',
          examples: [
            `const m = new Map([['a', undefined]]);

m.get('a');    // → undefined
m.has('a');    // → true — ключ есть, значение undefined
m.has('b');    // → false`,
            `// «уже загружали этот раздел?» — пустой ответ и отсутствие запроса это разное
const loaded = new Map([['orders', []]]);

loaded.has('orders');           // → true — сходили, данных нет
loaded.get('orders')?.length;   // → 0
loaded.has('users');            // → false — сюда ещё не ходили

// без has пустой массив не отличить от «не грузили»
(loaded.get('orders') ?? []).length === (loaded.get('users') ?? []).length;   // → true`,
          ],
        },
        {
          sig: 'map.delete(key)',
          key: 'delete',
          summary: 'Удаляет пару. Возвращает, была ли она.',
          returns: 'boolean',
          mutates: true,
          complexity: 'O(1)',
          examples: [
            `const m = new Map([['a', 1]]);
m.delete('a');   // → true
m.delete('a');   // → false
m.size;          // → 0`,
            `// инвалидация кеша: по ключу и по префиксу
const cache = new Map([['user:1', {}], ['user:2', {}], ['orders', {}]]);

cache.delete('user:1');   // → true

for (const key of [...cache.keys()]) {
  if (key.startsWith('user:')) cache.delete(key);
}
[...cache.keys()];   // → ['orders']`,
          ],
        },
        {
          sig: 'map.clear() / map.size',
          key: 'clear',
          summary: 'Очистка и размер. size — свойство и считается за O(1), в отличие от Object.keys(obj).length.',
          examples: [
            `const m = new Map([['a', 1], ['b', 2]]);
m.size;   // → 2
m.clear();
m.size;   // → 0`,
            `// сброс всего кеша при выходе пользователя — одна операция вместо перебора
const store = new Map([['user', {}], ['orders', []]]);
store.size;   // → 2
store.clear();
store.size;   // → 0

// size у Map — O(1); у объекта пришлось бы строить массив ключей
Object.keys({ a: 1, b: 2 }).length;   // → 2`,
          ],
        },
      ],
    },
    {
      title: 'Перебор',
      host: 'Map.prototype',
      entries: [
        {
          sig: 'for..of / [...map] / map.forEach(fn)',
          key: 'forEach',
          summary: 'Обход строго в порядке вставки. Каждый элемент — пара [ключ, значение].',
          complexity: 'O(n)',
          examples: [
            `const m = new Map([['a', 1], ['b', 2]]);

const out = [];
for (const [key, value] of m) out.push(key + value);
out;   // → ['a1', 'b2']

[...m];   // → [['a', 1], ['b', 2]]`,
            `// внимание на порядок аргументов: сначала значение, потом ключ
const m = new Map([['a', 1], ['b', 2]]);
const seen = [];
m.forEach((value, key) => seen.push([key, value]));
seen;   // → [['a', 1], ['b', 2]]`,
            `// словарь → опции селекта: порядок вставки задаёт порядок в списке
const labels = new Map([['new', 'Новый'], ['done', 'Готов']]);

const options = [];
for (const [value, label] of labels) options.push({ value, label });

options[0];       // → { value: 'new', label: 'Новый' }
options.length;   // → 2`,
          ],
          gotcha: 'В forEach у Map колбэк получает (value, key) — обратный порядок относительно пары [key, value] в for..of.',
        },
        {
          sig: 'map.keys() / values() / entries()',
          key: 'keys',
          summary: 'Итераторы по ключам, значениям и парам.',
          examples: [
            `const m = new Map([['a', 1], ['b', 2]]);

[...m.keys()];      // → ['a', 'b']
[...m.values()];    // → [1, 2]
[...m.entries()];   // → [['a', 1], ['b', 2]]`,
            `// методов массива у Map нет — разворачивай
const m = new Map([['a', 1], ['b', 5]]);

[...m.values()].reduce((a, b) => a + b, 0);              // → 6
[...m].filter(([, v]) => v > 1).map(([k]) => k);         // → ['b']

// отсортировать по значению и собрать обратно
const sorted = new Map([...m].sort((x, y) => y[1] - x[1]));
[...sorted.keys()];   // → ['b', 'a']`,
            `// статистика по счётчикам: сумма, лидер, порог
const counts = new Map([['/a', 3], ['/b', 7], ['/c', 1]]);

[...counts.values()].reduce((a, b) => a + b, 0);           // → 11
[...counts.entries()].sort((x, y) => y[1] - x[1])[0][0];   // → '/b'
[...counts.keys()].filter((k) => counts.get(k) > 2);       // → ['/a', '/b']`,
          ],
        },
        {
          sig: 'Map.groupBy(items, keyFn)',
          key: 'groupBy',
          summary: 'Группировка в Map. В отличие от Object.groupBy ключом может быть объект или число.',
          returns: 'Map',
          since: 'ES2024',
          examples: [
            `const nums = [1, 2, 3, 4, 5];
const groups = Map.groupBy(nums, (n) => n % 2);

groups.get(0);   // → [2, 4] — ключ именно число, а не строка '0'
groups.get(1);   // → [1, 3, 5]`,
            `// группировка по объекту-ключу — то, чего Object.groupBy не умеет в принципе
const dev = { name: 'разработка' };
const sales = { name: 'продажи' };
const users = [
  { id: 1, dept: dev },
  { id: 2, dept: dev },
  { id: 3, dept: sales },
];

const byDept = Map.groupBy(users, (u) => u.dept);
byDept.get(dev).length;     // → 2
byDept.get(sales).length;   // → 1
byDept.size;                // → 2`,
          ],
        },
      ],
    },
    {
      title: 'Map или объект',
      host: null,
      entries: [
        {
          sig: 'Сравнение Map и обычного объекта',
          key: null,
          summary: 'Объект — для фиксированной структуры с известными полями. Map — для набора пар, который меняется в рантайме.',
          examples: [
            `// ключи объекта всегда приводятся к строке
const obj = {};
obj[1] = 'число';
obj['1'] = 'строка';
Object.keys(obj);   // → ['1'] — один ключ, значение перетёрлось
obj[1];             // → 'строка'

const map = new Map();
map.set(1, 'число').set('1', 'строка');
map.size;           // → 2`,
            `// объект наследует свойства прототипа — на пользовательских ключах это дыра
const dict = {};
dict.toString;               // не undefined: метод из прототипа
typeof dict.toString;        // → 'function'
'toString' in dict;          // → true

const safe = new Map();
safe.has('toString');        // → false — Map чист`,
            `// размер и очистка
const m = new Map([['a', 1]]);
m.size;                        // → 1 — O(1)
Object.keys({ a: 1 }).length;  // → 1 — O(n), строит массив`,
          ],
          gotcha:
            'JSON.stringify(map) даёт "{}" — Map не сериализуется сама. Перед отправкой: Object.fromEntries(map) или [...map].',
        },
        {
          sig: 'WeakMap',
          key: null,
          summary: 'Словарь с объектными ключами, не мешающий сборке мусора. Не итерируется, size нет.',
          examples: [
            `const meta = new WeakMap();
const el = { id: 'node' };

meta.set(el, { clicks: 0 });
meta.get(el).clicks;   // → 0
meta.has(el);          // → true

// примитив ключом быть не может
try { meta.set('строка', 1); } catch { /* TypeError */ }
meta.has('строка');    // → false`,
            `// приватное состояние объекта, недоступное снаружи
const privateState = new WeakMap();
class Counter {
  constructor() { privateState.set(this, { n: 0 }); }
  inc() { privateState.get(this).n += 1; return this; }
  get value() { return privateState.get(this).n; }
}
new Counter().inc().inc().value;   // → 2`,
          ],
          gotcha:
            'Когда объект-ключ станет недостижим, запись исчезнет сама. Это и есть смысл: кеш по объекту, который не превращается в утечку памяти.',
        },
      ],
    },
    {
      title: 'Боевые сценарии',
      host: null,
      entries: [
        {
          sig: 'Порядок ключей: почему список ломается на объекте',
          key: null,
          summary: 'Разложить отсортированный ответ бэка в объект по числовому id — значит потерять порядок. Реальный баг, который ищут часами.',
          examples: [
            `// бэк отдал в нужном порядке: сначала 10, потом 2
const byIdObject = {};
byIdObject[10] = 'десятый';
byIdObject[2] = 'второй';

Object.keys(byIdObject);     // → ['2', '10'] — целые ключи молча пересортировались
Object.values(byIdObject);   // → ['второй', 'десятый'] — порядок с бэка потерян

const byIdMap = new Map();
byIdMap.set(10, 'десятый').set(2, 'второй');
[...byIdMap.keys()];     // → [10, 2] — порядок вставки как есть
[...byIdMap.values()];   // → ['десятый', 'второй']`,
            `// в объекте это не лечится: строковый ключ помогает, но только пока он не число
const o = {};
o['id-10'] = 1;
o['id-2'] = 2;
Object.keys(o);   // → ['id-10', 'id-2'] — нецелые ключи сохраняют порядок вставки`,
          ],
          gotcha:
            'Либо храни порядок отдельным массивом ids, либо бери Map. Полагаться на порядок ключей объекта с числовыми id нельзя.',
        },
        {
          sig: 'Дедупликация одновременных запросов (in-flight)',
          key: null,
          summary: 'Три компонента при монтировании просят один и тот же ресурс. Map с промисами превращает три запроса в один — так устроен дедуп в TanStack Query.',
          examples: [
            `const inFlight = new Map();

const fetchOnce = (key, loader) => {
  if (!inFlight.has(key)) {
    // финализатор снимает запись, иначе закешируется и провалившийся запрос
    inFlight.set(key, loader(key).finally(() => inFlight.delete(key)));
  }
  return inFlight.get(key);
};

let calls = 0;
const loader = () => { calls += 1; return Promise.resolve('данные'); };

const p1 = fetchOnce('/users', loader);
const p2 = fetchOnce('/users', loader);

p1 === p2;   // → true — второй компонент подписался на тот же промис
calls;       // → 1 — сеть дёрнули один раз`,
          ],
        },
        {
          sig: 'LRU-кеш на Map',
          key: null,
          summary: 'Map помнит порядок вставки, и это даёт вытеснение самого старого в несколько строк — без структуры данных и зависимостей.',
          complexity: 'O(1) на операцию',
          examples: [
            `const createLru = (limit) => {
  const store = new Map();
  return {
    get(key) {
      if (!store.has(key)) return undefined;
      const value = store.get(key);
      // переставляем в конец: обращение делает запись «свежей»
      store.delete(key);
      store.set(key, value);
      return value;
    },
    set(key, value) {
      store.delete(key);
      store.set(key, value);
      // первый ключ итератора — самый давний
      if (store.size > limit) store.delete(store.keys().next().value);
    },
    get keys() { return [...store.keys()]; },
  };
};

const lru = createLru(2);
lru.set('a', 1);
lru.set('b', 2);
lru.get('a');   // → 1 — 'a' стал свежим, вытеснится 'b'
lru.set('c', 3);
lru.keys;       // → ['a', 'c']
lru.get('b');   // → undefined`,
          ],
        },
        {
          sig: 'Индексы «многие ко многим»: Map + Set',
          key: null,
          summary: 'Связки из таблицы-джойна разворачиваются в два индекса — по пользователю и по роли.',
          examples: [
            `const grants = [
  { userId: 'u1', role: 'admin' },
  { userId: 'u1', role: 'editor' },
  { userId: 'u2', role: 'editor' },
];

const rolesByUser = new Map();
for (const g of grants) {
  if (!rolesByUser.has(g.userId)) rolesByUser.set(g.userId, new Set());
  rolesByUser.get(g.userId).add(g.role);
}

rolesByUser.get('u1').has('admin');   // → true
rolesByUser.get('u1').size;           // → 2
[...rolesByUser.keys()];              // → ['u1', 'u2']`,
            `// обратный индекс строится тем же проходом
const rolesByUser = new Map([
  ['u1', new Set(['admin', 'editor'])],
  ['u2', new Set(['editor'])],
]);

const usersByRole = new Map();
for (const [user, roles] of rolesByUser) {
  for (const role of roles) {
    usersByRole.set(role, [...(usersByRole.get(role) ?? []), user]);
  }
}

usersByRole.get('editor');   // → ['u1', 'u2']
usersByRole.get('admin');    // → ['u1']`,
          ],
        },
        {
          sig: 'Выбранные элементы с данными (не только id)',
          key: null,
          summary: 'Set хранит только id, а для «скачать выбранное» нужны сами строки — в том числе с других страниц, которых уже нет в списке.',
          examples: [
            `const selected = new Map();

const toggle = (row) => {
  if (!selected.delete(row.id)) selected.set(row.id, row);
};

toggle({ id: 1, name: 'Аня' });
toggle({ id: 2, name: 'Борис' });
toggle({ id: 1, name: 'Аня' });

selected.size;                                // → 1
[...selected.values()].map((r) => r.name);    // → ['Борис']
selected.has(2);                              // → true

// экспорт выбранного не зависит от текущей страницы таблицы
[...selected.values()];   // → [{ id: 2, name: 'Борис' }]`,
          ],
        },
        {
          sig: 'Таймеры и подписки по ключу',
          key: null,
          summary: 'Дебаунс на несколько независимых полей, подписки на несколько каналов — состояние живёт в Map, а не в куче переменных.',
          examples: [
            `const timers = new Map();

const debounceByKey = (key, fn, ms) => {
  clearTimeout(timers.get(key));   // clearTimeout(undefined) безопасен
  timers.set(key, setTimeout(fn, ms));
};

debounceByKey('search', () => {}, 300);
debounceByKey('search', () => {}, 300);
timers.size;   // → 1 — на ключ ровно один живой таймер

debounceByKey('autosave', () => {}, 1000);
timers.size;   // → 2

// в useEffect обязателен cleanup, иначе таймеры переживут размонтирование
for (const id of timers.values()) clearTimeout(id);
timers.clear();
timers.size;   // → 0`,
          ],
          gotcha:
            'Ключи в такой Map накапливаются: удаляй запись в самом колбэке или чисти при размонтировании — иначе это утечка на длинной сессии.',
        },
        {
          sig: 'Метрики и агрегация событий',
          key: null,
          summary: 'Счётчики по составному ключу, среднее и топ — типичная задача дашборда и логирования.',
          examples: [
            `const events = [
  { route: '/orders', ms: 120 },
  { route: '/orders', ms: 80 },
  { route: '/users', ms: 200 },
];

const stats = new Map();
for (const e of events) {
  const acc = stats.get(e.route) ?? { count: 0, total: 0 };
  acc.count += 1;
  acc.total += e.ms;
  stats.set(e.route, acc);
}

stats.get('/orders').count;   // → 2
stats.get('/orders').total;   // → 200

// среднее время ответа по каждому маршруту
[...stats].map(([route, s]) => [route, s.total / s.count]);
// → [['/orders', 100], ['/users', 200]]`,
            `// составной ключ — строкой, потому что объект-ключ сравнивается по ссылке
const key = (row) => row.city + '|' + row.status;
const rows = [
  { city: 'мск', status: 'ok' },
  { city: 'мск', status: 'ok' },
  { city: 'спб', status: 'fail' },
];

const counts = new Map();
for (const r of rows) counts.set(key(r), (counts.get(key(r)) ?? 0) + 1);

counts.get('мск|ok');     // → 2
counts.get('спб|fail');   // → 1
counts.size;              // → 2`,
          ],
        },
      ],
    },
  ],
};
