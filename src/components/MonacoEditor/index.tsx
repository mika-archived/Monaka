import React, { useEffect } from "react";
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import MonacoEditor from "react-monaco-editor";

import { ThemeContext } from "@/components/ThemeProvider";

type Props = {
  className?: string;
  value: string;
  language?: string;
  onContentChanged?: (content: string, event: monacoEditor.editor.IModelContentChangedEvent) => void;
  onEditorMounted?: (instance: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => void;
  onEditorUnmounted?: () => void;

  options?: monacoEditor.editor.IEditorConstructionOptions;
};

const Editor: React.FC<Props> = ({ className, language, onContentChanged, onEditorMounted, onEditorUnmounted, options, value }) => {
  useEffect(() => {
    return () => {
      if (onEditorUnmounted) onEditorUnmounted();
    };
  }, []);

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <div className={className}>
          <MonacoEditor
            onChange={onContentChanged}
            editorDidMount={onEditorMounted}
            height="100%"
            theme={theme.base}
            language={language}
            options={options}
            value={value}
            width="100%"
          />
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export default Editor;
