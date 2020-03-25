/* eslint-disable import/no-cycle */
import React from "react";
import styled from "styled-components";

import { FileItem, Item } from "@/types";
import { IconContext } from "@/components/IconProvider";
import { DefaultFile } from "@/components/Icon";
import { getDepth } from "@/components/FileTree/utils";

type ContainerProps = {
  depth: number;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  height: 20px;
  padding: 0 0 0 ${(props) => 20 + props.depth * 16}px;
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
  item: FileItem;
  items: Item[];
};

const File: React.FC<Props> = ({ item, items }) => {
  const depth = getDepth(items, item);

  const getIconComponent = (icons: { extension: RegExp; component: React.FC<any> }[], filename: string) => {
    const icon = icons.find((w) => w.extension.test(filename));
    const Component = icon ? icon.component : DefaultFile;

    return <Component />;
  };

  return (
    <IconContext.Consumer>
      {(icons) => (
        <Container depth={depth}>
          <Icon>{getIconComponent(icons, item.title)}</Icon>
          <Label>{item.title}</Label>
        </Container>
      )}
    </IconContext.Consumer>
  );
};

export default File;