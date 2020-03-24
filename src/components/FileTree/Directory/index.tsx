/* eslint-disable import/no-cycle */
import React, { useState } from "react";
import styled from "styled-components";

import { DirectoryItem, Item } from "..";
import { IconContext } from "../../IconProvider";
import Tree from "../Tree";
import { getDepth } from "../utils";
import { ChevronDown, ChevronRight, FolderClosed, FolderOpened } from "../../Icon";

type ContainerProps = {
  depth: number;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  height: 20px;
  padding: 0 0 0 ${(props) => 2 + props.depth * 16}px;
  font-size: 14px;
  color: #ccc;
`;

const Icon = styled.div`
  width: 16px;
  height: 16px;
`;

const Label = styled.span`
  padding: 2px 2px 0 8px;
  font-size: 14px;
`;

type Props = {
  item: DirectoryItem;
  items: Item[];
  onFolderStateChanged?: (id: string, state: DirectoryItem["state"]) => void;
};

const Directory: React.FC<Props> = ({ item, items, onFolderStateChanged }) => {
  const [isOpen, setOpen] = useState(item.state === "opened");
  const toggle = () => {
    setOpen(!isOpen);
    if (onFolderStateChanged) onFolderStateChanged(item.id, !isOpen ? "opened" : "closed");
  };

  const depth = getDepth(items, item);

  const getIconComponent = (icons: { extension: RegExp; component: React.FC<any> }[], dirname: string) => {
    const icon = icons.find((w) => w.extension.test(dirname));

    let Component = icon?.component;
    if (Component == null) Component = isOpen ? FolderOpened : FolderClosed;

    return <Component />;
  };

  const getChevronComponent = () => {
    const Component = isOpen ? ChevronDown : ChevronRight;

    return <Component />;
  };

  return (
    <IconContext.Consumer>
      {(icons) => (
        <>
          <Container depth={depth} onClick={toggle}>
            {getChevronComponent()}
            <Icon>{getIconComponent(icons, item.title)}</Icon>
            <Label>{item.title}</Label>
          </Container>
          {isOpen ? <Tree items={items} level={depth + 1} onFolderStateChanged={onFolderStateChanged} /> : null}
        </>
      )}
    </IconContext.Consumer>
  );
};

export default Directory;
