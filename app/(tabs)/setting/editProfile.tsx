import { useTheme } from '@/hook/useTheme';
import { supabase } from '@/lib/database';
import { getCurrentUser, getUserProfile } from '@/lib/supabaseImplemented';
import { logo } from '@/styles/theme';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
const EditProfile = () => {
  const router = useRouter();
  const theme = useTheme();
  const style = styles(theme);
  const [isLoading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const pickImage = async () => {
    // xin quyền (an toàn hơn)
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("persmission to access images!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }

  };
  const handleSave = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { error } = await supabase
      .from("users")
      .update({
        first_name: firstName,
        last_name: lastName,
        avatar_url: avatar,
      })
      .eq("id", user.id);

    if (error) {
      console.log("Update error:", error);
      return;
    }

    router.back();
  };
  const handleCancel = () => {
    router.back();
  }
  useEffect(() => {
    const load = async () => {
      const data = await getUserProfile();
      console.log("EDIT DATA:", data);

      if (data) {
        setFirstName(data.first_name ?? '');
        setLastName(data.last_name ?? '');
        setEmail(data.email ?? '');
        setAvatar(data.avatar_url ?? null);
      }

      setLoading(false);
    };

    load();
  }, []);
  if (isLoading) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    )
  }
  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column', backgroundColor: theme.colors.background, alignItems: 'center', gap: 10, }}>

      <TouchableOpacity onPress={pickImage}>
        <View style={{ position: "relative" }}>

          {/* Avatar */}
          <View style={style.Image}>
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                style={{ width: "100%", height: "100%", borderRadius: 100 }}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  borderRadius: 100,
                  backgroundColor: "#ccc",
                }}
              />
            )}
          </View>

          {/* Icon camera */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: logo.text,
              width: 36,
              height: 36,
              borderRadius: 100,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="camera" size={18} color="#fff" />
          </View>

        </View>
      </TouchableOpacity>
      {/**firstName */}
      <View style={style.card}>
        <Text style={style.title}>FIRST NAME</Text>
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          style={style.input}
        />
      </View>

      {/**lastName */}
      <View style={style.card}>
        <Text style={style.title}>LAST NAME</Text>
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          style={style.input}
        />
      </View>
      {/**email */}
      <View style={style.card}>
        <Text style={style.title}>EMAIL</Text>
        <Text style={style.input}>{email}</Text>
      </View>

      <TouchableOpacity onPress={handleSave}>
        <View style={style.editButton}>
          <Text style={{ color: "#fff", fontWeight: 'bold' }}>Save</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleCancel}
      >
        <View style={style.cancelButton}>
          <Text style={{ color: logo.text, fontWeight: 'bold' }}>Cancel</Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default EditProfile

const styles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    Image: {
      width: 120,
      height: 120,
      borderRadius: 100,
      backgroundColor: 'red',
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
      marginTop: 20,
      width: 342,
      height: 56,
      borderRadius: 100,
      backgroundColor: logo.text,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cancelButton: {
      marginTop: 5,
      width: 342,
      height: 56,
      borderRadius: 100,
      backgroundColor: '#B0C4FF',
      justifyContent: 'center',
      alignItems: 'center',
    }
  });