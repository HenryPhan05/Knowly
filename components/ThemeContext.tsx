import * as storage from "@/lib/storage";
import { STORAGE_KEYS } from '@/lib/storage';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
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
  useEffect(() => {
    const loadTheme = async () => {
      const saved = await storage.get<boolean>(STORAGE_KEYS.THEME);
      if (saved !== null) {
        if (saved !== isDark) {
          toggleTheme();
        }
      }
    }
    loadTheme();
  }, [isDark])
  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
