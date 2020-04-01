/* eslint-disable import/no-cycle */
import React from "react";
import styled from "styled-components";

import { DirectoryItem, Item } from "@/types";
import Directory from "@/components/FileTree/Directory";
import File from "@/components/FileTree/File";
import { getDepth } from "@/components/FileTree/utils";

type Props = {
  items: Item[];
  selectedItem: Item | null;
  level: number;

  onFolderStateChanged?: (id: string, state: DirectoryItem["state"]) => void;
  onItemChanged?: (item: Item) => void;
  onItemCreated?: (item: Item) => void;
  onItemDeleted?: (item: Item) => void;
  onSelectStateChanged?: (item: Item | null) => void;
};

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  align-content: stretch;
  align-items: stretch;
`;

const Tree: React.FC<Props> = ({ items, selectedItem, level, onFolderStateChanged, onItemChanged, onItemCreated, onItemDeleted, onSelectStateChanged }) => {
  return (
    <>
      {items
        .filter((w) => getDepth(items, w) === level)
        .map((w) => {
          return (
            <Container key={w.id}>
              {w.type === "directory" ? (
                <Directory
                  items={items}
                  item={w}
                  selectedItem={selectedItem}
                  onFolderStateChanged={onFolderStateChanged}
                  onItemChanged={onItemChanged}
                  onItemCreated={onItemCreated}
                  onItemDeleted={onItemDeleted}
                  onSelectStateChanged={onSelectStateChanged}
                />
              ) : (
                <File items={items} item={w} selectedItem={selectedItem} onItemChanged={onItemChanged} onItemDeleted={onItemDeleted} onSelectStateChanged={onSelectStateChanged} />
              )}
            </Container>
          );
        })}
    </>
  );
};

export default Tree;
