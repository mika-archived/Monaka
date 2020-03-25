import React from "react";
import styled from "styled-components";

import MonacoEditor from ".";

const value = `
const sayHello = (str: string): void => {
  console.log(\`Hello, \${str}\`);
};

sayHello("TypeScript");
`.trim();

const FullHeightEditor = styled(MonacoEditor)`
  height: 500px;
`;

export default {
  title: "components/MonacoEditor",
};

export const DefaultEditor = () => <FullHeightEditor language="typescript" value={value} />;

export const Readonly = () => <FullHeightEditor language="typescript" options={{ readOnly: true }} value={value} />;
