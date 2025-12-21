import { View, Text } from "react-native";
import React, { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";

const FavouritesScreen = () => {
  const { user } = useUser();

  const {
    data: favouriteRecipes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["favourites", user?.id],
    queryFn: async () => {
      console.log(user?.id);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/api/favourites/${user?.id}`
      );
      const data = await response.json();
      return data;
    },
  });

  console.log(favouriteRecipes);

  return (
    <View>
      <Text>FavouritesScreen</Text>
    </View>
  );
};

export default FavouritesScreen;
