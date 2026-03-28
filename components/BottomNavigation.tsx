import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import { AntDesign } from "@expo/vector-icons";
import { useTheme } from "@/hook/useTheme";
import { ThemeContext } from "./ThemeContext";
const BottomNavigation = () => {
  const { isDark } = useContext(ThemeContext)!;
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          height: 111,
          borderTopLeftRadius: 30,
          borderTopEndRadius: 30,
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 20,
          paddingBottom: 20,
          backgroundColor: theme.colors.background,
        },

        tabBarActiveTintColor: "#4647D3",
        tabBarInactiveTintColor: isDark ? "#ECF1FF" : "#515C70",
        tabBarActiveBackgroundColor: "#B0C4FF",
        tabBarItemStyle: {
          width: 74,
          height: 57,
          borderRadius: 10,
          overflow: "hidden",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          fontFamily: "Inter",
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "HOME",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={30} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="task/index"
        options={{
          title: "TASKS",
          tabBarIcon: ({ color }) => (
            <AntDesign name="carry-out" size={25} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting/index"
        options={{
          title: "SETTINGS",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={25} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

export default BottomNavigation

const styles = StyleSheet.create({})