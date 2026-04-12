import { useTheme } from '@/hook/useTheme'
import { logo } from '@/styles/theme'
import { Stack } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'
const TaskLayout = () => {
  const theme = useTheme();
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Tasks",
          headerShown: false
        }} />
      <Stack.Screen
        name="taskDetail/ViewTask"
        options={({
          title: "Task Detail",
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitleAlign: 'left',
          headerTintColor: logo.text,
        })}
      />
      <Stack.Screen
        name="taskDetail/editTask/[id]"
        options={({
          title: "Edit Task",
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitleAlign: 'left',
          headerTintColor: logo.text,
        })} />
    </Stack>
  )
}

export default TaskLayout

const styles = StyleSheet.create({})