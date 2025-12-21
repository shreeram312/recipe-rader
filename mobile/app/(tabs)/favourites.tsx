import { View, Text, ScrollView, FlatList, RefreshControl } from "react-native";
import React, { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/loading-spinner";
import { favouriteStyles } from "@/assets/styles/favourite-styles";
import RecipeCard from "@/components/recipe-card";
import EmptyFavouritesComponent from "@/components/empty-favourites";

const FavouritesScreen = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
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
      const transformedData = data.map((recipe: any) => ({
        ...recipe,
        id: recipe.recipeId,
      }));
      return transformedData;
    },
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading your favourite recipes..." />;
  }
  if (isError) {
    return <Text>Error: {isError.toString()}</Text>;
  }
  return (
    <View style={favouriteStyles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => {
              queryClient.refetchQueries({
                queryKey: ["favourites", user?.id],
              });
            }}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={favouriteStyles.header}>
          <Text style={favouriteStyles.title}>Favourites</Text>
        </View>
        <View style={favouriteStyles.recipesSection}>
          <FlatList
            data={favouriteRecipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={favouriteStyles.row}
            contentContainerStyle={favouriteStyles.recipesGrid}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            ListEmptyComponent={<EmptyFavouritesComponent />}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default FavouritesScreen;
