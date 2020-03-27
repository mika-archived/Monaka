/* eslint-disable import/no-cycle */
import React, { useState } from "react";
import styled from "styled-components";

import Tree from "@/components/FileTree/Tree";
import { getDepth, getIsSelected } from "@/components/FileTree/utils";
import { ChevronDown, ChevronRight, FolderClosed, FolderOpened } from "@/components/Icon";
import { IconContext } from "@/components/IconProvider";
import { ThemeContext, Theme } from "@/components/ThemeProvider";
import { FileIcon, DirectoryItem, Item } from "@/types";

type ContainerProps = {
  depth: number;
  theme: Theme;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 20px;
  padding: 2px 0 2px ${(props) => 2 + props.depth * 16}px;
  font-size: 14px;
  color: ${(props) => props.theme.fontColor};
  user-select: none;

  &.selected {
    background: ${(props) => props.theme.highlightBackground};
  }

  &:hover:not(.selected) {
    background: ${(props) => props.theme.hoverBackground};
  }
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
  selectedItem: Item | null;
  onFolderStateChanged?: (id: string, state: DirectoryItem["state"]) => void;
  onSelectStateChanged?: (item: Item | null) => void;
};

const Directory: React.FC<Props> = ({ item, items, selectedItem, onFolderStateChanged, onSelectStateChanged }) => {
  const [isOpen, setOpen] = useState(item.state === "opened");
  const toggle = (event: React.MouseEvent) => {
    event.stopPropagation();

    setOpen(!isOpen);
    if (onFolderStateChanged) onFolderStateChanged(item.id, !isOpen ? "opened" : "closed");
    if (onSelectStateChanged) onSelectStateChanged(item);
  };

  const depth = getDepth(items, item);
  const clazz = getIsSelected(item, selectedItem) ? "selected" : undefined;

  const getIconComponent = (icons: FileIcon[], dirname: string) => {
    const icon = icons.find((w) => w.directory && w.extension.test(`${dirname}_${isOpen ? "opened" : "closed"}`));

    let Component = icon?.component;
    if (Component == null) Component = isOpen ? FolderOpened : FolderClosed;

    return <Component />;
  };

  const getChevronComponent = () => {
    const Component = isOpen ? ChevronDown : ChevronRight;

    return <Component />;
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <IconContext.Consumer>
          {(icons) => (
            <>
              <Container className={clazz} depth={depth} theme={theme} onClick={toggle}>
                {getChevronComponent()}
                <Icon>{getIconComponent(icons, item.title)}</Icon>
                <Label>{item.title}</Label>
              </Container>
              {isOpen ? (
                <Tree items={items} selectedItem={selectedItem} level={depth + 1} onFolderStateChanged={onFolderStateChanged} onSelectStateChanged={onSelectStateChanged} />
              ) : null}
            </>
          )}
        </IconContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
};

export default Directory;
