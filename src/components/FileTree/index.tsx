/* eslint-disable import/no-cycle */
import React, { useState } from "react";

import Tree from "@/components/FileTree/Tree";
import { sortPredicate } from "@/components/FileTree/utils";
import { Item } from "@/types";

type Props = {
  items: Item[];
  onSelectedItem?: (id: string) => void;
};

const FileTree: React.FC<Props> = ({ items: initialItems }) => {
  const [items, setItems] = useState(initialItems.sort(sortPredicate));

  const onFolderStateChanged = (id: string, state: "closed" | "opened") => {
    const newItems = items.slice();
    const index = items.findIndex((w) => w.id === id);
    (newItems[index] as any).state = state;

    setItems(newItems);
  };

  return <Tree items={items} level={0} onFolderStateChanged={onFolderStateChanged} />;
};

export default FileTree;
