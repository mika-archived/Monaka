import React from "react";
import styled from "styled-components";

import Project from ".";
import ProjectSection from "./ProjectSection";
import FileTree from "../FileTree";

const Container = styled.div`
  width: 250px;
  height: 250px;
`;

export default {
  title: "components/Project",
};

export const Default = () => {
  return (
    <Container>
      <Project title="Monaka Project">
        <ProjectSection title="Explorer 1">
          <FileTree items={[]} />
        </ProjectSection>
        <ProjectSection title="Explorer 2">
          <FileTree items={[]} />
        </ProjectSection>
      </Project>
    </Container>
  );
};
