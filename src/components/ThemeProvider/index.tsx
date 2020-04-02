import React from "react";

export type Theme = {
  base: "vs-light" | "vs-dark";

  // colors
  activeBackground: string;
  inactiveBackground: string;
  editorBackground: string;
  highlightBackground: string;
  hoverBackground: string;
  background: string;

  activeBorderColor: string;

  activeFontColor: string;
  fontColor: string;
};

type Props = {
  theme: Theme;
};

const LightTheme: Theme = {
  base: "vs-light",
  activeBackground: "",
  inactiveBackground: "",
  editorBackground: "",
  highlightBackground: "",
  hoverBackground: "",
  background: "",
  activeBorderColor: "",
  activeFontColor: "",
  fontColor: "#333",
};

const DarkTheme: Theme = {
  base: "vs-dark",
  activeBackground: "#1e1e1e",
  editorBackground: "#202124",
  inactiveBackground: "#2d2d2d",
  highlightBackground: "#094771",
  hoverBackground: "#2a2d2e",
  background: "#252526",
  activeBorderColor: "#094771",
  activeFontColor: "#fff",
  fontColor: "#ccc",
};

const ThemeContext = React.createContext(DarkTheme);

const ThemeProvider: React.FC<Props> = ({ children, theme }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
export { ThemeContext, LightTheme, DarkTheme };
