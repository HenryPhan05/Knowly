// Week 9: Local Storage — NEW file
import AsyncStorage from "@react-native-async-storage/async-storage";

// Typed key names to prevent typos
export const STORAGE_KEYS = {
  PROFILE: "profile",
  NOTIFICATIONS: "notifications",
  THEME: 'isDark',
  PROFILE_PHOTO: "profile_photo", // Week 11: stores the URI of the profile photo
} as const;

// Get a value from storage (automatically parses JSON)
export async function get<T>(key: string): Promise<T | null> {
  const value = await AsyncStorage.getItem(key);
  if (value === null) return null;
  return JSON.parse(value) as T;
}

// Set a value in storage (automatically stringifies to JSON)
export async function set(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

// Remove a value from storage
export async function remove(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}