import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { tags } from '@lezer/highlight';

/**
 * Тема редактора под палитру Aurora.
 *
 * Цвета берутся из CSS-переменных темы, а не хардкодятся: редактор обязан
 * жить в той же палитре, что и остальная страница, иначе он выглядит как
 * вставленный из другого приложения.
 */
export const auroraEditorTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'transparent',
      color: 'var(--foreground)',
      fontSize: '13px',
    },
    '.cm-content': {
      fontFamily: 'var(--font-mono, "JetBrains Mono", monospace)',
      caretColor: 'var(--viz-active)',
      padding: '10px 0',
    },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--viz-active)' },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: 'color-mix(in oklch, var(--viz-window) 30%, transparent)',
    },
    '.cm-gutters': {
      backgroundColor: 'transparent',
      color: 'color-mix(in oklch, var(--muted-foreground) 60%, transparent)',
      border: 'none',
    },
    '.cm-activeLine': { backgroundColor: 'color-mix(in oklch, var(--muted) 40%, transparent)' },
    '.cm-activeLineGutter': { backgroundColor: 'transparent', color: 'var(--foreground)' },
    '.cm-lineNumbers .cm-gutterElement': { padding: '0 8px 0 12px' },
    '&.cm-focused': { outline: 'none' },
    '.cm-scroller': { lineHeight: '1.6' },
  },
  { dark: true },
);

export const auroraHighlight = syntaxHighlighting(
  HighlightStyle.define([
    { tag: tags.keyword, color: 'var(--viz-window)' },
    { tag: [tags.controlKeyword, tags.moduleKeyword], color: 'var(--viz-window)', fontWeight: '600' },
    { tag: [tags.string, tags.special(tags.string)], color: 'var(--viz-active)' },
    { tag: [tags.number, tags.bool, tags.null], color: 'var(--viz-compare)' },
    { tag: [tags.comment, tags.lineComment, tags.blockComment], color: 'var(--muted-foreground)', fontStyle: 'italic' },
    { tag: [tags.function(tags.variableName), tags.function(tags.propertyName)], color: 'var(--info)' },
    { tag: [tags.typeName, tags.className], color: 'var(--viz-swap)' },
    { tag: tags.operator, color: 'var(--foreground)' },
    { tag: tags.propertyName, color: 'var(--foreground)' },
    { tag: tags.variableName, color: 'var(--foreground)' },
    { tag: tags.invalid, color: 'var(--destructive)' },
  ]),
);
