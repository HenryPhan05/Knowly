import { useAuth } from "@/hook/useAuth";
import { useTheme } from "@react-navigation/native";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
export default function Index() {
  const { session, isLoading } = useAuth();
  const theme = useTheme();
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: "center", backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return <Redirect href={session ? "/(tabs)/home" : "/login"} />;

}