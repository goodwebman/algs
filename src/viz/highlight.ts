/**
 * Минимальная подсветка TS для листингов.
 *
 * Тянуть сюда CodeMirror ради статического блока кода не стоит: он нужен в
 * песочнице, где есть редактирование, и грузится отдельным чанком. Здесь
 * достаточно одного прохода по тексту — важно только не сломать строки и
 * комментарии, поэтому токенизируем весь файл целиком, а по строкам режем
 * уже готовые токены (иначе многострочный шаблон развалится).
 */

export type TokenKind = 'plain' | 'keyword' | 'string' | 'comment' | 'number' | 'fn' | 'type';

export interface Token {
  text: string;
  kind: TokenKind;
}

const KEYWORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'of', 'in', 'while', 'do',
  'break', 'continue', 'new', 'class', 'extends', 'this', 'null', 'undefined', 'true', 'false',
  'export', 'import', 'from', 'as', 'typeof', 'instanceof', 'yield', 'async', 'await', 'try',
  'catch', 'finally', 'throw', 'switch', 'case', 'default', 'delete', 'void', 'interface', 'type',
  'implements', 'readonly', 'private', 'public', 'protected', 'static', 'enum', 'satisfies',
]);

const TOKEN_RE = new RegExp(
  [
    '(\\/\\/[^\\n]*)', // 1 — строчный комментарий
    '(\\/\\*[\\s\\S]*?\\*\\/)', // 2 — блочный комментарий
    "('(?:\\\\.|[^'\\\\])*'|\"(?:\\\\.|[^\"\\\\])*\"|`(?:\\\\.|[^`\\\\])*`)", // 3 — строка
    '(\\b\\d[\\d_]*(?:\\.\\d+)?\\b)', // 4 — число
    '([A-Za-z_$][\\w$]*)', // 5 — идентификатор
  ].join('|'),
  'g',
);

export const tokenize = (source: string): Token[][] => {
  const tokens: Token[] = [];
  let last = 0;

  const push = (text: string, kind: TokenKind) => {
    if (text) tokens.push({ text, kind });
  };

  for (const match of source.matchAll(TOKEN_RE)) {
    const index = match.index;
    push(source.slice(last, index), 'plain');
    last = index + match[0].length;

    if (match[1] || match[2]) push(match[0], 'comment');
    else if (match[3]) push(match[0], 'string');
    else if (match[4]) push(match[0], 'number');
    else if (match[5]) {
      const word = match[5];
      const next = source[last];
      if (KEYWORDS.has(word)) push(word, 'keyword');
      else if (next === '(') push(word, 'fn');
      else if (/^[A-Z]/.test(word)) push(word, 'type');
      else push(word, 'plain');
    }
  }
  push(source.slice(last), 'plain');

  // Режем на строки уже после токенизации — так многострочный комментарий
  // или шаблонная строка остаются корректно подсвеченными.
  const lines: Token[][] = [[]];
  for (const token of tokens) {
    const parts = token.text.split('\n');
    parts.forEach((part, i) => {
      if (i > 0) lines.push([]);
      if (part) lines[lines.length - 1].push({ text: part, kind: token.kind });
    });
  }
  return lines;
};

export const TOKEN_CLASS: Record<TokenKind, string> = {
  plain: 'text-foreground/85',
  keyword: 'text-viz-window',
  string: 'text-viz-active',
  comment: 'text-muted-foreground italic',
  number: 'text-viz-compare',
  fn: 'text-info',
  type: 'text-viz-swap',
};
