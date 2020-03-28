import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import * as editor from "monaco-editor";
import { monaco, Monaco } from "@monaco-editor/react";

import Breadcrumbs from "@/components/Breadcrumbs";
import ExplorerSection from "@/components/Explorer/ExplorerItem";
import FileTree from "@/components/FileTree";
import { LanguageContext } from "@/components/LanguageProvider";
import MonacoEditor from "@/components/MonacoEditor";
import TabContainer from "@/components/TabControl/TabContainer";
import { ThemeContext, Theme } from "@/components/ThemeProvider";
import useSize from "@/hooks/useSize";
import { Item, TabContent } from "@/types";

type Props = {
  items: Item[];

  onItemContentChanged?: (item: Item, content: string) => void;
};

type ThemedProps = {
  theme: Theme;
};

const BreadcrumbsContainer = styled.div<ThemedProps>`
  padding: 2px 2px 2px 12px;
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
  height: calc(100% - 27px);
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

const InnerTabContent = styled.div`
  height: 100%;
  padding: 0;
`;

const Monaka: React.FC<Props> = ({ items, onItemContentChanged }) => {
  const [tabs, setTabs] = useState<TabContent[]>([]);
  const [models, setModels] = useState<editor.editor.ITextModel[]>([]);
  const [currentTab, setCurrentTabInner] = useState<TabContent | null>(null);
  const [bufferedTabs, setBufferedTabsInner] = useState<TabContent[]>([]);
  // Workaround: some functions are stored in `useRef` container by @monaco-editor/react, so required reference values for use these variables.
  const bufferedTabsRef = useRef<TabContent[]>([]);
  const currentTabRef = useRef<TabContent | null>(null);
  const getter = useRef<() => string>();
  const editorInstance = useRef<editor.editor.IStandaloneCodeEditor>();
  const monacoInstance = useRef<Monaco>();
  const editorContainer = useRef<HTMLDivElement | null>(null);
  const languages = useContext(LanguageContext);
  const size = useSize();

  useEffect(() => {
    const init = async () => {
      monacoInstance.current = await monaco.init();
    };

    init();

    return () => {
      models.forEach((w) => w.dispose());
    };
  }, []);

  useEffect(() => {
    if (editorInstance.current) {
      const width = editorContainer.current!.clientWidth;
      const height = editorContainer.current!.clientHeight;
      editorInstance.current.layout({ height, width });
    }
  }, [size]);

  const setBufferedTabs = (newBufferedTabs: TabContent[]) => {
    bufferedTabsRef.current = newBufferedTabs;
    setBufferedTabsInner(newBufferedTabs);
  };

  const setCurrentTab = (newCurrentTab: TabContent | null) => {
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

  // eslint-disable-next-line no-shadow
  const onSaveCurrentTab = (editor: editor.editor.ICodeEditor) => {
    if (onItemContentChanged) onItemContentChanged(currentTabRef.current!.item, editor.getValue());

    const newBufferedTabs = bufferedTabsRef.current.slice().filter((w) => w.item.id !== currentTabRef.current!.item.id);
    setBufferedTabs(newBufferedTabs);
  };

  const onSelectedItemChanged = (item: Item | null) => {
    if (item === null || item.type !== "file") return;
    if (!tabs.find((w) => w.item.id === item.id)) {
      setTabs([...tabs, { item } as TabContent]);
    }

    setCurrentTab({ item } as TabContent);

    if (models.find((w) => w.uri.path === `/${item.id}`)) {
      editorInstance.current!.setModel(models.find((w) => w.uri.path === `/${item.id}`)!);
    } else {
      const uri = editor.Uri.from({ scheme: "monaka", path: `/${item.id}` });
      const model = monacoInstance.current?.editor?.createModel(item.content, languages.find((w) => w.extension.test(item.title))?.language, uri)!;
      setModels([...models, model]);
      if (editorInstance.current) editorInstance.current!.setModel(model);
    }
  };

  const onTabClosed = ({ item }: TabContent) => {
    if (bufferedTabsRef.current.find((w) => w.item.id === item.id)) {
      // eslint-disable-next-line no-alert
      if (window.confirm(`Tab ${item.title} is unsaved, save this?`)) {
        const model = models.find((w) => w.uri.path === `/${item.id}`);
        if (onItemContentChanged) onItemContentChanged(item, model?.getValue() || "");
      }
    }

    const closedModel = models.find((w) => w.uri.path === `/${item.id}`);
    if (closedModel) {
      try {
        closedModel.dispose();
      } catch (err) {
        // ignored
      }
    }

    const nextIndex = tabs.findIndex((w) => w.item.id === item.id);
    const newTabs = tabs.slice().filter((w) => w.item.id !== item.id);
    const tab = newTabs[nextIndex >= newTabs.length - 1 ? newTabs.length - 1 : nextIndex];
    const newModels = models.slice().filter((w) => w.uri.path !== `/${item.id}`);
    const model = newModels[nextIndex >= newTabs.length - 1 ? newTabs.length - 1 : nextIndex];
    const newBufferedTabs = bufferedTabsRef.current.slice().filter((w) => w.item.id !== item.id);

    setCurrentTab(tab);
    setTabs(newTabs);
    setModels(newModels);
    setBufferedTabs(newBufferedTabs);
    editorInstance.current!.setModel(model);
  };

  const onTabSelected = (tab: TabContent) => {
    setCurrentTab(tab);

    const model = models.find((w) => w.uri.path === `/${tab.item.id}`)!;
    editorInstance.current!.setModel(model);
  };

  const onContentChanged = (_1: editor.editor.IModelContentChangedEvent, content: string | undefined) => {
    const tab = currentTabRef.current!;
    if (tab.item.content === content) return;

    const newBufferedTabs = bufferedTabsRef.current.slice();
    if (newBufferedTabs.find((w) => w.item.id === tab.item.id)) return;
    newBufferedTabs.push(tab);

    setBufferedTabs(newBufferedTabs);
  };

  const onEditorMounted = (valueGetter: () => string, instance: editor.editor.IStandaloneCodeEditor) => {
    getter.current = valueGetter;
    editorInstance.current = instance;

    // eslint-disable-next-line no-shadow
    const monaco = monacoInstance.current!;

    editorInstance.current!.setModel(models[0]);
    editorInstance.current!.addAction({
      id: "save",
      label: "Save File",
      // eslint-disable-next-line no-bitwise
      keybindings: [(monaco.KeyMod.CtrlCmd as any) | (monaco.KeyCode.KEY_S as any)],
      run: onSaveCurrentTab,
    });
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
            <TabContainer items={tabs} bufferedItems={bufferedTabs} selectedItem={currentTab} onTabClosed={onTabClosed} onTabSelected={onTabSelected} />
            <InnerTabContent>
              {currentTab ? (
                <>
                  <BreadcrumbsContainer theme={theme}>
                    <Breadcrumbs path={getPathFromItem(currentTab.item, items)} />
                  </BreadcrumbsContainer>
                  <EditorContainer>
                    {/* Workaround: The Monaco Editor resized gradually, so this component calculates the size by itself. */}
                    <EditorCalculator ref={editorContainer} />
                    <Editor
                      language="typescript"
                      value={currentTab.item.content}
                      options={{ automaticLayout: true }}
                      onContentChanged={onContentChanged}
                      onEditorMounted={onEditorMounted}
                    />
                  </EditorContainer>
                </>
              ) : null}
            </InnerTabContent>
          </Content>
        </Container>
      )}
    </ThemeContext.Consumer>
  );
};

export default Monaka;
