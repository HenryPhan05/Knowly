import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { logo } from '@/styles/theme'
import { useTheme } from '@react-navigation/native'
const HeaderNonImage = () => {
  const theme = useTheme();
  const style = styles(theme);
  return (
    <View style={style.header}>
      <Text style={style.textAppName}>Knowly</Text>
      <TouchableOpacity activeOpacity={0.5}>

      </TouchableOpacity>
    </View>
  )
}

export default HeaderNonImage

const styles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,

    },
    textAppName: {
      fontSize: 30,
      fontWeight: '900',
      color: logo.text,
    },
    profileImage: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ccc',
      borderRadius: 20,
    },
  })