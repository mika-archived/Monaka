import React from "react";
import styled from "styled-components";

import Editor from ".";

const value = `
const sayHello = (str: string): void => {
  console.log(\`Hello, \${str}\`);
};

sayHello("TypeScript");
`.trim();

const FullHeightEditor = styled(Editor)`
  height: 500px;
`;

export default {
  title: "components/Editor",
  component: Editor,
};

export const MonacoEditor = () => <FullHeightEditor language="typescript" value={value} />;

export const ReadonlyMonacoEditor = () => <FullHeightEditor language="typescript" options={{ readOnly: true }} value={value} />;
