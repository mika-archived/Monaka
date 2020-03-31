import React from "react";
import styled from "styled-components";

import { Item } from "@/types";
import FileTree from ".";
import Scroller from "../Scroller";

/**
 * + src
 * |  + components
 * |  |  + some-component.tsx
 * |  |  + more-component.tsx
 * |  + main.tsx
 * + tsconfig.json
 */
const items = [
  {
    type: "file",
    id: "a974ae0d-0016-4bc5-81ad-b077f2be533e",
    title: "some-component.tsx",
    content: "",
    parentId: "56500707-f157-4c6c-9e94-7c0baec4bc85",
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
    id: "0cf5ed9d-89b9-4162-be03-2124a7e33ebe",
    title: "tsconfig.json",
    content: "",
    parentId: null,
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
    id: "ab9455ce-0b45-47f3-bd79-c332810b9d2e",
    title: "more-component.tsx",
    content: "",
    parentId: "56500707-f157-4c6c-9e94-7c0baec4bc85",
  },
  {
    type: "directory",
    id: "df415ce9-eafa-4841-bf76-6329a2f576ce",
    title: "src",
    parentId: null,
    state: "closed",
  },
] as Item[];

const Container = styled.div`
  width: 200px;
`;

export default {
  title: "components/FileTree/Composite",
};

export const Default = () => (
  <Container>
    <Scroller>
      <FileTree items={items} />
    </Scroller>
  </Container>
);
