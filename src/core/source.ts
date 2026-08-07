/**
 * Работа с исходником алгоритма как с текстом.
 *
 * Листинг в статье — это не копия кода, а сам файл алгоритма, импортированный
 * через `?raw`. Подсвечиваемая строка задаётся якорем — комментарием в конце
 * строки (`// @compare`), а не номером: номер разъезжается при первой правке,
 * якорь переезжает вместе со своей строкой.
 *
 * Из файла показывается участок между `// #region show` и `// #endregion`,
 * а внутри него дополнительно вырезается всё, что относится к визуализации,
 * а не к алгоритму:
 *   — JSDoc-шапка (её текст и так развёрнут в самой статье);
 *   — блоки `yield { … }` — это кадры плеера, а не шаги алгоритма;
 *   — куски между `// #hide` и `// #endhide` — хелперы вроде `view`.
 *
 * Без этого листинг раздувается втрое, и в узкой колонке рядом с
 * визуализацией сам алгоритм просто не виден.
 */

const REGION_START = '// #region show';
const REGION_END = '// #endregion';
const HIDE_START = '// #hide';
const HIDE_END = '// #endhide';
const ANCHOR_RE = /\s*\/\/\s*@([\w-]+)\s*$/;

export interface ParsedSource {
  /** Строки листинга без якорных комментариев. */
  lines: string[];
  /** Имя якоря → номер строки (1-based) внутри `lines`. */
  anchors: Map<string, number>;
}

const indentOf = (line: string) => line.length - line.trimStart().length;

const sliceRegion = (raw: string): string[] => {
  const all = raw.replace(/\r\n/g, '\n').split('\n');
  const start = all.findIndex((l) => l.trim() === REGION_START);
  if (start === -1) return all;

  const end = all.findIndex((l, i) => i > start && l.trim() === REGION_END);
  return all.slice(start + 1, end === -1 ? all.length : end);
};

/** Вырезает явно помеченные служебные куски. */
const stripHidden = (lines: string[]): string[] => {
  const out: string[] = [];
  let hiding = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === HIDE_START) {
      hiding = true;
      continue;
    }
    if (trimmed === HIDE_END) {
      hiding = false;
      continue;
    }
    if (!hiding) out.push(line);
  }

  return out;
};

/**
 * Убирает ведущий JSDoc-блок. Его содержимое — объяснение приёма, которое
 * целиком развёрнуто в тексте разбора; в листинге оно занимает десяток
 * строк и отодвигает сам код за пределы экрана.
 */
const stripLeadingDoc = (lines: string[]): string[] => {
  let i = 0;
  while (i < lines.length && !lines[i].trim()) i += 1;
  if (!lines[i]?.trim().startsWith('/**')) return lines;

  let end = i;
  while (end < lines.length && !lines[end].includes('*/')) end += 1;

  return lines.slice(end + 1);
};

/**
 * Вырезает блоки `yield { … };` — это кадры для плеера, а не шаги алгоритма.
 * Конец блока ищется по строке `};` с тем же отступом, что и у `yield`.
 */
const stripYields = (lines: string[]): string[] => {
  const out: string[] = [];
  let closingIndent: number | null = null;

  for (const line of lines) {
    if (closingIndent !== null) {
      if (line.trim() === '};' && indentOf(line) === closingIndent) closingIndent = null;
      continue;
    }

    const trimmed = line.trim();

    // `yield* walk(node)` и `return yield* fib(...)` — часть алгоритма, не кадр.
    if (trimmed.startsWith('yield {')) {
      if (!trimmed.endsWith('};')) closingIndent = indentOf(line);
      continue;
    }

    out.push(line);
  }

  return out;
};

/** Схлопывает пустые блоки, оставшиеся после вырезания кадров. */
const dropEmptyBlocks = (lines: string[]): string[] => {
  const out = [...lines];

  for (let i = out.length - 1; i > 0; i -= 1) {
    const open = out[i - 1].trim();
    const close = out[i].trim();

    // `} else {` + `}` — ветка, в которой был только yield.
    const isEmptyElse = open.endsWith('else {') && close === '}';
    if (isEmptyElse) out.splice(i - 1, 2);
  }

  return out;
};

/** Несколько пустых строк подряд в листинге выглядят как дырка. */
const collapseBlankRuns = (lines: string[]): string[] =>
  lines.filter((line, i) => line.trim() || lines[i - 1]?.trim());

/** Убирает общий отступ, чтобы вырезанный кусок не висел лесенкой. */
const dedent = (lines: string[]): string[] => {
  const indents = lines.filter((l) => l.trim()).map(indentOf);
  const min = indents.length ? Math.min(...indents) : 0;
  return min ? lines.map((l) => l.slice(min)) : lines;
};

export const parseSource = (raw: string): ParsedSource => {
  // Порядок важен: якоря индексируются в самом конце, когда набор
  // строк уже окончательный — иначе номера уедут.
  const region = dedent(
    collapseBlankRuns(dropEmptyBlocks(stripYields(stripLeadingDoc(stripHidden(sliceRegion(raw)))))),
  );

  const anchors = new Map<string, number>();

  const lines = region.map((line, i) => {
    const match = ANCHOR_RE.exec(line);
    if (!match) return line;
    // Один якорь = одна строка. Дубль имени почти всегда опечатка,
    // и молча взять последнюю — худшее, что можно сделать.
    if (anchors.has(match[1])) {
      throw new Error(`Якорь @${match[1]} встречается в исходнике дважды`);
    }
    anchors.set(match[1], i + 1);
    return line.slice(0, match.index);
  });

  // Хвостовые и ведущие пустые строки региона выглядят как дырка.
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  while (lines.length && !lines[0].trim()) lines.shift();

  return { lines, anchors };
};

/** Номер строки для якоря; 0 — не подсвечивать. */
export const lineOfAnchor = (parsed: ParsedSource, anchor: string | undefined): number =>
  anchor ? (parsed.anchors.get(anchor) ?? 0) : 0;
