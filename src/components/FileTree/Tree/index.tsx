/* eslint-disable import/no-cycle */
import React from "react";

import { Item } from "..";
import Directory from "../Directory";
import File from "../File";
import { getDepth } from "../utils";

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
