import type { ApiGroup } from './types';

/** Объекты: обход, копирование, защита, дескрипторы и JSON. */
export const OBJECTS: ApiGroup = {
  id: 'objects',
  title: 'Объекты',
  intro:
    'Объект — хеш-таблица со строковыми и символьными ключами. Порядок обхода не случайный: сначала целочисленные ключи по возрастанию, потом остальные строки в порядке добавления, потом символы. Все методы копирования из коробки — поверхностные.',
  sections: [
    {
      title: 'Ключи, значения, пары',
      host: 'Object',
      entries: [
        {
          sig: 'Object.keys(obj)',
          key: 'keys',
          summary: 'Массив собственных перечислимых строковых ключей.',
          returns: 'string[]',
          complexity: 'O(n)',
          examples: [
            `Object.keys({ a: 1, b: 2 });   // → ['a', 'b']
Object.keys({});               // → []
Object.keys([10, 20]);         // → ['0', '1'] — индексы строками
Object.keys('ab');             // → ['0', '1']`,
            `// порядок: целые ключи по возрастанию идут первыми, остальные — в порядке вставки
Object.keys({ b: 1, 2: 2, a: 3, 1: 4 });   // → ['1', '2', 'b', 'a']`,
            `// количество ключей
Object.keys({ a: 1, b: 2 }).length;   // → 2

// пустой ли объект
const isEmpty = (o) => Object.keys(o).length === 0;
isEmpty({});        // → true
isEmpty({ a: 1 });  // → false`,
            `// «есть ли активные фильтры» и цифра на бейдже
const filters = { city: 'мск', tag: null, q: '' };
const active = Object.keys(filters).filter((key) => filters[key]);

active;          // → ['city']
active.length;   // → 1`,
            `// одинаковая ли форма у двух ответов — быстрая проверка контракта
const shape = (o) => Object.keys(o).sort().join(',');

shape({ b: 1, a: 2 }) === shape({ a: 3, b: 4 });   // → true
shape({ a: 1 }) === shape({ a: 1, extra: 2 });     // → false`,
          ],
          gotcha: 'Ключи всегда строки (или символы). obj[1] и obj["1"] — один и тот же ключ.',
        },
        {
          sig: 'Object.values(obj)',
          key: 'values',
          summary: 'Массив собственных перечислимых значений.',
          returns: 'array',
          since: 'ES2017',
          examples: [
            `Object.values({ a: 1, b: 2 });   // → [1, 2]

// сумма значений
Object.values({ x: 10, y: 20 }).reduce((a, b) => a + b, 0);   // → 30`,
            `// сводка по нормализованному состоянию byId — без обратной сборки в массив
const byId = {
  o1: { total: 300, paid: true },
  o2: { total: 500, paid: false },
};

Object.values(byId).length;                                 // → 2
Object.values(byId).filter((o) => o.paid).length;           // → 1
Object.values(byId).reduce((sum, o) => sum + o.total, 0);   // → 800`,
            `// проверка «все загрузились» по словарю статусов
const status = { a: 'done', b: 'done', c: 'loading' };
Object.values(status).every((s) => s === 'done');   // → false
Object.values(status).filter((s) => s === 'loading').length;   // → 1`,
          ],
        },
        {
          sig: 'Object.entries(obj)',
          key: 'entries',
          summary: 'Массив пар [ключ, значение] — то, чем объект превращают в массив и обратно.',
          returns: '[string, any][]',
          since: 'ES2017',
          examples: [
            `Object.entries({ a: 1, b: 2 });   // → [['a', 1], ['b', 2]]

// перебор с деструктуризацией
const out = [];
for (const [key, value] of Object.entries({ a: 1, b: 2 })) out.push(key + value);
out;   // → ['a1', 'b2']`,
            `// map по значениям объекта: entries → map → fromEntries
const prices = { хлеб: 40, молоко: 80 };
const withVat = Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, Math.round(v * 1.2)]),
);
withVat;   // → { хлеб: 48, молоко: 96 }`,
            `// фильтрация по значению
const raw = { a: 1, b: null, c: 3 };
Object.fromEntries(Object.entries(raw).filter(([, v]) => v !== null));
// → { a: 1, c: 3 }`,
            `// объект настроек → список элементов интерфейса
const settings = { theme: 'dark', compact: false };
const controls = Object.entries(settings).map(([key, value]) => ({
  key,
  type: typeof value === 'boolean' ? 'switch' : 'select',
}));

controls[0].type;   // → 'select'
controls[1].type;   // → 'switch'
controls.length;    // → 2`,
            `// заполненность формы: сколько полей осталось
const form = { name: 'Аня', phone: '', email: null };
const filled = Object.entries(form).filter(([, v]) => v !== '' && v !== null);

filled.length;                 // → 1
Object.fromEntries(filled);    // → { name: 'Аня' }
Object.keys(form).length - filled.length;   // → 2 — столько ещё заполнять`,
          ],
        },
        {
          sig: 'Object.fromEntries(pairs)',
          key: 'fromEntries',
          summary: 'Обратная операция к entries: собирает объект из пар. Понимает Map и любой итератор пар.',
          returns: 'object',
          since: 'ES2019',
          examples: [
            `Object.fromEntries([['a', 1], ['b', 2]]);   // → { a: 1, b: 2 }
Object.fromEntries(new Map([['a', 1]]));    // → { a: 1 }`,
            `// query-строка в объект
const params = new URLSearchParams('page=2&sort=name');
Object.fromEntries(params);   // → { page: '2', sort: 'name' }`,
            `// инвертировать объект (значения станут ключами)
const codes = { ok: 200, notFound: 404 };
Object.fromEntries(Object.entries(codes).map(([k, v]) => [v, k]));
// → { 200: 'ok', 404: 'notFound' }`,
            `// заголовки ответа — это итератор пар, а не объект
const headers = new Headers({ 'content-type': 'application/json', 'x-total': '42' });
const asObject = Object.fromEntries(headers);

asObject['x-total'];       // → '42'
asObject['content-type'];  // → 'application/json'`,
            `// массив id → словарь состояний по умолчанию
const ids = ['a', 'b'];
Object.fromEntries(ids.map((id) => [id, { loading: false, error: null }]));
// → { a: {...}, b: {...} }

const state = Object.fromEntries(ids.map((id) => [id, 'idle']));
state.a;                     // → 'idle'
Object.keys(state).length;   // → 2`,
          ],
        },
        {
          sig: 'Object.hasOwn(obj, key)',
          key: 'hasOwn',
          summary: 'Есть ли собственное свойство — без похода по цепочке прототипов. Замена hasOwnProperty.',
          returns: 'boolean',
          since: 'ES2022',
          examples: [
            `const o = { a: 1, b: undefined };

Object.hasOwn(o, 'a');          // → true
Object.hasOwn(o, 'b');          // → true — свойство есть, значение undefined
Object.hasOwn(o, 'toString');   // → false — это в прототипе
'toString' in o;                // → true — in смотрит и прототип`,
            `// зачем не obj.hasOwnProperty: у объекта без прототипа его нет
const dict = Object.create(null);
dict.a = 1;
Object.hasOwn(dict, 'a');            // → true
typeof dict.hasOwnProperty;          // → 'undefined' — вызов бы упал`,
            `// PATCH: «поле прислали пустым» и «поле не трогали» — разные операции
const patch = { name: 'Аня', avatar: null };

Object.hasOwn(patch, 'avatar');   // → true — аватар просят удалить
Object.hasOwn(patch, 'phone');    // → false — телефон не менялся
patch.avatar ?? 'не менялся';     // → 'не менялся' — а так эти случаи не различить`,
          ],
        },
        {
          sig: 'obj.hasOwnProperty(key)',
          key: 'hasOwnProperty',
          summary: 'Старый способ той же проверки. В новом коде — Object.hasOwn.',
          returns: 'boolean',
          examples: [
            `({ a: 1 }).hasOwnProperty('a');   // → true

// безопасный вызов, если объект мог переопределить метод
Object.prototype.hasOwnProperty.call({ hasOwnProperty: null, a: 1 }, 'a');   // → true`,
          ],
        },
        {
          sig: 'Object.getOwnPropertyNames(obj)',
          key: 'getOwnPropertyNames',
          summary: 'Все собственные строковые ключи, включая неперечислимые — их Object.keys не показывает.',
          returns: 'string[]',
          examples: [
            `const o = { a: 1 };
Object.defineProperty(o, 'hidden', { value: 2, enumerable: false });

Object.keys(o);                     // → ['a']
Object.getOwnPropertyNames(o);      // → ['a', 'hidden']
o.hidden;                           // → 2`,
          ],
        },
        {
          sig: 'Object.getOwnPropertySymbols(obj)',
          key: 'getOwnPropertySymbols',
          summary: 'Собственные символьные ключи — единственный способ их увидеть.',
          returns: 'symbol[]',
          examples: [
            `const id = Symbol('id');
const o = { [id]: 1, a: 2 };

Object.keys(o);                       // → ['a']
Object.getOwnPropertySymbols(o).length;   // → 1
o[Object.getOwnPropertySymbols(o)[0]];    // → 1`,
          ],
        },
      ],
    },
    {
      title: 'Копирование и слияние',
      host: 'Object',
      entries: [
        {
          sig: 'Object.assign(target, ...sources)',
          key: 'assign',
          summary: 'Копирует собственные перечислимые свойства в target. Мутирует target и возвращает его.',
          returns: 'target',
          mutates: true,
          examples: [
            `Object.assign({}, { a: 1 }, { b: 2 });        // → { a: 1, b: 2 }
Object.assign({}, { a: 1 }, { a: 2 });        // → { a: 2 } — правый побеждает

// первый аргумент мутируется
const target = { a: 1 };
Object.assign(target, { b: 2 });
target;   // → { a: 1, b: 2 }`,
            `// слияние поверхностное: вложенный объект заменяется целиком, а не сливается
const base = { user: { name: 'Аня', age: 30 } };
const patch = { user: { name: 'Борис' } };
Object.assign({}, base, patch);   // → { user: { name: 'Борис' } } — age потерян`,
            `// дефолты параметров запроса
const withDefaults = (opts) => Object.assign({ page: 1, perPage: 20 }, opts);

withDefaults({ perPage: 50 });   // → { page: 1, perPage: 50 }
withDefaults({});                // → { page: 1, perPage: 20 }

// осторожно: явный undefined в источнике всё равно перетирает дефолт
withDefaults({ page: undefined });   // → { page: undefined, perPage: 20 }`,
          ],
          gotcha: 'Object.assign(obj, ...) с непустым первым аргументом мутирует его. Нужна копия — первым аргументом всегда {}.',
        },
        {
          sig: 'Spread и rest: { ...obj }',
          key: null,
          summary: 'Тот же поверхностный копир, но короче. Плюс rest в деструктуризации — «всё остальное».',
          examples: [
            `const user = { id: 1, name: 'Аня', role: 'admin' };

// копия с заменой поля
const renamed = { ...user, name: 'Борис' };
renamed.name;   // → 'Борис'
user.name;      // → 'Аня'`,
            `// выкинуть поле — rest в деструктуризации
const { role, ...safe } = { id: 1, name: 'Аня', role: 'admin' };
safe;   // → { id: 1, name: 'Аня' }
role;   // → 'admin'`,
            `// порядок важен: значения справа перетирают левые
const defaults = { theme: 'dark', size: 10 };
const opts = { size: 14 };
({ ...defaults, ...opts });   // → { theme: 'dark', size: 14 }

// undefined тоже перетирает — фильтруй значения, а не надейся на spread
({ ...{ a: 1 }, ...{ a: undefined } });   // → { a: undefined }`,
            `// изменение одного поля формы в state — то, что пишут каждый день
const form = { name: 'Аня', city: 'мск' };
const onChange = (state, field, value) => ({ ...state, [field]: value });

onChange(form, 'city', 'спб');   // → { name: 'Аня', city: 'спб' }
form.city;                       // → 'мск' — исходник не тронут`,
            `// условное поле без if и без мутаций
const withOptional = (base, extra) => ({ ...base, ...(extra ? { extra } : {}) });

withOptional({ a: 1 }, 'x');    // → { a: 1, extra: 'x' }
withOptional({ a: 1 }, null);   // → { a: 1 }

// сборка тела запроса из нескольких источников: порядок задаёт приоритет
const defaults = { perPage: 20 };
const fromUrl = { page: 2 };
const fromUser = { perPage: 50 };
({ ...defaults, ...fromUrl, ...fromUser });   // → { perPage: 50, page: 2 }`,
          ],
          gotcha:
            'Spread не копирует прототип и превращает геттеры в обычные значения (вычисляет их один раз). Для копии класса нужен structuredClone или ручной конструктор.',
        },
        {
          sig: 'structuredClone(value)',
          key: null,
          summary: 'Настоящая глубокая копия: массивы, Map, Set, Date, RegExp, циклические ссылки.',
          returns: 'копия',
          examples: [
            `const src = { list: [1, 2], meta: new Map([['k', 'v']]) };
const copy = structuredClone(src);

copy.list.push(3);
src.list;                  // → [1, 2] — исходник цел
copy.meta.get('k');        // → 'v'`,
            `// циклы не роняют, в отличие от JSON.stringify
const node = { name: 'root' };
node.self = node;
structuredClone(node).self.name;   // → 'root'`,
          ],
          gotcha:
            'Функции, DOM-узлы, классы с методами и символы клонировать нельзя — бросает DataCloneError. Прототип не сохраняется: экземпляр класса вернётся простым объектом.',
        },
        {
          sig: 'JSON.parse(JSON.stringify(obj))',
          key: null,
          summary: 'Старый трюк «глубокая копия». Работает, но молча теряет данные.',
          examples: [
            `const src = { a: 1, when: new Date(0), skip: undefined, fn: () => 1, nan: NaN };
const copy = JSON.parse(JSON.stringify(src));

copy.a;                 // → 1
typeof copy.when;       // → 'string' — Date стала строкой
'skip' in copy;         // → false — undefined выброшено
'fn' in copy;           // → false — функция выброшена
copy.nan;               // → null — NaN превратился в null`,
          ],
          gotcha: 'Есть structuredClone — используй его. JSON-трюк оправдан только там, где нужен именно JSON-совместимый результат.',
        },
      ],
    },
    {
      title: 'Защита от изменений',
      host: 'Object',
      entries: [
        {
          sig: 'Object.freeze(obj) / Object.isFrozen(obj)',
          key: 'freeze',
          summary: 'Запрещает добавлять, удалять и менять свойства. Поверхностно — вложенные объекты остаются изменяемыми.',
          returns: 'тот же объект',
          examples: [
            `const config = Object.freeze({ url: '/api', retries: 3 });

// в модуле (strict mode) присваивание бросит TypeError, в sloppy — молча ничего не сделает
try { config.retries = 10; } catch {}
config.retries;              // → 3
Object.isFrozen(config);     // → true`,
            `// заморозка только верхнего уровня
const state = Object.freeze({ nested: { n: 1 } });
state.nested.n = 42;
state.nested.n;   // → 42

// глубокая заморозка — рекурсией
const deepFreeze = (o) => {
  for (const v of Object.values(o)) {
    if (v !== null && typeof v === 'object') deepFreeze(v);
  }
  return Object.freeze(o);
};
const frozen = deepFreeze({ nested: { n: 1 } });
try { frozen.nested.n = 42; } catch {}
frozen.nested.n;   // → 1`,
            `// общая «пустая» константа: без freeze её однажды мутируют — и сломается всё
const EMPTY = Object.freeze([]);
const list = EMPTY;

list.length;               // → 0
Object.isFrozen(EMPTY);    // → true
try { list.push(1); } catch {}
EMPTY.length;              // → 0`,
          ],
        },
        {
          sig: 'Object.seal(obj) / Object.isSealed(obj)',
          key: 'seal',
          summary: 'Запрещает добавлять и удалять свойства, но существующие менять можно.',
          examples: [
            `const o = Object.seal({ a: 1 });

o.a = 2;
o.a;                  // → 2 — менять можно
try { o.b = 3; } catch {}
'b' in o;             // → false — добавлять нельзя
Object.isSealed(o);   // → true`,
          ],
        },
        {
          sig: 'Object.preventExtensions(obj) / Object.isExtensible(obj)',
          key: 'preventExtensions',
          summary: 'Самая слабая защита: нельзя добавлять новые свойства, старые можно менять и удалять.',
          examples: [
            `const o = Object.preventExtensions({ a: 1 });

try { o.b = 2; } catch {}
'b' in o;                 // → false
delete o.a;               // → true — удалять всё ещё можно
Object.isExtensible(o);   // → false`,
          ],
        },
      ],
    },
    {
      title: 'Дескрипторы и прототипы',
      host: 'Object',
      entries: [
        {
          sig: 'Object.defineProperty(obj, key, descriptor)',
          key: 'defineProperty',
          summary: 'Создаёт свойство с точной настройкой: перечислимость, доступ на запись, геттер и сеттер.',
          examples: [
            `const o = {};
Object.defineProperty(o, 'id', { value: 42 });

o.id;                 // → 42
Object.keys(o);       // → [] — по умолчанию enumerable: false
o.id = 99;            // writable: false — молча (в strict — TypeError)
o.id;                 // → 42`,
            `// вычисляемое свойство через геттер
const rect = { w: 3, h: 4 };
Object.defineProperty(rect, 'area', {
  get() { return this.w * this.h; },
  enumerable: true,
});
rect.area;   // → 12
rect.w = 5;
rect.area;   // → 20`,
            `// служебное поле, которое не должно попасть ни в JSON, ни в Object.keys
const row = { id: 1, title: 'Заказ' };
Object.defineProperty(row, '__raw', { value: { source: 'api' }, enumerable: false });

JSON.stringify(row);   // → '{"id":1,"title":"Заказ"}'
Object.keys(row);      // → ['id', 'title']
row.__raw.source;      // → 'api' — доступно в коде, невидимо для сериализации`,
          ],
          gotcha:
            'У defineProperty все флаги по умолчанию false, а у обычного присваивания — true. Свойство «пропало» из Object.keys обычно именно поэтому.',
        },
        {
          sig: 'Object.getOwnPropertyDescriptor(obj, key)',
          key: 'getOwnPropertyDescriptor',
          summary: 'Полное описание свойства — как оно на самом деле объявлено.',
          examples: [
            `Object.getOwnPropertyDescriptor({ a: 1 }, 'a');
// → { value: 1, writable: true, enumerable: true, configurable: true }`,
            `// getOwnPropertyDescriptors + create — копия с сохранением геттеров и прототипа
const src = { w: 2, get double() { return this.w * 2; } };
const copy = Object.create(
  Object.getPrototypeOf(src),
  Object.getOwnPropertyDescriptors(src),
);
copy.w = 5;
copy.double;   // → 10 — геттер остался геттером

// а вот spread геттер бы «запёк» в число
const flat = { ...src };
flat.w = 5;
flat.double;   // → 4`,
          ],
        },
        {
          sig: 'Object.create(proto, descriptors?)',
          key: 'create',
          summary: 'Создаёт объект с заданным прототипом. Object.create(null) даёт чистый словарь без наследства.',
          examples: [
            `// словарь без прототипа: никаких toString и constructor среди ключей
const dict = Object.create(null);
dict.constructor = 'значение как значение';
Object.getPrototypeOf(dict);   // → null
'toString' in dict;            // → false`,
            `// наследование без class
const animal = { speak() { return this.name + ' говорит'; } };
const dog = Object.create(animal);
dog.name = 'Рекс';
dog.speak();                    // → 'Рекс говорит'
Object.hasOwn(dog, 'speak');    // → false — метод в прототипе`,
            `// ключ приходит от пользователя: обычный объект уязвим к '__proto__'
const dict = Object.create(null);
dict['__proto__'] = 'значение';
dict['__proto__'];   // → 'значение'
Object.keys(dict);   // → ['__proto__'] — это обычные данные

const plain = {};
plain['__proto__'] = 'значение';
Object.keys(plain);   // → [] — присваивание ушло в сеттер прототипа, данные потерялись`,
          ],
          gotcha: 'Object.create(null) — правильный выбор для словаря по пользовательскому ключу: ключ "__proto__" не сломает объект.',
        },
        {
          sig: 'Object.getPrototypeOf(obj) / Object.setPrototypeOf(obj, proto)',
          key: 'getPrototypeOf',
          summary: 'Чтение и замена прототипа. Замена на живом объекте убивает оптимизации движка.',
          examples: [
            `Object.getPrototypeOf([]) === Array.prototype;    // → true
Object.getPrototypeOf({}) === Object.prototype;   // → true
Object.getPrototypeOf(Object.create(null));       // → null`,
            `const proto = { greet() { return 'привет'; } };
const o = {};
Object.setPrototypeOf(o, proto);
o.greet();                       // → 'привет'
proto.isPrototypeOf(o);          // → true`,
          ],
          gotcha: 'setPrototypeOf на существующем объекте — тормоз. Задавай прототип при создании: Object.create или class.',
        },
        {
          sig: 'Object.is(a, b)',
          key: 'is',
          summary: 'Сравнение, где NaN равен NaN, а +0 не равен -0. Ровно эту семантику использует React для сравнения state.',
          returns: 'boolean',
          examples: [
            `Object.is(NaN, NaN);   // → true
NaN === NaN;           // → false

Object.is(0, -0);      // → false
0 === -0;              // → true

Object.is({}, {});     // → false — объекты по ссылке, как и ===`,
            `// именно так React сравнивает пропсы и зависимости хуков
const prev = { list: [1, 2] };
const next = { list: [1, 2] };

Object.is(prev.list, next.list);   // → false — новый массив = лишняя перерисовка
Object.is(prev.list, prev.list);   // → true — стабильная ссылка

// сравнение примитивов работает как ===, кроме NaN и -0
Object.is('a', 'a');   // → true
Object.is(1, '1');     // → false`,
          ],
        },
        {
          sig: 'Object.groupBy(items, keyFn)',
          key: 'groupBy',
          summary: 'Группировка массива в объект. Заменяет привычный reduce с аккумулятором-объектом.',
          returns: 'объект без прототипа',
          since: 'ES2024',
          examples: [
            `const nums = [1, 2, 3, 4, 5];
const parity = Object.groupBy(nums, (n) => (n % 2 === 0 ? 'чёт' : 'нечет'));

parity['чёт'];    // → [2, 4]
parity['нечет'];  // → [1, 3, 5]`,
            `const people = [
  { city: 'мск', name: 'Аня' },
  { city: 'спб', name: 'Борис' },
  { city: 'мск', name: 'Вера' },
];
const byCity = Object.groupBy(people, (p) => p.city);
byCity['мск'].map((p) => p.name);   // → ['Аня', 'Вера']`,
            `// лента, разбитая по дням — заголовки секций берутся прямо из ключей
const events = [
  { at: '2024-05-17T10:00:00Z', title: 'создан' },
  { at: '2024-05-17T18:00:00Z', title: 'оплачен' },
  { at: '2024-05-18T09:00:00Z', title: 'отправлен' },
];

const byDay = Object.groupBy(events, (e) => e.at.slice(0, 10));
Object.keys(byDay);           // → ['2024-05-17', '2024-05-18']
byDay['2024-05-17'].length;   // → 2
byDay['2024-05-18'][0].title; // → 'отправлен'`,
            `// разложить по статусу — для канбана и вкладок с counters
const tasks = [{ status: 'todo' }, { status: 'done' }, { status: 'todo' }];
const byStatus = Object.groupBy(tasks, (t) => t.status);

byStatus.todo.length;   // → 2
byStatus.done.length;   // → 1
byStatus.archived;      // → undefined — пустых групп не создаётся`,
          ],
          gotcha:
            'Результат — объект без прототипа (Object.create(null)), поэтому у него нет hasOwnProperty. Нужны нестроковые ключи — Map.groupBy.',
        },
      ],
    },
    {
      title: 'JSON',
      host: 'JSON',
      entries: [
        {
          sig: 'JSON.stringify(value, replacer?, space?)',
          key: 'stringify',
          summary: 'Сериализация в строку. Молча выбрасывает то, чего нет в JSON.',
          returns: 'string | undefined',
          examples: [
            `JSON.stringify({ a: 1, b: 'два' });   // → '{"a":1,"b":"два"}'
JSON.stringify([1, 'a', null]);       // → '[1,"a",null]'
JSON.stringify('строка');             // → '"строка"'`,
            `// что теряется
JSON.stringify({ a: undefined, f: () => 1, s: Symbol('s') });   // → '{}'
JSON.stringify([undefined, () => 1]);                           // → '[null,null]'
JSON.stringify({ n: NaN, i: Infinity });                        // → '{"n":null,"i":null}'
JSON.stringify(undefined);                                      // → undefined — не строка!`,
            `// отступы для читаемого вывода
JSON.stringify({ a: 1 }, null, 2);   // → '{\\n  "a": 1\\n}'

// белый список полей вторым аргументом
JSON.stringify({ a: 1, secret: 2 }, ['a']);   // → '{"a":1}'

// или функция-replacer
JSON.stringify({ a: 1, secret: 2 }, (k, v) => (k === 'secret' ? undefined : v));
// → '{"a":1}'`,
            `// toJSON у объекта переопределяет сериализацию
const money = { amount: 10, toJSON() { return this.amount + '₽'; } };
JSON.stringify({ price: money });   // → '{"price":"10₽"}'`,
            `// тело запроса и «изменилась ли форма» через снимок состояния
JSON.stringify({ q: 'книга', page: 1 });   // → '{"q":"книга","page":1}'

const initial = { q: '', page: 1 };
const current = { q: '', page: 1 };
JSON.stringify(initial) === JSON.stringify(current);   // → true — кнопку «Сохранить» не активируем

// но сравнение снимков зависит от порядка ключей — см. стабильный ключ кеша
JSON.stringify({ a: 1, b: 2 }) === JSON.stringify({ b: 2, a: 1 });   // → false`,
          ],
          gotcha:
            'Циклическая ссылка бросает TypeError, BigInt — тоже. Date превращается в строку без обратного пути: JSON.parse вернёт строку, а не Date.',
        },
        {
          sig: 'JSON.parse(text, reviver?)',
          key: 'parse',
          summary: 'Разбор строки. Второй аргумент позволяет чинить типы на лету.',
          returns: 'any',
          examples: [
            `JSON.parse('{"a":1}');       // → { a: 1 }
JSON.parse('[1,2]');         // → [1, 2]
JSON.parse('"текст"');       // → 'текст'`,
            `// reviver: строку-дату обратно в Date
const parsed = JSON.parse('{"when":"1970-01-01T00:00:00.000Z"}', (key, value) =>
  key === 'when' ? new Date(value) : value,
);
parsed.when.getTime();   // → 0`,
            `// битый JSON бросает SyntaxError — парси в try/catch
const safeParse = (text, fallback = null) => {
  try { return JSON.parse(text); } catch { return fallback; }
};
safeParse('не json');        // → null
safeParse('{"a":1}');        // → { a: 1 }`,
            `// чтение localStorage: там бывает null, мусор и строка 'null'
const readJson = (raw, fallback) => {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) ?? fallback;
  } catch {
    return fallback;
  }
};

readJson(null, []);        // → [] — ключа нет
readJson('[1,2]', []);     // → [1, 2]
readJson('не json', []);   // → [] — кто-то испортил значение руками
readJson('null', []);      // → [] — валидный JSON, но бесполезный`,
          ],
        },
      ],
    },
    {
      title: 'Синтаксис доступа',
      host: null,
      entries: [
        {
          sig: 'Опциональная цепочка: obj?.a?.b, obj?.[key], fn?.()',
          key: null,
          summary: 'Прерывает выражение и возвращает undefined, если слева null или undefined.',
          examples: [
            `const user = { profile: { name: 'Аня' } };

user?.profile?.name;         // → 'Аня'
user?.settings?.theme;       // → undefined — не падает
user?.['profile']?.['name']; // → 'Аня'

const noop = undefined;
noop?.();                    // → undefined — вызов только если функция есть`,
            `// глубокий доступ к API-ответу без каскада проверок
const res = { data: { items: [{ id: 1 }] } };
res?.data?.items?.[0]?.id;   // → 1
res?.data?.items?.[9]?.id;   // → undefined`,
            `// необязательный колбэк из пропсов и метод, которого может не быть
const props = { onChange: undefined };
props.onChange?.('значение');   // → undefined — без ?. это TypeError

const api = { refresh: () => 'ok' };
api.refresh?.();   // → 'ok'
api.reset?.();     // → undefined`,
            `// длина и методы на возможном null — без каскада проверок
const res = { data: null };
res.data?.items?.length ?? 0;      // → 0
res.data?.title?.trim() ?? '—';    // → '—'`,
          ],
          gotcha: 'Цепочка спасает только от null и undefined. Ошибку в самом свойстве (например, обращение к полю строки) она не ловит.',
        },
        {
          sig: '?? и ??= против || и ||=',
          key: null,
          summary: 'Нулевое слияние срабатывает только на null и undefined — в отличие от ||, который считает 0 и "" ложью.',
          examples: [
            `const count = 0;

count || 10;    // → 10 — ноль посчитали «пустым», это баг
count ?? 10;    // → 0 — правильно

'' ?? 'по умолчанию';    // → ''
null ?? 'по умолчанию';  // → 'по умолчанию'`,
            `// логическое присваивание: значение ставится только если его не было
const opts = { a: null, b: 0 };
opts.a ??= 'задано';
opts.b ??= 99;
opts;   // → { a: 'задано', b: 0 }`,
            `// значения из ответа бэка, где 0, '' и false — валидные данные
const res = { count: 0, title: '', tags: null, active: false };

res.count ?? 10;    // → 0
res.title ?? '—';   // → ''
res.tags ?? [];     // → []
res.active ?? true; // → false

// через || всё это молча подменилось бы
res.count || 10;    // → 10
res.title || '—';   // → '—'
res.active || true; // → true`,
            `// накопление в словаре: ??= убирает проверку «если ключа нет»
const groups = {};
for (const row of [{ k: 'a' }, { k: 'b' }, { k: 'a' }]) {
  (groups[row.k] ??= []).push(row);
}
groups.a.length;   // → 2
groups.b.length;   // → 1`,
          ],
        },
        {
          sig: 'Деструктуризация с переименованием и значениями по умолчанию',
          key: null,
          summary: 'Разбор объекта на переменные — с новыми именами, дефолтами и вложенностью.',
          examples: [
            `const res = { data: { id: 7, tags: ['a', 'b'] }, error: null };

const { data: { id, tags: [first] }, error } = res;
id;      // → 7
first;   // → 'a'
error;   // → null`,
            `// дефолт срабатывает только на undefined, но не на null
const { a = 5, b = 5 } = { a: undefined, b: null };
a;   // → 5
b;   // → null`,
            `// в аргументах функции — с дефолтом на весь объект
const draw = ({ x = 0, y = 0 } = {}) => x + ':' + y;
draw();                 // → '0:0'
draw({ x: 3 });         // → '3:0'`,
            `// пропсы компонента: дефолт, переименование и «всё остальное» в rest
const props = { id: 7, size: 'lg', title: 'Кнопка', onClick: null };
const { size = 'md', title: label, ...rest } = props;

size;              // → 'lg'
label;             // → 'Кнопка'
rest.id;           // → 7
'title' in rest;   // → false — вытащенное в rest не попадает`,
            `// деструктуризация в колбэках и в for..of — вместо row.name повсюду
const rows = [{ id: 1, name: 'Аня' }, { id: 2, name: 'Борис' }];

rows.map(({ name }) => name);   // → ['Аня', 'Борис']

const out = [];
for (const { id, name } of rows) out.push(id + ':' + name);
out;   // → ['1:Аня', '2:Борис']`,
          ],
        },
        {
          sig: 'Вычисляемые ключи и сокращения',
          key: null,
          summary: 'Ключ из переменной, короткая запись свойств и методов.',
          examples: [
            `const key = 'role';
const name = 'Аня';

const user = { name, [key]: 'admin', [\`\${key}Id\`]: 1 };
user;   // → { name: 'Аня', role: 'admin', roleId: 1 }`,
            `// динамическое поле в объекте-состоянии
const setField = (state, field, value) => ({ ...state, [field]: value });
setField({ a: 1 }, 'b', 2);   // → { a: 1, b: 2 }`,
            `// ошибки по имени поля и флаги загрузки по составному ключу
const setError = (state, field, msg) => ({ ...state, [field]: msg });
setError({}, 'email', 'обязательное');   // → { email: 'обязательное' }

const key = (type, id) => type + ':' + id;
const loading = { [key('order', 7)]: true };
loading['order:7'];   // → true
loading[key('order', 8)] ?? false;   // → false`,
          ],
        },
        {
          sig: 'for..in против Object.keys',
          key: null,
          summary: 'for..in обходит и унаследованные перечислимые свойства — почти всегда это не то, что нужно.',
          examples: [
            `const proto = { inherited: 1 };
const o = Object.create(proto);
o.own = 2;

const viaForIn = [];
for (const k in o) viaForIn.push(k);
viaForIn;          // → ['own', 'inherited']

Object.keys(o);    // → ['own'] — только своё`,
          ],
          gotcha: 'Пишешь for..in — сразу ставь фильтр Object.hasOwn(obj, key). Или просто бери Object.keys/entries.',
        },
      ],
    },
    {
      title: 'Боевые сценарии: работа с ответом API',
      host: null,
      entries: [
        {
          sig: 'Рекурсивная нормализация ключей snake_case → camelCase',
          key: null,
          summary: 'Бэк на Python или Go отдаёт snake_case, фронт живёт в camelCase. Конвертер на границе — один раз, а не в каждом компоненте.',
          examples: [
            `const toCamel = (s) => s.replace(/_([a-z0-9])/g, (_, ch) => ch.toUpperCase());

const camelizeKeys = (value) => {
  if (Array.isArray(value)) return value.map(camelizeKeys);
  if (value === null || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, v]) => [toCamel(key), camelizeKeys(v)]),
  );
};

const res = {
  user_id: 1,
  first_name: 'Аня',
  order_items: [{ item_id: 7, is_paid: true }],
};

const data = camelizeKeys(res);
data.userId;                  // → 1
data.firstName;               // → 'Аня'
data.orderItems[0].itemId;    // → 7
data.orderItems[0].isPaid;    // → true
'first_name' in data;         // → false`,
            `// обратно перед отправкой на бэк
const toSnake = (s) => s.replace(/[A-Z]/g, (ch) => '_' + ch.toLowerCase());
const snakeKeys = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [toSnake(k), v]));

snakeKeys({ userId: 1, firstName: 'Аня' });   // → { user_id: 1, first_name: 'Аня' }`,
          ],
          gotcha:
            'Наивная рекурсия портит Date, Map и File: typeof у них тоже "object", и они разберутся на простые объекты. Проверяй конструктор или конвертируй только то, что пришло из JSON.',
        },
        {
          sig: 'Чистка payload перед отправкой',
          key: null,
          summary: 'Пустые поля формы не должны улетать на бэк как null и "" — иначе фильтр сервера отдаст пустой список.',
          examples: [
            `const clean = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  );

clean({ q: 'книга', page: 1, tag: '', author: null, sort: undefined });
// → { q: 'книга', page: 1 }

// ноль и false — валидные значения, их выбрасывать нельзя
clean({ page: 0, active: false });   // → { page: 0, active: false }`,
            `// подготовка формы: trim строкам, выкинуть пустое
const form = { name: '  Аня  ', comment: '   ', age: 30, avatar: null };

const payload = Object.fromEntries(
  Object.entries(form)
    .map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v])
    .filter(([, v]) => v !== null && v !== ''),
);
payload;   // → { name: 'Аня', age: 30 }`,
          ],
          gotcha:
            'Фильтр по `Boolean(v)` — распространённый баг: он выкинет 0, false и пустую строку, хотя «количество: 0» и «подписка: false» надо отправить.',
        },
        {
          sig: 'Глубокое слияние конфигов',
          key: null,
          summary: 'Дефолты приложения плюс настройки пользователя. Object.assign и spread тут ломаются: вложенный объект заменяется целиком.',
          examples: [
            `const isPlain = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

const merge = (base, patch) => {
  const out = { ...base };
  for (const [key, value] of Object.entries(patch)) {
    out[key] = isPlain(value) && isPlain(out[key]) ? merge(out[key], value) : value;
  }
  return out;
};

const defaults = { api: { url: '/api', timeout: 5000 }, theme: 'dark', tags: ['a'] };
const user = { api: { timeout: 1000 }, tags: ['b'] };

const cfg = merge(defaults, user);
cfg.api.url;       // → '/api' — не потерялся, в отличие от spread
cfg.api.timeout;   // → 1000
cfg.theme;         // → 'dark'
cfg.tags;          // → ['b'] — массивы заменяются целиком, а не склеиваются

// для сравнения: поверхностный spread снёс бы url
({ ...defaults, ...user }).api;   // → { timeout: 1000 }`,
          ],
          gotcha:
            'Решение «сливать или заменять массивы» зависит от домена: список тегов заменяют, список миддлварей — склеивают. Универсального deepMerge не бывает, поэтому он и не в стандарте.',
        },
        {
          sig: 'Diff объектов → тело PATCH-запроса',
          key: null,
          summary: 'Отправлять надо только изменённые поля: так меньше конфликтов и понятнее аудит-лог.',
          examples: [
            `const diff = (before, after) =>
  Object.fromEntries(Object.entries(after).filter(([key, v]) => !Object.is(v, before[key])));

const saved = { name: 'Аня', age: 30, city: 'мск' };
const edited = { name: 'Аня', age: 31, city: 'спб' };

diff(saved, edited);                       // → { age: 31, city: 'спб' }
Object.keys(diff(saved, saved)).length;    // → 0 — нечего сохранять, запрос не нужен`,
            `// удалённые поля надо передать явным null, иначе бэк их не тронет
const withRemovals = (before, after) => {
  const patch = Object.fromEntries(
    Object.entries(after).filter(([k, v]) => !Object.is(v, before[k])),
  );
  for (const key of Object.keys(before)) {
    if (!(key in after)) patch[key] = null;
  }
  return patch;
};

withRemovals({ a: 1, b: 2 }, { a: 1 });   // → { b: null }`,
          ],
          gotcha:
            'Object.is сравнивает по ссылке: вложенный объект после любого редактирования формы попадёт в diff, даже если поля не менялись. Для вложенности нужен рекурсивный diff или сравнение по значимым полям.',
        },
        {
          sig: 'Безопасный доступ по пути: get / setIn',
          key: null,
          summary: 'Когда путь известен только в рантайме (i18n-ключ, имя поля формы, конфиг таблицы) — оптическая цепочка не поможет.',
          examples: [
            `const get = (obj, path, fallback) =>
  path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj) ?? fallback;

const res = { data: { user: { profile: { name: 'Аня' } }, items: [{ id: 7 }] } };

get(res, 'data.user.profile.name');       // → 'Аня'
get(res, 'data.items.0.id');              // → 7
get(res, 'data.user.avatar.url', null);   // → null — не бросает на середине пути
get(res, 'нет.такого.пути', 'дефолт');    // → 'дефолт'`,
            `// иммутабельная запись по пути — обновление вложенного state без библиотек
const setIn = (obj, path, value) => {
  const [head, ...rest] = path.split('.');
  return {
    ...obj,
    [head]: rest.length === 0 ? value : setIn(obj[head] ?? {}, rest.join('.'), value),
  };
};

const state = { form: { user: { name: 'Аня' } }, ui: { open: true } };
const next = setIn(state, 'form.user.name', 'Борис');

next.form.user.name;      // → 'Борис'
state.form.user.name;     // → 'Аня' — исходник цел
next.ui === state.ui;     // → true — нетронутая ветка сохранила ссылку`,
          ],
        },
        {
          sig: 'pick и omit',
          key: null,
          summary: 'Отобрать поля для ответа или выкинуть секреты перед логированием — две строки, зависимость не нужна.',
          examples: [
            `const pick = (obj, keys) =>
  Object.fromEntries(keys.filter((k) => k in obj).map((k) => [k, obj[k]]));

const omit = (obj, keys) => {
  const drop = new Set(keys);
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !drop.has(k)));
};

const user = { id: 1, name: 'Аня', password: 'x', token: 'y' };

pick(user, ['id', 'name']);          // → { id: 1, name: 'Аня' }
omit(user, ['password', 'token']);   // → { id: 1, name: 'Аня' }
pick(user, ['id', 'несуществующее']);   // → { id: 1 } — лишний ключ не появится`,
          ],
        },
        {
          sig: 'Приведение типов из query-строки',
          key: null,
          summary: 'В URL всё строка. Состояние фильтров и пагинации надо распаковывать обратно в числа и булевы.',
          examples: [
            `const params = Object.fromEntries(
  new URLSearchParams('page=2&active=true&q=книга&empty='),
);
params.page;   // → '2' — всё строки, включая числа

const coerce = (v) => {
  if (v === '') return null;
  if (v === 'true' || v === 'false') return v === 'true';
  return Number.isNaN(Number(v)) ? v : Number(v);
};

const typed = Object.fromEntries(Object.entries(params).map(([k, v]) => [k, coerce(v)]));
typed;   // → { page: 2, active: true, q: 'книга', empty: null }`,
            `// обратно в строку запроса — с выкинутыми пустыми значениями
const toQuery = (obj) =>
  new URLSearchParams(
    Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== ''),
  ).toString();

toQuery({ page: 2, q: 'книга', tag: null });   // → 'page=2&q=%D0%BA%D0%BD%D0%B8%D0%B3%D0%B0'`,
          ],
          gotcha:
            'Автоприведение опасно на артикулах и телефонах: "007" станет 7, а "1e3" — тысячей. Приводи по схеме конкретных полей, а не всё подряд.',
        },
        {
          sig: 'Стабильный ключ кеша из объекта параметров',
          key: null,
          summary: 'JSON.stringify зависит от порядка ключей — два одинаковых запроса дадут разные ключи кеша и лишний поход в сеть.',
          examples: [
            `JSON.stringify({ b: 2, a: 1 }) === JSON.stringify({ a: 1, b: 2 });   // → false

const cacheKey = (params) =>
  JSON.stringify(
    Object.fromEntries(Object.entries(params).sort(([x], [y]) => x.localeCompare(y))),
  );

cacheKey({ b: 2, a: 1 });                              // → '{"a":1,"b":2}'
cacheKey({ a: 1, b: 2 }) === cacheKey({ b: 2, a: 1 }); // → true`,
          ],
          gotcha: 'Ключ должен покрывать вложенность — для глубоких параметров сортируй рекурсивно или бери готовый stable-stringify.',
        },
        {
          sig: 'Сериализация ошибок для логов',
          key: null,
          summary: 'Error в JSON превращается в пустой объект: message и stack — неперечислимые свойства.',
          examples: [
            `const err = new TypeError('нет соединения');

JSON.stringify(err);   // → '{}' — в лог уходит пустота

const serialize = (e) => ({ name: e.name, message: e.message, stack: e.stack });
serialize(err).name;      // → 'TypeError'
serialize(err).message;   // → 'нет соединения'`,
            `// причина ошибки через cause — не теряй нижний слой
const low = new Error('ECONNREFUSED');
const high = new Error('не удалось загрузить заказы', { cause: low });

high.cause.message;   // → 'ECONNREFUSED'`,
          ],
        },
        {
          sig: 'Словарь вместо switch и замороженные константы',
          key: null,
          summary: 'Статусы, лейблы, цвета — объект-словарь читается лучше, расширяется без правки логики и защищается freeze.',
          examples: [
            `const STATUS = Object.freeze({ NEW: 'new', PAID: 'paid', DONE: 'done' });

const LABEL = {
  [STATUS.NEW]: 'Новый',
  [STATUS.PAID]: 'Оплачен',
  [STATUS.DONE]: 'Готов',
};

LABEL[STATUS.PAID];             // → 'Оплачен'
LABEL['неизвестный'] ?? '—';    // → '—' — вместо падения рендера
Object.values(STATUS);          // → ['new', 'paid', 'done']
Object.keys(LABEL).length;      // → 3`,
            `// набор обработчиков вместо длинного switch
const handlers = {
  increment: (state) => ({ ...state, n: state.n + 1 }),
  reset: () => ({ n: 0 }),
};
const reduce = (state, type) => (handlers[type] ?? ((s) => s))(state);

reduce({ n: 5 }, 'increment');   // → { n: 6 }
reduce({ n: 5 }, 'reset');       // → { n: 0 }
reduce({ n: 5 }, 'неизвестно');  // → { n: 5 }`,
          ],
        },
      ],
    },
  ],
};
