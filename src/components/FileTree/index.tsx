/* eslint-disable import/no-cycle */
import React, { useState } from "react";
import styled from "styled-components";

import Tree from "@/components/FileTree/Tree";
import { sortPredicate } from "@/components/FileTree/utils";
import { Item } from "@/types";

type Props = {
  items: Item[];
  onSelectedItemChanged?: (item: Item | null) => void;
};

const Container = styled.div`
  padding-bottom: 20px;
`;

const FileTree: React.FC<Props> = ({ items: initialItems, onSelectedItemChanged }) => {
  const [items, setItems] = useState(initialItems.sort(sortPredicate));
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const onFolderStateChanged = (id: string, state: "closed" | "opened") => {
    const newItems = items.slice();
    const index = items.findIndex((w) => w.id === id);
    (newItems[index] as any).state = state;

    setItems(newItems);
  };

  const onSelectedStateChanged = (item: Item | null) => {
    setSelectedItem(item);
    if (onSelectedItemChanged) onSelectedItemChanged(item);
  };

  return (
    <Container>
      <Tree items={items} selectedItem={selectedItem} level={0} onFolderStateChanged={onFolderStateChanged} onSelectStateChanged={onSelectedStateChanged} />
    </Container>
  );
};

export default FileTree;
