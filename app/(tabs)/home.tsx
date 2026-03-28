import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'
import { useContext } from 'react'
import { ThemeContext } from '@/components/ThemeContext'
export default function Home() {
  const { isDark, toggleTheme } = useContext(ThemeContext)!;

  return (
    <View>
      <Text>home</Text>
      <Button title='toggle' onPress={toggleTheme} />

    </View>
  )
}



const styles = StyleSheet.create({})