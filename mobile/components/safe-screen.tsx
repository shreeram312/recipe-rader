import { View, StatusBar, Platform } from "react-native";
import React, { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { useAuth } from "@clerk/clerk-expo";
import { SplashScreen } from "expo-router";

const SafeScreen = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
        translucent={Platform.OS === "android"}
      />
      <View
        style={{
          paddingTop: insets.top,
          flex: 1,
          backgroundColor: COLORS.background,
        }}
      >
        {children}
      </View>
    </>
  );
};

export default SafeScreen;
