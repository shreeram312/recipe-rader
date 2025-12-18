import {
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
  useAuth,
} from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import SafeScreen from "@/components/safe-screen";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const clerkPublishableKey = process.env
    .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

  if (!clerkPublishableKey) {
    throw new Error("Missing Clerk publishable key");
  }

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={clerkPublishableKey}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  );
}
