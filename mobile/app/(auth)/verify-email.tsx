import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { authStyles } from "@/assets/styles/auth-styles";
import { COLORS } from "@/constants/colors";
import { useSignUp } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { TextInput } from "react-native";
import { useRouter } from "expo-router";

const VerifyEmail = ({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) => {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();
  const [code, setCode] = useState<"" | string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleVerifiction = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.push("/(tabs)");
      } else {
        console.log(JSON.stringify(signUpAttempt, null, 2));
        Alert.alert("Error", "Invalid code");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to verify code");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={authStyles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 35}
      >
        <ScrollView
          contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={authStyles.imageContainer}>
            <Image
              source={require("@/assets/images/i3.png")}
              style={authStyles.image}
            />
          </View>

          <Text style={authStyles.title}>Verify Email</Text>
          <Text style={authStyles.subtitle}>
            We have sent a verification code to your email.
          </Text>
          <View style={authStyles.formContainer}>
            <View style={authStyles.inputContainer}>
              <TextInput
                placeholder="Enter verification code"
                placeholderTextColor={COLORS.textLight}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                autoCapitalize="none"
                style={authStyles.textInput}
              />
            </View>

            <TouchableOpacity
              style={authStyles.authButton}
              onPress={handleVerifiction}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={authStyles.buttonText}>
                {loading ? "Verifying..." : "Verify"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={authStyles.linkContainer} onPress={onBack}>
              <Text style={authStyles.linkText}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default VerifyEmail;
