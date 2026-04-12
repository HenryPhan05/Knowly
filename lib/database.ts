import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // presist sessions in AsyncSTorage
    autoRefreshToken: true, // automatically refresh  JWT before it exists
    persistSession: true, // save session to storage automaticaly
    detectSessionInUrl: false, //no URL parsing in React Native
  }
})