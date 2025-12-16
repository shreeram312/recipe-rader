import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import React, { useState } from "react";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { settingsStyles } from "@/assets/styles/settings-styles";
import { COLORS } from "@/constants/colors";
import SafeScreen from "@/components/safe-screen";

const Settings = () => {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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

  const getInitials = (email: string | undefined) => {
    if (!email) return "U";
    return email
      .split("@")[0]
      .split(".")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeScreen>
      <View style={settingsStyles.container}>
        <ScrollView
          style={settingsStyles.container}
          contentContainerStyle={settingsStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={settingsStyles.header}>
            <Text style={settingsStyles.headerTitle}>Settings</Text>
          </View>

          {/* Profile Section */}
          <View style={settingsStyles.profileSection}>
            <View style={settingsStyles.profileCard}>
              <View style={settingsStyles.avatarContainer}>
                {user?.imageUrl ? (
                  <Image
                    source={{
                      uri: `https://api.dicebear.com/9.x/micah/svg?seed=${user?.fullName}&baseColor=f9c9b6`,
                    }}
                    style={settingsStyles.avatarImage}
                    contentFit="cover"
                  />
                ) : (
                  <Text style={settingsStyles.avatarText}>
                    {getInitials(user?.primaryEmailAddress?.emailAddress)}
                  </Text>
                )}
              </View>
              <View style={settingsStyles.profileInfo}>
                <Text style={settingsStyles.profileName}>
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.firstName || user?.lastName || "User"}
                </Text>
                <View style={settingsStyles.emailRow}>
                  <Text style={settingsStyles.profileEmail}>
                    {user?.primaryEmailAddress?.emailAddress}
                  </Text>
                  {user?.primaryEmailAddress?.verification?.status ===
                    "verified" && (
                    <View style={settingsStyles.verifiedBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={COLORS.primary}
                      />
                      <Text style={settingsStyles.verifiedText}>Verified</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Notifications */}
          <View style={settingsStyles.section}>
            <View
              style={[
                settingsStyles.settingItem,
                settingsStyles.settingItemOnly,
              ]}
            >
              <View style={settingsStyles.settingLeft}>
                <View style={settingsStyles.settingIconContainer}>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    style={settingsStyles.settingIcon}
                  />
                </View>
                <View style={settingsStyles.settingContent}>
                  <Text style={settingsStyles.settingTitle}>Notifications</Text>
                </View>
              </View>
              <View style={settingsStyles.settingRight}>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: COLORS.border, true: COLORS.primary }}
                  thumbColor={COLORS.white}
                />
              </View>
            </View>
          </View>

          {/* Sign Out Button */}
          <TouchableOpacity
            style={settingsStyles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <View style={settingsStyles.signOutButtonContent}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#FF6B6B"
                style={settingsStyles.signOutIcon}
              />
              <Text style={settingsStyles.signOutText}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

export default Settings;
