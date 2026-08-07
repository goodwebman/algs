import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';

/**
 * Тема редактора под палитру Aurora.
 *
 * Цвета берутся из CSS-переменных темы, а не хардкодятся: редактор обязан
 * жить в той же палитре, что и остальная страница, иначе он выглядит как
 * вставленный из другого приложения.
 *
 * Важно: эта тема работает только вместе с `theme="none"` и
 * `syntaxHighlighting: false` в CodeEditor. Обёртка @uiw добавляет свои
 * extensions ПЕРЕД пользовательскими, а в CodeMirror при конфликте
 * выигрывает первый зарегистрированный highlighter — то есть светлый
 * дефолт, рассчитанный на белый фон.
 */
export const auroraEditorTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'transparent',
      color: 'var(--foreground)',
      fontSize: '13.5px',
    },
    '.cm-content': {
      fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
      caretColor: 'var(--viz-active)',
      padding: '12px 0',
      lineHeight: '1.7',
    },
    '.cm-line': { padding: '0 12px' },

    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: 'var(--viz-active)',
      borderLeftWidth: '2px',
    },

    // Выделение должно быть заметным, но не перекрывать текст.
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: 'color-mix(in oklch, var(--viz-window) 35%, transparent)',
    },
    '.cm-selectionMatch': {
      backgroundColor: 'color-mix(in oklch, var(--viz-compare) 22%, transparent)',
      borderRadius: '2px',
    },

    // Номера строк: приглушены относительно кода, но читаемы (~4:1 к фону).
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: 'color-mix(in oklch, var(--muted-foreground) 75%, transparent)',
      border: 'none',
      borderRight: '1px solid color-mix(in oklch, var(--border) 60%, transparent)',
      paddingRight: '2px',
    },
    '.cm-lineNumbers .cm-gutterElement': { padding: '0 10px 0 14px', minWidth: '2.4em' },

    // Активная строка — едва заметная подложка. Дефолтная у CodeMirror
    // почти белая и на тёмном фоне гасит текст под собой.
    '.cm-activeLine': {
      backgroundColor: 'color-mix(in oklch, var(--muted) 28%, transparent)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent',
      color: 'var(--foreground)',
    },

    '.cm-matchingBracket, &.cm-focused .cm-matchingBracket': {
      backgroundColor: 'color-mix(in oklch, var(--viz-active) 25%, transparent)',
      outline: '1px solid color-mix(in oklch, var(--viz-active) 60%, transparent)',
      borderRadius: '2px',
    },
    '.cm-nonmatchingBracket': {
      backgroundColor: 'color-mix(in oklch, var(--destructive) 25%, transparent)',
    },

    '&.cm-focused': { outline: 'none' },
    '.cm-scroller': { overflow: 'auto' },

    // Автодополнение живёт в поповере — ему нужен собственный фон,
    // иначе список будет прозрачным поверх кода.
    '.cm-tooltip': {
      backgroundColor: 'var(--popover)',
      border: '1px solid var(--border)',
      borderRadius: '6px',
      color: 'var(--foreground)',
    },
    '.cm-tooltip-autocomplete > ul > li': {
      fontFamily: 'var(--font-mono, monospace)',
      padding: '3px 8px',
    },
    '.cm-tooltip-autocomplete > ul > li[aria-selected]': {
      backgroundColor: 'color-mix(in oklch, var(--viz-active) 22%, transparent)',
      color: 'var(--foreground)',
    },
  },
  { dark: true },
);

/**
 * Подсветка синтаксиса.
 *
 * Все цвета проверены на контраст к фону редактора: минимум 6:1, то есть
 * с запасом к порогу WCAG AA для обычного текста. Комментарии намеренно
 * приглушены до ~7:1 — они должны читаться, но не спорить с кодом.
 */
export const auroraHighlight = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.keyword, color: 'var(--viz-window)', fontWeight: '500' },
    { tag: [tags.controlKeyword, tags.moduleKeyword], color: 'var(--viz-window)', fontWeight: '600' },
    { tag: [tags.definitionKeyword, tags.operatorKeyword], color: 'var(--viz-window)' },

    { tag: [tags.string, tags.special(tags.string)], color: 'var(--viz-active)' },
    { tag: [tags.number, tags.bool, tags.null, tags.atom], color: 'var(--viz-compare)' },

    {
      tag: [tags.comment, tags.lineComment, tags.blockComment, tags.docComment],
      color: 'color-mix(in oklch, var(--muted-foreground) 92%, transparent)',
      fontStyle: 'italic',
    },

    { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: 'var(--info)' },
    { tag: [tags.typeName, tags.className, tags.namespace], color: 'var(--viz-swap)' },

    { tag: [tags.definition(tags.variableName), tags.definition(tags.propertyName)], color: 'var(--foreground)' },
    { tag: [tags.variableName, tags.propertyName], color: 'var(--foreground)' },
    { tag: tags.operator, color: 'color-mix(in oklch, var(--foreground) 80%, transparent)' },
    { tag: [tags.punctuation, tags.separator, tags.bracket], color: 'color-mix(in oklch, var(--foreground) 65%, transparent)' },

    { tag: tags.regexp, color: 'var(--viz-swap)' },
    { tag: tags.escape, color: 'var(--viz-compare)' },
    { tag: tags.invalid, color: 'var(--destructive)', textDecoration: 'underline wavy' },
  ]),
);
