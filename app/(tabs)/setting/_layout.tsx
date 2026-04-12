import { useTheme } from '@/hook/useTheme';
import { logo } from '@/styles/theme';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
const SettingLayout = () => {
  const theme = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "settings",
          headerShown: false
        }} />
      <Stack.Screen
        name="profile"
        options={({
          title: "Profile Detail",
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitleAlign: 'left',
          headerTintColor: logo.text,
        })}
      />
      <Stack.Screen
        name="editProfile"
        options={({
          title: "Edit Profile",
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitleAlign: 'left',
          headerTintColor: logo.text,
        })}
      />

    </Stack>
  )
}

export default SettingLayout;

const styles = StyleSheet.create({})