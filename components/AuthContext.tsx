import { createContext, useState } from 'react';
export const AuthContext = createContext<any>(null);
export const AuthProvider = ({ children }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoggedUp, setIsLoggedUp] = useState(false);
  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoggedUp, setIsLoggedIn, setIsLoggedUp }}>
      {children}
    </AuthContext.Provider>
  )
}