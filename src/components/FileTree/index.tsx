/* eslint-disable import/no-cycle */
import React, { useEffect, useState } from "react";
import { ContextMenu, MenuItem } from "react-contextmenu";
import styled from "styled-components";

import Tree from "@/components/FileTree/Tree";
import { sortPredicate } from "@/components/FileTree/utils";
import StyledContextMenu from "@/components/StyledContextMenu";
import { Item } from "@/types";

type Props = {
  items: Item[];
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

const FileTree: React.FC<Props> = ({ items: initialItems, onItemCreated, onItemChanged, onItemDeleted, onSelectedItemChanged }) => {
  const [items, setItems] = useState(initialItems.sort(sortPredicate));
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isEnabledRenameOverlay, setEnabledRenameOverlay] = useState(false);

  useEffect(() => {
    setItems(initialItems.sort(sortPredicate));
  }, [initialItems]);

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

  const id = `FileTree-ContextMenu`;

  return (
    <>
      <StyledContextMenu id={id} disable={isEnabledRenameOverlay}>
        <Container>
          <Tree
            items={items}
            selectedItem={selectedItem}
            level={0}
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
        <MenuItem>New File</MenuItem>
        <MenuItem>New Folder</MenuItem>
      </ContextMenu>
    </>
  );
};

export default FileTree;
