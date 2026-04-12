import { AuthProvider } from "@/components/AuthContext";
import { ThemeProvider } from "@/components/ThemeContext";
import { useAuth } from "@/hook/useAuth";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

const AuthGuard = () => {
  const { session, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const isAuthPage =
      segments[0] === "login" ||
      segments[0] === "logup" ||
      segments[0] === "findAccount";

    if (!session && !isAuthPage) {
      router.replace("/login");
    } else if (session && isAuthPage) {
      router.replace("/(tabs)/home");
    }
  }, [session, isLoading, segments]);

  return null
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>

        <Slot />
        <AuthGuard />
      </ThemeProvider>
    </AuthProvider>
  );
}
