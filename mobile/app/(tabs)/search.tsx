import { View, Text, TextInput, FlatList } from "react-native";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "@/hooks/use-debounce";
import { MEAL_API } from "@/services/meal-api";
import { searchStyles } from "@/assets/styles/search-styles";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "@/components/recipe-card";
const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: ["search-recipes", debouncedSearchQuery],
    // queryFn: async () => {
    //   const res = await MEAL_API.get(
    //     `/recipes/complexSearch?query=${debouncedSearchQuery}`
    //   );
    // },
  });

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

          <View style={searchStyles.resultsSection}>
            <View style={searchStyles.resultsHeader}>
              <Text style={searchStyles.resultsTitle}>
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : "Search for a recipe"}
              </Text>
              <Text style={searchStyles.resultsCount}>
                {recipes.length} results
              </Text>
            </View>
          </View>

          {isLoading ? (
            <View style={searchStyles.loadingContainer}>
              <Text>Loading...</Text>
            </View>
          ) : (
            <FlatList
              data={recipes}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default SearchScreen;
