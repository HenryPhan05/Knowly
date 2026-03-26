import { createContext, useState, useEffect } from 'react';
export const AuthContext = createContext<any>(null);
export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const login = (userData: any) => {
    setUser(userData);
  }
  const logout = () => {
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}