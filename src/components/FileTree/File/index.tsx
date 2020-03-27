/* eslint-disable import/no-cycle */
import React from "react";
import styled from "styled-components";

import { DefaultFile } from "@/components/Icon";
import { IconContext } from "@/components/IconProvider";
import { ThemeContext, Theme } from "@/components/ThemeProvider";
import { getDepth, getIsSelected } from "@/components/FileTree/utils";
import { FileIcon, FileItem, Item } from "@/types";

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
  padding: 2px 0 2px ${(props) => 20 + props.depth * 16}px;
  font-size: 14px;
  color: ${(props) => props.theme.fontColor};
  white-space: nowrap;
  user-select: none;

  &.selected {
    background: ${(props) => props.theme.highlightBackground};
  }

  &:hover:not(.selected) {
    background: ${(props) => props.theme.hoverBackground};
  }
`;

const Icon = styled.div`
  flex: 0 0 16px;
  width: 16px;
  height: 16px;
`;

const Label = styled.span`
  flex: 0 1 auto;
  padding: 2px 4px 0 8px;
  font-size: 14px;
`;

type Props = {
  item: FileItem;
  items: Item[];
  selectedItem: Item | null;
  onSelectStateChanged?: (item: Item | null) => void;
};

const File: React.FC<Props> = ({ item, items, selectedItem, onSelectStateChanged }) => {
  const depth = getDepth(items, item);
  const clazz = getIsSelected(item, selectedItem) ? "selected" : undefined;

  const getIconComponent = (icons: FileIcon[], filename: string) => {
    const icon = icons.find((w) => !w.directory && w.extension.test(filename));
    const Component = icon ? icon.component : DefaultFile;

    return <Component />;
  };

  const onClickItem = (event: React.MouseEvent) => {
    event.stopPropagation();

    if (onSelectStateChanged) onSelectStateChanged(item);
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <IconContext.Consumer>
          {(icons) => (
            <Container className={clazz} depth={depth} theme={theme} onClick={onClickItem}>
              <Icon>{getIconComponent(icons, item.title)}</Icon>
              <Label>{item.title}</Label>
            </Container>
          )}
        </IconContext.Consumer>
      )}
    </ThemeContext.Consumer>
  );
};

export default File;
