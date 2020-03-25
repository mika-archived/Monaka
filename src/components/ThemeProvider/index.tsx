import React from "react";

export type Theme = {
  base: "light" | "dark";

  // colors
  activeBackground: string;
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
  background: "",
  activeFontColor: "",
  fontColor: "#333",
};

const DarkTheme: Theme = {
  base: "dark",
  activeBackground: "#1e1e1e",
  background: "rgb(37, 37, 38)",
  activeFontColor: "#fff",
  fontColor: "#ccc",
};

const ThemeContext = React.createContext(DarkTheme);

const ThemeProvider: React.FC<Props> = ({ children, theme }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
export { ThemeContext, LightTheme, DarkTheme };
