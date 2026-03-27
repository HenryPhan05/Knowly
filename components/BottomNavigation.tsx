import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemeContext } from "./ThemeContext";
import { useTheme } from "@react-navigation/native";

const BottomNavigation = () => {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
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
        tabBarInactiveTintColor: "#515C70",
        tabBarActiveBackgroundColor: "#B0C4FF",
        tabBarItemStyle: {
          width: 74,
          height: 57,
          borderRadius: 10,
          overflow: "hidden",
        }
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="task"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

export default BottomNavigation

const styles = StyleSheet.create({})