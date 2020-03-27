import React from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { ControlledEditor } from "@monaco-editor/react";

import { ThemeContext } from "@/components/ThemeProvider";

type Props = {
  className?: string;
  language: string;
  value: string;
  onContentChanged?: (event: monaco.editor.IModelContentChangedEvent, content: string | undefined) => void;
  onEditorMounted?: (valueGetter: () => string, instance: monaco.editor.IStandaloneCodeEditor) => void;

  options?: monaco.editor.IEditorConstructionOptions;
};

const Editor: React.FC<Props> = ({ className, language, onContentChanged, onEditorMounted, options, value }) => {
  const noop = () => {};

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <div className={className}>
          <ControlledEditor
            onChange={onContentChanged || noop}
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
