import React, { useCallback, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { getUserProfile } from '@/lib/supabaseImplemented'
import { useFocusEffect, useRouter } from 'expo-router'

import { logo } from '@/styles/theme'
import { useTheme } from '@react-navigation/native'
const Header = () => {
  const [profile, setProfile] = useState<any>(null);
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

  const theme = useTheme();
  const style = styles(theme);
  const router = useRouter();
  const handleProfile = () => {
    router.push("/(tabs)/setting/profile");
  }
  return (
    <View style={style.header}>
      <Text style={style.textAppName}>Knowly</Text>
      <TouchableOpacity
        onPress={handleProfile}
        activeOpacity={0.5}>

        {profile?.avatar_url ? (
          <Image
            source={{ uri: profile.avatar_url }}
            style={style.avatar}
          />
        ) : (
          <View style={style.avatar} />
        )}

      </TouchableOpacity>
    </View>
  )
}

export default Header

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
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 100,
      backgroundColor: "#fcd5b5",
      marginRight: 20,
    },
  })