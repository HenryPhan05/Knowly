import { ThemeContext } from "@/components/ThemeContext";
import { darkTheme, lightTheme } from "@/styles/theme";
import { useContext } from "react";


export const useTheme = () => {

  const { isDark, toggleTheme } = useContext(ThemeContext)!;

  return isDark ? darkTheme : lightTheme;
}