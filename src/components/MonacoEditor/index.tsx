import React, { useEffect } from "react";
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

  useEffect(() => {
    if (!(window as any).MonacoEnvironment) {
      (window as any).MonacoEnvironment = {
        getWorkerUrl(moduleId: string, label: string): string {
          // Workaround: Monaco Editor could not create a worker when loaded from CDN.
          const wrapForCrossDomain = (url: string): string => {
            return `data:text/javascript;charset=utt-8,${encodeURIComponent(`
              self.MonacoEnvironment = {
                baseUrl: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.19.3'
              };
              importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.19.3${url}');
            `)}`;
          };

          switch (label) {
            case "typescript":
            case "javascript":
              return wrapForCrossDomain(`/min/vs/language/typescript/tsWorker.js`);

            case "json":
              return wrapForCrossDomain(`/min/vs/language/json/jsonWorker.js`);

            case "html":
              return wrapForCrossDomain(`/min/vs/language/html/htmlWorker.js`);

            case "css":
              return wrapForCrossDomain(`/min/vs/language/css/cssWorker.js`);

            default:
              return wrapForCrossDomain(`/min/vs/base/worker/workerMain.js`);
          }
        },
      };
    }
  }, []);

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
