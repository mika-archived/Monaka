import React from "react";
import styled from "styled-components";

import { ThemeContext, Theme } from "@/components/ThemeProvider";

type Props = {
  title: string;
};

type ThemedProps = {
  theme: Theme;
};

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  height: 100%;
`;

const Header = styled.div<ThemedProps>`
  padding: 8px 22px;
  font-size: 14px;
  color: ${(props) => props.theme.fontColor};
`;

const Project: React.FC<Props> = ({ children, title }) => {
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Container>
          <Header theme={theme}>{title}</Header>
          {children}
        </Container>
      )}
    </ThemeContext.Consumer>
  );
};

export default Project;
