import { ClerkProvider } from "@clerk/clerk-expo";
import { Slot } from "expo-router";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import SafeScreen from "@/components/safe-screen";

export default function RootLayout() {
  const clerkPublishableKey = process.env
    .EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY as string;

  if (!clerkPublishableKey) {
    throw new Error("Missing Clerk publishable key");
  }
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={clerkPublishableKey}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  );
}
