import {
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
  useAuth,
} from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import SafeScreen from "@/components/safe-screen";
import * as SplashScreen from "expo-splash-screen";
import * as SecureStore from "expo-secure-store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (err) {
      // Token save failed, but continue anyway
      console.error("Failed to save token:", err);
    }
  },
  async deleteToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (err) {
      // Token delete failed, but continue anyway
      console.error("Failed to delete token:", err);
    }
  },
};

export default function RootLayout() {
  const clerkPublishableKey = process.env
    .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

  if (!clerkPublishableKey) {
    throw new Error("Missing Clerk publishable key");
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={clerkPublishableKey}>
      <SafeScreen>
        <QueryClientProvider client={queryClient}>
          <Slot />
        </QueryClientProvider>
      </SafeScreen>
    </ClerkProvider>
  );
}
