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
 * Числа Фибоначчи: наивная рекурсия против мемоизации.
 *
 * fib(n) = fib(n-1) + fib(n-2) звучит элегантно, но наивная реализация
 * экспоненциальна: fib(3) вызывается по три раза, fib(40) — около миллиарда
 * вызовов. Перекрытия в дереве вызовов и есть источник взрыва.
 *
 * Мемоизация запоминает уже посчитанные значения. Тогда fib(k) считается
 * ровно один раз, и дерево из экспоненциального превращается в линейное.
 * Тот же приём переводит экспоненциальное DP в полиномиальное.
 */
export function* traceFibonacci(n: number): AlgoTrace<VizState, number> {
  const memo = new Map<number, number>();
  let counter = 0;
  const treeNodes = new Map<string, MutableNode>();
  const parents = new Map<string, string | null>();
  let rootId: string | null = null;

  // Полный стек от корня до текущего кадра: поднимаемся по parent-цепочке.
  const stackToRoot = (id: string): CallStackFrameView[] => {
    const path: CallStackFrameView[] = [];
    let cur: string | null = id;
    while (cur) {
      const node = treeNodes.get(cur);
      if (node) path.push({ id: cur, label: node.label, mark: node.mark });
      cur = parents.get(cur) ?? null;
    }
    return path.reverse();
  };

  const view = (currentId: string, note: string, returned?: number, cached = false): VizState => {
    const frames = stackToRoot(currentId).map((frame, i, arr) =>
      i === arr.length - 1 ? { ...frame, returned, cached } : frame,
    );
    return {
      kind: 'callstack',
      frames,
      tree: rootId ? freeze(treeNodes.get(rootId)!) : null,
      caption: note,
    };
  };

  function* fib(k: number, parentId: string | null): Generator<Step<VizState>, number, void> {
    counter += 1;
    const myId = `n${counter}`;
    if (!rootId) rootId = myId;

    parents.set(myId, parentId);
    const node: MutableNode = { id: myId, label: `f${k}`, children: [] };
    treeNodes.set(myId, node);
    if (parentId && treeNodes.has(parentId)) {
      treeNodes.get(parentId)!.children.push(node);
    }

    if (k <= 1) { // @base
      node.mark = 'done';
      yield { state: view(myId, `fib(${k}) = ${k}, базовый случай`), at: 'base', note: `fib(${k}) — базовый случай, возвращаем ${k}.` };
      return k;
    }

    if (memo.has(k)) { // @cache
      const cached = memo.get(k)!;
      node.mark = 'done';
      yield {
        state: view(myId, `fib(${k}) уже посчитан: ${cached} — берём из кэша`, cached, true),
        at: 'cache',
        note: `fib(${k}) уже в кэше (${cached}) — не вычисляем заново, берём готовое.`,
      };
      return cached;
    }

    yield { state: view(myId, `считаем fib(${k}): нужны fib(${k - 1}) и fib(${k - 2})`), note: `Заходим в fib(${k}). Разбирается на fib(${k - 1}) + fib(${k - 2}).` };

    const a = yield* fib(k - 1, myId); // @left
    const b = yield* fib(k - 2, myId); // @right
    const result = a + b; // @combine

    memo.set(k, result);
    node.mark = 'done';

    yield {
      state: view(myId, `fib(${k}) = ${a} + ${b} = ${result}`, result),
      at: 'combine',
      note: `fib(${k}) = ${a} + ${b} = ${result}. Запоминаем в кэше и возвращаем наверх.`,
    };
    return result;
  }

  return yield* fib(n, null);
}
// #endregion

export const fibonacci = (n: number): number => runTrace(traceFibonacci(n));

export default defineAlgo({
  meta: {
    slug: 'fibonacci',
    title: 'Фибоначчи: рекурсия и мемоизация',
    topic: 'recursion',
    summary: 'Как мемоизация превращает экспоненциальное дерево вызовов в линейное.',
    complexity: { time: 'O(n) с мемо, O(2ⁿ) без', space: 'O(n)', growth: 'O(n)' },
    difficulty: 'medium',
    tags: ['рекурсия', 'мемоизация', 'динамическое программирование'],
  },
  raw,
  presets: [
    { label: 'fib(6)', args: [6] as const, hint: 'Видно перекрытия: fib(3) считается трижды без кэша.' },
    { label: 'fib(8)', args: [8] as const, hint: 'Дерево разрастается — без кэша это десятки вызовов.' },
    { label: 'fib(1)', args: [1] as const, hint: 'Базовый случай.' },
  ],
  trace: traceFibonacci,
  formatResult: (result) => `fib = ${result}`,
});
