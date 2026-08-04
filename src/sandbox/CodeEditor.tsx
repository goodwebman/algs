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
  <div className="overflow-hidden rounded-lg border border-border bg-background/60">
    <CodeMirror
      value={value}
      onChange={onChange}
      extensions={extensions}
      minHeight={minHeight}
      basicSetup={{
        lineNumbers: true,
        foldGutter: false,
        highlightActiveLine: true,
        autocompletion: true,
        bracketMatching: true,
        closeBrackets: true,
      }}
      aria-label={ariaLabel}
    />
  </div>
);
