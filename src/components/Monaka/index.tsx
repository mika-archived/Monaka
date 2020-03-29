import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import * as monacoEditor from "monaco-editor";

import Breadcrumbs from "@/components/Breadcrumbs";
import ExplorerSection from "@/components/Explorer/ExplorerItem";
import FileTree from "@/components/FileTree";
import { LanguageContext } from "@/components/LanguageProvider";
import MonacoEditor from "@/components/MonacoEditor";
import TabContainer from "@/components/TabControl/TabContainer";
import { ThemeContext, Theme } from "@/components/ThemeProvider";
import useSize from "@/hooks/useSize";
import { Item, FileItem } from "@/types";

type Props = {
  items: Item[];

  onItemCreated?: (item: Item) => void;
  onItemChanged?: (item: Item) => void;
  onItemDeleted?: (item: Item) => void;
};

type ThemedProps = {
  theme: Theme;
};

const BreadcrumbsContainer = styled.div<ThemedProps>`
  padding: 4px 2px 4px 12px;
  background: ${(props) => props.theme.editorBackground};
`;

const Container = styled.div<ThemedProps>`
  display: flex;
  flex-flow: row nowrap;
  align-content: stretch;
  align-items: stretch;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  background: ${(props) => props.theme.background};
`;

const Content = styled.div`
  display: flex;
  flex: 1 1 auto;
  flex-flow: column nowrap;
`;

const Editor = styled(MonacoEditor)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  max-width: calc(100% - 1px);
  height: 100%;
  max-height: 100%;
`;

const EditorContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100% - 30px);
`;

const EditorCalculator = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const Explorer = styled.div`
  flex: 0 0 250px;
`;

const Header = styled.div<ThemedProps>`
  padding: 8px 22px;
  font-size: 14px;
  color: ${(props) => props.theme.fontColor};
`;

const TabControl = styled(TabContainer)`
  order: 0;
`;

const InnerTabContent = styled.div`
  order: 1;
  height: 100%;
  padding: 0;
  margin-top: -7.2px; /* shit div element */
`;

