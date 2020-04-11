import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import * as monacoEditor from "monaco-editor";

import Breadcrumbs from "@/components/Breadcrumbs";
import FileTree from "@/components/FileTree";
import { LanguageContext } from "@/components/LanguageProvider";
import MonacoEditor from "@/components/MonacoEditor";
import Project from "@/components/Project";
import ProjectSection from "@/components/Project/ProjectSection";
import TabContainer from "@/components/TabControl/TabContainer";
import { ThemeContext, Theme } from "@/components/ThemeProvider";
import useSize from "@/hooks/useSize";
import { Item, FileItem } from "@/types";

type Props = {
  items: Item[];
  title: string;
  readonly?: boolean;

  onItemCreated?: (item: Item) => void;
  onItemsChanged?: (items: Item[]) => void;
  onItemDeleted?: (item: Item) => void;
};

type ThemedProps = {
  theme: Theme;
};

const BreadcrumbsContainer = styled.div<ThemedProps>`
  padding: 4px 2px 5px 12px;
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
  height: calc(100% - 32px);
`;

const EditorCalculator = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const SideArea = styled.div`
  width: 250px;
`;

const TabControl = styled(TabContainer)`
  order: 0;
`;

const InnerTabContent = styled.div`
  order: 1;
  height: 100%;
  padding: 0;
`;

