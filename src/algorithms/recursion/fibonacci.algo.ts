import raw from './fibonacci.algo.ts?raw';
import { defineAlgo } from '@/core/algo';
import { runTrace, type AlgoTrace, type Step } from '@/core/trace';
import type { CallStackFrameView, MarkKind, TreeNodeView, VizState } from '@/viz/types';

/** Мутабельный узел дерева вызовов: дети добавляются по мере рекурсии. */
interface MutableNode {
  id: string;
  label: string;
  mark?: MarkKind;
  children: MutableNode[];
}

/** Приводит mutable-дерево к иммутабельному виду для рендерера. */
const freeze = (node: MutableNode): TreeNodeView => ({
  id: node.id,
  label: node.label,
  mark: node.mark,
  children: node.children.map(freeze),
});

// #region show
/**
 * Числа Фибоначчи наивной рекурсией — и почему она взрывается.
 *
 * fib(n) = fib(n-1) + fib(n-2) звучит элегантно, но стоит экспоненциально:
 * fib(3) вычисляется по три раза, fib(40) — около миллиарда вызовов.
 * Перекрытия в дереве вызовов и есть источник взрыва — на визуализации
 * одинаковые поддеревья видно буквально.
 *
 * Лечится мемоизацией: запомнить уже посчитанное, и дерево из
 * экспоненциального становится линейным. Разбор — в статье.
 */
export function* traceFibonacci(n: number): AlgoTrace<VizState, number> {
  // #hide
  let counter = 0;
  const treeNodes = new Map<string, MutableNode>();
  const callStack: string[] = [];
  let rootId: string | null = null;

  // Ведём дерево вызовов для картинки: enter вешает узел на текущего
  // родителя, finish помечает его посчитанным и снимает со стека.
  const enter = (label: string): string => {
    counter += 1;
    const id = `n${counter}`;
    const node: MutableNode = { id, label, children: [] };
    treeNodes.set(id, node);

    const parentId = callStack[callStack.length - 1];
    if (parentId) treeNodes.get(parentId)!.children.push(node);
    else rootId = id;

    callStack.push(id);
    return id;
  };

  const finish = (id: string) => {
    treeNodes.get(id)!.mark = 'done';
    callStack.pop();
  };

  const view = (currentId: string, note: string, returned?: number): VizState => {
    const ids = callStack.includes(currentId) ? callStack : [...callStack, currentId];
    const frames: CallStackFrameView[] = ids.map((id, i, arr) => {
      const node = treeNodes.get(id)!;
      const frame = { id, label: node.label, mark: node.mark };
      return i === arr.length - 1 ? { ...frame, returned } : frame;
    });

    return {
      kind: 'callstack',
      frames,
      tree: rootId ? freeze(treeNodes.get(rootId)!) : null,
      caption: note,
    };
  };
  // #endhide

  function* fibonachi(n: number): Generator<Step<VizState>, number, void> {
    // #hide
    const myId = enter(`f${n}`);
    // #endhide

    if (n <= 0) { // @zero
      // #hide
      finish(myId);
      // #endhide
      yield { state: view(myId, `fib(${n}) = 0`, 0), at: 'zero', note: `fib(${n}) — не положительное n, возвращаем 0.` };
      return 0;
    }

    if (n <= 2) { // @base
      // #hide
      finish(myId);
      // #endhide
      yield { state: view(myId, `fib(${n}) = 1, базовый случай`, 1), at: 'base', note: `fib(${n}) — базовый случай, возвращаем 1.` };
      return 1;
    }

    yield { state: view(myId, `считаем fib(${n}): нужны fib(${n - 1}) и fib(${n - 2})`), note: `Заходим в fib(${n}). Разбирается на fib(${n - 1}) + fib(${n - 2}).` };

    // @combine
    const result = (yield* fibonachi(n - 1)) + (yield* fibonachi(n - 2));

    // #hide
    finish(myId);
    // #endhide

    yield {
      state: view(myId, `fib(${n}) = ${result}`, result),
      at: 'combine',
      note: `Обе ветки вернулись: fib(${n}) = ${result}. Отдаём наверх.`,
      metrics: { comparisons: 1 },
    };
    return result;
  }

  return yield* fibonachi(n);
}
// #endregion

export const fibonacci = (n: number): number => runTrace(traceFibonacci(n));

export default defineAlgo({
  meta: {
    slug: 'fibonacci',
    title: 'Фибоначчи: наивная рекурсия',
    topic: 'recursion',
    summary: 'Почему прямой перевод формулы в рекурсию стоит экспоненциально.',
    complexity: { time: 'O(2ⁿ)', space: 'O(n)', growth: 'O(2^n)' },
    difficulty: 'medium',
    tags: ['рекурсия', 'дерево вызовов', 'мемоизация'],
  },
  raw,
  presets: [
    { label: 'fib(6)', args: [6] as const, hint: 'Видно перекрытия: fib(3) считается трижды.' },
    { label: 'fib(8)', args: [8] as const, hint: 'Дерево разрастается — это уже 41 вызов ради восьмого числа.' },
    { label: 'fib(1)', args: [1] as const, hint: 'Базовый случай.' },
  ],
  trace: traceFibonacci,
  formatResult: (result) => `fib = ${result}`,
});
