import React from "react";

import { FileItem } from "@/types";
import TabItem from ".";

const item = {
  type: "file",
  id: "5148c791-57af-4cb3-9861-5e763ff5a36b",
  title: "main.ts",
  content: "",
  parentId: null,
} as FileItem;

export default {
  title: "components/TabControl/TabItem",
};

export const ActivatedTab = () => <TabItem item={item} isActivated isShowUnsaved={false} />;

export const InactivatedTab = () => <TabItem item={item} isActivated={false} isShowUnsaved={false} />;

export const ActivatedAndUnsavedTab = () => <TabItem item={item} isActivated isShowUnsaved />;

export const InactivatedButUnsavedTab = () => <TabItem item={item} isActivated={false} isShowUnsaved />;
