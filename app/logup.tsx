import { ThemeContext } from '@/components/ThemeContext';
import { useTheme } from "@/hook/useTheme";
import { addUser, checkEmailExists } from '@/lib/supabaseImplemented';
import { logo } from "@/styles/theme";
import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useContext, useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';
const signUpSchema = z
  .object({
    first_name: z
      .string()
      .min(1, "First name is required.")
      .trim(),

    last_name: z
      .string()
      .min(1, "Last name is required.")
      .trim(),
    email: z.string().trim().email("Please enter a valid email address!"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character.")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain a special character!"),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords don't match.",
    path: ["confirmPassword"],
  });
type SignUpForm = z.infer<typeof signUpSchema>
const LogUp = () => {
  const { isDark } = useContext(ThemeContext)!;

  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false); // shown if email confirmation is required
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    criteriaMode: "all",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });
  const theme = useTheme();
  const style = styles(theme);
  const onSubmit = async (data: SignUpForm) => {
    try {
      setAuthError(null);
      const exists = await checkEmailExists(data.email);
      if (exists) {
        setAuthError("Email already exists");
        return;
      }
      await addUser(
        data.email, data.password, data.first_name, data.last_name
      );
      setEmailSent(true);
      router.replace("/login");
    }
    catch (e) {
      setAuthError(
        e instanceof Error ? e.message : "Sign up failed. Please try again."
      );
    }
  }


  return (
    <SafeAreaView style={style.container}>
      <View />


      {/* Sign In Container */}
      <View style={style.card}>

        <Text style={style.cardTitle}>Sign Up</Text>
        {/* firstName */}
        <View style={style.inputGroup}>
          <Text style={style.inputLabel}>First Name</Text>
          <Controller
            control={control}
            name="first_name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={style.input}
                placeholder="Enter your First Name"
                placeholderTextColor={isDark ? "white" : 'black'}
                value={value}
                onChangeText={onChange}
                keyboardType="default"
                autoCapitalize="words"
                autoComplete="name"
              />
            )}
          />
          {errors.first_name &&
            (<Text style={style.error}>{errors.first_name.message}</Text>
            )}
        </View>

        {/* firstName */}
        <View style={style.inputGroup}>
          <Text style={style.inputLabel}>Last Name</Text>
          <Controller
            control={control}
            name="last_name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={style.input}
                placeholder="Enter your Last Name"
                placeholderTextColor={isDark ? "white" : 'black'}
                value={value}
                onChangeText={onChange}
                keyboardType="default"
                autoCapitalize="words"
                autoComplete="name"
              />
            )}
          />
          {errors.last_name &&
            (<Text style={style.error}>{errors.last_name.message}</Text>
            )}
        </View>

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

          <View style={{ position: 'relative', justifyContent: 'center' }}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    style.input,
                    { paddingRight: 40 }
                  ]}
                  placeholder="Enter your Password"
                  placeholderTextColor={isDark ? "white" : "black"}
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={showPassword}
                  autoComplete="new-password"
                />
              )}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: 10,
              }}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color={isDark ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>
          {errors.password &&
            (<Text style={style.error}>{errors.password.message}</Text>
            )}
        </View>

        {/* confirm Password */}
        <View style={style.inputGroup}>
          <Text style={style.inputLabel}>Confirm Password</Text>
          <View style={{ position: 'relative', justifyContent: 'center' }}>
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={[
                    style.input,
                    { paddingRight: 40 }
                  ]}
                  placeholder="Enter your Confirm Password"
                  placeholderTextColor={isDark ? "white" : "black"}
                  value={value}
                  onChangeText={onChange}
                  secureTextEntry={showConfirmPassword}
                  autoComplete="new-password"
                />
              )}
            />

            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: 10,
              }}
            >
              <Ionicons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={20}
                color={isDark ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword &&
            (<Text style={style.error}>{errors.confirmPassword.message}</Text>
            )}
          {authError && (
            <Text style={{ color: 'red', marginBottom: 10 }}>
              {authError}
            </Text>
          )}
        </View>
        {/*Sign Iup Button */}
        <TouchableOpacity style={style.signInButton} onPress={handleSubmit(onSubmit)}>
          <Text style={style.signInButtonText}>Sign in</Text>
        </TouchableOpacity>

        {/*Sign inn */}
        <TouchableOpacity
          onPress={() => router.replace("/login")}
          style={[style.createAccountButton,]}>
          <Text style={[style.createAccountText]}>I already have account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default LogUp

const styles = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center'
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

