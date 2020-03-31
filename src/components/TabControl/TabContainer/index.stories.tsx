import React, { useState } from "react";

import { FileItem } from "@/types";
import TabContainer from ".";

export default {
  title: "components/TabControl/TabContainer",
};

const initialItems = [
  {
    type: "file",
    id: "5148c791-57af-4cb3-9861-5e763ff5a36b",
    title: "main.ts",
    content: "",
    parentId: null,
  } as FileItem,
  {
    type: "file",
    id: "0cf5ed9d-89b9-4162-be03-2124a7e33ebe",
    title: "tsconfig.json",
    content: "",
    parentId: null,
  } as FileItem,
  {
    type: "file",
    id: "a974ae0d-0016-4bc5-81ad-b077f2be533e",
    title: "some-component.tsx",
    content: "",
    parentId: "56500707-f157-4c6c-9e94-7c0baec4bc85",
  } as FileItem,
  {
    type: "file",
    id: "ab9455ce-0b45-47f3-bd79-c332810b9d2e",
    title: "more-component.tsx",
    content: "",
    parentId: "56500707-f157-4c6c-9e94-7c0baec4bc85",
  } as FileItem,
];

export const TabContainerWithItems = () => {
  const [items, setItems] = useState(initialItems);

  const onCloseThisClicked = (item: FileItem) => {
    setItems(items.filter((w) => w.id !== item.id));
  };

  return <TabContainer items={items} onCloseThisClicked={onCloseThisClicked} />;
};
