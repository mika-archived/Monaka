import React from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import MonacoEditor from "@monaco-editor/react";

type Props = {
  className?: string;
  language: string;
  value: string;
  onValueChanged?: (code: string) => void;

  options?: monaco.editor.IEditorConstructionOptions;
};

const Editor: React.FC<Props> = ({ className, language, onValueChanged, options, value }) => {
  const onEditorMounted = (valueGetter: () => string, _: any) => {
    if (onValueChanged) onValueChanged(valueGetter());
  };

  return (
    <div className={className}>
      <MonacoEditor editorDidMount={onEditorMounted} height="100%" theme="dark" language={language} options={options} value={value} width="100%" />
    </div>
  );
};

export default Editor;
