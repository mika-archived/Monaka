import React from "react";

import { DirectoryItem, FileItem } from "@/types";
import File from ".";

export default {
  title: "components/FileTree/File",
};

const item = {
  type: "file",
  id: "5148c791-57af-4cb3-9861-5e763ff5a36b",
  title: "main.ts",
  content: "",
  parentId: null,
} as FileItem;

export const Default = () => <File items={[item]} item={item} />;

const items = [
  {
    type: "directory",
    id: "df415ce9-eafa-4841-bf76-6329a2f576ce",
    title: "main.ts",
    parentId: null,
    state: "closed",
  } as DirectoryItem,
  { ...item, parentId: "df415ce9-eafa-4841-bf76-6329a2f576ce" },
];

export const WithOneDepth = () => <File items={items} item={items[1] as FileItem} />;
