/* eslint-disable import/no-cycle */
import React, { useEffect, useRef, useState } from "react";
import { ContextMenu, MenuItem } from "react-contextmenu";
import styled from "styled-components";
import { v4 as uuid } from "uuid";

import Tree from "@/components/FileTree/Tree";
import { getDepth, getIsSelected, getIsValidPath, getChildren } from "@/components/FileTree/utils";
import { ChevronDown, ChevronRight, FolderClosed, FolderOpened } from "@/components/Icon";
import { IconContext } from "@/components/IconProvider";
import Input from "@/components/Input";
import StyledContextMenu from "@/components/StyledContextMenu";
import { ThemeContext, Theme } from "@/components/ThemeProvider";
import { DirectoryItem, FileIcon, FileItem, Item } from "@/types";

type ContainerProps = {
  depth: number;
  theme: Theme;
};

const Container = styled.div<ContainerProps>`
  box-sizing: border-box;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
  min-width: 100%;
  height: 24px;
  padding: 2px 0 2px ${(props) => 2 + props.depth * 16}px;
  font-size: 14px;
  color: ${(props) => props.theme.fontColor};
  user-select: none;

  &.selected {
    background: ${(props) => props.theme.highlightBackground};
  }

  &:hover:not(.selected) {
    background: ${(props) => props.theme.hoverBackground};
  }
`;

const Icon = styled.div`
  width: 16px;
  height: 16px;
`;

const Label = styled.span`
  padding: 2px 2px 0 8px;
  font-size: 14px;
`;

type Props = {
  item: DirectoryItem;
  items: Item[];
  selectedItem: Item | null;

  onFolderStateChanged?: (id: string, state: DirectoryItem["state"]) => void;
  onItemChanged?: (item: Item) => void;
  onItemCreated?: (item: Item) => void;
  onItemDeleted?: (item: Item) => void;
  onRenameOverlayStateChanged?: (isEnabled: boolean) => void;
  onSelectStateChanged?: (item: Item | null) => void;
};

