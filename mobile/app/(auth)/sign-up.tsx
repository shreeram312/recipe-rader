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
import { useSignUp } from "@clerk/clerk-expo";
import { authStyles } from "@/assets/styles/auth-styles";
import { Image } from "expo-image";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";

import VerifyEmail from "./verify-email";

const SignUpScreen = () => {
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 6 characters long");
      return;
    }
    setLoading(true);

    if (!isLoaded) return;
    try {
      const completeSignUp = await signUp.create({
        emailAddress: email,
        firstName: name.split(" ")[0],
        lastName: name.split(" ")[1],
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setPendingVerification(true);
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
      Alert.alert("Error", "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <VerifyEmail email={email} onBack={() => setPendingVerification(false)} />
    );
  }

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 35}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("@/assets/images/i2.png")}
              style={authStyles.image}
            />
          </View>

          <Text style={authStyles.title}>Create an Account</Text>
          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
                placeholder="Enter your name"
                value={name}
                placeholderTextColor={COLORS.textLight}
                onChangeText={setName}
                keyboardType="default"
                autoCapitalize="none"
                style={authStyles.textInput}
              />
            </View>
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
                autoCapitalize="none"
                style={authStyles.textInput}
              />
              <TouchableOpacity
                style={authStyles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons name="eye" size={20} color={COLORS.textLight} />
              </TouchableOpacity>
            </View>

            {/* Signup Button */}
            <View>
              <TouchableOpacity
                style={[
                  authStyles.authButton,
                  loading && authStyles.buttonDisabled,
                ]}
                onPress={handleSignUp}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={authStyles.buttonText}>
                  {loading ? "Creating account..." : "Create Account"}
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                style={authStyles.linkContainer}
                onPress={() => router.back()}
              >
                <Text style={authStyles.linkText}>
                  Already have an account?{" "}
                  <Text style={authStyles.link}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;
