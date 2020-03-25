/* eslint-disable import/no-cycle */
import React from "react";

import { Item } from "@/types";
import Directory from "@/components/FileTree/Directory";
import File from "@/components/FileTree/File";
import { getDepth } from "@/components/FileTree/utils";

type Props = {
  items: Item[];
  level: number;
  onFolderStateChanged?: (id: string, state: "closed" | "opened") => void;
};

const Tree: React.FC<Props> = ({ items, level, onFolderStateChanged }) => {
  return (
    <>
      {items
        .filter((w) => getDepth(items, w) === level)
        .map((w) => {
          return (
            <React.Fragment key={w.id}>
              {w.type === "directory" ? <Directory items={items} item={w} onFolderStateChanged={onFolderStateChanged} /> : <File items={items} item={w} />}
            </React.Fragment>
          );
        })}
    </>
  );
};

export default Tree;
