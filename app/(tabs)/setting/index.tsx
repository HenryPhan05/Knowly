import HeaderNonImage from "@/components/HeaderNonImage";
import { ThemeContext } from "@/components/ThemeContext";
import { useAuth } from '@/hook/useAuth';
import { useTheme } from "@/hook/useTheme";
import * as storage from "@/lib/storage";
import { STORAGE_KEYS } from '@/lib/storage';
import { getUserProfile } from "@/lib/supabaseImplemented";
import { logo } from "@/styles/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from "react-native";


import { SafeAreaView } from "react-native-safe-area-context";
export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);

  const [profile, setProfile] = useState<any>(null);
  const { toggleTheme, isDark } = useContext(ThemeContext)!;
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();
  const style = styles(theme);
  const router = useRouter();
  const { signOut } = useAuth();

  const loadProfile = async () => {
    const data = await getUserProfile();
    console.log("PROFILE:", data);
    setProfile(data);
  };
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );
  useEffect(() => {
    const loadNotifications = async () => {
      const saved = await storage.get<boolean>(STORAGE_KEYS.NOTIFICATIONS);
      if (saved !== null) {
        setNotifications(saved);
      }

    }
    const loadTheme = async () => {
      const saved = await storage.get<boolean>(STORAGE_KEYS.THEME);
      if (saved !== null) {
        if (saved !== isDark) {
          toggleTheme();
        }
      }
    }
    loadProfile();
    setIsLoading(false);
    loadNotifications();
    loadTheme();
  }, []);
  const handleToggleNotification = async (value: boolean) => {
    setNotifications(value);
    await storage.set(STORAGE_KEYS.NOTIFICATIONS, value);
  }
  const handleToggleTheme = async () => {
    toggleTheme();
    await storage.set(STORAGE_KEYS.THEME, !isDark);
  }
  const handleSignOut = async () => {
    await signOut();
  }
  if (isLoading) {
    return (
      <View style={style.loading}>
        <ActivityIndicator size="large" color={theme.colors.text} />
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={style.container}>
        {/* Title */}
        <View>
          <HeaderNonImage />
        </View>

        {/* Profile */}
        <View style={style.profileCard}>
          {profile?.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              style={style.avatar}
            />
          ) : (
            <View style={style.avatar} />
          )}
          <Text style={style.name}>
            {profile
              ? `${profile.first_name} ${profile.last_name}`
              : "No Name"}
          </Text>
        </View>

        {/* APP SETTINGS */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>APP SETTINGS</Text>

          <View style={style.settingItem}>
            <View style={style.left}>
              <Ionicons name="notifications-outline" size={20} />
              <Text style={style.label}>Notifications</Text>
            </View>
            <Switch
              trackColor={{ false: "#fff", true: logo.text }}
              value={notifications} onValueChange={handleToggleNotification} />
          </View>

          <View style={style.settingItem}>
            <View style={style.left}>
              <Feather name="moon" size={20} />
              <Text style={style.label}>Dark mode</Text>
            </View>
            <Switch
              trackColor={{ false: "#fff", true: logo.text }}
              value={isDark} onValueChange={handleToggleTheme} />
          </View>
        </View>

        {/* ACCOUNT */}
        <View style={style.section}>
          <Text style={style.sectionTitle}>ACCOUNT</Text>

          <TouchableOpacity
            onPress={() => router.push("/(tabs)/setting/profile")}
            style={style.settingItem}>
            <View style={style.left}>
              <Feather name="user" size={20} />
              <Text style={style.label}>Profile</Text>
            </View>
            <Feather name="chevron-right" size={20} />
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={style.logoutBtn}
          onPress={handleSignOut}
        >
          <Feather name="log-out" size={20} color="#fff" />
          <Text style={style.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    loading: {
      flex: 1,
      padding: 10,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      padding: 10,
    },

    title: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 20,
    },

    profileCard: {
      flexDirection: "row",
      alignItems: "center",

      backgroundColor: theme.colors.card,
      padding: 25,
      paddingTop: 40,
      paddingBottom: 40,
      borderRadius: 20,
      marginBottom: 20,
    },

    avatar: {
      width: 70,
      height: 70,
      borderRadius: 100,
      backgroundColor: "#fcd5b5",
      marginRight: 20,
    },

    name: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.colors.text,
    },

    section: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 15,
      padding: 15,
      marginBottom: 20,
    },

    sectionTitle: {
      fontSize: 12,
      color: theme.colors.progressText,

      marginBottom: 10,
    },

    settingItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.colors.card,
      padding: 15,
      borderRadius: 12,
      marginBottom: 10,

    },

    left: {
      flexDirection: "row",
      alignItems: "center",
    },

    label: {
      marginLeft: 10,
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: 'bold',
    },

    logoutBtn: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "red",
      padding: 15,
      borderRadius: 15,
      marginTop: 10,
      gap: 10,
    },

    logoutText: {
      color: "#fff",
      fontWeight: "600",
    },
  });