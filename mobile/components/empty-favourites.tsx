import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { favouriteStyles } from "@/assets/styles/favourite-styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { useRouter } from "expo-router";

const EmptyFavouritesComponent = () => {
  const router = useRouter();
  return (
    <View style={favouriteStyles.emptyState}>
      <View style={favouriteStyles.emptyIconContainer}>
        <Ionicons name="heart-outline" size={80} color={COLORS.textLight} />
      </View>
      <Text style={favouriteStyles.emptyTitle}>No favorites yet</Text>
      <TouchableOpacity
        style={favouriteStyles.exploreButton}
        onPress={() => router.push("/")}
      >
        <Ionicons name="search" size={18} color={COLORS.white} />
        <Text style={favouriteStyles.exploreButtonText}>Explore Recipes</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyFavouritesComponent;
