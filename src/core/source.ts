/**
 * Работа с исходником алгоритма как с текстом.
 *
 * Листинг в статье — это не копия кода, а сам файл алгоритма, импортированный
 * через `?raw`. Подсвечиваемая строка задаётся якорем — комментарием в конце
 * строки (`// @compare`), а не номером: номер разъезжается при первой правке,
 * якорь переезжает вместе со своей строкой.
 *
 * Показываем не весь файл, а участок между `// #region show` и `// #endregion`,
 * чтобы в листинге не было импортов и служебной обвязки.
 */

const REGION_START = '// #region show';
const REGION_END = '// #endregion';
const ANCHOR_RE = /\s*\/\/\s*@([\w-]+)\s*$/;

export interface ParsedSource {
  /** Строки листинга без якорных комментариев. */
  lines: string[];
  /** Имя якоря → номер строки (1-based) внутри `lines`. */
  anchors: Map<string, number>;
}

const sliceRegion = (raw: string): string[] => {
  const all = raw.replace(/\r\n/g, '\n').split('\n');
  const start = all.findIndex((l) => l.trim() === REGION_START);
  if (start === -1) return all;

  const end = all.findIndex((l, i) => i > start && l.trim() === REGION_END);
  return all.slice(start + 1, end === -1 ? all.length : end);
};

/** Убирает общий отступ, чтобы вырезанный кусок не висел лесенкой. */
const dedent = (lines: string[]): string[] => {
  const indents = lines.filter((l) => l.trim()).map((l) => l.length - l.trimStart().length);
  const min = indents.length ? Math.min(...indents) : 0;
  return min ? lines.map((l) => l.slice(min)) : lines;
};

export const parseSource = (raw: string): ParsedSource => {
  const region = dedent(sliceRegion(raw));
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

  // Хвостовые пустые строки региона выглядят в листинге как дырка.
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();

  return { lines, anchors };
};

/** Номер строки для якоря; 0 — не подсвечивать. */
export const lineOfAnchor = (parsed: ParsedSource, anchor: string | undefined): number =>
  anchor ? (parsed.anchors.get(anchor) ?? 0) : 0;
