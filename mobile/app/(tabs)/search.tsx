import { View, Text, TextInput, FlatList } from "react-native";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "@/hooks/use-debounce";
import { MEAL_API } from "@/services/meal-api";
import { TransformedMealData } from "@/types/meals";
import { searchStyles } from "@/assets/styles/search-styles";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "@/components/recipe-card";
import LoadingSpinner from "@/components/loading-spinner";

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data: randomRecipes, isLoading: isLoadingRandom } = useQuery({
    queryKey: ["random-recipes"],
    queryFn: async () => {
      const meals = await MEAL_API.getMultipleRandomMeals(12);
      const transformedMeals = meals
        .map((meal: any) => MEAL_API.transformMealData(meal))
        .filter(
          (meal: TransformedMealData | null): meal is TransformedMealData =>
            meal !== null
        );
      return transformedMeals;
    },
    enabled: !debouncedSearchQuery, // Only fetch when search is empty
  });

  const { data: searchResults, isLoading: isLoadingSearch } = useQuery({
    queryKey: ["search-recipes", debouncedSearchQuery],
    queryFn: async () => {
      if (!debouncedSearchQuery.trim()) return [];
      const meals = await MEAL_API.searchMealsByName(debouncedSearchQuery);
      const transformedMeals = meals
        .map((meal: any) => MEAL_API.transformMealData(meal))
        .filter(
          (meal: TransformedMealData | null): meal is TransformedMealData =>
            meal !== null
        );
      return transformedMeals;
    },
    enabled: !!debouncedSearchQuery.trim(), // Only fetch when there's a search query
  });

  const displayRecipes = debouncedSearchQuery
    ? searchResults || []
    : randomRecipes || [];

  const isLoading = debouncedSearchQuery ? isLoadingSearch : isLoadingRandom;

  return (
    <View style={searchStyles.container}>
      <View style={searchStyles.searchSection}>
        <View style={searchStyles.searchContainer}>
          <Ionicons name="search" size={24} color="black" />
          <TextInput
            style={searchStyles.searchInput}
            placeholder="Search for a recipe"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={searchStyles.resultsSection}>
        <View style={searchStyles.resultsHeader}>
          <Text style={searchStyles.resultsTitle}>
            {debouncedSearchQuery
              ? `Results for "${debouncedSearchQuery}"`
              : "Popular Recipes"}
          </Text>
          <Text style={searchStyles.resultsCount}>
            {displayRecipes.length} results
          </Text>
        </View>

        {isLoading ? (
          <LoadingSpinner message="Loading recipes..." />
        ) : (
          <FlatList
            data={displayRecipes}
            renderItem={({ item }) => <RecipeCard recipe={item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={searchStyles.row}
            contentContainerStyle={searchStyles.recipesGrid}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={<ListEmptyComponent />}
          />
        )}
      </View>
    </View>
  );
};

const ListEmptyComponent = () => {
  return (
    <View style={searchStyles.emptyState}>
      <Ionicons name="search-outline" size={64} color="#999" />
      <Text style={searchStyles.emptyTitle}>No recipes found</Text>
      <Text style={searchStyles.emptyDescription}>
        Try searching with different keywords
      </Text>
    </View>
  );
};

export default SearchScreen;
