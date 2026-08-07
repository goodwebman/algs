import { javascript } from '@codemirror/lang-javascript';
import CodeMirror from '@uiw/react-codemirror';

import { auroraEditorTheme, auroraHighlight } from './editor-theme';

const extensions = [javascript(), auroraEditorTheme, auroraHighlight];

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  minHeight?: string;
}

export const CodeEditor = ({ value, onChange, ariaLabel = 'Редактор кода', minHeight = '18rem' }: CodeEditorProps) => (
  <div className="overflow-hidden rounded-lg border border-border bg-card/40">
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extensions}
      minHeight={minHeight}
      // 'none', а не 'light' (дефолт обёртки): светлая тема ставит белый фон
      // поверх нашего, и код становится нечитаемым на тёмной странице.
      theme="none"
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: true,
        autocompletion: true,
        bracketMatching: true,
        closeBrackets: true,
        // Своя подсветка из editor-theme. Дефолтная рассчитана на белый фон
        // и, будучи добавленной последней, перебивает нашу.
        syntaxHighlighting: false,
      }}
      aria-label={ariaLabel}
    />
  </div>
);
