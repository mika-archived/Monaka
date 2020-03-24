/* eslint-disable import/no-cycle */
import React, { useState } from "react";

import Tree from "./Tree";
import { sortPredicate } from "./utils";

export type FileItem = {
  type: "file";
  id: string;
  title: string;
  content: string;
  parentId: string | null;
};

export type DirectoryItem = {
  type: "directory";
  id: string;
  title: string;
  parentId: string | null;
  state: "closed" | "opened";
};

export type Item = FileItem | DirectoryItem;

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