const Monaka: React.FC<Props> = ({ children, items, title, readonly, onItemsChanged, onItemCreated, onItemDeleted }) => {
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
      return null;
    }

    const uri = monacoInstance.current.Uri.from({ scheme: "monaka", authority: "models", path: `/${item.id}` });
    return monacoInstance.current.editor.createModel(item.content, languages.find((w) => w.extension.test(item.title))?.language, uri);
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

  const onTabSelected = (tab: FileItem) => {
    setCurrentTab(tab);

    const model = models.find((w) => w.uri.path === `/${tab.id}`)!;
    editorInstance.current!.setModel(model);
  };

  const getBufferedContentById = (id: string): string => {
    const buffer = bufferedTabs.find((w) => w.id === id);
    if (buffer) return buffer.content;
    if (currentTab) return currentTab.content;
    return "";
  };

  // #region Editor Event Handlers

  const onSaveCurrentTab = (editor: monacoEditor.editor.ICodeEditor) => {
    if (onItemsChanged) onItemsChanged([{ ...currentTabRef.current!, content: editor.getValue() }]);

    const newBufferedTabs = bufferedTabsRef.current.slice().filter((w) => w.id !== currentTabRef.current?.id);
    setBufferedTabs(newBufferedTabs);
  };

  const onContentChanged = (content: string, _event: any) => {
    const tab = currentTabRef.current!;
    if (tab.content === content && !bufferedTabsRef.current.find((w) => w.id === tab.id)) return;

    const newBufferedTabs = bufferedTabsRef.current.slice();
    const buffer = newBufferedTabs.find((w) => w.id === tab.id);
    if (buffer) {
      buffer.content = content;
    } else {
      newBufferedTabs.push({ ...tab, content });
    }

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

  // #endregion

  // #region TabContainer Event Handlers

  const showConfirmDialog = (item: FileItem): boolean => {
    // eslint-disable-next-line no-alert
    return window.confirm(`Tab ${item.title} is not saved, close it ?`);
  };

  const getCloseTabIds = (targetTabs: FileItem[]): string[] => {
    const closeTabIds: string[] = [];

    for (let i = 0; i < targetTabs.length; i += 1) {
      const tab = targetTabs[i];
      const model = findModelById(tab);

      const notIncludedInBuffer = !bufferedTabs.find((w) => w.id === tab.id);
      if (notIncludedInBuffer || showConfirmDialog(tab)) {
        closeTabIds.push(tab.id);
        model!.dispose();
      }
    }

    return closeTabIds;
  };

  const closeTabs = (closeTabIds: string[]): void => {
    const includesInClosedTabs = (id: string): boolean => {
      return !!closeTabIds.find((w) => w === id);
    };

    const remainTabs = tabs.slice().filter((w) => !includesInClosedTabs(w.id));
    const remainBufferedTabs = bufferedTabs.slice().filter((w) => !includesInClosedTabs(w.id));
    const remainModels = models.slice().filter((w) => !includesInClosedTabs(w.uri.path.substring(1)));

    setCurrentTab(remainTabs[remainTabs.length - 1]);
    setTabs(remainTabs);
    setBufferedTabs(remainBufferedTabs);
    setModels(remainModels);
    editorInstance.current!.setModel(remainModels[remainModels.length - 1]);
  };

  const onCloseAllClicked = () => {
    const closeItemIds = getCloseTabIds(tabs);
    closeTabs(closeItemIds);
  };

  const onCloseOthersClicked = (item: FileItem) => {
    const closeItemIds = getCloseTabIds(tabs.filter((w) => w.id !== item.id));
    closeTabs(closeItemIds);
  };

  const onCloseRightsClicked = (item: FileItem) => {
    const closeItemIds = getCloseTabIds(tabs.slice(tabs.findIndex((w) => w.id === item.id) + 1));
    closeTabs(closeItemIds);
  };

  const onCloseSavedClicked = () => {
    const closedItemIds: string[] = [];

    for (let i = 0; i < tabs.length; i += 1) {
      const tab = tabs[i];
      const model = findModelById(tab);
      if (model) {
        if (!bufferedTabs.find((w) => w.id === tab.id)) {
          closedItemIds.push(tab.id);
          model.dispose();
        }
      }
    }

    closeTabs(closedItemIds);
  };

  const onCloseThisClicked = (item: FileItem) => {
    const model = models.find((w) => w.uri.path === `/${item.id}`);
    if (!model) return;

    if (bufferedTabs.find((w) => w.id === item.id)) {
      if (!showConfirmDialog(item)) {
        return;
      }
    }

    model.dispose();

    const nextIndex = tabs.findIndex((w) => w.id === item.id);
    const remainTabs = tabs.slice().filter((w) => w.id !== item.id);
    const nextTab = remainTabs[nextIndex >= remainTabs.length - 1 ? remainTabs.length - 1 : nextIndex];
    const remainBufferedTabs = bufferedTabs.slice().filter((w) => w.id !== item.id);
    const remainModels = models.slice().filter((w) => w.uri.path !== `/${item.id}`);
    const nextModel = remainModels[nextIndex >= remainModels.length - 1 ? remainModels.length - 1 : nextIndex];

    setCurrentTab(nextTab);
    setTabs(remainTabs);
    setBufferedTabs(remainBufferedTabs);
    setModels(remainModels);
    editorInstance.current!.setModel(nextModel);
  };

  // #endregion

  // #region FileTree Event Handlers

  const onCreatedItem = (item: Item) => {
    if (onItemCreated) onItemCreated(item);
  };

  const onChangedItem = (item: Item) => {
    // if file extension is changed, reopen model
    if (item.type === "file") {
      const getExtension = (filename: string): string => {
        return filename.substring(filename.lastIndexOf("."));
      };

      const oldItem = items.find((w) => w.id === item.id)!;
      if (getExtension(oldItem.title) !== getExtension(item.title)) {
        const oldModel = findModelById(item);
        if (oldModel) {
          oldModel.dispose();
        }

        const newModel = createEditorModel(item)!;
        editorInstance.current!.setModel(newModel);

        // replace model instance
        const newModels = models.slice();
        newModels[newModels.findIndex((w) => w.uri.path === `/${item.id}`)] = newModel;
        setModels(newModels);
      }
    }

    if (onItemsChanged) onItemsChanged([item]);
  };

  const onDeletedItem = (item: Item) => {
    const existTab = tabs.find((w) => w.id === item.id);
    if (existTab) closeTabs([existTab.id]);

    if (onItemDeleted) onItemDeleted(item);
  };

  // #endregion

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Container theme={theme}>
          <SideArea>
            <Project title={title}>
              <ProjectSection title="Explorer">
                <FileTree
                  items={items}
                  readonly={readonly || false}
                  onItemChanged={onChangedItem}
                  onItemCreated={onCreatedItem}
                  onItemDeleted={onDeletedItem}
                  onSelectedItemChanged={onSelectedItemChanged}
                />
              </ProjectSection>
              {children}
            </Project>
          </SideArea>
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
                      value={getBufferedContentById(currentTab.id)}
                      options={{ automaticLayout: true, readOnly: readonly || false }}
                      onContentChanged={onContentChanged}
                      onEditorMounted={onEditorMounted}
                      onEditorUnmounted={onEditorUnmounted}
                    />
                  </EditorContainer>
                </>
              ) : null}
            </InnerTabContent>
            <TabControl
              items={tabs}
              bufferedItems={bufferedTabs}
              selectedItem={currentTab}
              onCloseAllClicked={onCloseAllClicked}
              onCloseOthersClicked={onCloseOthersClicked}
              onCloseRightsClicked={onCloseRightsClicked}
              onCloseSavedClicked={onCloseSavedClicked}
              onCloseThisClicked={onCloseThisClicked}
              onTabSelected={onTabSelected}
            />
          </Content>
        </Container>
      )}
    </ThemeContext.Consumer>
  );
};

export default Monaka;