const Directory: React.FC<Props> = ({
  item,
  items,
  selectedItem,
  onItemChanged,
  onItemCreated,
  onItemDeleted,
  onFolderStateChanged,
  onRenameOverlayStateChanged,
  onSelectStateChanged,
}) => {
  const [isOpen, setOpen] = useState(item.state === "opened");
  const [isEditing, setIsEditing] = useState(false);
  const [temporaryItem, setTemporaryItem] = useState<Item | null>(null);
  const renamingOverlay = useRef<HTMLInputElement>();

  useEffect(() => {
    if (renamingOverlay.current) renamingOverlay.current.focus();
  }, [isEditing]);

  useEffect(() => {
    if (renamingOverlay.current) renamingOverlay.current.focus();
  }, [temporaryItem]);

  const toggle = (event: React.MouseEvent) => {
    event.stopPropagation();

    setOpen(!isOpen);
    if (onFolderStateChanged) onFolderStateChanged(item.id, !isOpen ? "opened" : "closed");
    if (onSelectStateChanged) onSelectStateChanged(item);
  };

  const depth = getDepth(items, item);
  const clazz = getIsSelected(item, selectedItem) ? "selected" : undefined;

  const getIconComponent = (icons: FileIcon[], dirname: string) => {
    const icon = icons.find((w) => w.directory && w.extension.test(`${dirname}_${isOpen ? "opened" : "closed"}`));

    let Component = icon?.component;
    if (Component == null) Component = isOpen ? FolderOpened : FolderClosed;

    return <Component />;
  };

  const getChevronComponent = () => {
    const Component = isOpen ? ChevronDown : ChevronRight;

    return <Component />;
  };

  const onClickDeleteItem = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Are you sure you want to delete ${item.title} and its contents?`)) {
      if (onItemDeleted) onItemDeleted(item);
    }
  };

  const onClickRenameItem = () => {
    setIsEditing(true);
    if (onRenameOverlayStateChanged) onRenameOverlayStateChanged(true);
  };

  const onClickNewFile = () => {
    setTemporaryItem({ type: "file", id: uuid(), parentId: item.id, title: "", content: "" } as FileItem);
    if (onRenameOverlayStateChanged) onRenameOverlayStateChanged(true);
  };

  const onClickNewFolder = () => {
    setTemporaryItem({ type: "directory", id: uuid(), parentId: item.id, title: "", state: "closed" } as DirectoryItem);
    if (onRenameOverlayStateChanged) onRenameOverlayStateChanged(true);
  };

  const onBlur = () => {
    setIsEditing(false);
    setTemporaryItem(null);
    if (onRenameOverlayStateChanged) onRenameOverlayStateChanged(false);
  };

  const onMounted = (ref: HTMLInputElement) => {
    renamingOverlay.current = ref;
  };

  const onSubmit = (value: any) => {
    if (typeof value === "string") {
      // renaming or creating
      if (isEditing) {
        setIsEditing(false);
        if (onRenameOverlayStateChanged) onRenameOverlayStateChanged(false);
        if (value.trim() !== "" && getIsValidPath(value.trim()) && onItemChanged) onItemChanged({ ...item, title: value.trim() });
      } else if (temporaryItem) {
        setTemporaryItem(null);
        if (onRenameOverlayStateChanged) onRenameOverlayStateChanged(false);
        if (value.trim() !== "" && getIsValidPath(value.trim()) && onItemCreated) onItemCreated({ ...temporaryItem, title: value.trim() });
      }
    }
  };

  const onIsValid = (value: string) => {
    if (getIsValidPath(value)) {
      return null;
    }

    return "Invalid pathname";
  };

  const id = `FileTree-Directory-ContextMenu-${item.id}`;

  return (
    <>
      <ThemeContext.Consumer>
        {(theme) => (
          <IconContext.Consumer>
            {(icons) => (
              <>
                <StyledContextMenu id={id} disable={isEditing}>
                  <Container className={clazz} depth={depth} theme={theme} onClick={toggle}>
                    {getChevronComponent()}
                    <Icon>{getIconComponent(icons, item.title)}</Icon>
                    {isEditing ? <Input value={item.title} onBlur={onBlur} onIsValid={onIsValid} onMounted={onMounted} onSubmit={onSubmit} /> : <Label>{item.title}</Label>}
                  </Container>
                </StyledContextMenu>
                <ContextMenu id={id}>
                  <MenuItem onClick={onClickNewFile} disabled={!onItemCreated}>
                    New File
                  </MenuItem>
                  <MenuItem onClick={onClickNewFolder} disabled={!onItemCreated}>
                    New Folder
                  </MenuItem>
                  <MenuItem divider />
                  <MenuItem onClick={onClickRenameItem} disabled={!onItemChanged}>
                    Rename
                  </MenuItem>
                  <MenuItem onClick={onClickDeleteItem} disabled={!onItemDeleted}>
                    Delete
                  </MenuItem>
                </ContextMenu>
                {temporaryItem ? (
                  <Container depth={depth + 1} theme={theme}>
                    <Input value="" onBlur={onBlur} onMounted={onMounted} onSubmit={onSubmit} />
                  </Container>
                ) : null}
                {isOpen ? (
                  <Tree
                    items={getChildren(items, item)}
                    selectedItem={selectedItem}
                    level={depth + 1}
                    onFolderStateChanged={onFolderStateChanged}
                    onItemChanged={onItemChanged}
                    onItemCreated={onItemCreated}
                    onItemDeleted={onItemDeleted}
                    onRenameOverlayStateChanged={onRenameOverlayStateChanged}
                    onSelectStateChanged={onSelectStateChanged}
                  />
                ) : null}
              </>
            )}
          </IconContext.Consumer>
        )}
      </ThemeContext.Consumer>
    </>
  );
};

export default Directory;
