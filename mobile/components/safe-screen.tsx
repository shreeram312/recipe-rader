import { View, StatusBar, Platform } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";

const SafeScreen = ({ children }: { children: React.ReactNode }) => {
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
