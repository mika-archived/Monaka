import React from "react";

export type Theme = {
  base: "vs-light" | "vs-dark";

  // colors
  background: string;
  activeBackground: string;
  inactiveBackground: string;
  editorBackground: string;
  errorBackground: string;
  highlightBackground: string;
  hoverBackground: string;

  activeBorderColor: string;
  errorBorderColor: string;

  fontColor: string;
  activeFontColor: string;
  errorFontColor: string;
};

type Props = {
  theme: Theme;
};

const LightTheme: Theme = {
  base: "vs-light",
  background: "",
  activeBackground: "",
  inactiveBackground: "",
  editorBackground: "",
  errorBackground: "",
  highlightBackground: "",
  hoverBackground: "",
  activeBorderColor: "",
  errorBorderColor: "",
  fontColor: "#333",
  activeFontColor: "",
  errorFontColor: "",
};

const DarkTheme: Theme = {
  base: "vs-dark",
  activeBackground: "#1e1e1e",
  editorBackground: "#202124",
  errorBackground: "#94124e",
  inactiveBackground: "#2d2d2d",
  highlightBackground: "#094771",
  hoverBackground: "#2a2d2e",
  background: "#252526",
  activeBorderColor: "#094771",
  errorBorderColor: "#ff3d71",
  fontColor: "#ccc",
  activeFontColor: "#fff",
  errorFontColor: "#fff",
};

const ThemeContext = React.createContext(DarkTheme);

const ThemeProvider: React.FC<Props> = ({ children, theme }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
export { ThemeContext, LightTheme, DarkTheme };
