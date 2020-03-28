import React from "react";
import styled from "styled-components";

import { ChevronRight, DefaultFile } from "@/components/Icon";
import { IconContext } from "@/components/IconProvider";
import Scroller from "@/components/Scroller";
import { ThemeContext } from "@/components/ThemeProvider";

type Props = {
  path: string;
};

type ContainerProps = {
  fontColor: string;
};

const Container = styled.div<ContainerProps>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-start;
  height: 20px;
  font-size: 14px;
  color: ${(props) => props.fontColor};
  white-space: nowrap;
  user-select: none;
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
    <Scroller>
      <ThemeContext.Consumer>
        {(theme) => (
          <Container fontColor={theme.fontColor}>
            {paths.map((w, idx) => {
              const key = paths.slice(0, idx).join("/");
              if (idx + 1 === paths.length) {
                return (
                  <React.Fragment key={key}>
                    <IconContext.Consumer>
                      {(icons) => (
                        <>
                          <Icon>{getIconComponent(icons, w)}</Icon>
                          <Label>{w}</Label>
                        </>
                      )}
                    </IconContext.Consumer>
                  </React.Fragment>
                );
              }

              return (
                <React.Fragment key={key}>
                  <Label>{w}</Label>
                  <ChevronRight />
                </React.Fragment>
              );
            })}
          </Container>
        )}
      </ThemeContext.Consumer>
    </Scroller>
  );
};

export default Breadcrumbs;
