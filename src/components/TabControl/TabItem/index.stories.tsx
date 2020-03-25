import React from "react";

import { TabContent } from "@/types";
import TabItem from ".";

const content = {
  item: {
    type: "file",
    id: "5148c791-57af-4cb3-9861-5e763ff5a36b",
    title: "main.ts",
    content: "",
    parentId: null,
  },
} as TabContent;

export default {
  title: "components/TabControl/TabItem",
};

export const ActivatedTab = () => <TabItem item={content} isActivated />;

export const InactivatedTab = () => <TabItem item={content} isActivated={false} />;
