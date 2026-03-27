import React, { createContext, useState, ReactNode } from 'react';
type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void
}
type ProviderProps = {
  children: ReactNode;
}
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: ProviderProps) => {
  const [isDark, setDark] = useState<boolean>(false);
  const toggleTheme = () => setDark(prev => !prev);
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
