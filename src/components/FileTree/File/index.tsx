/* eslint-disable import/no-cycle */
import React from "react";
import styled from "styled-components";

import { DefaultFile } from "@/components/Icon";
import { IconContext } from "@/components/IconProvider";
import { ThemeContext } from "@/components/ThemeProvider";
import { getDepth } from "@/components/FileTree/utils";
import { FileIcon, FileItem, Item } from "@/types";

type ContainerProps = {
  depth: number;
  fontColor: string;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  height: 20px;
  padding: 0 0 0 ${(props) => 20 + props.depth * 16}px;
  font-size: 14px;
  color: ${(props) => props.fontColor};
  white-space: nowrap;
  user-select: none;
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
};

const File: React.FC<Props> = ({ item, items }) => {
  const depth = getDepth(items, item);

  const getIconComponent = (icons: FileIcon[], filename: string) => {
    const icon = icons.find((w) => !w.directory && w.extension.test(filename));
    const Component = icon ? icon.component : DefaultFile;

    return <Component />;
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <IconContext.Consumer>
          {(icons) => (
            <Container depth={depth} fontColor={theme.fontColor}>
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
