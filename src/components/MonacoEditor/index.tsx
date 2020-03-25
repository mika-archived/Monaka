import React from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import MonacoEditor from "@monaco-editor/react";

import { ThemeContext } from "@/components/ThemeProvider";

type Props = {
  className?: string;
  language: string;
  value: string;
  onEditorMounted?: (valueGetter: () => string, instance: monaco.editor.IStandaloneCodeEditor) => void;

  options?: monaco.editor.IEditorConstructionOptions;
};

const Editor: React.FC<Props> = ({ className, language, onEditorMounted, options, value }) => {
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <div className={className}>
          <MonacoEditor editorDidMount={onEditorMounted} height="100%" theme={theme.base} language={language} options={options} value={value} width="100%" />
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export default Editor;
