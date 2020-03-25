import React from "react";

import { DirectoryItem } from "@/types";
import Directory from ".";

export default {
  title: "components/FileTree/Directory",
};

const item = {
  type: "directory",
  id: "5148c791-57af-4cb3-9861-5e763ff5a36b",
  title: "src",
  parentId: null,
  state: "closed",
} as DirectoryItem;

export const Default = () => <Directory items={[item]} item={item} />;

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

export const WithOneDepth = () => <Directory items={items} item={items[1] as DirectoryItem} />;
