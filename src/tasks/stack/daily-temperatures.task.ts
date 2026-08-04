import { defineTask } from '../types';

export default defineTask({
  slug: 'daily-temperatures',
  title: 'Сколько ждать тепла',
  topic: 'stack',
  prompt:
    'Дан массив температур по дням. Для каждого дня верни, через сколько дней\n' +
    'впервые станет строго теплее. Если теплее не станет — 0.\n' +
    'Нужно O(n): вложенный цикл не подойдёт.',
  exportName: 'dailyTemperatures',
  starter: `export function dailyTemperatures(temps) {
  // Монотонный стек индексов дней без ответа (температуры убывают к вершине).
  // Новый день закрывает все холоднее него на вершине.
}
`,
  solution: `export function dailyTemperatures(temps) {
  const answer = new Array(temps.length).fill(0);
  const stack = [];

  for (let i = 0; i < temps.length; i += 1) {
    while (stack.length > 0 && temps[stack[stack.length - 1]] < temps[i]) {
      const day = stack.pop();
      answer[day] = i - day;
    }

    stack.push(i);
  }

  return answer;
}
`,
  cases: [
    { name: 'классический вход', args: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
    { name: 'возрастающий ряд', args: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
    { name: 'убывающий ряд', args: [[60, 50, 40, 30]], expected: [0, 0, 0, 0] },
    // Строгое сравнение: равные температуры не закрывают
    { name: 'равные температуры', args: [[50, 50, 50]], expected: [0, 0, 0] },
    { name: 'пустой массив', args: [[]], expected: [] },
    { name: 'один день', args: [[42]], expected: [0] },
    { name: 'теплее только в конце', args: [[70, 69, 68, 80]], expected: [3, 2, 1, 0] },
  ],
  bench: {
    sizes: [1000, 5000, 20000, 60000, 150000],
    // Убывающий ряд — худший случай по памяти стека, но O(n) по времени.
    makeArgsSource: '(n) => [Array.from({ length: n }, (_, i) => n - i)]',
    compareWith: ['O(n)', 'O(n²)'],
  },
  hints: [
    'На стеке лежат ИНДЕКСЫ, не температуры.',
    'Сравнение строгое (<, не <=): равные температуры не закрывают.',
    'answer инициализируется нулями — дни, оставшиеся на стеке, уже имеют правильный 0.',
  ],
});
