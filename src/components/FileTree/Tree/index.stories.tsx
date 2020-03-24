import React, { useState } from "react";

import { Item } from "..";
import Tree from ".";

/**
 * + src
 * |  + components
 * |  |  + some-component.tsx
 * |  |  + more-component.tsx
 * |  + main.tsx
 * + tsconfig.json
 */
const ITEMS = [
  {
    type: "directory",
    id: "df415ce9-eafa-4841-bf76-6329a2f576ce",
    title: "src",
    parentId: null,
    state: "closed",
  },
  {
    type: "directory",
    id: "56500707-f157-4c6c-9e94-7c0baec4bc85",
    title: "components",
    parentId: "df415ce9-eafa-4841-bf76-6329a2f576ce",
    state: "closed",
  },
  {
    type: "file",
    id: "a974ae0d-0016-4bc5-81ad-b077f2be533e",
    title: "some-component.tsx",
    content: "",
    parentId: "56500707-f157-4c6c-9e94-7c0baec4bc85",
  },
  {
    type: "file",
    id: "ab9455ce-0b45-47f3-bd79-c332810b9d2e",
    title: "more-component.tsx",
    content: "",
    parentId: "56500707-f157-4c6c-9e94-7c0baec4bc85",
  },
  {
    type: "file",
    id: "5148c791-57af-4cb3-9861-5e763ff5a36b",
    title: "main.tsx",
    content: "",
    parentId: "df415ce9-eafa-4841-bf76-6329a2f576ce",
  },
  {
    type: "file",
    id: "0cf5ed9d-89b9-4162-be03-2124a7e33ebe",
    title: "tsconfig.json",
    content: "",
    parentId: null,
  },
] as Item[];

export default {
  title: "components/FileTree/Tree",
};

export const Default = () => {
  const [items, setItems] = useState(ITEMS);

  const onFolderStateChanged = (id: string, state: "closed" | "opened") => {
    const newItems = items.slice();
    const index = items.findIndex((w) => w.id === id);
    (newItems[index] as any).state = state;

    setItems(newItems);
  };

  return <Tree items={items} level={0} onFolderStateChanged={onFolderStateChanged} />;
};
