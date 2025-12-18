import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import { authStyles } from "@/assets/styles/auth-styles";
import { Image } from "expo-image";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";

const SignInScreen = () => {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isLoaded) return;
    setLoading(true);

    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(tabs)"); // redirect to home screen
      } else {
        Alert.alert("Error", "Failed to sign in. Please try again.");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Provide more specific error messages
      let errorMessage = "Something went wrong. Please try again.";
      
      if (error?.errors && error.errors.length > 0) {
        const clerkError = error.errors[0];
        if (clerkError?.code === "form_identifier_not_found" || clerkError?.code === "form_password_incorrect") {
          errorMessage = "Invalid email or password. Please check your credentials.";
        } else if (clerkError?.message) {
          errorMessage = clerkError.message;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Sign In Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 35}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("@/assets/images/i1.png")}
              style={authStyles.image}
            />
          </View>
          <Text style={authStyles.subtitle}>Recipe Finder</Text>
          <Text style={authStyles.title}>Welcome Back</Text>

          {/* form container */}

          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
                placeholder="Enter your email"
                value={email}
                placeholderTextColor={COLORS.textLight}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={authStyles.textInput}
              />
            </View>

            <View style={authStyles.inputContainer}>
              <TextInput
                placeholder="Enter your password"
                value={password}
                placeholderTextColor={COLORS.textLight}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={authStyles.textInput}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons name="eye" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                style={[
                  authStyles.authButton,
                  loading && authStyles.buttonDisabled,
                ]}
                onPress={handleSignIn}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={authStyles.buttonText}>
                  {loading ? "Signing in..." : "Sign In"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={authStyles.linkContainer}
                onPress={() => router.push("/(auth)/sign-up")}
              >
                <Text style={authStyles.linkText}>
                  Don't have an account?{" "}
                  <Text style={authStyles.link}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignInScreen;
