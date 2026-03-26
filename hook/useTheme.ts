import { useContext } from "react";
import { ThemeContext } from "@/components/ThemeContext";
import { lightTheme, darkTheme } from "@/styles/theme";
export const useTheme = () => {
  const { isDark } = useContext(ThemeContext)!;
  return isDark ? darkTheme : lightTheme;
}