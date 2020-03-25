import React from "react";
import styled from "styled-components";

import { ChevronRight, DefaultFile } from "@/components/Icon";
import { IconContext } from "@/components/IconProvider";

type Props = {
  path: string;
};

const Container = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  height: 20px;
  font-size: 14px;
  color: #ccc;
`;

const Icon = styled.div`
  width: 16px;
  height: 16px;
`;

const Label = styled.span`
  padding: 2px 2px 0 2px;
  font-size: 14px;
`;

const Breadcrumbs: React.FC<Props> = ({ path }) => {
  const paths = path.split("/");

  const getIconComponent = (icons: { extension: RegExp; component: React.FC<any> }[], filename: string) => {
    const icon = icons.find((w) => w.extension.test(filename));
    const Component = icon ? icon.component : DefaultFile;

    return <Component />;
  };

  return (
    <Container>
      {paths.map((w, idx) => {
        if (idx + 1 === paths.length) {
          return (
            <IconContext.Consumer>
              {(icons) => (
                <>
                  <Icon>{getIconComponent(icons, w)}</Icon>
                  <Label>{w}</Label>
                </>
              )}
            </IconContext.Consumer>
          );
        }

        return (
          <>
            <Label>{w}</Label>
            <ChevronRight />
          </>
        );
      })}
    </Container>
  );
};

export default Breadcrumbs;
