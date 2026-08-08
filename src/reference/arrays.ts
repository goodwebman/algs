import type { ApiGroup } from './types';

/**
 * Массивы. Ключевое деление, из-за которого чаще всего ловят баги:
 * одни методы возвращают новый массив, другие молча меняют исходный.
 */
export const ARRAYS: ApiGroup = {
  id: 'arrays',
  title: 'Массивы',
  intro:
    'Главное — держать в голове, что метод мутирует, а что возвращает копию. Мутирующих ровно девять: push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin. У четырёх из них с ES2023 есть иммутабельные близнецы: toSorted, toReversed, toSpliced, with.',
  sections: [
    {
      title: 'Создание',
      host: 'Array.prototype',
      entries: [
        {
          sig: 'Array.isArray(value)',
          key: 'isArray',
          summary: 'Единственная надёжная проверка «это массив». typeof здесь бесполезен.',
          returns: 'boolean',
          examples: [
            `Array.isArray([1, 2]);        // → true
Array.isArray('строка');      // → false
typeof [];                    // → 'object' — typeof массив не отличает`,
            `// ответ бэка бывает массивом, а бывает обёрткой { data: [...] }
const unwrap = (res) => (Array.isArray(res) ? res : (res.data ?? []));

unwrap([1, 2]);                  // → [1, 2]
unwrap({ data: [3] });           // → [3]
unwrap({ error: 'нет прав' });   // → [] — рендер списка не упадёт`,
            `// защита перед вызовом методов массива на данных неизвестной формы
const size = (v) => (Array.isArray(v) ? v.length : 0);

size(['a']);   // → 1
size(null);    // → 0
size('abc');   // → 0 — у строки length есть, но это не массив`,
          ],
        },
        {
          sig: 'Array.from(iterable, mapFn?)',
          key: 'from',
          summary: 'Делает массив из чего угодно итерируемого или похожего на массив. Второй аргумент — сразу map, без промежуточного массива.',
          returns: 'array',
          examples: [
            `Array.from('abc');                    // → ['a', 'b', 'c']
Array.from(new Set([1, 1, 2]));       // → [1, 2]
Array.from(new Map([['a', 1]]));      // → [['a', 1]]`,
            `// диапазон чисел — идиома, которую стоит запомнить
Array.from({ length: 5 }, (_, i) => i);        // → [0, 1, 2, 3, 4]
Array.from({ length: 3 }, (_, i) => i * 10);   // → [0, 10, 20]`,
            `// матрица без общих ссылок между строками
const grid = Array.from({ length: 2 }, () => new Array(3).fill(0));
grid[0][0] = 9;
grid;   // → [[9, 0, 0], [0, 0, 0]]`,
            `// NodeList «похож на массив», но методов массива у него нет
document.body.innerHTML = '<ul><li>раз</li><li>два</li></ul>';
const items = document.querySelectorAll('li');

typeof items.map;                            // → 'undefined'
Array.from(items, (el) => el.textContent);   // → ['раз', 'два']
[...items].length;                           // → 2`,
            `// скелетоны на время загрузки, годы для селекта, диапазон страниц
Array.from({ length: 3 }, (_, i) => 'skeleton-' + i);
// → ['skeleton-0', 'skeleton-1', 'skeleton-2']

const years = Array.from({ length: 4 }, (_, i) => 2026 - i);
years;   // → [2026, 2025, 2024, 2023]

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);
range(3, 6);   // → [3, 4, 5, 6]`,
            `// Array.from(Map) и Array.from(Set) — быстрый способ применить методы массива
const counts = new Map([['a', 3], ['b', 1]]);
Array.from(counts, ([key, n]) => key + ':' + n);   // → ['a:3', 'b:1']
Array.from(counts.values()).reduce((x, y) => x + y, 0);   // → 4`,
          ],
          gotcha:
            'Именно Array.from({ length: n }, fn), а не new Array(n).map(fn): map пропускает дырки, и второй вариант вернёт пустой массив с дырками.',
        },
        {
          sig: 'Array.of(...items)',
          key: 'of',
          summary: 'Массив из переданных значений. Существует ради одного случая — new Array(5).',
          returns: 'array',
          examples: [
            `Array.of(5);        // → [5]
new Array(5).length;  // → 5 — а это массив из пяти дырок, не [5]
Array.of(1, 2, 3);  // → [1, 2, 3]`,
          ],
        },
        {
          sig: 'new Array(n) / литерал / spread',
          key: null,
          summary: 'Три способа создать массив и их различия по дыркам.',
          examples: [
            `const holes = new Array(3);
holes.length;      // → 3
0 in holes;        // → false — дырка, не undefined
holes.map(() => 1).length;   // → 3
0 in holes.map(() => 1);     // → false — map перепрыгнул дырки

const filled = new Array(3).fill(0);
filled;            // → [0, 0, 0]`,
            `// spread разворачивает любой итерируемый объект
[...'abc'];                  // → ['a', 'b', 'c']
[...new Set([3, 3, 1])];     // → [3, 1]
[...[1, 2], ...[3]];         // → [1, 2, 3]`,
            `// матрица-заглушка и «пустое состояние» без общих ссылок между строками
const board = Array.from({ length: 2 }, () => Array(2).fill(null));
board[0][0] = 'X';
board;   // → [['X', null], [null, null]]

// spread в аргументы — Math не принимает массив
Math.max(...[3, 9, 1]);   // → 9
Math.max(3, 9, 1);        // → 9`,
          ],
          gotcha:
            'new Array(3).fill([]) кладёт в три ячейки один и тот же массив: push в первую строку изменит все. Для независимых элементов — Array.from({ length: 3 }, () => []).',
        },
        {
          sig: 'Array.fromAsync(asyncIterable)',
          key: 'fromAsync',
          summary: 'Собирает массив из асинхронного итератора или из массива промисов — последовательно, по одному.',
          returns: 'Promise<array>',
          since: 'ES2024',
          examples: [
            `// последовательно, а не параллельно: для параллели по-прежнему Promise.all
async function load(urls) {
  const pages = await Array.fromAsync(urls, (url) => fetch(url));
  return pages.length;
}
typeof load;   // → 'function'`,
          ],
        },
      ],
    },
    {
      title: 'Чтение и поиск',
      host: 'Array.prototype',
      entries: [
        {
          sig: 'arr.length',
          key: 'length',
          summary: 'Количество элементов. Записываемое свойство — присваивание обрезает или растягивает массив.',
          complexity: 'O(1)',
          examples: [
            `const arr = [1, 2, 3, 4];
arr.length;   // → 4

arr.length = 2;
arr;          // → [1, 2]

arr.length = 4;
arr;          // → [1, 2, undefined, undefined] (последние две — дырки)
2 in arr;     // → false`,
            `// обрезать лог до последних N — без создания нового массива
const log = ['a', 'b', 'c', 'd'];
log.length = 2;
log;   // → ['a', 'b']`,
            `// очистка на месте против переприсваивания: разница видна только по ссылкам
const shared = [1, 2, 3];
const alias = shared;
shared.length = 0;
alias;   // → [] — обе ссылки видят пустой массив

let other = [1, 2];
const otherAlias = other;
other = [];
otherAlias;   // → [1, 2] — старый массив жив, связь оборвалась`,
          ],
        },
        {
          sig: 'arr.at(index)',
          key: 'at',
          summary: 'Элемент по индексу с поддержкой отрицательных. Главный сценарий — «последний».',
          returns: 'элемент | undefined',
          complexity: 'O(1)',
          since: 'ES2022',
          examples: [
            `const arr = [10, 20, 30];

arr.at(0);    // → 10
arr.at(-1);   // → 30
arr.at(-2);   // → 20
arr.at(5);    // → undefined

// старый способ — и он тоже везде встречается
arr[arr.length - 1];   // → 30`,
            `// последний сегмент пути, последний шаг мастера, последнее сообщение
'/api/v1/users'.split('/').at(-1);   // → 'users'

const steps = ['данные', 'оплата', 'готово'];
steps.at(-1);   // → 'готово'
steps.at(-2);   // → 'оплата'

const messages = [{ text: 'привет' }, { text: 'как дела' }];
messages.at(-1).text;   // → 'как дела'
[].at(-1)?.text;        // → undefined — пустой чат не роняет рендер`,
            `// последняя страница пагинации и предыдущее значение в истории
const pages = [[1, 2], [3, 4], [5]];
pages.at(-1);          // → [5]
pages.at(-1).length;   // → 1

const history = ['/', '/orders', '/orders/7'];
history.at(-2) ?? '/';   // → '/orders' — куда вернёт кнопка «назад»`,
          ],
        },
        {
          sig: 'arr.indexOf(item, from?) / lastIndexOf',
          key: 'indexOf',
          summary: 'Индекс элемента по строгому равенству или -1.',
          returns: 'number',
          complexity: 'O(n)',
          examples: [
            `const arr = [10, 20, 30, 20];

arr.indexOf(20);       // → 1
arr.lastIndexOf(20);   // → 3
arr.indexOf(20, 2);    // → 3
arr.indexOf(99);       // → -1`,
            `// сравнение строгое: объекты ищутся по ссылке, NaN не находится вообще
[{ a: 1 }].indexOf({ a: 1 });   // → -1
[NaN].indexOf(NaN);             // → -1
[NaN].includes(NaN);            // → true`,
            `// навигация по вкладкам и слайдам с зацикливанием
const tabs = ['обзор', 'отзывы', 'вопросы'];
const next = (cur) => tabs[(tabs.indexOf(cur) + 1) % tabs.length];
const prev = (cur) => tabs[(tabs.indexOf(cur) - 1 + tabs.length) % tabs.length];

next('обзор');     // → 'отзывы'
next('вопросы');   // → 'обзор' — с конца на начало
prev('обзор');     // → 'вопросы'`,
            `// на объектах indexOf ищет по ссылке — для поиска по полю нужен findIndex
const rows = [{ id: 1 }, { id: 2 }];

rows.indexOf(rows[1]);               // → 1 — та же ссылка находится
rows.findIndex((r) => r.id === 2);   // → 1

// «есть ли уже такой элемент» на строках — самый частый честный кейс
const tags = ['js', 'ts'];
tags.indexOf('ts') !== -1;   // → true
tags.indexOf('go');          // → -1`,
          ],
        },
        {
          sig: 'arr.includes(item, from?)',
          key: 'includes',
          summary: 'Есть ли элемент. В отличие от indexOf находит NaN.',
          returns: 'boolean',
          complexity: 'O(n)',
          examples: [
            `[1, 2, 3].includes(2);      // → true
[1, 2, 3].includes('2');    // → false — без приведения типов`,
            `// в цикле includes даёт O(n²) — для больших данных нужен Set
const allowed = new Set(['a', 'b']);
allowed.has('a');   // → true`,
            `// белые списки методов, ролей и статусов — самое частое применение
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];
SAFE_METHODS.includes('GET');    // → true
SAFE_METHODS.includes('POST');   // → false

const user = { roles: ['editor', 'viewer'] };
user.roles.includes('admin');    // → false
user.roles.includes('editor');   // → true

// «показывать вкладку только на этих статусах»
['paid', 'done'].includes('new');   // → false`,
            `// includes на массиве значений фильтра
const selectedCities = ['мск', 'спб'];
const rows = [{ city: 'мск' }, { city: 'екб' }, { city: 'спб' }];

rows.filter((r) => selectedCities.includes(r.city)).length;   // → 2

// пустой фильтр = «все», иначе список схлопнется в ноль
const filtered = (rows, cities) =>
  cities.length === 0 ? rows : rows.filter((r) => cities.includes(r.city));
filtered(rows, []).length;   // → 3`,
          ],
          gotcha: 'Проверка вхождения внутри цикла по другому массиву — классический способ получить O(n·m). Заменяй на Set.',
        },
        {
          sig: 'arr.find(fn) / arr.findIndex(fn)',
          key: 'find',
          summary: 'Первый подходящий элемент / его индекс. Останавливаются на первом совпадении.',
          returns: 'элемент | undefined / number',
          complexity: 'O(n)',
          examples: [
            `const users = [
  { id: 1, name: 'Аня' },
  { id: 2, name: 'Борис' },
];

users.find((u) => u.id === 2);          // → { id: 2, name: 'Борис' }
users.findIndex((u) => u.id === 2);     // → 1
users.find((u) => u.id === 99);         // → undefined
users.findIndex((u) => u.id === 99);    // → -1`,
            `// найти и заменить иммутабельно: findIndex + with
const rows = [{ id: 1, done: false }, { id: 2, done: false }];
const i = rows.findIndex((r) => r.id === 2);
const next = i === -1 ? rows : rows.with(i, { ...rows[i], done: true });

next[1].done;   // → true
rows[1].done;   // → false — исходник не тронут`,
            `// значение селекта с запасным вариантом — вместо пустого поля
const options = [
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
];
const current = options.find((o) => o.value === 'de') ?? options[0];
current.label;   // → 'Русский'

// составное условие: первый оплаченный непустой заказ
const orders = [
  { paid: true, total: 0 },
  { paid: false, total: 900 },
  { paid: true, total: 500 },
];
orders.find((o) => o.paid && o.total > 0).total;   // → 500`,
            `// find по вложенному полю ответа бэка — с защитой от отсутствия
const res = { data: { items: [{ id: 'a', meta: { primary: false } }, { id: 'b', meta: {} }] } };
const primary = res.data.items.find((it) => it.meta?.primary);

primary;                    // → undefined
primary?.id ?? res.data.items[0].id;   // → 'a' — дефолт вместо падения`,
          ],
          gotcha:
            'find возвращает undefined, а findIndex — минус единицу. Проверка `if (index)` на нулевом индексе даст ложное «не найдено»: сравнивай с -1.',
        },
        {
          sig: 'arr.findLast(fn) / arr.findLastIndex(fn)',
          key: 'findLast',
          summary: 'То же самое, но поиск идёт с конца.',
          since: 'ES2023',
          complexity: 'O(n)',
          examples: [
            `const nums = [1, 8, 3, 9, 2];

nums.findLast((n) => n > 5);        // → 9
nums.findLastIndex((n) => n > 5);   // → 3

// раньше писали так — с копией и разворотом
[...nums].reverse().find((n) => n > 5);   // → 9`,
            `// последнее сообщение пользователя в чате, последняя ошибка в логе
const chat = [
  { from: 'user', text: 'привет' },
  { from: 'bot', text: 'здравствуйте' },
  { from: 'user', text: 'где заказ?' },
];
chat.findLast((m) => m.from === 'user').text;   // → 'где заказ?'

const log = [{ level: 'info' }, { level: 'error', code: 500 }, { level: 'info' }];
log.findLast((e) => e.level === 'error')?.code;   // → 500
log.findLast((e) => e.level === 'fatal')?.code;   // → undefined`,
            `// последняя пройденная стадия и текущий шаг — в трекере заказа
const stages = [
  { name: 'создан', done: true },
  { name: 'оплачен', done: true },
  { name: 'отправлен', done: false },
];
stages.findLast((s) => s.done).name;   // → 'оплачен'
stages.findLastIndex((s) => s.done);   // → 1
stages.findIndex((s) => !s.done);      // → 2 — на чём остановились`,
          ],
        },
        {
          sig: 'arr.some(fn) / arr.every(fn)',
          key: 'some',
          summary: 'Есть ли хоть один подходящий / подходят ли все. Обе останавливаются, как только ответ известен.',
          returns: 'boolean',
          complexity: 'O(n), выход раньше при первом решающем элементе',
          examples: [
            `const nums = [2, 4, 6];

nums.some((n) => n > 5);      // → true
nums.every((n) => n % 2 === 0);   // → true
nums.every((n) => n > 5);     // → false`,
            `// на пустом массиве: some — всегда false, every — всегда true
[].some(() => true);    // → false
[].every(() => false);  // → true`,
            `// состояние кнопки «Отправить» и сводка ошибок формы
const fields = [
  { name: 'email', error: null },
  { name: 'phone', error: 'обязательное поле' },
];

fields.every((f) => f.error === null);              // → false — кнопка disabled
fields.some((f) => f.error !== null);               // → true — показываем сводку
fields.filter((f) => f.error).map((f) => f.name);   // → ['phone']`,
            `// права: «хотя бы одна роль» против «все обязательные»
const roles = ['editor'];
['admin', 'editor'].some((r) => roles.includes(r));    // → true — доступ есть
['admin', 'editor'].every((r) => roles.includes(r));   // → false

// непрочитанные сообщения и «всё загрузилось»
const items = [{ read: true }, { read: false }];
items.some((i) => !i.read);   // → true — рисуем индикатор
items.every((i) => i.read);   // → false`,
            `// some дешевле, чем filter().length: выходит на первом совпадении
const rows = [{ status: 'fail' }, { status: 'ok' }, { status: 'ok' }];
rows.some((r) => r.status === 'fail');                 // → true — остановился сразу
rows.filter((r) => r.status === 'fail').length > 0;    // → true — прошёл весь массив`,
          ],
          gotcha: '`[].every(...)` === true ловит на валидации: «все поля заполнены» у пустой формы вернёт true.',
        },
      ],
    },
    {
      title: 'Перебор и преобразование (новый массив)',
      host: 'Array.prototype',
      entries: [
        {
          sig: 'arr.forEach(fn)',
          key: 'forEach',
          summary: 'Пробегает по элементам ради побочного эффекта. Ничего не возвращает и не умеет прерываться.',
          returns: 'undefined',
          complexity: 'O(n)',
          examples: [
            `const out = [];
[1, 2, 3].forEach((value, index, array) => {
  out.push(value * 10 + index);
});
out;   // → [10, 21, 32]`,
            `// break внутри forEach невозможен: return выходит только из колбэка
let sum = 0;
[1, 2, 3, 4].forEach((n) => {
  if (n > 2) return;   // не прерывает перебор, просто пропускает
  sum += n;
});
sum;   // → 3

// нужен выход — обычный for..of или some
let firstBig = 0;
for (const n of [1, 2, 3, 4]) {
  if (n > 2) { firstBig = n; break; }
}
firstBig;   // → 3`,
            `// forEach уместен ровно там, где нужен побочный эффект
const rows = [{ id: 10 }, { id: 20 }];
const positionById = new Map();
rows.forEach((row, i) => positionById.set(row.id, i));

positionById.get(20);   // → 1
positionById.size;      // → 2`,
            `// async-колбэк: вызовы стартуют, но forEach их не ждёт — «сохранено» покажется раньше времени
const started = [];
const save = (x) => { started.push(x); return Promise.resolve(x); };

[1, 2].forEach(async (x) => { await save(x); });
started;   // → [1, 2] — запросы ушли, но результата никто не дождался

// нужна последовательность — for..of с await; нужна параллель — Promise.all
typeof Promise.all([save(3), save(4)]).then;   // → 'function'`,
          ],
          gotcha: 'forEach не ждёт async-колбэк: внутри него await не задерживает перебор. Нужна последовательность — for..of с await.',
        },
        {
          sig: 'arr.map(fn)',
          key: 'map',
          summary: 'Новый массив той же длины: каждый элемент прогнан через функцию.',
          returns: 'array',
          complexity: 'O(n)',
          examples: [
            `[1, 2, 3].map((n) => n * 2);            // → [2, 4, 6]
[1, 2, 3].map((n, i) => n + i);         // → [1, 3, 5]
[{ id: 7 }, { id: 8 }].map((o) => o.id);   // → [7, 8]`,
            `// классическая ловушка: map(parseInt)
['1', '7', '11'].map(Number);      // → [1, 7, 11]
['1', '7', '11'].map(parseInt);    // → [1, NaN, 3]
// parseInt получает вторым аргументом индекс и принимает его за систему счисления`,
            `// map всегда сохраняет длину — фильтрация им не делается
[1, 2, 3].map((n) => (n > 1 ? n : null));   // → [null, 2, 3]
[1, 2, 3].filter((n) => n > 1);             // → [2, 3]`,
            `// DTO с бэка → модель для UI: переименование, склейка, приведение типов
const dto = [
  { user_id: 1, first_name: 'Аня', last_name: null, is_active: 1 },
  { user_id: 2, first_name: 'Борис', last_name: 'Петров', is_active: 0 },
];

const users = dto.map((u) => ({
  id: u.user_id,
  fullName: [u.first_name, u.last_name].filter(Boolean).join(' '),
  active: Boolean(u.is_active),
}));

users[0].fullName;   // → 'Аня' — null не превратился в 'Аня null'
users[1].fullName;   // → 'Борис Петров'
users[0].active;     // → true
users[1].active;     // → false`,
            `// опции для селекта и подписи для графика — из любой формы данных
const cities = [
  { code: 'msk', title: 'Москва' },
  { code: 'spb', title: 'Питер' },
];

cities.map((c) => ({ value: c.code, label: c.title }))[1].label;   // → 'Питер'
cities.map((c) => c.code).join(',');                               // → 'msk,spb'`,
            `// индекс в колбэке: нумерация, «последний элемент», зебра строк
const rows = ['раз', 'два', 'три'];

rows.map((text, i) => i + 1 + '. ' + text);   // → ['1. раз', '2. два', '3. три']
rows.map((_, i) => (i % 2 === 0 ? 'even' : 'odd'));   // → ['even', 'odd', 'even']
rows.map((text, i, all) => ({ text, last: i === all.length - 1 })).at(-1).last;   // → true`,
          ],
        },
        {
          sig: 'arr.filter(fn)',
          key: 'filter',
          summary: 'Новый массив из элементов, на которых колбэк вернул истину.',
          returns: 'array',
          complexity: 'O(n)',
          examples: [
            `[1, 2, 3, 4].filter((n) => n % 2 === 0);   // → [2, 4]

// выкинуть всё ложное разом
[0, 1, '', 'a', null, 2, undefined, NaN].filter(Boolean);   // → [1, 'a', 2]`,
            `// дедупликация по индексу первого вхождения
const ids = [1, 2, 1, 3, 2];
ids.filter((v, i, a) => a.indexOf(v) === i);   // → [1, 2, 3]

// это O(n²); на больших массивах — Set
[...new Set(ids)];   // → [1, 2, 3]`,
            `// поиск и фильтры из UI разом
const products = [
  { title: 'Футболка', price: 900, tags: ['sale'] },
  { title: 'Кружка', price: 300, tags: [] },
  { title: 'Футболка спорт', price: 2500, tags: ['sale', 'new'] },
];
const f = { query: 'футбол', maxPrice: 1000, tag: 'sale' };

const found = products.filter(
  (p) =>
    p.title.toLowerCase().includes(f.query.toLowerCase()) &&
    p.price <= f.maxPrice &&
    p.tags.includes(f.tag),
);
found.map((p) => p.title);   // → ['Футболка']`,
            `// пустое значение фильтра не должно схлопывать список в ноль
const rows = [{ city: 'мск' }, { city: 'спб' }];
const byCity = (list, city) => (city ? list.filter((r) => r.city === city) : list);

byCity(rows, 'мск').length;   // → 1
byCity(rows, '').length;      // → 2`,
            `// filter всегда возвращает новый массив — даже когда ничего не отсеял
const src = [1, 2];
const same = src.filter(() => true);

same;           // → [1, 2]
same === src;   // → false — новая ссылка перерисует memo-компонент`,
          ],
        },
        {
          sig: 'arr.reduce(fn, init?)',
          key: 'reduce',
          summary: 'Сворачивает массив в одно значение: сумма, объект, группировка, что угодно.',
          returns: 'любое значение',
          complexity: 'O(n)',
          examples: [
            `[1, 2, 3, 4].reduce((acc, n) => acc + n, 0);   // → 10
[1, 2, 3, 4].reduce((acc, n) => acc + n);      // → 10 — без init берёт первый элемент
[5, 1, 9].reduce((max, n) => (n > max ? n : max));   // → 9`,
            `// в объект-счётчик — самый частый нетривиальный сценарий
const words = ['a', 'b', 'a', 'c', 'a'];
const counts = words.reduce((acc, w) => {
  acc[w] = (acc[w] ?? 0) + 1;
  return acc;
}, {});
counts;   // → { a: 3, b: 1, c: 1 }`,
            `// группировка по ключу
const people = [
  { city: 'мск', name: 'Аня' },
  { city: 'спб', name: 'Борис' },
  { city: 'мск', name: 'Вера' },
];
const byCity = people.reduce((acc, p) => {
  (acc[p.city] ??= []).push(p.name);
  return acc;
}, {});
byCity;   // → { 'мск': ['Аня', 'Вера'], 'спб': ['Борис'] }`,
            `// цепочка функций — reduce не только про числа
const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);
pipe((n) => n + 1, (n) => n * 2)(3);   // → 8`,
            `// сумма корзины: считай в копейках, иначе всплывёт float
const cart = [
  { title: 'книга', priceKop: 30050, qty: 2 },
  { title: 'кружка', priceKop: 19990, qty: 1 },
];

const totalKop = cart.reduce((sum, i) => sum + i.priceKop * i.qty, 0);
totalKop;         // → 80090
totalKop / 100;   // → 800.9

// то же во float даёт мусор в младших разрядах
[0.1, 0.2].reduce((a, b) => a + b, 0);   // → 0.30000000000000004`,
            `// максимум и минимум по полю за один проход, без сортировки
const rows = [
  { name: 'a', ts: 5 },
  { name: 'b', ts: 12 },
  { name: 'c', ts: 3 },
];

rows.reduce((best, r) => (r.ts > best.ts ? r : best)).name;   // → 'b'
rows.reduce((best, r) => (r.ts < best.ts ? r : best)).name;   // → 'c'`,
            `// разложить на две корзины за один проход (выполненные / активные)
const [done, active] = [1, 2, 3, 4].reduce(
  ([d, a], n) => (n % 2 === 0 ? [[...d, n], a] : [d, [...a, n]]),
  [[], []],
);

done;     // → [2, 4]
active;   // → [1, 3]`,
            `// сборка Map-индекса прямо в reduce — когда нужен именно Map, а не объект
const users = [{ id: 'u1', name: 'Аня' }, { id: 'u2', name: 'Борис' }];
const byId = users.reduce((map, u) => map.set(u.id, u), new Map());

byId.get('u2').name;   // → 'Борис'
byId.size;             // → 2`,
          ],
          gotcha:
            'reduce на пустом массиве без начального значения бросает TypeError. И не забывай возвращать аккумулятор — самая частая ошибка: тело в фигурных скобках без return даёт undefined на второй итерации.',
        },
        {
          sig: 'arr.reduceRight(fn, init?)',
          key: 'reduceRight',
          summary: 'То же, но справа налево. Нужен там, где важна правая ассоциативность.',
          complexity: 'O(n)',
          examples: [
            `[['a'], ['b'], ['c']].reduceRight((acc, cur) => acc.concat(cur), []);   // → ['c', 'b', 'a']

// compose: справа налево, в отличие от pipe
const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);
compose((n) => n + 1, (n) => n * 2)(3);   // → 7`,
            `// сборка цепочки middleware — так устроен applyMiddleware в Redux
const logger = (next) => (action) => next(action + ':log');
const auth = (next) => (action) => next(action + ':auth');
const base = (action) => action;

const chain = [logger, auth].reduceRight((next, mw) => mw(next), base);
chain('act');   // → 'act:log:auth' — обёртки применяются слева направо`,
          ],
        },
        {
          sig: 'arr.flat(depth?)',
          key: 'flat',
          summary: 'Разворачивает вложенные массивы на заданную глубину (по умолчанию 1).',
          returns: 'array',
          since: 'ES2019',
          examples: [
            `[1, [2, 3], [4]].flat();              // → [1, 2, 3, 4]
[1, [2, [3, [4]]]].flat();            // → [1, 2, [3, [4]]]
[1, [2, [3, [4]]]].flat(2);           // → [1, 2, 3, [4]]
[1, [2, [3, [4]]]].flat(Infinity);    // → [1, 2, 3, 4]

// заодно выкидывает дырки
[1, , 3].flat();   // → [1, 3]`,
            `// страницы бесконечного списка — в один массив
const pages = [{ items: [1, 2] }, { items: [3] }, { items: [] }];

pages.map((p) => p.items).flat();   // → [1, 2, 3]
pages.flatMap((p) => p.items);      // → [1, 2, 3] — то же за один проход`,
            `// результаты Promise.all по батчам и склейка ответов нескольких эндпоинтов
const batches = [['a', 'b'], ['c'], []];
batches.flat();          // → ['a', 'b', 'c']
batches.flat().length;   // → 3`,
          ],
        },
        {
          sig: 'arr.flatMap(fn)',
          key: 'flatMap',
          summary: 'map + flat(1) за один проход. Позволяет вернуть из колбэка ноль, один или несколько элементов.',
          returns: 'array',
          since: 'ES2019',
          examples: [
            `[1, 2, 3].flatMap((n) => [n, n * 2]);   // → [1, 2, 2, 4, 3, 6]

// пустой массив = «выкинуть элемент», один элемент = «оставить»
[1, 2, 3, 4].flatMap((n) => (n % 2 === 0 ? [n] : []));   // → [2, 4]`,
            `// разбор строк в слова одним проходом
['раз два', 'три'].flatMap((s) => s.split(' '));   // → ['раз', 'два', 'три']`,
            `// ошибки валидации с бэка — в плоский список для тостов
const res = {
  errors: [
    { field: 'email', messages: ['неверный формат'] },
    { field: 'phone', messages: ['обязательное', 'слишком короткий'] },
  ],
};

const flat = res.errors.flatMap((e) => e.messages.map((m) => e.field + ': ' + m));
flat.length;   // → 3
flat[2];       // → 'phone: слишком короткий'`,
            `// фильтр и преобразование одним проходом: пустой массив = «выкинуть элемент»
const raw = [
  { id: 1, price: '100' },
  { id: 2, price: null },
  { id: 3, price: '50' },
];

const prices = raw.flatMap((r) => (r.price === null ? [] : [Number(r.price)]));
prices;   // → [100, 50]

// то же через filter + map — два прохода и промежуточный массив
raw.filter((r) => r.price !== null).map((r) => Number(r.price));   // → [100, 50]`,
          ],
        },
        {
          sig: 'arr.join(separator?)',
          key: 'join',
          summary: 'Склеивает элементы в строку. Разделитель по умолчанию — запятая.',
          returns: 'string',
          complexity: 'O(n)',
          examples: [
            `[1, 2, 3].join();       // → '1,2,3'
[1, 2, 3].join('-');    // → '1-2-3'
[1, 2, 3].join('');     // → '123'`,
            `// null и undefined превращаются в пустую строку, а не в 'null'
[1, null, undefined, 2].join('-');   // → '1---2'

// вложенные массивы склеиваются рекурсивно, но своим разделителем
[[1, 2], [3]].join(';');   // → '1,2;3'`,
            `// перечисления в интерфейсе
const tags = ['новинка', 'скидка', 'хит'];
tags.join(', ');   // → 'новинка, скидка, хит'

// «и ещё N» вместо длинного хвоста
const head = tags.slice(0, 2).join(', ');
head + (tags.length > 2 ? ' и ещё ' + (tags.length - 2) : '');   // → 'новинка, скидка и ещё 1'

// правильный последний разделитель по локали — это уже Intl
new Intl.ListFormat('ru').format(tags);   // → 'новинка, скидка и хит'`,
            `// пути, составные ключи и CSV
['users', '42', 'orders'].join('/');   // → 'users/42/orders'
['мск', 'ok'].join('|');               // → 'мск|ok'

const rows = [{ id: 1, name: 'Аня' }, { id: 2, name: 'Борис' }];
const csv = [['id', 'name'], ...rows.map((r) => [r.id, r.name])]
  .map((r) => r.join(','))
  .join('\\n');
csv;   // → 'id,name\\n1,Аня\\n2,Борис'`,
          ],
        },
        {
          sig: 'arr.entries() / keys() / values()',
          key: 'entries',
          summary: 'Итераторы по парам [индекс, значение] / индексам / значениям.',
          returns: 'Iterator',
          examples: [
            `const arr = ['a', 'b'];

[...arr.entries()];   // → [[0, 'a'], [1, 'b']]
[...arr.keys()];      // → [0, 1]
[...arr.values()];    // → ['a', 'b']`,
            `// индекс и значение в for..of — без счётчика вручную
const out = [];
for (const [i, value] of ['a', 'b'].entries()) out.push(i + value);
out;   // → ['0a', '1b']`,
            `// нумерация строк таблицы и флаги «первый / последний»
const rows = ['раз', 'два', 'три'];
const numbered = [];
for (const [i, text] of rows.entries()) {
  numbered.push({ n: i + 1, text, first: i === 0, last: i === rows.length - 1 });
}

numbered[0].first;    // → true
numbered.at(-1).n;    // → 3
numbered.at(-1).last; // → true`,
          ],
        },
      ],
    },
    {
      title: 'Изменение на месте (мутируют!)',
      host: 'Array.prototype',
      entries: [
        {
          sig: 'arr.push(...items) / arr.pop()',
          key: 'push',
          summary: 'Добавить в конец / забрать с конца. Основа стека.',
          returns: 'новая длина / удалённый элемент',
          mutates: true,
          complexity: 'O(1) амортизированно',
          examples: [
            `const stack = [1, 2];

stack.push(3);       // → 3 (новая длина)
stack;               // → [1, 2, 3]
stack.push(4, 5);    // → 5
stack.pop();         // → 5
stack;               // → [1, 2, 3, 4]

[].pop();            // → undefined — на пустом не падает`,
            `// история для undo: стек с ограничением глубины
const history = [];
const commit = (state) => {
  history.push(state);
  if (history.length > 3) history.shift();
};

[1, 2, 3, 4].forEach(commit);
history;        // → [2, 3, 4] — самое старое вытеснено
history.pop();  // → 4 — шаг назад
history;        // → [2, 3]`,
            `// накопление результатов в цикле: push, а не concat в аккумуляторе
const rows = [{ ok: true, v: 1 }, { ok: false, v: 2 }, { ok: true, v: 3 }];
const out = [];
for (const row of rows) {
  if (row.ok) out.push(row.v);
}
out;   // → [1, 3]`,
          ],
        },
        {
          sig: 'arr.shift() / arr.unshift(...items)',
          key: 'shift',
          summary: 'Забрать с начала / добавить в начало. Оба сдвигают все индексы.',
          returns: 'удалённый элемент / новая длина',
          mutates: true,
          complexity: 'O(n) — вся лента переезжает',
          examples: [
            `const queue = [1, 2, 3];

queue.shift();        // → 1
queue;                // → [2, 3]
queue.unshift(0);     // → 3 (новая длина)
queue;                // → [0, 2, 3]`,
            `// очередь на shift() превращает BFS в O(n²).
// правильная очередь — указатель на голову, без сдвигов
const items = [1, 2, 3];
let head = 0;
const next = items[head++];
next;   // → 1
head;   // → 1`,
            `// лента уведомлений: новое сверху, хвост отваливается
const feed = [];
const add = (e) => {
  feed.unshift(e);
  feed.length = Math.min(feed.length, 3);
};

['a', 'b', 'c', 'd'].forEach(add);
feed;   // → ['d', 'c', 'b']`,
          ],
          gotcha: 'shift в цикле по большому массиву — самая дорогая ошибка в задачах на BFS. Держи указатель головы.',
        },
        {
          sig: 'arr.splice(start, deleteCount?, ...items)',
          key: 'splice',
          summary: 'Швейцарский нож: удаляет, вставляет и заменяет на месте. Возвращает удалённое.',
          returns: 'array удалённых',
          mutates: true,
          complexity: 'O(n) — хвост сдвигается',
          examples: [
            `// удалить
const arr = ['a', 'b', 'c', 'd'];
arr.splice(1, 2);   // → ['b', 'c'] (что удалили)
arr;                // → ['a', 'd']`,
            `// вставить, ничего не удаляя: deleteCount = 0
const arr = ['a', 'd'];
arr.splice(1, 0, 'b', 'c');
arr;   // → ['a', 'b', 'c', 'd']`,
            `// заменить
const arr = ['a', 'b', 'c'];
arr.splice(1, 1, 'X');
arr;   // → ['a', 'X', 'c']`,
            `// удалить по значению — частый паттерн
const arr = ['a', 'b', 'c'];
const i = arr.indexOf('b');
if (i !== -1) arr.splice(i, 1);
arr;   // → ['a', 'c']

// отрицательный старт — с конца
const tail = [1, 2, 3, 4];
tail.splice(-2);   // → [3, 4]
tail;              // → [1, 2]`,
            `// перемещение элемента (drag & drop): вырезать и вставить
const move = (arr, from, to) => {
  const copy = [...arr];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
};

move(['a', 'b', 'c'], 0, 2);   // → ['b', 'c', 'a']
move(['a', 'b', 'c'], 2, 0);   // → ['c', 'a', 'b']`,
          ],
          gotcha:
            'splice(1) без второго аргумента удаляет всё до конца, а splice(1, 0) — ничего. Не путай с slice: тот не мутирует и берёт (start, end).',
        },
        {
          sig: 'arr.sort(compareFn?)',
          key: 'sort',
          summary: 'Сортирует на месте и возвращает тот же массив. Без компаратора сравнивает строки.',
          returns: 'тот же массив',
          mutates: true,
          complexity: 'O(n log n), в V8 — TimSort, стабильная с ES2019',
          examples: [
            `// без компаратора всё приводится к строке — числа ломаются
[10, 9, 1].sort();              // → [1, 10, 9]
[10, 9, 1].sort((a, b) => a - b);   // → [1, 9, 10]
[10, 9, 1].sort((a, b) => b - a);   // → [10, 9, 1]`,
            `// объекты: по числу — вычитание, по строке — localeCompare
const users = [
  { name: 'Вера', age: 30 },
  { name: 'Аня', age: 25 },
];
[...users].sort((a, b) => a.age - b.age)[0].name;                 // → 'Аня'
[...users].sort((a, b) => a.name.localeCompare(b.name))[0].name;  // → 'Аня'`,
            `// сортировка по нескольким полям: || переходит к следующему критерию
const rows = [
  { city: 'мск', age: 30 },
  { city: 'мск', age: 20 },
  { city: 'спб', age: 25 },
];
rows.sort((a, b) => a.city.localeCompare(b.city) || a.age - b.age);
rows.map((r) => r.age);   // → [20, 30, 25]`,
            `// sort мутирует: копируй, если исходник кому-то ещё нужен
const original = [3, 1, 2];
const sorted = [...original].sort((a, b) => a - b);
original;   // → [3, 1, 2]
sorted;     // → [1, 2, 3]`,
            `// даты: вычитай времена, а не сравнивай объекты Date
const items = [{ at: '2024-05-17T10:00:00Z' }, { at: '2024-01-02T10:00:00Z' }];

items.toSorted((a, b) => new Date(a.at) - new Date(b.at))[0].at;   // → '2024-01-02T10:00:00Z'

// ISO-строки сравниваются лексикографически верно — Date можно не создавать
items.toSorted((a, b) => a.at.localeCompare(b.at))[0].at;          // → '2024-01-02T10:00:00Z'`,
            `// на длинных списках Collator создают один раз: localeCompare в компараторе дорог
const collator = new Intl.Collator('ru', { sensitivity: 'base' });
['Яд', 'ель', 'Ёж'].sort(collator.compare);   // → ['Ёж', 'ель', 'Яд']

// sensitivity: 'base' приравнивает ё к е и игнорирует регистр
collator.compare('ёж', 'еж');   // → 0`,
          ],
          gotcha:
            'Компаратор должен возвращать число, а не boolean. `(a, b) => a > b` — молчаливый баг: false приводится к 0, и порядок получается частичным.',
        },
        {
          sig: 'arr.reverse()',
          key: 'reverse',
          summary: 'Переворачивает массив на месте.',
          returns: 'тот же массив',
          mutates: true,
          complexity: 'O(n)',
          examples: [
            `const arr = [1, 2, 3];
arr.reverse();   // → [3, 2, 1]
arr;             // → [3, 2, 1] — исходник изменён

// безопасно: копия или toReversed
[1, 2, 3].toReversed();   // → [3, 2, 1]`,
            `// «последние N, новые сверху» — лог и лента событий
const log = ['a', 'b', 'c', 'd'];
log.slice(-2).reverse();   // → ['d', 'c']
log;                       // → ['a', 'b', 'c', 'd'] — slice уже сделал копию`,
          ],
        },
        {
          sig: 'arr.fill(value, start?, end?)',
          key: 'fill',
          summary: 'Забивает диапазон одним значением. Заполняет и дырки.',
          returns: 'тот же массив',
          mutates: true,
          examples: [
            `new Array(3).fill(0);          // → [0, 0, 0]
[1, 2, 3, 4].fill(0, 1);       // → [1, 0, 0, 0]
[1, 2, 3, 4].fill(0, 1, 3);    // → [1, 0, 0, 4]
[1, 2, 3].fill(9, -1);         // → [1, 2, 9]`,
            `// одно и то же значение по ссылке во всех ячейках
const rows = new Array(2).fill([]);
rows[0].push('x');
rows[1];   // → ['x'] — это тот же самый массив!`,
            `// сброс счётчиков и буфера без выделения нового массива
const counts = new Array(3).fill(0);
counts[1] += 5;
counts;   // → [0, 5, 0]

counts.fill(0);
counts;   // → [0, 0, 0]

// частичный сброс: только «хвост» после позиции
const flags = [true, true, true, true];
flags.fill(false, 2);
flags;   // → [true, true, false, false]`,
          ],
        },
        {
          sig: 'arr.copyWithin(target, start?, end?)',
          key: 'copyWithin',
          summary: 'Копирует кусок массива внутрь него же, не меняя длину. В прикладном коде встречается редко.',
          returns: 'тот же массив',
          mutates: true,
          examples: [
            `[1, 2, 3, 4, 5].copyWithin(0, 3);      // → [4, 5, 3, 4, 5]
[1, 2, 3, 4, 5].copyWithin(0, 3, 4);   // → [4, 2, 3, 4, 5]`,
          ],
        },
      ],
    },
    {
      title: 'Копии без мутации',
      host: 'Array.prototype',
      entries: [
        {
          sig: 'arr.slice(start?, end?)',
          key: 'slice',
          summary: 'Кусок массива [start, end) новым массивом. Без аргументов — поверхностная копия.',
          returns: 'array',
          complexity: 'O(k)',
          examples: [
            `const arr = [1, 2, 3, 4, 5];

arr.slice(1, 3);   // → [2, 3]
arr.slice(2);      // → [3, 4, 5]
arr.slice(-2);     // → [4, 5]
arr.slice();       // → [1, 2, 3, 4, 5] — копия
arr;               // → [1, 2, 3, 4, 5] — исходник цел`,
            `// копия поверхностная: вложенные объекты общие
const nested = [{ n: 1 }];
const copy = nested.slice();
copy[0].n = 42;
nested[0].n;   // → 42`,
            `// «первые N» и «последние N» — превью списка и хвост лога
const rows = [1, 2, 3, 4, 5];

rows.slice(0, 3);    // → [1, 2, 3]
rows.slice(-2);      // → [4, 5]
rows.slice(0, 99);   // → [1, 2, 3, 4, 5] — выход за границы безопасен
rows.slice(3, 1);    // → [] — пустой результат вместо ошибки`,
            `// копия перед мутирующей операцией — обязательная привычка в React
const props = [3, 1, 2];
const sorted = props.slice().sort((a, b) => a - b);

props;    // → [3, 1, 2]
sorted;   // → [1, 2, 3]`,
          ],
        },
        {
          sig: 'arr.concat(...items)',
          key: 'concat',
          summary: 'Склеивает массивы в новый. Разворачивает переданные массивы на один уровень.',
          returns: 'array',
          examples: [
            `[1, 2].concat([3, 4]);        // → [1, 2, 3, 4]
[1].concat(2, [3], [[4]]);    // → [1, 2, 3, [4]]

// то же самое спредом — читается лучше
[...[1, 2], ...[3, 4]];       // → [1, 2, 3, 4]`,
            `// подгрузка следующей страницы бесконечного списка
const loaded = [{ id: 1 }, { id: 2 }];
const nextPage = [{ id: 3 }];

const all = loaded.concat(nextPage);
all.length;      // → 3
loaded.length;   // → 2 — прежнее состояние не тронуто

// с дедупом по id, если бэк может прислать пересечение
const merged = [...new Map([...loaded, ...nextPage].map((r) => [r.id, r])).values()];
merged.length;   // → 3`,
          ],
        },
        {
          sig: 'arr.toSorted(fn?) / toReversed() / toSpliced(...) / with(i, v)',
          key: 'toSorted',
          summary: 'Иммутабельные версии sort, reverse, splice и присваивания по индексу. То, чего не хватало в React-коде.',
          returns: 'новый array',
          since: 'ES2023',
          examples: [
            `const arr = [3, 1, 2];

arr.toSorted((a, b) => a - b);   // → [1, 2, 3]
arr.toReversed();                // → [2, 1, 3]
arr.with(0, 99);                 // → [99, 1, 2]
arr.toSpliced(1, 1, 'X');        // → [3, 'X', 2]
arr;                             // → [3, 1, 2] — исходник не тронут`,
            `// в state React это то, что нужно: новая ссылка без мутации
const items = [{ id: 1, done: false }];
const next = items.with(0, { ...items[0], done: true });
next[0].done;    // → true
items[0].done;   // → false`,
            `// сортировка прямо в рендере: мутировать пропс нельзя
const rows = [{ n: 3 }, { n: 1 }];
const view = rows.toSorted((a, b) => a.n - b.n);

view.map((r) => r.n);   // → [1, 3]
rows.map((r) => r.n);   // → [3, 1] — пропс цел

// удалить элемент по индексу без filter и без splice
rows.toSpliced(0, 1).length;   // → 1`,
          ],
        },
      ],
    },
    {
      title: 'Грабли и приёмы',
      host: null,
      entries: [
        {
          sig: 'Сравнение и копирование массивов',
          key: null,
          summary: '=== сравнивает ссылки, а не содержимое. Копия по умолчанию поверхностная.',
          examples: [
            `[1, 2] === [1, 2];   // → false — разные объекты
JSON.stringify([1, 2]) === JSON.stringify([1, 2]);   // → true (но ломается на undefined и порядке ключей)

// поэлементно
const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
same([1, 2], [1, 2]);   // → true`,
            `// глубокая копия без ручной рекурсии
const src = [{ n: 1 }];
const deep = structuredClone(src);
deep[0].n = 2;
src[0].n;   // → 1`,
          ],
        },
        {
          sig: 'delete arr[i] и разреженные массивы',
          key: null,
          summary: 'delete не сдвигает элементы, а оставляет дырку. Длина не меняется.',
          examples: [
            `const arr = [1, 2, 3];
delete arr[1];
arr.length;   // → 3
1 in arr;     // → false
arr;          // → [1, undefined, 3] (в середине дырка)

// правильно — splice
const ok = [1, 2, 3];
ok.splice(1, 1);
ok;           // → [1, 3]`,
          ],
          gotcha:
            'Дырки ведут себя непредсказуемо: forEach/map/filter их пропускают, а for..of и Array.from видят как undefined.',
        },
        {
          sig: 'Частые однострочники',
          key: null,
          summary: 'Приёмы, которые проще запомнить, чем выводить каждый раз.',
          examples: [
            `const arr = [5, 3, 8, 1];

// сумма, максимум, минимум
arr.reduce((a, b) => a + b, 0);   // → 17
Math.max(...arr);                 // → 8
Math.min(...arr);                 // → 1`,
            `// уникальные, пересечение, разность
const a = [1, 2, 3, 3];
const b = [3, 4];
[...new Set(a)];                                  // → [1, 2, 3]
a.filter((x) => b.includes(x));                   // → [3, 3]
[...new Set(a)].filter((x) => !b.includes(x));    // → [1, 2]`,
            `// разбить на куски по n
const chunk = (a, n) =>
  Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));
chunk([1, 2, 3, 4, 5], 2);   // → [[1, 2], [3, 4], [5]]`,
            `// перемешать (Fisher–Yates) — sort(() => Math.random() - 0.5) даёт неравномерное распределение
const shuffle = (a) => {
  const copy = [...a];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};
shuffle([1, 2, 3]).length;   // → 3`,
            `// транспонировать матрицу
const m = [[1, 2, 3], [4, 5, 6]];
m[0].map((_, i) => m.map((row) => row[i]));   // → [[1, 4], [2, 5], [3, 6]]`,
          ],
        },
      ],
    },
    {
      title: 'Боевые сценарии: данные с бэкенда',
      host: null,
      entries: [
        {
          sig: 'Нормализация списка: ids + byId',
          key: null,
          summary: 'Форма, к которой сводят любой список в state: массив id для порядка и словарь для доступа за O(1).',
          examples: [
            `const res = {
  data: [
    { id: 'u1', name: 'Аня', roleId: 'r1' },
    { id: 'u2', name: 'Борис', roleId: 'r2' },
  ],
};

const ids = res.data.map((u) => u.id);
const byId = Object.fromEntries(res.data.map((u) => [u.id, u]));

ids;               // → ['u1', 'u2']
byId.u2.name;      // → 'Борис'
byId.u1.roleId;    // → 'r1'`,
            `// точечное обновление одного элемента: остальные сохраняют ссылку,
// поэтому React.memo не перерисует нетронутые строки списка
const byId = { u1: { id: 'u1', name: 'Аня' }, u2: { id: 'u2', name: 'Борис' } };
const next = { ...byId, u1: { ...byId.u1, name: 'Анна' } };

next.u1.name;          // → 'Анна'
byId.u1.name;          // → 'Аня'
next.u2 === byId.u2;   // → true — вторая строка не тронута`,
            `// вернуть список в исходном порядке
const ids = ['u2', 'u1'];
const byId = { u1: { name: 'Аня' }, u2: { name: 'Борис' } };
ids.map((id) => byId[id]).map((u) => u.name);   // → ['Борис', 'Аня']`,
          ],
          gotcha:
            'Не храни список объектов и его копию по id одновременно — рассинхрон гарантирован. Источник правды один: byId, а массив — только порядок id.',
        },
        {
          sig: 'Джойн двух коллекций без вложенного цикла',
          key: null,
          summary: 'Подтянуть пользователя к каждому заказу. find внутри map — это O(n·m), индекс через Map — O(n + m).',
          examples: [
            `const users = [
  { id: 1, name: 'Аня' },
  { id: 2, name: 'Борис' },
];
const orders = [
  { id: 'o1', userId: 2, total: 500 },
  { id: 'o2', userId: 1, total: 300 },
  { id: 'o3', userId: 99, total: 200 },
];

// ❌ так пишут чаще всего: find бежит по всем users для каждого заказа
const slow = orders.map((o) => ({ ...o, user: users.find((u) => u.id === o.userId) }));
slow[0].user.name;   // → 'Борис'

// ✅ индекс строится один раз
const userById = new Map(users.map((u) => [u.id, u]));
const rows = orders.map((o) => ({ ...o, user: userById.get(o.userId) ?? null }));

rows[0].user.name;   // → 'Борис'
rows[2].user;        // → null — битая ссылка с бэка не роняет рендер`,
            `// «повесить» детей на родителей одним проходом
const posts = [{ id: 'p1' }, { id: 'p2' }];
const comments = [
  { id: 'c1', postId: 'p1' },
  { id: 'c2', postId: 'p1' },
  { id: 'c3', postId: 'p2' },
];

const byPost = new Map(posts.map((p) => [p.id, []]));
for (const c of comments) byPost.get(c.postId)?.push(c);

const withComments = posts.map((p) => ({ ...p, comments: byPost.get(p.id) }));
withComments[0].comments.length;   // → 2
withComments[1].comments[0].id;    // → 'c3'`,
          ],
          gotcha:
            'Всегда проверяй промах индекса: битые внешние ключи в ответе бэка — норма, а `user.name` на undefined роняет весь рендер.',
        },
        {
          sig: 'Плоский список → дерево (категории, комментарии, меню)',
          key: null,
          summary: 'Бэк отдаёт плоские строки с parentId, UI хочет вложенность. Два прохода, порядок строк в ответе не важен.',
          complexity: 'O(n)',
          examples: [
            `// родитель может прийти позже ребёнка — поэтому сначала строим все узлы
const rows = [
  { id: 3, parentId: 1, title: 'Ноутбуки' },
  { id: 1, parentId: null, title: 'Техника' },
  { id: 2, parentId: 1, title: 'Телефоны' },
  { id: 4, parentId: 2, title: 'Кнопочные' },
];

const buildTree = (flat) => {
  const nodes = new Map(flat.map((row) => [row.id, { ...row, children: [] }]));
  const roots = [];
  for (const node of nodes.values()) {
    const parent = node.parentId === null ? null : nodes.get(node.parentId);
    (parent ? parent.children : roots).push(node);
  }
  return roots;
};

const tree = buildTree(rows);
tree.length;                              // → 1
tree[0].title;                            // → 'Техника'
tree[0].children.map((c) => c.title);     // → ['Ноутбуки', 'Телефоны']
tree[0].children[1].children[0].title;    // → 'Кнопочные'`,
            `// обратно в плоский список с глубиной — для отрисовки отступами
const tree = [
  { id: 1, children: [{ id: 2, children: [{ id: 3, children: [] }] }] },
  { id: 4, children: [] },
];

const flatten = (nodes, depth = 0) =>
  nodes.flatMap((n) => [{ id: n.id, depth }, ...flatten(n.children, depth + 1)]);

flatten(tree).map((n) => n.id);      // → [1, 2, 3, 4]
flatten(tree).map((n) => n.depth);   // → [0, 1, 2, 0]`,
          ],
          gotcha:
            'Битый parentId (родителя нет в выборке) молча теряет ветку. Либо считай такие узлы корнями, либо логируй — иначе часть данных просто не отрисуется.',
        },
        {
          sig: 'Группировка с агрегацией (отчёт по категориям)',
          key: null,
          summary: 'Сырые строки продаж → сводка с суммами и сортировкой. Один reduce вместо трёх проходов.',
          examples: [
            `const sales = [
  { category: 'книги', total: 300, qty: 2 },
  { category: 'софт', total: 1200, qty: 1 },
  { category: 'книги', total: 150, qty: 1 },
];

const report = Object.values(
  sales.reduce((acc, row) => {
    acc[row.category] ??= { category: row.category, total: 0, qty: 0 };
    acc[row.category].total += row.total;
    acc[row.category].qty += row.qty;
    return acc;
  }, {}),
).sort((a, b) => b.total - a.total);

report.map((r) => r.category);   // → ['софт', 'книги']
report[1].total;                 // → 450
report[1].qty;                   // → 3`,
            `// доли в процентах — считаются после агрегации, вторым проходом
const totals = [{ name: 'a', v: 30 }, { name: 'b', v: 10 }];
const sum = totals.reduce((s, r) => s + r.v, 0);
const withShare = totals.map((r) => ({ ...r, share: Math.round((r.v / sum) * 100) }));
withShare.map((r) => r.share);   // → [75, 25]`,
          ],
        },
        {
          sig: 'Сортировка таблицы: направление, null-ы, локаль',
          key: null,
          summary: 'Компаратор, который переживает продакшен: пустые значения всегда внизу, строки по локали, направление снаружи.',
          examples: [
            `const rows = [
  { name: 'Вера', lastLogin: null },
  { name: 'аня', lastLogin: '2024-05-17' },
  { name: 'Борис', lastLogin: '2024-01-02' },
];

// null уходит в конец независимо от направления — иначе при desc пустые строки
// всплывают наверх и таблица выглядит сломанной
const byField = (field, dir = 'asc') => (a, b) => {
  const x = a[field];
  const y = b[field];
  if (x === y) return 0;
  if (x === null || x === undefined) return 1;
  if (y === null || y === undefined) return -1;
  const cmp = typeof x === 'string' ? x.localeCompare(y, 'ru') : x - y;
  return dir === 'asc' ? cmp : -cmp;
};

[...rows].sort(byField('lastLogin')).map((r) => r.name);         // → ['Борис', 'аня', 'Вера']
[...rows].sort(byField('lastLogin', 'desc')).map((r) => r.name); // → ['аня', 'Борис', 'Вера']
[...rows].sort(byField('name')).map((r) => r.name);              // → ['аня', 'Борис', 'Вера']`,
            `// приоритетный порядок статусов, а не алфавитный
const ORDER = { critical: 0, warning: 1, ok: 2 };
const alerts = [{ level: 'ok' }, { level: 'critical' }, { level: 'warning' }];
alerts.sort((a, b) => ORDER[a.level] - ORDER[b.level]).map((a) => a.level);
// → ['critical', 'warning', 'ok']`,
          ],
          gotcha:
            'sort мутирует — в React-компоненте это правка пропса на месте: список отсортируется, но перерисовки не будет. Копируй: [...rows].sort(...) или toSorted.',
        },
        {
          sig: 'Diff двух списков: что создать, обновить, удалить',
          key: null,
          summary: 'Сравнение состояния формы с тем, что на сервере — чтобы отправить только изменения.',
          examples: [
            `const server = [
  { id: 1, title: 'старое' },
  { id: 2, title: 'общее' },
];
const client = [
  { id: 2, title: 'изменённое' },
  { id: 3, title: 'новое' },
];

const serverById = new Map(server.map((r) => [r.id, r]));
const clientById = new Map(client.map((r) => [r.id, r]));

const created = client.filter((r) => !serverById.has(r.id));
const deleted = server.filter((r) => !clientById.has(r.id));
const updated = client.filter(
  (r) => serverById.has(r.id) && serverById.get(r.id).title !== r.title,
);

created.map((r) => r.id);      // → [3]
deleted.map((r) => r.id);      // → [1]
updated.map((r) => r.title);   // → ['изменённое']`,
            `// «выбранные чекбоксы» → две операции для бэка
const wasSelected = [1, 2, 3];
const nowSelected = [2, 3, 4];
const before = new Set(wasSelected);
const after = new Set(nowSelected);

[...after].filter((id) => !before.has(id));   // → [4] — добавить
[...before].filter((id) => !after.has(id));   // → [1] — отвязать`,
          ],
        },
        {
          sig: 'Батчи для bulk-запроса и пагинация',
          key: null,
          summary: 'Бэк принимает не больше N id за раз, а UI показывает страницами. Обе задачи — про нарезку.',
          examples: [
            `// 250 id → три запроса вместо одного, который упрётся в лимит
const ids = Array.from({ length: 250 }, (_, i) => i + 1);
const batches = Array.from({ length: Math.ceil(ids.length / 100) }, (_, i) =>
  ids.slice(i * 100, i * 100 + 100),
);

batches.length;      // → 3
batches[2].length;   // → 50
batches[2][0];       // → 201

// дальше: for (const batch of batches) await api.bulk(batch);`,
            `// пагинация с защитой от страницы вне диапазона
const paginate = (items, page, perPage) => {
  const pages = Math.max(1, Math.ceil(items.length / perPage));
  const safe = Math.min(Math.max(page, 1), pages);
  return { page: safe, pages, items: items.slice((safe - 1) * perPage, safe * perPage) };
};

const data = Array.from({ length: 7 }, (_, i) => i);
paginate(data, 2, 3).items;   // → [3, 4, 5]
paginate(data, 3, 3).items;   // → [6]
paginate(data, 99, 3).page;   // → 3 — не пустой экран, а последняя страница
paginate([], 1, 3).pages;     // → 1`,
          ],
        },
        {
          sig: 'Разворачивание вложенных сущностей (заказы → позиции)',
          key: null,
          summary: 'flatMap превращает дерево заказов в плоскую таблицу строк — дальше по ней считают выручку и группировки.',
          examples: [
            `const orders = [
  { id: 'o1', items: [{ sku: 'a', price: 100, qty: 2 }] },
  { id: 'o2', items: [{ sku: 'b', price: 50, qty: 1 }, { sku: 'a', price: 100, qty: 1 }] },
];

const lines = orders.flatMap((o) => o.items.map((it) => ({ orderId: o.id, ...it })));
lines.length;       // → 3
lines[2].orderId;   // → 'o2'

const revenue = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
revenue;   // → 350

const bySku = Object.groupBy(lines, (l) => l.sku);
bySku.a.length;   // → 2`,
            `// пустые вложенные массивы исчезают сами — отдельная проверка не нужна
const mixed = [{ items: [] }, { items: [1, 2] }, { items: null }];
mixed.flatMap((o) => o.items ?? []);   // → [1, 2]`,
          ],
        },
        {
          sig: 'Дедупликация потока событий по ключу',
          key: null,
          summary: 'Вебсокет присылает обновления одной сущности несколько раз. Нужен либо последний, либо первый.',
          examples: [
            `const events = [
  { id: 'a', ts: 1, status: 'new' },
  { id: 'b', ts: 2, status: 'new' },
  { id: 'a', ts: 3, status: 'done' },
];

// последний побеждает: Map перезаписывает значение, но помнит позицию первой вставки
const last = [...new Map(events.map((e) => [e.id, e])).values()];
last.map((e) => e.id);       // → ['a', 'b']
last.map((e) => e.status);   // → ['done', 'new']`,
            `// первый побеждает
const events = [
  { id: 'a', ts: 1 },
  { id: 'b', ts: 2 },
  { id: 'a', ts: 3 },
];
const seen = new Set();
const first = events.filter((e) => {
  if (seen.has(e.id)) return false;
  seen.add(e.id);
  return true;
});
first.map((e) => e.ts);   // → [1, 2]`,
          ],
        },
        {
          sig: 'Иммутабельное обновление списка в state',
          key: null,
          summary: 'Четыре операции над списком в сторе — без единой мутации и с сохранением ссылок на нетронутые элементы.',
          examples: [
            `const todos = [
  { id: 1, text: 'раз', done: false },
  { id: 2, text: 'два', done: false },
];

// переключить один
const toggled = todos.map((t) => (t.id === 2 ? { ...t, done: !t.done } : t));
toggled[1].done;             // → true
todos[1].done;               // → false
toggled[0] === todos[0];     // → true — ссылка нетронутого элемента та же`,
            `const todos = [
  { id: 1, text: 'раз' },
  { id: 2, text: 'два' },
];

// удалить
todos.filter((t) => t.id !== 1).map((t) => t.id);          // → [2]
// вставить в середину
todos.toSpliced(1, 0, { id: 3 }).map((t) => t.id);         // → [1, 3, 2]
// переместить (drag&drop)
const move = (arr, from, to) => {
  const copy = [...arr];
  copy.splice(to, 0, ...copy.splice(from, 1));
  return copy;
};
move(todos, 0, 1).map((t) => t.id);   // → [2, 1]
todos.map((t) => t.id);               // → [1, 2] — исходник цел`,
          ],
          gotcha:
            'Сохранение ссылок — не эстетика: React.memo и useMemo сравнивают по Object.is, и новый объект на каждый элемент перерисовывает весь список вместо одной строки.',
        },
        {
          sig: 'Топ-N по частоте (аналитика, логи)',
          key: null,
          summary: 'Посчитать и отсортировать — задача, которая всплывает в каждом дашборде.',
          examples: [
            `const logs = ['/a', '/b', '/a', '/c', '/a', '/b'];

const counts = new Map();
for (const path of logs) counts.set(path, (counts.get(path) ?? 0) + 1);

const top = [...counts].sort((x, y) => y[1] - x[1]).slice(0, 2);
top;   // → [['/a', 3], ['/b', 2]]

// доля первого в процентах
Math.round((top[0][1] / logs.length) * 100);   // → 50`,
          ],
        },
      ],
    },
  ],
};
