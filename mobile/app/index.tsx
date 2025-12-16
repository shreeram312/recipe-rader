import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { Redirect } from "expo-router";

const Index = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return null;
  }

  return <Redirect href={"/(tabs)"} />;
};
export default Index;
