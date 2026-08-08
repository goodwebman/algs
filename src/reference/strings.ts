import type { ApiGroup } from './types';

/**
 * Строки. Главное, что нужно помнить: строка иммутабельна — ни один метод
 * не меняет исходник, все возвращают новую строку.
 */
export const STRINGS: ApiGroup = {
  id: 'strings',
  title: 'Строки',
  intro:
    'Строка в JS иммутабельна: `s[0] = "X"` молча ничего не сделает. Любой метод возвращает новую строку, а исходная остаётся как была. Индексация — по UTF-16 code units, поэтому эмодзи и составные символы считаются за два и более.',
  sections: [
    {
      title: 'Символы и длина',
      host: 'String.prototype',
      entries: [
        {
          sig: 'str.length',
          key: 'length',
          summary: 'Количество UTF-16 code units — не всегда совпадает с количеством видимых символов.',
          returns: 'number',
          complexity: 'O(1)',
          examples: [
            `'алгоритм'.length;    // → 8
''.length;             // → 0

// эмодзи занимает две ячейки — length врёт про «символы»
'👍'.length;           // → 2
[...'👍'].length;      // → 1`,
            `// счётчик символов в поле ввода и остаток лимита
const text = 'Привет, мир';
text.length;         // → 11
280 - text.length;   // → 269

// с эмодзи лимит по length врёт — считай код-поинты
const tweet = 'ок 👍👍';
tweet.length;        // → 7
[...tweet].length;   // → 5`,
          ],
          gotcha:
            'Для подсчёта настоящих символов — [...str].length. Для графем («👨‍👩‍👧» — одна семья из нескольких эмодзи) даже этого мало, нужен Intl.Segmenter.',
        },
        {
          sig: 'str.at(index)',
          key: 'at',
          summary: 'Символ по индексу, отрицательный индекс отсчитывается с конца.',
          returns: 'string | undefined',
          since: 'ES2022',
          examples: [
            `const s = 'алгоритм';

s.at(0);     // → 'а'
s.at(-1);    // → 'м'
s.at(-2);    // → 'т'
s.at(100);   // → undefined`,
            `// до at(-1) писали так — и это до сих пор встречается в коде
const s = 'hello';
s[s.length - 1];        // → 'o'
s.charAt(s.length - 1); // → 'o'
s.slice(-1);            // → 'o'`,
            `// нормализация базового URL и последний символ кода
const base = 'https://api.ru/v1';
base.at(-1) === '/' ? base : base + '/';   // → 'https://api.ru/v1/'

'ABC-123'.at(-1);   // → '3'
'/orders/'.at(-1);  // → '/'
''.at(-1);          // → undefined — пустая строка не роняет проверку`,
          ],
        },
        {
          sig: 'str.charAt(index)',
          key: 'charAt',
          summary: 'Символ по индексу. Отличие от str[i] — за границей возвращает пустую строку, а не undefined.',
          returns: 'string',
          examples: [
            `'abc'.charAt(1);   // → 'b'
'abc'.charAt(9);   // → ''
'abc'[9];          // → undefined`,
          ],
        },
        {
          sig: 'str.charCodeAt(index)',
          key: 'charCodeAt',
          summary: 'Код UTF-16 юнита. Рабочая лошадь задач на алфавит и хеш-таблицы по буквам.',
          returns: 'number | NaN',
          examples: [
            `'A'.charCodeAt(0);   // → 65
'a'.charCodeAt(0);   // → 97
'abc'.charCodeAt(9); // → NaN`,
            `// частый приём: буква → индекс 0..25 для массива-счётчика
const counts = new Array(26).fill(0);
for (const ch of 'banana') {
  counts[ch.charCodeAt(0) - 97] += 1;
}
counts[0];   // → 3
counts[1];   // → 1
counts[13];  // → 2`,
            `// суррогатная пара: charCodeAt видит половинку
'😀'.charCodeAt(0);   // → 55357
'😀'.codePointAt(0);  // → 128512`,
          ],
        },
        {
          sig: 'str.codePointAt(index)',
          key: 'codePointAt',
          summary: 'Полный код-поинт Unicode — корректно читает суррогатные пары.',
          returns: 'number | undefined',
          examples: [
            `'A'.codePointAt(0);    // → 65
'😀'.codePointAt(0);   // → 128512

// парная операция — обратно в символ
String.fromCodePoint(128512);  // → '😀'`,
          ],
        },
        {
          sig: 'String.fromCharCode(...codes)',
          key: 'fromCharCode',
          summary: 'Строит строку из кодов UTF-16.',
          returns: 'string',
          examples: [
            `String.fromCharCode(72, 101, 108, 108, 111);  // → 'Hello'

// шифр Цезаря на 1 позицию
const shift = (ch) => String.fromCharCode((ch.charCodeAt(0) - 97 + 1) % 26 + 97);
shift('a');  // → 'b'
shift('z');  // → 'a'`,
          ],
        },
        {
          sig: 'String.fromCodePoint(...points)',
          key: 'fromCodePoint',
          summary: 'То же, но понимает код-поинты выше 0xFFFF (эмодзи, редкие письменности).',
          returns: 'string',
          examples: [
            `String.fromCodePoint(128512);         // → '😀'
String.fromCharCode(128512);          // → '\\uF600' — мусор, старший бит потерян`,
          ],
        },
      ],
    },
    {
      title: 'Поиск и проверка',
      host: 'String.prototype',
      entries: [
        {
          sig: 'str.includes(search, from?)',
          key: 'includes',
          summary: 'Есть ли подстрока. Читается лучше, чем indexOf !== -1.',
          returns: 'boolean',
          complexity: 'O(n·m) в худшем случае',
          examples: [
            `'алгоритмы'.includes('ритм');    // → true
'алгоритмы'.includes('Ритм');    // → false — регистрозависимо
'алгоритмы'.includes('а', 1);    // → false — ищем начиная с индекса 1`,
            `// регистронезависимый поиск
const has = (hay, needle) => hay.toLowerCase().includes(needle.toLowerCase());
has('JavaScript', 'script');   // → true`,
            `// фильтр списка по строке поиска — самое частое применение
const rows = ['Футболка синяя', 'Кружка', 'ФУТБОЛКА белая'];
const q = 'футболка';

rows.filter((r) => r.toLowerCase().includes(q.toLowerCase())).length;   // → 2`,
            `// проверки заголовков, флагов и типов контента
'application/json; charset=utf-8'.includes('json');   // → true
'user-agent: Mozilla/5.0'.includes('Chrome');         // → false
'/admin/users'.includes('/admin');                    // → true`,
          ],
        },
        {
          sig: 'str.indexOf(search, from?)',
          key: 'indexOf',
          summary: 'Индекс первого вхождения или -1.',
          returns: 'number',
          examples: [
            `const s = 'абракадабра';

s.indexOf('а');       // → 0
s.indexOf('а', 1);    // → 3
s.indexOf('zzz');     // → -1`,
            `// все вхождения — цикл с продвижением from
const all = [];
let i = 'абракадабра'.indexOf('а');
while (i !== -1) {
  all.push(i);
  i = 'абракадабра'.indexOf('а', i + 1);
}
all;   // → [0, 3, 5, 7, 10]`,
            `// разбор «ключ=значение» по первому разделителю: split развалил бы значение
const line = 'token=abc=def';
const at = line.indexOf('=');

line.slice(0, at);    // → 'token'
line.slice(at + 1);   // → 'abc=def'
line.split('=');      // → ['token', 'abc', 'def'] — не то, что нужно`,
          ],
        },
        {
          sig: 'str.lastIndexOf(search, from?)',
          key: 'lastIndexOf',
          summary: 'Индекс последнего вхождения или -1. Поиск идёт справа налево.',
          returns: 'number',
          examples: [
            `'file.name.txt'.lastIndexOf('.');   // → 9

// расширение файла
const path = 'photo.final.png';
path.slice(path.lastIndexOf('.') + 1);   // → 'png'`,
          ],
        },
        {
          sig: 'str.startsWith(search, from?)',
          key: 'startsWith',
          summary: 'Начинается ли строка с подстроки.',
          returns: 'boolean',
          examples: [
            `'https://ya.ru'.startsWith('https://');   // → true
'abcdef'.startsWith('cd', 2);             // → true — проверка с позиции 2`,
            `// маршруты, внешние ссылки и префиксы ключей хранилища
'/admin/users'.startsWith('/admin');   // → true — показать админ-меню
'https://other.ru'.startsWith('http'); // → true — открыть в новой вкладке
'/about'.startsWith('http');           // → false
'app:v2:user'.startsWith('app:');      // → true`,
            `// отрезать префикс безопасно: без проверки slice покалечит чужую строку
const strip = (s, prefix) => (s.startsWith(prefix) ? s.slice(prefix.length) : s);

strip('Bearer abc', 'Bearer ');   // → 'abc'
strip('abc', 'Bearer ');          // → 'abc'
'abc'.slice(7);                   // → '' — вот что было бы без проверки`,
          ],
        },
        {
          sig: 'str.endsWith(search, endPos?)',
          key: 'endsWith',
          summary: 'Заканчивается ли строка подстрокой.',
          returns: 'boolean',
          examples: [
            `'report.pdf'.endsWith('.pdf');    // → true
'report.pdfx'.endsWith('.pdf');   // → false
'report.pdfx'.endsWith('.pdf', 10);  // → true — считаем, что строка кончается на 10-м символе`,
            `// тип файла по имени и нормализация базового URL
'договор.PDF'.toLowerCase().endsWith('.pdf');   // → true
'скрин.png'.endsWith('.pdf');                   // → false

const base = 'https://api.ru/v1';
base.endsWith('/') ? base : base + '/';   // → 'https://api.ru/v1/'

// набор допустимых расширений
const OK = ['.png', '.jpg', '.webp'];
OK.some((e) => 'фото.webp'.endsWith(e));   // → true`,
          ],
        },
        {
          sig: 'str.search(regexp)',
          key: 'search',
          summary: 'Индекс первого совпадения с регуляркой или -1. Как indexOf, но по шаблону.',
          returns: 'number',
          examples: [
            `'заказ 42 готов'.search(/\\d+/);   // → 6
'нет цифр'.search(/\\d+/);         // → -1`,
            `// проверки для валидации пароля — без возни с null от match
const pass = 'пароль123';
pass.search(/\\d/) !== -1;        // → true — есть цифра
pass.search(/[A-Z]/) !== -1;     // → false — нет заглавной латинской
pass.length >= 8;                // → true`,
          ],
        },
        {
          sig: 'str.match(regexp)',
          key: 'match',
          summary: 'Без флага g — первое совпадение с группами и позицией. С флагом g — массив всех совпадений без групп.',
          returns: 'array | null',
          examples: [
            `// без /g: подробный результат
const m = '2024-05-17'.match(/(\\d{4})-(\\d{2})-(\\d{2})/);
m[0];        // → '2024-05-17'
m[1];        // → '2024'
m.index;     // → 0`,
            `// именованные группы читаются гораздо лучше номеров
const { groups } = '2024-05-17'.match(/(?<y>\\d{4})-(?<m>\\d{2})-(?<d>\\d{2})/);
groups.y;    // → '2024'
groups.d;    // → '17'`,
            `// с /g: только сами совпадения, групп нет
'a1 b22 c333'.match(/\\d+/g);   // → ['1', '22', '333']
'нет цифр'.match(/\\d+/g);      // → null`,
            `// разбор версии релиза и телефона на части
const tag = 'release-2024.05-rc3';
tag.match(/(\\d{4})\\.(\\d{2})/).slice(1);   // → ['2024', '05']

const { groups } = '+7 999 123-45-67'.match(/^\\+(?<country>\\d)\\s(?<code>\\d{3})/);
groups.country;   // → '7'
groups.code;      // → '999'`,
            `// безопасный доступ: match может вернуть null
const id = ('заказ без номера'.match(/\\d+/) ?? [])[0] ?? null;
id;   // → null

const found = ('заказ 42'.match(/\\d+/) ?? [])[0] ?? null;
found;   // → '42'`,
          ],
          gotcha:
            'С флагом g при отсутствии совпадений возвращается null, а не пустой массив — `.match(re).length` падает. Пиши `str.match(re) ?? []`.',
        },
        {
          sig: 'str.matchAll(regexp)',
          key: 'matchAll',
          summary: 'Итератор по всем совпадениям — с группами и позициями. Требует флаг g.',
          returns: 'Iterator',
          since: 'ES2020',
          examples: [
            `const text = 'петров:30, иванов:25';
// \\w — это [A-Za-z0-9_], кириллицу он не ловит: нужен \\p{L} с флагом u
const rows = [...text.matchAll(/(\\p{L}+):(\\d+)/gu)].map((m) => [m[1], Number(m[2])]);
rows;   // → [['петров', 30], ['иванов', 25]]`,
            `// позиции всех вхождений — без ручного цикла по indexOf
const at = [...'абракадабра'.matchAll(/а/g)].map((m) => m.index);
at;   // → [0, 3, 5, 7, 10]`,
          ],
          gotcha: 'Без флага g бросает TypeError. Результат — итератор: один проход, поэтому обычно сразу разворачивают в массив.',
        },
        {
          sig: 'str.localeCompare(other, locales?, options?)',
          key: 'localeCompare',
          summary: 'Сравнение строк по правилам языка. Единственный корректный способ сортировать русский текст.',
          returns: '-1 | 0 | 1',
          examples: [
            `// наивная сортировка ломается: 'ё' по коду идёт после 'я'
['ёж', 'ель', 'яд'].sort();   // → ['ель', 'яд', 'ёж']

['ёж', 'ель', 'яд'].sort((a, b) => a.localeCompare(b, 'ru'));
// → ['ель', 'ёж', 'яд']`,
            `// без учёта регистра и диакритики
'ЯБЛОКО'.localeCompare('яблоко', 'ru', { sensitivity: 'base' });   // → 0`,
            `// «естественная» сортировка с числами внутри
const files = ['файл10', 'файл2', 'файл1'];
files.sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }));
files;   // → ['файл1', 'файл2', 'файл10']`,
            `// алфавитный список с заголовками-буквами
const names = ['Яна', 'Аня', 'Борис'];
names.sort((a, b) => a.localeCompare(b, 'ru'));

names;         // → ['Аня', 'Борис', 'Яна']
names[0][0];   // → 'А' — заголовок первой секции

// группировка по первой букве
const byLetter = Object.groupBy(names, (n) => n[0]);
byLetter['Б'];   // → ['Борис']`,
          ],
          gotcha:
            'localeCompare медленный. Для сортировки больших массивов заведи один Intl.Collator и переиспользуй его метод compare.',
        },
      ],
    },
    {
      title: 'Вырезание и склейка',
      host: 'String.prototype',
      entries: [
        {
          sig: 'str.slice(start?, end?)',
          key: 'slice',
          summary: 'Кусок строки [start, end). Понимает отрицательные индексы — рабочий выбор по умолчанию.',
          returns: 'string',
          complexity: 'O(k) — копируется вырезанное',
          examples: [
            `const s = 'javascript';

s.slice(0, 4);    // → 'java'
s.slice(4);       // → 'script'
s.slice(-6);      // → 'script'
s.slice(-6, -3);  // → 'scr'
s.slice(4, 0);    // → '' — start > end, пусто (не переворачивает)`,
            `// обрезка с многоточием
const cut = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s);
cut('очень длинный заголовок', 10);   // → 'очень дли…'
cut('коротко', 10);                   // → 'коротко'`,
            `// маска карты, превью текста, вырезание по найденной позиции
const card = '4276380012345678';
card.slice(-4);     // → '5678'
card.slice(0, 4);   // → '4276'

const url = 'https://ya.ru/search?q=js';
url.slice(0, url.indexOf('?'));   // → 'https://ya.ru/search'
url.slice(url.indexOf('?') + 1);  // → 'q=js'`,
            `// «показать ещё»: обрезаем и решаем, нужна ли кнопка
const text = 'Длинное описание товара';
const preview = text.slice(0, 8);

preview;              // → 'Длинное '
text.length > 8;      // → true — рисуем кнопку раскрытия`,
          ],
        },
        {
          sig: 'str.substring(start?, end?)',
          key: 'substring',
          summary: 'Тот же кусок, но отрицательные индексы считает нулём, а перепутанные аргументы молча меняет местами.',
          returns: 'string',
          examples: [
            `'javascript'.substring(0, 4);   // → 'java'
'javascript'.substring(4, 0);   // → 'java' — аргументы поменялись местами!
'javascript'.substring(-6);     // → 'javascript' — минус стал нулём`,
          ],
          gotcha: 'Именно из-за этих двух сюрпризов по умолчанию бери slice.',
        },
        {
          sig: 'str.substr(start, length)',
          key: 'substr',
          summary: 'Кусок заданной длины от позиции. Устаревший — оставлен только для совместимости.',
          returns: 'string',
          since: 'deprecated',
          examples: [
            `'javascript'.substr(4, 3);   // → 'scr'

// современный аналог
'javascript'.slice(4, 4 + 3);   // → 'scr'`,
          ],
        },
        {
          sig: 'str.concat(...strings)',
          key: 'concat',
          summary: 'Склейка строк. На практике почти всегда пишут + или шаблонную строку.',
          returns: 'string',
          examples: [
            `'Hello'.concat(', ', 'world');   // → 'Hello, world'
'Hello' + ', ' + 'world';        // → 'Hello, world'`,
            `// склейка в цикле: предсказуемее собрать массив и один раз join
const parts = [];
for (let i = 1; i <= 3; i += 1) parts.push('id' + i);
parts.join(',');   // → 'id1,id2,id3'`,
          ],
        },
        {
          sig: 'str.repeat(count)',
          key: 'repeat',
          summary: 'Повторяет строку count раз.',
          returns: 'string',
          examples: [
            `'ab'.repeat(3);   // → 'ababab'
'-'.repeat(5);    // → '-----'
'ab'.repeat(0);   // → ''`,
            `// отступ уровня дерева
const indent = (level) => '  '.repeat(level) + '└─ ';
indent(2);   // → '    └─ '`,
            `// маска нужной длины и текстовый прогресс-бар
'*'.repeat('4276'.length);      // → '****'
'█'.repeat(3) + '░'.repeat(2);  // → '███░░'

// заглушка под ширину колонки
('—'.repeat(3)).length;   // → 3`,
          ],
          gotcha: 'Отрицательный count бросает RangeError.',
        },
        {
          sig: 'str.padStart(len, pad?)',
          key: 'padStart',
          summary: 'Дополняет слева до нужной длины. Классика — ведущие нули.',
          returns: 'string',
          since: 'ES2017',
          examples: [
            `'7'.padStart(3, '0');      // → '007'
'12345'.padStart(3, '0');  // → '12345' — короче не режет
'7'.padStart(3);           // → '  7' — по умолчанию пробел`,
            `// время mm:ss
const mmss = (sec) =>
  String(Math.floor(sec / 60)).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0');
mmss(65);    // → '01:05'
mmss(600);   // → '10:00'`,
            `// номера заказов, инвойсы и ключи, по которым потом сортируют строками
'42'.padStart(6, '0');        // → '000042'
String(7).padStart(2, '0');   // → '07'

const d = { y: 2024, m: 5, day: 7 };
const iso = [d.y, String(d.m).padStart(2, '0'), String(d.day).padStart(2, '0')].join('-');
iso;   // → '2024-05-07'

// без padStart строковая сортировка ломается
['9', '10'].sort();                                    // → ['10', '9']
['9', '10'].map((n) => n.padStart(2, '0')).sort();     // → ['09', '10']`,
          ],
        },
        {
          sig: 'str.padEnd(len, pad?)',
          key: 'padEnd',
          summary: 'Дополняет справа — выравнивание колонок в текстовом выводе.',
          returns: 'string',
          since: 'ES2017',
          examples: [
            `'имя'.padEnd(10, '.') + 'значение';   // → 'имя.......значение'`,
          ],
        },
        {
          sig: 'str.trim() / trimStart() / trimEnd()',
          key: 'trim',
          summary: 'Срезает пробелы, табы и переводы строк по краям.',
          returns: 'string',
          examples: [
            `'  текст  '.trim();        // → 'текст'
'  текст  '.trimStart();   // → 'текст  '
'  текст  '.trimEnd();     // → '  текст'
'\\n\\t текст \\n'.trim();    // → 'текст'`,
            `// валидация формы: пустая строка после trim = не заполнено
const filled = (v) => v.trim().length > 0;
filled('   ');   // → false
filled(' a ');   // → true`,
            `// вставленные из буфера токены и коды почти всегда с мусором по краям
' eyJhbGci \\n'.trim();          // → 'eyJhbGci'
' ABC123 '.trim() === 'ABC123'; // → true

// нормализация всех строковых полей формы разом
const form = { name: '  Аня ', city: 'мск ' };
const trimmed = Object.fromEntries(
  Object.entries(form).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]),
);
trimmed;   // → { name: 'Аня', city: 'мск' }`,
          ],
          gotcha: 'Внутренние пробелы не трогает: "a   b".trim() === "a   b". Схлопнуть — replace(/\\s+/g, " ").',
        },
        {
          sig: 'str.split(separator?, limit?)',
          key: 'split',
          summary: 'Режет строку в массив по разделителю или регулярке.',
          returns: 'string[]',
          complexity: 'O(n)',
          examples: [
            `'a,b,c'.split(',');       // → ['a', 'b', 'c']
'a,b,c'.split(',', 2);    // → ['a', 'b']
'abc'.split('');          // → ['a', 'b', 'c']
'abc'.split();            // → ['abc'] — без аргумента не режет вообще`,
            `// регулярка как разделитель: несколько пробелов подряд
'слова   с    пробелами'.split(/\\s+/);   // → ['слова', 'с', 'пробелами']

// группа в разделителе — сами разделители остаются в результате
'1+2-3'.split(/([+-])/);   // → ['1', '+', '2', '-', '3']`,
            `// разворот строки — split + reverse + join
'привет'.split('').reverse().join('');   // → 'тевирп'

// но с эмодзи split('') ломает суррогатные пары — надо [...str]
[...'ab👍'].reverse().join('');   // → '👍ba'`,
            `// строка «ключ=значение через точку с запятой» → объект
const raw = 'theme=dark; lang=ru';
const pairs = raw.split('; ').map((p) => p.split('='));

pairs;                       // → [['theme', 'dark'], ['lang', 'ru']]
Object.fromEntries(pairs);   // → { theme: 'dark', lang: 'ru' }`,
            `// теги, введённые руками: лишние пробелы и пустые куски
'js , ts,  , go'.split(',').map((t) => t.trim()).filter(Boolean);   // → ['js', 'ts', 'go']

// многострочный ввод в список строк, с \\r\\n от Windows
'раз\\r\\nдва\\nтри'.split(/\\r?\\n/);   // → ['раз', 'два', 'три']`,
          ],
          gotcha:
            'split("") режет по UTF-16 юнитам и разрывает эмодзи. Для символов используй [...str] или Array.from(str).',
        },
      ],
    },
    {
      title: 'Замена и регистр',
      host: 'String.prototype',
      entries: [
        {
          sig: 'str.replace(pattern, replacement)',
          key: 'replace',
          summary: 'Заменяет первое вхождение (или все, если регулярка с флагом g).',
          returns: 'string',
          examples: [
            `'кот и кот'.replace('кот', 'пёс');       // → 'пёс и кот' — только первое
'кот и кот'.replace(/кот/g, 'пёс');      // → 'пёс и пёс'`,
            `// спецсимволы в строке замены: $& — всё совпадение, $1 — группа
'2024-05-17'.replace(/(\\d+)-(\\d+)-(\\d+)/, '$3.$2.$1');   // → '17.05.2024'
'цена 100'.replace(/\\d+/, '<$&>');                        // → 'цена <100>'`,
            `// функция вместо строки — когда замена зависит от совпадения
'a1 b2'.replace(/\\d/g, (d) => String(Number(d) * 2));   // → 'a2 b4'

// аргументы колбэка: (match, ...groups, offset, wholeString)
'ab'.replace(/b/, (m, offset) => offset);   // → 'a1'`,
            `// snake_case → camelCase
const camel = (s) => s.replace(/_(\\w)/g, (_, ch) => ch.toUpperCase());
camel('user_first_name');   // → 'userFirstName'`,
            `// подстановка параметров в шаблон пути роутера
const template = '/users/:id/orders/:orderId';

template.replace(':id', '42').replace(':orderId', 'o7');   // → '/users/42/orders/o7'

// то же одним проходом по словарю — и видно, если параметр забыли
const params = { id: '42', orderId: 'o7' };
template.replace(/:(\\w+)/g, (_, key) => params[key] ?? ':' + key);
// → '/users/42/orders/o7'`,
            `// вычищаем лишние пробелы и переносы из текста, пришедшего из редактора
'  много   пробелов \\n и перенос '.replace(/\\s+/g, ' ').trim();
// → 'много пробелов и перенос'

const clean = '  много   пробелов \\n и перенос '.replace(/\\s+/g, ' ').trim();
clean;   // → 'много пробелов и перенос'`,
          ],
          gotcha:
            'Строковый первый аргумент заменяет только первое вхождение — источник багов. Нужны все — replaceAll или регулярка с /g.',
        },
        {
          sig: 'str.replaceAll(pattern, replacement)',
          key: 'replaceAll',
          summary: 'Заменяет все вхождения. Без плясок с регуляркой и экранированием.',
          returns: 'string',
          since: 'ES2021',
          examples: [
            `'кот и кот'.replaceAll('кот', 'пёс');   // → 'пёс и пёс'
'1.2.3'.replaceAll('.', '-');           // → '1-2-3'`,
            `// до ES2021 приходилось экранировать точку в регулярке
'1.2.3'.replace(/\\./g, '-');   // → '1-2-3'
'1.2.3'.replace(/./g, '-');    // → '-----' — забыл экранировать, точка съела всё`,
            `// нормализация разделителей и подстановка имени во весь текст
'2024/05/17'.replaceAll('/', '-');   // → '2024-05-17'
'+7 (999) 12'.replaceAll(' ', '');   // → '+7(999)12'

const letter = 'Привет, ИМЯ! ИМЯ, вы записаны.'.replaceAll('ИМЯ', 'Аня');
letter;   // → 'Привет, Аня! Аня, вы записаны.'`,
          ],
          gotcha: 'Регулярка без флага g бросает TypeError — метод требует явного «всех».',
        },
        {
          sig: 'str.toUpperCase() / toLowerCase()',
          key: 'toUpperCase',
          summary: 'Смена регистра.',
          returns: 'string',
          examples: [
            `'привет'.toUpperCase();   // → 'ПРИВЕТ'
'ПрИвЕт'.toLowerCase();   // → 'привет'`,
            `// с заглавной буквы
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
capitalize('пРИВЕТ');   // → 'Привет'
capitalize('');         // → '' — не падает на пустой строке`,
            `// коды валют и стран — в верхний регистр, поиск и ключи — в нижний
'rub'.toUpperCase();   // → 'RUB'
'RU'.toLowerCase();    // → 'ru'

// инициалы для аватара
const initials = 'аня петрова'.split(' ').map((p) => p[0].toUpperCase()).join('');
initials;   // → 'АП'`,
            `// регистронезависимое сравнение: приводим обе стороны, а не одну
const same = (a, b) => a.toLowerCase() === b.toLowerCase();
same('Admin', 'admin');    // → true
same('Admin', 'ADMIN ');   // → false — про trim забывать нельзя`,
          ],
        },
        {
          sig: 'str.toLocaleUpperCase(locale) / toLocaleLowerCase(locale)',
          key: 'toLocaleLowerCase',
          summary: 'Регистр по правилам языка. Нужен ровно там, где обычный метод врёт: турецкий i.',
          returns: 'string',
          examples: [
            `'I'.toLowerCase();                 // → 'i'
'I'.toLocaleLowerCase('tr');       // → 'ı' — турецкая i без точки`,
          ],
        },
        {
          sig: 'str.normalize(form?)',
          key: 'normalize',
          summary: 'Приводит Unicode к канонической форме. Без него визуально одинаковые строки не равны.',
          returns: 'string',
          since: 'ES2015',
          examples: [
            `// 'é' одним символом и 'e' + комбинирующий акцент выглядят одинаково
const a = 'é';            // U+00E9
const b = 'e\\u0301';      // 'e' + U+0301
a === b;                  // → false
a.length;                 // → 1
b.length;                 // → 2
a.normalize() === b.normalize();   // → true`,
            `// NFD + выкинуть диакритику — транслитерация «на глаз»
'café'.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '');   // → 'cafe'`,
          ],
          gotcha: 'Сравнивая пользовательский ввод (поиск, логины), нормализуй обе строки — иначе «одинаковые» строки не совпадут.',
        },
        {
          sig: 'str.isWellFormed() / toWellFormed()',
          key: 'toWellFormed',
          summary: 'Проверка и починка «сломанных» суррогатных пар — половинок эмодзи после неаккуратной нарезки.',
          returns: 'boolean / string',
          since: 'ES2024',
          examples: [
            `'👍'.isWellFormed();          // → true
'👍'.slice(0, 1).isWellFormed();   // → false — оторвали половину пары
'👍'.slice(0, 1).toWellFormed();   // → '\\uFFFD' — заменил на символ-заглушку`,
          ],
        },
      ],
    },
    {
      title: 'Синтаксис и приёмы',
      host: null,
      entries: [
        {
          sig: 'Шаблонные строки: `текст ${expr}`',
          key: null,
          summary: 'Интерполяция и многострочность без конкатенации.',
          examples: [
            `const name = 'мир';
const greet = \`Привет, \${name}!\`;
greet;   // → 'Привет, мир!'

// выражение внутри — любое
\`2 + 2 = \${2 + 2}\`;   // → '2 + 2 = 4'

// перевод строки внутри шаблона сохраняется как есть
const multiline = \`строка1
строка2\`;
multiline.split('\\n').length;   // → 2`,
          ],
        },
        {
          sig: 'String.raw`...`',
          key: 'raw',
          summary: 'Шаблон без обработки escape-последовательностей. Спасает при работе с путями и регулярками.',
          returns: 'string',
          examples: [
            `String.raw\`C:\\new\\table\`;   // → 'C:\\\\new\\\\table'
\`C:\\new\\table\`.length;        // → 10 — \\n и \\t стали переводом строки и табом`,
          ],
        },
        {
          sig: 'Итерация по символам',
          key: null,
          summary: 'for..of, спред и Array.from идут по код-поинтам — не рвут эмодзи, в отличие от цикла по индексу.',
          examples: [
            `const s = 'a👍b';

s.length;             // → 4
[...s].length;        // → 3
Array.from(s);        // → ['a', '👍', 'b']

const chars = [];
for (const ch of s) chars.push(ch);
chars.length;         // → 3`,
            `// Array.from с колбэком — сразу map, без промежуточного массива
Array.from('abc', (ch) => ch.toUpperCase());   // → ['A', 'B', 'C']`,
          ],
          gotcha:
            'Семья «👨‍👩‍👧» — три эмодзи, склеенные zero-width joiner: даже [...str] даст 5 элементов. Настоящие графемы режет только Intl.Segmenter(locale, { granularity: "grapheme" }).',
        },
        {
          sig: 'Приведение к строке',
          key: null,
          summary: 'String(x) — безопасный способ; x + "" и x.toString() ведут себя иначе на null и undefined.',
          examples: [
            `String(42);          // → '42'
String(null);        // → 'null'
String(undefined);   // → 'undefined'
String([1, 2]);      // → '1,2'
String({});          // → '[object Object]'

// а вот .toString() у null просто упадёт — String() безопаснее
(42).toString(2);    // → '101010' — двоичная запись
(255).toString(16);  // → 'ff'`,
          ],
        },
        {
          sig: 'Сравнение строк',
          key: null,
          summary: '=== сравнивает посимвольно, < и > — по кодам UTF-16, а не по алфавиту языка.',
          examples: [
            `'a' < 'b';       // → true
'Я' < 'а';       // → true — все заглавные кириллические идут раньше строчных
'10' < '9';      // → true — сравнение строк, а не чисел

// для человеческого порядка — localeCompare
'Я'.localeCompare('а', 'ru');   // → 1`,
          ],
        },
      ],
    },
    {
      title: 'Боевые сценарии',
      host: null,
      entries: [
        {
          sig: 'Нормализация пользовательского ввода',
          key: null,
          summary: 'Перед сравнением, поиском и отправкой на бэк строку надо привести к канону: пробелы, регистр, ё, Unicode.',
          examples: [
            `const norm = (s) =>
  s.trim().replace(/\\s+/g, ' ').toLowerCase().replaceAll('ё', 'е').normalize('NFC');

norm('  Ёлки   Палки ');                        // → 'елки палки'
norm('Ёлки палки') === norm('елки  ПАЛКИ');     // → true`,
            `// поиск по подстроке после нормализации обеих сторон — иначе «Ёлки» не найдёт «елки»
const norm = (s) => s.trim().toLowerCase().replaceAll('ё', 'е');
const items = ['Ёлки-палки', 'Берёза', 'Дуб'];
const find = (list, query) => list.filter((x) => norm(x).includes(norm(query)));

find(items, 'ЕЛКИ');       // → ['Ёлки-палки']
find(items, ' береза ');   // → ['Берёза']`,
            `// нормализация email перед сохранением: регистр домена не значим
const raw = '  Ivan.Petrov@Example.COM ';
const email = raw.trim().toLowerCase();
email;   // → 'ivan.petrov@example.com'

// телефон: оставить только цифры и привести 8 → 7
const phone = '+7 (999) 123-45-67'.replace(/\\D/g, '').replace(/^8/, '7');
phone;   // → '79991234567'`,
          ],
          gotcha:
            'Не пиши регулярку для валидации email — она либо отвергает валидные адреса, либо пропускает мусор. Проверяй наличие «@» и отправляй письмо с подтверждением.',
        },
        {
          sig: 'Подсветка совпадений и экранирование регулярок',
          key: null,
          summary: 'Строка из поля поиска попадает в RegExp как есть — и «C++» роняет приложение SyntaxError. Экранируй всегда.',
          examples: [
            `const escapeRegExp = (s) => s.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');

escapeRegExp('C++');       // → 'C\\\\+\\\\+'
escapeRegExp('цена (₽)');  // → 'цена \\\\(₽\\\\)'

// без экранирования new RegExp('C++') бросит SyntaxError
const highlight = (text, query) =>
  text.replace(new RegExp(escapeRegExp(query), 'gi'), '[$&]');

highlight('Курс C++ и курс Go', 'c++');   // → 'Курс [C++] и курс Go'
highlight('Цена (₽) большая', '(₽)');     // → 'Цена [(₽)] большая'`,
            `// разбиение на куски для React-разметки: <mark> на нечётных индексах
const escapeRegExp = (s) => s.replace(/[.*+?^\${}()|[\\]\\\\]/g, '\\\\$&');
const parts = 'абракадабра'.split(new RegExp('(' + escapeRegExp('бра') + ')', 'gi'));
parts;   // → ['а', 'бра', 'када', 'бра', ''] — совпадения на нечётных индексах`,
          ],
          gotcha:
            'Поисковый запрос — недоверенный ввод. Кроме SyntaxError бывает и хуже: «(a+)+$» на длинной строке вешает вкладку катастрофическим бэктрекингом.',
        },
        {
          sig: 'Шаблоны сообщений: подстановка {{placeholder}}',
          key: null,
          summary: 'Тексты писем и уведомлений приходят с бэка строкой с плейсхолдерами — подставить надо на клиенте.',
          examples: [
            `const template = 'Привет, {{name}}! Заказ {{orderId}} на {{total}} ₽ принят.';
const vars = { name: 'Аня', orderId: 'A-17', total: 1200 };

const render = (tpl, data) =>
  tpl.replace(/\\{\\{(\\w+)\\}\\}/g, (_, key) => String(data[key] ?? ''));

render(template, vars);
// → 'Привет, Аня! Заказ A-17 на 1200 ₽ принят.'

// пропущенная переменная не оставляет '{{name}}' в тексте письма
render('Привет, {{name}}!', {});   // → 'Привет, !'`,
            `// собрать список недостающих переменных до отправки
const missing = (tpl, data) =>
  [...tpl.matchAll(/\\{\\{(\\w+)\\}\\}/g)]
    .map((m) => m[1])
    .filter((key) => !(key in data));

missing('{{a}} и {{b}}', { a: 1 });   // → ['b']`,
          ],
        },
        {
          sig: 'Slug для URL и транслитерация',
          key: null,
          summary: 'Заголовок статьи → человекочитаемый адрес. Кириллица транслитерируется, диакритика снимается через NFD.',
          examples: [
            `const MAP = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
  'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
  'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'c',
  'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e',
  'ю': 'yu', 'я': 'ya',
};

const slug = (s) =>
  [...s.toLowerCase()]
    .map((ch) => MAP[ch] ?? ch)
    .join('')
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

slug('Привет, мир! Café 2024');   // → 'privet-mir-cafe-2024'
slug('  Щи да каша  ');           // → 'schi-da-kasha'
slug('---');                      // → ''`,
          ],
          gotcha: 'Пустой slug (заголовок из одних эмодзи) сломает роутинг — подставляй id как запасной вариант.',
        },
        {
          sig: 'Маскирование персональных данных в логах',
          key: null,
          summary: 'Номер карты, email и телефон нельзя писать в лог целиком. Регулярка с lookahead делает это одной строкой.',
          examples: [
            `// все цифры, кроме последних четырёх
'4276380012345678'.replace(/\\d(?=\\d{4})/g, '*');   // → '************5678'

// email: первая буква и домен
'ivan.petrov@mail.ru'.replace(/^(.).*(@.*)$/, '$1***$2');   // → 'i***@mail.ru'

// телефон: середина
'+79991234567'.replace(/^(\\+\\d)(\\d{3})(\\d+)(\\d{2})$/, '$1$2***$4');   // → '+7999***67'`,
            `// маскирование полей объекта перед отправкой в аналитику
const SECRET = new Set(['password', 'token', 'card']);
const safeLog = (payload) =>
  Object.fromEntries(
    Object.entries(payload).map(([k, v]) => [k, SECRET.has(k) ? '***' : v]),
  );

safeLog({ user: 'аня', password: 'qwerty' });   // → { user: 'аня', password: '***' }`,
          ],
        },
        {
          sig: 'Разбор заголовков, токенов и путей',
          key: null,
          summary: 'Мелкая работа со строками, которая встречается в каждом клиенте API.',
          examples: [
            `// Bearer-токен
const auth = 'Bearer eyJhbGciOiJIUzI1';
auth.startsWith('Bearer ') ? auth.slice(7) : null;   // → 'eyJhbGciOiJIUzI1'

// Content-Type без параметров
'application/json; charset=utf-8'.split(';')[0].trim();   // → 'application/json'

// имя файла из Content-Disposition
const cd = 'attachment; filename="отчёт.pdf"';
cd.match(/filename="?([^";]+)"?/)[1];   // → 'отчёт.pdf'`,
            `// расширение файла: ловушка с lastIndexOf, когда точки нет вообще
const ext = (name) => {
  const at = name.lastIndexOf('.');
  return at === -1 ? '' : name.slice(at + 1).toLowerCase();
};

ext('отчёт.за.2024.PDF');   // → 'pdf'
ext('README');              // → ''
'README'.slice('README'.lastIndexOf('.') + 1);   // → 'README' — вот почему нужна проверка на -1`,
            `// последний сегмент пути и id из URL
const url = '/api/v1/users/42/orders';
url.split('/').filter(Boolean);        // → ['api', 'v1', 'users', '42', 'orders']
url.split('/').at(-1);                 // → 'orders'
Number(url.split('/').at(-2));         // → 42`,
          ],
        },
        {
          sig: 'Форматирование чисел, денег и дат — через Intl',
          key: null,
          summary: 'Не пиши регулярку для разделителей разрядов: Intl знает про локаль, валюту и падежи.',
          examples: [
            `// пробелы-разделители в ru-локали неразрывные — при сравнении их нормализуют
const nf = new Intl.NumberFormat('ru-RU');
nf.format(1234567.5).replace(/\\s/g, ' ');   // → '1 234 567,5'

const money = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
});
money.format(1990).replace(/\\s/g, ' ');   // → '1 990 ₽'

// проценты и компактная запись
new Intl.NumberFormat('ru-RU', { style: 'percent' }).format(0.075).replace(/\\s/g, ' ');   // → '8 %'
new Intl.NumberFormat('en', { notation: 'compact' }).format(1200);   // → '1.2K'`,
            `// множественное число по-русски: три формы, а не две
const plural = (n, forms) => {
  const rule = new Intl.PluralRules('ru').select(n);
  return n + ' ' + (forms[rule] ?? forms.other);
};
const forms = { one: 'товар', few: 'товара', many: 'товаров', other: 'товара' };

plural(1, forms);    // → '1 товар'
plural(3, forms);    // → '3 товара'
plural(11, forms);   // → '11 товаров'
plural(21, forms);   // → '21 товар'`,
            `// размер файла — единственное место, где ручное форматирование оправдано
const formatSize = (bytes) => {
  if (bytes === 0) return '0 Б';
  const units = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / 1024 ** i).toFixed(i === 0 ? 0 : 1) + ' ' + units[i];
};

formatSize(0);         // → '0 Б'
formatSize(2048);      // → '2.0 КБ'
formatSize(1536000);   // → '1.5 МБ'`,
          ],
          gotcha:
            'Создавай Intl.NumberFormat один раз и переиспользуй: конструктор тяжёлый, вызов в цикле рендера заметно тормозит таблицу.',
        },
        {
          sig: 'Сортировка версий и «естественный» порядок',
          key: null,
          summary: 'Строковое сравнение ставит 1.10 перед 1.9. Лечится опцией numeric.',
          examples: [
            `['1.10.0', '1.2.0', '1.9.0'].sort();   // → ['1.10.0', '1.2.0', '1.9.0'] — неверно

const byVersion = (a, b) => a.localeCompare(b, undefined, { numeric: true });
['1.10.0', '1.2.0', '1.9.0'].sort(byVersion);   // → ['1.2.0', '1.9.0', '1.10.0']`,
            `// то же для имён файлов и артикулов
['арт-10', 'арт-2', 'арт-1'].sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }));
// → ['арт-1', 'арт-2', 'арт-10']`,
          ],
        },
        {
          sig: 'Обрезка текста и инициалы',
          key: null,
          summary: 'Обрезать по словам, а не по символам, и собрать инициалы из ФИО с пропущенными частями.',
          examples: [
            `const truncate = (s, n) => {
  if (s.length <= n) return s;
  const cut = s.slice(0, n);
  const at = cut.lastIndexOf(' ');
  return (at > 0 ? cut.slice(0, at) : cut) + '…';
};

truncate('очень длинный заголовок новости', 15);   // → 'очень длинный…'
truncate('коротко', 15);                           // → 'коротко'
truncate('НеразрывноеСлово', 8);                   // → 'Неразрыв…'`,
            `// инициалы: части ФИО могут отсутствовать или быть пустыми строками
const initials = (...parts) =>
  parts
    .filter(Boolean)
    .map((p) => p.trim()[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('');

initials('Аня', 'Петрова');        // → 'АП'
initials('Аня', '', null);         // → 'А'
initials('  ', undefined);         // → ''`,
          ],
        },
        {
          sig: 'Экранирование HTML и защита от XSS',
          key: null,
          summary: 'Любая строка от пользователя, попадающая в innerHTML или в шаблон письма, должна быть экранирована.',
          examples: [
            `const ESCAPE = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (ch) => ESCAPE[ch]);

escapeHtml('<script>alert(1)</script>');
// → '&lt;script&gt;alert(1)&lt;/script&gt;'

escapeHtml('Ссылка "тут" & там');   // → 'Ссылка &quot;тут&quot; &amp; там'`,
          ],
          gotcha:
            'В React экранирование по умолчанию уже есть — руками оно нужно только для dangerouslySetInnerHTML, писем и генерации HTML на сервере. И даже там для разметки от пользователя нужен санитайзер, а не replace.',
        },
        {
          sig: 'Разбор CSV и «текстовых» ответов',
          key: null,
          summary: 'Простой split по запятой работает ровно до первой запятой внутри кавычек — знай границы применимости.',
          examples: [
            `const csv = 'id,name,price\\n1,Книга,300\\n2,Софт,1200';
const [header, ...lines] = csv.split('\\n');
const cols = header.split(',');

const rows = lines.map((line) => Object.fromEntries(line.split(',').map((v, i) => [cols[i], v])));
rows[0];          // → { id: '1', name: 'Книга', price: '300' }
rows[1].price;    // → '1200'

// значения всегда строки — приводи типы явно
rows.reduce((sum, r) => sum + Number(r.price), 0);   // → 1500`,
            `// где это ломается
'1,"Книга, с запятой",300'.split(',').length;   // → 4 — а полей должно быть 3`,
          ],
          gotcha:
            'Кавычки, переводы строк внутри полей, BOM в начале файла и \\r\\n от Windows — всё это ломает наивный split. Для реального CSV бери парсер (papaparse), а split оставь для своих же служебных форматов.',
        },
      ],
    },
  ],
};
