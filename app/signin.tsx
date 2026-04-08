
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Platform } from 'react-native';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSignIn = () => {
    router.replace('/home'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar} />
      <Text style={styles.logoText}>Knowly</Text>

      {/* Sign In Container */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign In</Text>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
        </View>

        {/*Sign In Button */}
        <TouchableOpacity style={styles.signInButton} onPress={handleSignIn}>
          <Text style={styles.signInButtonText}>Sign in</Text>
        </TouchableOpacity>

        {/* Forgot Password*/}
        <TouchableOpacity style={styles.forgotPasswordLink}>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Create Account Button */}
        <TouchableOpacity style={styles.createAccountButton}>
          <Text style={styles.createAccountText}>Create new account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  topBar: {
    height: Platform.OS === 'ios' ? 0 : 40, 
  },
  logoText: {
    fontSize: 56, 
    fontWeight: '900',
    color: '#4C51BF', 
    marginTop: 60,
    marginBottom: 50,
  },
  // Card Container
  card: {
    width: '90%',
    maxWidth: 400, 
    backgroundColor: '#EEF2FF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#4C51BF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    alignItems: 'center', 
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4C51BF',
    marginBottom: 24,
  },
  // Input Fields
  inputGroup: {
    width: '100%',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096', // Mid-grey/blue
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: '#EDF2F7', // Slightly greyed out input area
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#718096', // Neutral border color
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  // Buttons
  signInButton: {
    width: '100%',
    backgroundColor: '#4C51BF', // Main brand color
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  forgotPasswordLink: {
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#4C51BF',
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  createAccountButton: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4C51BF',
    paddingVertical: 12,
    alignItems: 'center',
  },
  createAccountText: {
    color: '#4C51BF',
    fontSize: 16,
    fontWeight: '600',
  },
});