import { ThemeContext } from "@/components/ThemeContext";
import { useAuth } from '@/hook/useAuth';
import { useTheme } from "@/hook/useTheme";
import { logo } from "@/styles/theme";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useContext, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';
//defind  a zod Schema for login data
const loginSchema = z.object({
  email: z.string().email("invalid email address!"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters!"),
})
type loginForm = z.infer<typeof loginSchema>;
export default function SignInScreen() {
  const [isSubmitting, setSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn } = useAuth();

  const [showPassword, setShowPassword] = useState<boolean>(true);

  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<loginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });
  const theme = useTheme();
  const { isDark, toggleTheme } = useContext(ThemeContext)!;
  const style = styles(theme);

  const onSubmit = async (data: loginForm) => {
    try {
      setAuthError(null);
      setSubmitting(true);
      await signIn(data.email, data.password);
    }
    catch (e) {
      setAuthError(
        e instanceof Error ? e.message : "Sign in failed, please try again."
      )
    }
    finally {
      setSubmitting(false);
    }
  }
  const watchValue = watch();


  return (
    <SafeAreaView style={style.container}>
      <View />
      <Text style={style.logoText}>Knowly</Text>
      <TouchableOpacity
        onPress={toggleTheme}>

      </TouchableOpacity>
      {/* Sign In Container */}
      <View style={style.card}>
        <Text style={style.cardTitle}>Sign In</Text>

        {/* Email */}
        <View style={style.inputGroup}>
          <Text style={style.inputLabel}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={style.input}
                placeholder="Enter your Email"
                placeholderTextColor={isDark ? "white" : 'black'}
                value={value}
                onChangeText={onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            )}
          />
          {errors.email &&
            (<Text style={style.error}>{errors.email.message}</Text>

            )}
        </View>

        {/* Password */}
        <View style={style.inputGroup}>
          <Text style={style.inputLabel}>Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={style.input}
                placeholder="Enter your Password"
                placeholderTextColor={isDark ? "white" : "black"}
                value={value}
                onChangeText={onChange}
                secureTextEntry={showPassword}
                autoComplete="current-password"
              />
            )}
          />
          {errors.password &&
            (<Text style={style.error}>{errors.password.message}</Text>
            )}
          {authError && (
            <Text style={{ color: 'red', marginBottom: 10 }}>
              {authError}
            </Text>
          )}
        </View>

        {/*Sign In Button */}
        <TouchableOpacity style={style.signInButton} onPress={handleSubmit(onSubmit)}>
          <Text style={style.signInButtonText}>Sign in</Text>
        </TouchableOpacity>

        {/* Forgot Password*/}
        <TouchableOpacity style={style.forgotPasswordLink}>
          <Text style={style.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>

        {/* Create Account Button */}
        <TouchableOpacity
          onPress={() => router.replace("/logup")}
          style={style.createAccountButton}>
          <Text style={[style.createAccountText,]}>Create new account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}




const styles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },

  logoText: {
    fontSize: 56,
    fontWeight: '900',
    color: logo.text,
    marginTop: 60,
    marginBottom: 50,
  },
  // Card Container
  card: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: theme.colors.cardBackground,
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
    color: logo.text,
    marginBottom: 8,
  },
  input: {
    width: '100%',
    backgroundColor: theme.colors.cardBackground, // Slightly greyed out input area
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#718096', // Neutral border color
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: theme.colors.text,
  },
  // Buttons
  signInButton: {
    width: '100%',
    backgroundColor: logo.text, // Main brand color
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
    color: logo.text,
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
  error: {
    color: theme.colors.errorText,
    fontSize: 14,
    marginTop: 4,
    left: 0,
  }
});

