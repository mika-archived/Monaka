import React from "react";

export type Theme = {
  base: "light" | "dark";

  // colors
  activeBackground: string;
  inactiveBackground: string;
  editorBackground: string;
  highlightBackground: string;
  hoverBackground: string;
  background: string;

  activeFontColor: string;
  fontColor: string;
};

type Props = {
  theme: Theme;
};

const LightTheme: Theme = {
  base: "light",
  activeBackground: "",
  inactiveBackground: "",
  editorBackground: "",
  highlightBackground: "",
  hoverBackground: "",
  background: "",
  activeFontColor: "",
  fontColor: "#333",
};

const DarkTheme: Theme = {
  base: "dark",
  activeBackground: "#1e1e1e",
  editorBackground: "#202124",
  inactiveBackground: "#2d2d2d",
  highlightBackground: "#094771",
  hoverBackground: "#2a2d2e",
  background: "#252526",
  activeFontColor: "#fff",
  fontColor: "#ccc",
};

const ThemeContext = React.createContext(DarkTheme);

const ThemeProvider: React.FC<Props> = ({ children, theme }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
export { ThemeContext, LightTheme, DarkTheme };
