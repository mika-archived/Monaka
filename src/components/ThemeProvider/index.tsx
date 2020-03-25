import React from "react";

export type Theme = {
  base: "light" | "dark";
  fontColor: string;
};

type Props = {
  theme: Theme;
};

const LightTheme: Theme = {
  base: "light",
  fontColor: "#333",
};

const DarkTheme: Theme = {
  base: "dark",
  fontColor: "#ccc",
};

const ThemeContext = React.createContext(DarkTheme);

const ThemeProvider: React.FC<Props> = ({ children, theme }) => {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};

export default ThemeProvider;
export { ThemeContext, LightTheme, DarkTheme };
