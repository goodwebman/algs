import { defineTask } from '../types';

export default defineTask({
  slug: 'event-emitter',
  title: 'EventEmitter',
  topic: 'js-practice',
  prompt:
    'Реализуй класс EventEmitter с методами on(event, cb), off(event, cb), emit(event, ...args).\n\n' +
    'Чтобы решение можно было проверить, экспортируй функцию runEmitter(script):\n' +
    'она получает массив команд и возвращает лог сработавших подписчиков.\n\n' +
    'Формат команды: ["on", событие, имяПодписчика] | ["off", событие, имяПодписчика] |\n' +
    '["emit", событие, значение].\n' +
    'При срабатывании подписчика пиши в лог строку `${имяПодписчика}:${значение}`.',
  exportName: 'runEmitter',
  starter: `class EventEmitter {
  // Храни подписчиков: событие → список колбэков.

  on(event, callback) {}

  off(event, callback) {}

  emit(event, ...args) {}
}

export function runEmitter(script) {
  const emitter = new EventEmitter();
  const log = [];
  const handlers = new Map();

  for (const [command, event, payload] of script) {
    if (command === 'on') {
      // payload — имя подписчика; на каждое имя нужен СВОЙ колбэк,
      // иначе off не сможет отличить их друг от друга.
      const callback = (value) => log.push(payload + ':' + value);
      handlers.set(event + '/' + payload, callback);
      emitter.on(event, callback);
    } else if (command === 'off') {
      emitter.off(event, handlers.get(event + '/' + payload));
    } else {
      emitter.emit(event, payload);
    }
  }

  return log;
}
`,
  solution: `class EventEmitter {
  #listeners = new Map();

  on(event, callback) {
    const list = this.#listeners.get(event) ?? [];
    list.push(callback);
    this.#listeners.set(event, list);
  }

  off(event, callback) {
    const list = this.#listeners.get(event);
    if (!list) return;

    // filter С КОЛБЭКОМ. Классическая опечатка — filter(cb !== callback),
    // где cb не определён: ReferenceError при каждом вызове off.
    const next = list.filter((cb) => cb !== callback);

    if (next.length) this.#listeners.set(event, next);
    else this.#listeners.delete(event);
  }

  emit(event, ...args) {
    const list = this.#listeners.get(event);
    if (!list) return false;

    // Копия перед обходом: подписчик может вызвать off во время рассылки,
    // и без копии мы мутировали бы массив прямо в процессе итерации.
    for (const callback of [...list]) callback(...args);
    return true;
  }
}

export function runEmitter(script) {
  const emitter = new EventEmitter();
  const log = [];
  const handlers = new Map();

  for (const [command, event, payload] of script) {
    if (command === 'on') {
      const callback = (value) => log.push(payload + ':' + value);
      handlers.set(event + '/' + payload, callback);
      emitter.on(event, callback);
    } else if (command === 'off') {
      emitter.off(event, handlers.get(event + '/' + payload));
    } else {
      emitter.emit(event, payload);
    }
  }

  return log;
}
`,
  cases: [
    {
      name: 'подписчик получает событие',
      args: [[['on', 'tick', 'a'], ['emit', 'tick', 1]]],
      expected: ['a:1'],
    },
    {
      name: 'несколько подписчиков в порядке подписки',
      args: [[['on', 'tick', 'a'], ['on', 'tick', 'b'], ['emit', 'tick', 7]]],
      expected: ['a:7', 'b:7'],
    },
    // Ловит ReferenceError из filter без колбэка
    {
      name: 'off отписывает конкретный колбэк',
      args: [
        [['on', 'tick', 'a'], ['on', 'tick', 'b'], ['off', 'tick', 'a'], ['emit', 'tick', 2]],
      ],
      expected: ['b:2'],
    },
    {
      name: 'emit без подписчиков ничего не делает',
      args: [[['emit', 'tick', 1]]],
      expected: [],
    },
    {
      name: 'события не путаются между собой',
      args: [[['on', 'a', 'x'], ['on', 'b', 'y'], ['emit', 'a', 1], ['emit', 'b', 2]]],
      expected: ['x:1', 'y:2'],
    },
    {
      name: 'off несуществующего подписчика безопасен',
      args: [[['off', 'tick', 'ghost'], ['on', 'tick', 'a'], ['emit', 'tick', 5]]],
      expected: ['a:5'],
    },
    {
      name: 'повторный emit после отписки всех',
      args: [[['on', 'tick', 'a'], ['off', 'tick', 'a'], ['emit', 'tick', 9]]],
      expected: [],
    },
  ],
  hints: [
    'Map<событие, массив колбэков> — самое простое хранилище.',
    'В off используй filter С КОЛБЭКОМ: list.filter((cb) => cb !== callback).',
    'В emit обходи КОПИЮ массива — подписчик может отписаться прямо во время рассылки.',
  ],
});
