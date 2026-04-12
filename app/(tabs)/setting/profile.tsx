import { useTheme } from '@/hook/useTheme'
import { logo } from '@/styles/theme'
import { FontAwesome } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'



import { getUserProfile } from '@/lib/supabaseImplemented'
import { User } from '@/lib/type'

import { SafeAreaView } from 'react-native-safe-area-context'
const Profile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getUserProfile();
      setProfile(data);
    }
    catch (error) {
      throw (error);
    }
    finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );
  const theme = useTheme();
  const style = styles(theme);
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: theme.colors.background, alignItems: 'center', gap: 10, }}>
      {isLoading ? (
        <View style={style.Image} />
      ) : profile?.avatar_url ? (
        <Image
          source={{ uri: profile.avatar_url }}
          style={{ width: 120, height: 120, borderRadius: 100 }}
        />
      ) : (
        <View style={style.Image} />
      )}
      {/**firstName */}
      <View style={style.card}>
        <Text style={style.title}>FIRST NAME</Text>
        <Text style={style.input}>{profile ? `${profile.first_name}` : 'none'}</Text>
      </View>

      {/**lastName */}
      <View style={style.card}>
        <Text style={style.title}>LAST NAME</Text>
        <Text style={style.input}>{profile ? `${profile.last_name}` : 'none'}</Text>
      </View>
      {/**email */}
      <View style={style.card}>
        <Text style={style.title}>EMAIL</Text>
        <Text style={style.input}>{profile ? `${profile.email}` : 'none'}</Text>
      </View>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/setting/editProfile")}
        activeOpacity={0.7}>
        <View style={style.editButton}>
          <FontAwesome name='edit' size={20} color={"#FFF"} />
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#FFF' }}>Edit Profile</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Profile

const styles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    Image: {
      width: 120,
      height: 120,
      borderRadius: 100,
      backgroundColor: '#ccc',
      marginBottom: 10,
    },
    card: {
      width: 385,
      height: 87,
      backgroundColor: theme.colors.card,
      flexDirection: 'column',
      padding: 20,
      borderRadius: 12,
      gap: 10,
    },
    title: {
      fontSize: 12,
      color: theme.colors.text,
    },
    input: {
      fontSize: 20,
      color: theme.colors.text,
      fontWeight: 'bold',
    },
    editButton: {
      marginTop: 30,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
      width: 342,
      height: 56,
      borderRadius: 100,
      backgroundColor: logo.text,
    },
  });