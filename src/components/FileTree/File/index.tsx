/* eslint-disable import/no-cycle */
import React, { useEffect, useRef, useState } from "react";
import { ContextMenu, MenuItem } from "react-contextmenu";
import styled from "styled-components";

import { DefaultFile } from "@/components/Icon";
import { IconContext } from "@/components/IconProvider";
import Input from "@/components/Input";
import StyledContextMenu from "@/components/StyledContextMenu";
import { ThemeContext, Theme } from "@/components/ThemeProvider";
import { getDepth, getIsSelected, getIsValidPath } from "@/components/FileTree/utils";
import { FileIcon, FileItem, Item } from "@/types";

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
  padding: 2px 0 2px ${(props) => 20 + props.depth * 16}px;
  font-size: 14px;
  color: ${(props) => props.theme.fontColor};
  white-space: nowrap;
  user-select: none;

  &.selected {
    background: ${(props) => props.theme.highlightBackground};
  }

  &:hover:not(.selected) {
    background: ${(props) => props.theme.hoverBackground};
  }
`;

const Icon = styled.div`
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
`;

const Label = styled.span`
  flex: 0 1 auto;
  padding: 2px 4px 0 8px;
  font-size: 14px;
`;

type Props = {
  item: FileItem;
  items: Item[];
  selectedItem: Item | null;

  onItemChanged?: (item: Item) => void;
  onItemDeleted?: (item: Item) => void;
  onRenameOverlayStateChanged?: (isEnabled: boolean) => void;
  onSelectStateChanged?: (item: Item | null) => void;
};

const File: React.FC<Props> = ({ item, items, selectedItem, onItemChanged, onItemDeleted, onRenameOverlayStateChanged, onSelectStateChanged }) => {
  const [isEditing, setIsEditing] = useState(false);
  const renamingOverlay = useRef<HTMLInputElement>();

  useEffect(() => {
    if (renamingOverlay.current) renamingOverlay.current.focus();
  }, [isEditing]);

  const depth = getDepth(items, item);
  const clazz = getIsSelected(item, selectedItem) ? "selected" : undefined;

  const getIconComponent = (icons: FileIcon[], filename: string) => {
    const icon = icons.find((w) => !w.directory && w.extension.test(filename));
    const Component = icon ? icon.component : DefaultFile;

    return <Component />;
  };

  const onClickItem = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (onSelectStateChanged) onSelectStateChanged(item);
  };

  const onClickDeleteItem = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm(`Are you sure you want to delete ${item.title}?`)) {
      if (onItemDeleted) onItemDeleted(item);
    }
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
      if (value.trim() !== "" && getIsValidPath(value.trim()) && onItemChanged) onItemChanged({ ...item, title: value.trim() });
    }
  };

  const onIsValid = (value: string) => {
    if (getIsValidPath(value)) {
      return null;
    }

    return "Invalid pathname";
  };

  const id = `FileTree-File-ContextMenu-${item.id}`;

  return (
    <>
      <StyledContextMenu id={id} disable={isEditing}>
        <ThemeContext.Consumer>
          {(theme) => (
            <IconContext.Consumer>
              {(icons) => (
                <Container className={clazz} depth={depth} theme={theme} onClick={onClickItem}>
                  <Icon>{getIconComponent(icons, item.title)}</Icon>
                  {isEditing ? (
                    <Input value={item.title} mode="Submit" onBlur={onBlur} onIsValid={onIsValid} onMounted={onMounted} onSubmit={onSubmit} />
                  ) : (
                    <Label>{item.title}</Label>
                  )}
                </Container>
              )}
            </IconContext.Consumer>
          )}
        </ThemeContext.Consumer>
      </StyledContextMenu>
      <ContextMenu id={id}>
        <MenuItem onClick={onClickRenameItem} disabled={!onItemChanged}>
          Rename
        </MenuItem>
        <MenuItem onClick={onClickDeleteItem} disabled={!onItemDeleted}>
          Delete
        </MenuItem>
      </ContextMenu>
    </>
  );
};

export default File;