const Monaka: React.FC<Props> = ({ items, onItemChanged, onItemCreated, onItemDeleted }) => {
  const [tabs, setTabs] = useState<FileItem[]>([]);
  const [models, setModels] = useState<monacoEditor.editor.ITextModel[]>([]);
  const [currentTab, setCurrentTabInner] = useState<FileItem | null>(null);
  const [bufferedTabs, setBufferedTabsInner] = useState<FileItem[]>([]);
  // Workaround: some functions are stored in `useRef` container by @monaco-editor/react, so required reference values for use these variables.
  const bufferedTabsRef = useRef<FileItem[]>([]);
  const currentTabRef = useRef<FileItem | null>(null);
  const editorInstance = useRef<monacoEditor.editor.IStandaloneCodeEditor>();
  const monacoInstance = useRef<typeof monacoEditor>();
  const editorContainer = useRef<HTMLDivElement | null>(null);
  const languages = useContext(LanguageContext);
  const size = useSize();

  // resize monaco-editor
  useEffect(() => {
    if (editorInstance.current) {
      const width = editorContainer.current!.clientWidth;
      const height = editorContainer.current!.clientHeight;
      editorInstance.current.layout({ height, width });
    }
  }, [size]);

  const setBufferedTabs = (newBufferedTabs: FileItem[]) => {
    bufferedTabsRef.current = newBufferedTabs;
    setBufferedTabsInner(newBufferedTabs);
  };

  const setCurrentTab = (newCurrentTab: FileItem | null) => {
    currentTabRef.current = newCurrentTab;
    setCurrentTabInner(newCurrentTab);
  };

  // eslint-disable-next-line no-shadow
  const getPathFromItem = (item: Item, items: Item[]) => {
    const path = [item.title];

    let current: Item = item;
    while (current.parentId !== null) {
      // eslint-disable-next-line no-loop-func
      current = items.find((w) => w.id === current.parentId)!;
      path.push(current.title);
    }

    return path.reverse().join("/");
  };

  const findModelById = (item: Item) => {
    return models.find((w) => w.uri.path === `/${item.id}`);
  };

  const createEditorModel = (item: FileItem) => {
    if (!monacoInstance.current) {
      // when 1st model creation, monaco instance is undefined
      return;
    }

    const uri = monacoInstance.current.Uri.from({ scheme: "monaka", authority: "models", path: `/${item.id}` });
    return monacoInstance.current.editor.createModel(item.content, languages.find((w) => w.extension.test(item.title))?.language, uri);
  };

  const deleteEditorModel = (item: FileItem) => {
    const model = findModelById(item);
    if (!model) return;

    model.dispose();
  };

  // eslint-disable-next-line no-shadow
  const onSaveCurrentTab = (editor: monacoEditor.editor.ICodeEditor) => {
    if (onItemChanged) onItemChanged({ ...currentTabRef.current!, content: editor.getValue() });

    const newBufferedTabs = bufferedTabsRef.current.slice().filter((w) => w.id !== currentTabRef.current!.id);
    setBufferedTabs(newBufferedTabs);
  };

  const onSelectedItemChanged = (item: Item | null) => {
    if (item === null || item.type !== "file") return;
    if (!tabs.find((w) => w.id === item.id)) {
      setTabs([...tabs, item]);
    }

    setCurrentTab(item);

    if (findModelById(item)) {
      editorInstance.current!.setModel(findModelById(item)!);
    } else {
      const model = createEditorModel(item);
      if (model) {
        setModels([...models, model]);
        if (editorInstance.current) editorInstance.current!.setModel(model);
      }
    }
  };

  const onTabClosed = (item: FileItem) => {
    if (bufferedTabsRef.current.find((w) => w.id === item.id)) {
      // eslint-disable-next-line no-alert
      if (window.confirm(`Tab ${item.title} is unsaved, save this?`)) {
        const model = findModelById(item);
        if (onItemChanged) onItemChanged({ content: model?.getValue() || "", ...item });
      }
    }

    deleteEditorModel(item);

    const nextIndex = tabs.findIndex((w) => w.id === item.id);
    const newTabs = tabs.slice().filter((w) => w.id !== item.id);
    const tab = newTabs[nextIndex >= newTabs.length - 1 ? newTabs.length - 1 : nextIndex];
    const newModels = models.slice().filter((w) => w.uri.path !== `/${item.id}`);
    const model = newModels[nextIndex >= newTabs.length - 1 ? newTabs.length - 1 : nextIndex];
    const newBufferedTabs = bufferedTabsRef.current.slice().filter((w) => w.id !== item.id);

    setCurrentTab(tab);
    setTabs(newTabs);
    setModels(newModels);
    setBufferedTabs(newBufferedTabs);
    editorInstance.current!.setModel(model);
  };

  const onTabSelected = (tab: FileItem) => {
    setCurrentTab(tab);

    const model = models.find((w) => w.uri.path === `/${tab.id}`)!;
    editorInstance.current!.setModel(model);
  };

  const onContentChanged = (content: string, _event: any) => {
    const tab = currentTabRef.current!;
    if (tab.content === content) return;

    const newBufferedTabs = bufferedTabsRef.current.slice();
    if (newBufferedTabs.find((w) => w.id === tab.id)) return;
    newBufferedTabs.push(tab);

    setBufferedTabs(newBufferedTabs);
  };

  const onEditorMounted = (instance: monacoEditor.editor.IStandaloneCodeEditor, monaco: typeof monacoEditor) => {
    monacoInstance.current = monaco;
    editorInstance.current = instance;

    // When the 1st model is set, the Monaco Editor has not yet been initialized, so we will initialize it here.
    const model = createEditorModel(currentTabRef.current!);
    if (model) {
      setModels([model]);
      editorInstance.current!.setModel(model);
    }

    editorInstance.current!.addAction({
      id: "save",
      label: "Save File",
      // eslint-disable-next-line no-bitwise
      keybindings: [(monaco.KeyMod.CtrlCmd as any) | (monaco.KeyCode.KEY_S as any)],
      run: onSaveCurrentTab,
    });
  };

  const onEditorUnmounted = () => {
    // cleanup editor instances
    monacoInstance.current = undefined;
    editorInstance.current = undefined;
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Container theme={theme}>
          <Explorer>
            <Header theme={theme}>Arteria Project</Header>
            <ExplorerSection title="Explorer">
              <FileTree items={items} onSelectedItemChanged={onSelectedItemChanged} />
            </ExplorerSection>
          </Explorer>
          <Content>
            <InnerTabContent>
              {currentTab ? (
                <>
                  <BreadcrumbsContainer theme={theme}>
                    <Breadcrumbs path={getPathFromItem(currentTab, items)} />
                  </BreadcrumbsContainer>
                  <EditorContainer>
                    {/* Workaround: The Monaco Editor resized gradually, so this component calculates the size by itself. */}
                    <EditorCalculator ref={editorContainer} />
                    <Editor
                      value={currentTab.content}
                      options={{ automaticLayout: true }}
                      onContentChanged={onContentChanged}
                      onEditorMounted={onEditorMounted}
                      onEditorUnmounted={onEditorUnmounted}
                    />
                  </EditorContainer>
                </>
              ) : null}
            </InnerTabContent>
            <TabControl items={tabs} bufferedItems={bufferedTabs} selectedItem={currentTab} onTabClosed={onTabClosed} onTabSelected={onTabSelected} />
          </Content>
        </Container>
      )}
    </ThemeContext.Consumer>
  );
};

export default Monaka;
