import { AuthContext } from "@/components/AuthContext";
import { useContext } from "react";
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be called inside <AuthProvider>")
  }
  return context;
}