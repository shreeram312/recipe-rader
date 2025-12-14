import { View, Text, TouchableOpacity, Alert } from "react-native";
import React from "react";
import { useClerk } from "@clerk/clerk-expo";

const Settings = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => await signOut(),
      },
    ]);
  };
  return (
    <View>
      <Text>Settings</Text>
      <TouchableOpacity onPress={handleSignOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
