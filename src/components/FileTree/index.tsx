/* eslint-disable import/no-cycle */
import React, { useEffect, useRef, useState } from "react";
import { ContextMenu, MenuItem } from "react-contextmenu";
import styled from "styled-components";
import { v4 as uuid } from "uuid";

import Tree from "@/components/FileTree/Tree";
import { sortPredicate, getIsValidPath } from "@/components/FileTree/utils";
import Input from "@/components/Input";
import StyledContextMenu from "@/components/StyledContextMenu";
import { DirectoryItem, FileItem, Item } from "@/types";

type Props = {
  items: Item[];
  readonly?: boolean;

  onItemChanged?: (item: Item) => void;
  onItemCreated?: (item: Item) => void;
  onItemDeleted?: (item: Item) => void;
  onSelectedItemChanged?: (item: Item | null) => void;
};

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-content: stretch;
  align-items: stretch;
  padding-bottom: 20px;
`;

const FileTree: React.FC<Props> = ({ items: initialItems, readonly, onItemCreated, onItemChanged, onItemDeleted, onSelectedItemChanged }) => {
  const [items, setItems] = useState(initialItems.sort(sortPredicate));
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isEnabledRenameOverlay, setEnabledRenameOverlay] = useState(false);
  const [temporaryItem, setTemporaryItem] = useState<Item | null>(null);
  const renamingOverlay = useRef<HTMLInputElement>();

  useEffect(() => {
    setItems(initialItems.sort(sortPredicate));
  }, [initialItems]);

  useEffect(() => {
    if (renamingOverlay.current) renamingOverlay.current.focus();
  }, [temporaryItem]);

  const onFolderStateChanged = (id: string, state: "closed" | "opened") => {
    const newItems = items.slice();
    const index = items.findIndex((w) => w.id === id);
    (newItems[index] as any).state = state;

    setItems(newItems);
  };

  const onRenameOverlayStateChanged = (isEnabled: boolean) => {
    setEnabledRenameOverlay(isEnabled);
  };

  const onSelectedStateChanged = (item: Item | null) => {
    setSelectedItem(item);
    if (onSelectedItemChanged) onSelectedItemChanged(item);
  };

  const onClickNewFile = () => {
    setTemporaryItem({ type: "file", id: uuid(), parentId: null, title: "", content: "" } as FileItem);
    setEnabledRenameOverlay(true);
  };

  const onClickNewFolder = () => {
    setTemporaryItem({ type: "directory", id: uuid(), parentId: null, title: "", state: "closed" } as DirectoryItem);
    setEnabledRenameOverlay(true);
  };

  const onBlur = () => {
    setTemporaryItem(null);
    setEnabledRenameOverlay(false);
  };

  const onMounted = (ref: HTMLInputElement) => {
    renamingOverlay.current = ref;
  };

  const onSubmit = (value: any) => {
    if (typeof value === "string") {
      setTemporaryItem(null);
      setEnabledRenameOverlay(false);
      if (value.trim() !== "" && getIsValidPath(value.trim()) && onItemCreated) onItemCreated({ ...temporaryItem, title: value.trim() } as Item);
    }
  };

  const onIsValid = (value: string) => {
    if (getIsValidPath(value)) {
      return null;
    }

    return "Invalid pathname";
  };

  const id = `FileTree-ContextMenu`;

  return (
    <>
      <StyledContextMenu id={id} disable={isEnabledRenameOverlay || readonly}>
        <Container>
          {temporaryItem ? <Input value="" mode="Submit" onBlur={onBlur} onIsValid={onIsValid} onMounted={onMounted} onSubmit={onSubmit} /> : null}
          <Tree
            items={items}
            selectedItem={selectedItem}
            level={0}
            readonly={readonly}
            onItemChanged={onItemChanged}
            onItemCreated={onItemCreated}
            onItemDeleted={onItemDeleted}
            onFolderStateChanged={onFolderStateChanged}
            onRenameOverlayStateChanged={onRenameOverlayStateChanged}
            onSelectStateChanged={onSelectedStateChanged}
          />
        </Container>
      </StyledContextMenu>
      <ContextMenu id={id}>
        <MenuItem onClick={onClickNewFile} disabled={!onItemCreated}>
          New File
        </MenuItem>
        <MenuItem onClick={onClickNewFolder} disabled={!onItemCreated}>
          New Folder
        </MenuItem>
      </ContextMenu>
    </>
  );
};

export default FileTree;
