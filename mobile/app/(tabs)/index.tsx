import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MEAL_API } from "@/services/meal-api";
import { TransformedMealData } from "@/types/meals";
import { homeStyles } from "@/assets/styles/home-styles";
import { Image } from "expo-image";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import RecipeCard from "@/components/recipe-card";
import CategoryFilter from "@/components/category-filter";
import LoadingSpinner from "@/components/loading-spinner";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const IndexScreen = () => {
  const { user } = useUser();
  if (!user) return null;

  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [filteredRecipes, setFilteredRecipes] = useState<TransformedMealData[]>(
    []
  );

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["home-data"],
    queryFn: async () => {
      const [allCategories, allRecipes, featuredMeal] = await Promise.all([
        MEAL_API.getCategories(),
        MEAL_API.getMultipleRandomMeals(12),
        MEAL_API.getRandomMeal(),
      ]);

      const transformedCategories = allCategories.map(
        (category: any, index: number) => {
          return {
            id: index + 1,
            name: category.strCategory,
            image: category.strCategoryThumb,
            description: category.strCategoryDescription,
          };
        }
      );

      const transformedMeals = allRecipes
        .map((meal: any) => MEAL_API.transformMealData(meal))
        .filter(
          (meal: TransformedMealData | null): meal is TransformedMealData =>
            meal !== null
        );

      const transformedFeaturedMeal = MEAL_API.transformMealData(featuredMeal);

      return {
        categories: transformedCategories,
        recipes: transformedMeals,
        featuredRecipe: transformedFeaturedMeal,
      };
    },
  });

  // Extract data from query result
  const categories = data?.categories || [];
  const recipes = data?.recipes || [];
  const featuredRecipe = data?.featuredRecipe || null;
  const queryClient = useQueryClient();

  // Auto-select first category when data loads
  useEffect(() => {
    if (categories.length > 0 && selectedCategory === "") {
      const firstCategory = categories[0].name;
      setSelectedCategory(firstCategory);
      loadCategoryData(firstCategory);
    }
  }, [categories]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <View style={homeStyles.container}>
        <Text>Error loading data: {error.message}</Text>
      </View>
    );
  }

  const loadCategoryData = async (category: string) => {
    const categories = await MEAL_API.filterByCategory(category);
    const transformedMeals = categories
      .map((meal: any) => MEAL_API.transformMealData(meal))
      .filter(
        (meal: TransformedMealData | null): meal is TransformedMealData =>
          meal !== null
      );
    setFilteredRecipes(transformedMeals);
  };
  const handleCategorySelect = async (category: string) => {
    if (category === selectedCategory) {
      // If clicking the same category, deselect it
      setSelectedCategory("");
      setFilteredRecipes([]);
      return;
    }
    setSelectedCategory(category);
    await loadCategoryData(category);
  };

  const loadIngredientData = async (ingredient: string) => {
    const ingredients = await MEAL_API.filterByIngredient(ingredient);
    const transformedMeals = ingredients
      .map((meal: any) => MEAL_API.transformMealData(meal))
      .filter(
        (meal: TransformedMealData | null): meal is TransformedMealData =>
          meal !== null
      );
    setFilteredRecipes(transformedMeals);
  };

  const displayRecipes = filteredRecipes.length > 0 ? filteredRecipes : recipes;

  return (
    <View style={homeStyles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={async () => {
              await sleep(2000);
              queryClient.refetchQueries({ queryKey: ["home-data"] });
            }}
          />
        }
        contentContainerStyle={homeStyles.scrollContent}
      >
        <View style={homeStyles.welcomeSection}>
          <Image
            source={require("@/assets/images/food.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require("@/assets/images/sandwich.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <Image
            source={require("@/assets/images/sandwich.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
        </View>

        {featuredRecipe && featuredRecipe.image && (
          <View style={homeStyles.featuredSection}>
            <TouchableOpacity
              style={homeStyles.featuredCard}
              activeOpacity={0.8}
              onPress={() => router.push(`/`)}
            >
              <View style={homeStyles.featuredImageContainer}>
                <Image
                  source={{ uri: featuredRecipe.image }}
                  style={homeStyles.featuredImage}
                  contentFit="cover"
                  transition={500}
                  placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
                  onError={(error) => {
                    console.error("Image load error:", error);
                    console.log("Image URL:", featuredRecipe.image);
                  }}
                />
                <View style={homeStyles.featuredOverlay}>
                  <Text style={homeStyles.featuredBadgeText}>Featured</Text>
                </View>

                <View style={homeStyles.featuredContent}>
                  <Text style={homeStyles.featuredTitle} numberOfLines={2}>
                    {featuredRecipe.title}
                  </Text>

                  <View style={homeStyles.featuredMeta}>
                    <View style={homeStyles.metaItem}>
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={COLORS.white}
                      />
                      <Text style={homeStyles.metaText}>
                        {featuredRecipe.cookTime}
                      </Text>
                    </View>
                    <View style={homeStyles.metaItem}>
                      <Ionicons
                        name="people-outline"
                        size={16}
                        color={COLORS.white}
                      />
                      <Text style={homeStyles.metaText}>
                        {featuredRecipe.servings}
                      </Text>
                    </View>
                    {featuredRecipe.area && (
                      <View style={homeStyles.metaItem}>
                        <Ionicons
                          name="location-outline"
                          size={16}
                          color={COLORS.white}
                        />
                        <Text style={homeStyles.metaText}>
                          {featuredRecipe.area}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {categories.length > 0 && (
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}

        <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>
              {selectedCategory || "All Recipes"}
            </Text>
          </View>

          {displayRecipes.length > 0 ? (
            <FlatList
              data={displayRecipes}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={homeStyles.row}
              contentContainerStyle={homeStyles.recipesGrid}
              scrollEnabled={false}
              // ListEmptyComponent={}
            />
          ) : (
            <View style={homeStyles.emptyState}>
              <Ionicons
                name="restaurant-outline"
                size={64}
                color={COLORS.textLight}
              />
              <Text style={homeStyles.emptyTitle}>No recipes found</Text>
              <Text style={homeStyles.emptyDescription}>
                Try a different category
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default IndexScreen;
