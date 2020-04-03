/* eslint-disable import/no-cycle */
import React, { useEffect, useRef, useState } from "react";
import { ContextMenu, MenuItem } from "react-contextmenu";
import styled from "styled-components";

import Tree from "@/components/FileTree/Tree";
import { getDepth, getIsSelected } from "@/components/FileTree/utils";
import { ChevronDown, ChevronRight, FolderClosed, FolderOpened } from "@/components/Icon";
import { IconContext } from "@/components/IconProvider";
import Input from "@/components/Input";
import StyledContextMenu from "@/components/StyledContextMenu";
import { ThemeContext, Theme } from "@/components/ThemeProvider";
import { FileIcon, DirectoryItem, Item } from "@/types";

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
  const renamingOverlay = useRef<HTMLInputElement>();

  useEffect(() => {
    if (renamingOverlay.current) renamingOverlay.current.focus();
  }, [isEditing]);

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

  const onClickRenameItem = () => {
    setIsEditing(true);
    if (onRenameOverlayStateChanged) onRenameOverlayStateChanged(true);
  };

  const onBlur = () => {
    setIsEditing(false);
    if (onRenameOverlayStateChanged) onRenameOverlayStateChanged(false);
  };

  const onMounted = (ref: HTMLInputElement) => {
    renamingOverlay.current = ref;
  };

  const onSubmit = (value: any) => {
    if (typeof value === "string") {
      setIsEditing(false);
      if (onRenameOverlayStateChanged) onRenameOverlayStateChanged(false);
      if (value.trim() !== "" && onItemChanged) onItemChanged({ ...item, title: value });
    }
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
                    {isEditing ? <Input value={item.title} onBlur={onBlur} onMounted={onMounted} onSubmit={onSubmit} /> : <Label>{item.title}</Label>}
                  </Container>
                </StyledContextMenu>
                <ContextMenu id={id}>
                  <MenuItem>New File</MenuItem>
                  <MenuItem>New Folder</MenuItem>
                  <MenuItem divider />
                  <MenuItem onClick={onClickRenameItem}>Rename</MenuItem>
                  <MenuItem>Delete</MenuItem>
                </ContextMenu>
                {isOpen ? (
                  <Tree
                    items={items}
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
