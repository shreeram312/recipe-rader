import { View, Text, Alert, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../../services/api";
import { MEAL_API } from "@/services/meal-api";
import LoadingSpinner from "../../components/loading-spinner";
import { Image } from "expo-image";

import { recipeDetailStyles } from "../../assets/styles/recipe-styles";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants/colors";

import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";

const RecipeDetailScreen = () => {
  const { id: recipeId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { user } = useUser();
  const userId = user?.id;

  // Query to fetch recipe details
  const {
    data: recipe,
    isLoading: loading,
    error: recipeError,
  } = useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: async () => {
      const mealData = await MEAL_API.getMealById(recipeId);
      if (!mealData) throw new Error("Recipe not found");

      const transformedRecipe = MEAL_API.transformMealData(mealData);
      if (!transformedRecipe) throw new Error("Failed to transform recipe");

      // Ensure image URL is valid
      if (!transformedRecipe.image) {
        console.warn("Recipe image is missing for recipe:", recipeId);
      }

      return {
        ...transformedRecipe,
        youtubeUrl: mealData.strYoutube || null,
      };
    },
    enabled: !!recipeId,
  });

  // Query to check if recipe is favorited
  const { data: favourites } = useQuery({
    queryKey: ["favourites", userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/api/favourites/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch favourites");
      const data = await response.json();
      return data;
    },
    enabled: !!userId,
  });

  // Helper function to check if recipe is favorited
  const isFavorited = () => {
    if (!favourites || !recipe) return false;
    // Use recipe.id consistently for comparison
    const currentRecipeId = String(recipe.id);
    return favourites.some(
      (fav: any) => String(fav.recipeId) === currentRecipeId
    );
  };

  const getYouTubeEmbedUrl = (url: string) => {
    // example url: https://www.youtube.com/watch?v=mTvlmY4vCug
    const videoId = url.split("v=")[1]?.split("&")[0];
    if (!videoId) return url; // Fallback to original URL if parsing fails
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // Mutation for toggling favorite
  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (!userId || !recipe) throw new Error("Missing userId or recipe");

      // Use recipe.id consistently (it's the actual recipe ID from the API)
      const currentRecipeId = String(recipe.id);

      // Check if recipe exists in favourites from query cache
      const currentFavourites = queryClient.getQueryData([
        "favourites",
        userId,
      ]) as any[];

      // Check if recipe exists - compare as strings to handle type mismatches
      const existsInFavourites =
        currentFavourites?.some(
          (fav: any) => String(fav.recipeId) === currentRecipeId
        ) || false;

      if (existsInFavourites) {
        // Delete from favourites
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/api/favourites/${userId}/${currentRecipeId}`,
          { method: "DELETE" }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to remove recipe");
        }
        return response.json();
      } else {
        // Add to favourites
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_API_URL}/api/favourites`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              recipeId: currentRecipeId,
              title: recipe.title,
              image: recipe.image,
              cookTime: recipe.cookTime as string,
              servings: recipe.servings.toString(),
            }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to save recipe");
        }
        const result = await response.json();
        // Handle both response formats (direct favourite object or wrapped in favourite property)
        return result.favourite || result;
      }
    },
    onError: (error: any) => {
      Alert.alert(
        "Error",
        error.message || "Something went wrong. Please try again."
      );
    },
    onSuccess: () => {
      // Refetch favourites after successful mutation
      queryClient.invalidateQueries({ queryKey: ["favourites", userId] });
    },
  });

  const handleToggleSave = () => {
    toggleFavoriteMutation.mutate();
  };

  if (loading) return <LoadingSpinner message="Loading recipe details..." />;

  if (recipeError || !recipe) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error loading recipe. Please try again.</Text>
      </View>
    );
  }

  return (
    <View style={recipeDetailStyles.container}>
      <ScrollView>
        {/* HEADER */}
        <View style={recipeDetailStyles.headerContainer}>
          <View style={recipeDetailStyles.imageContainer}>
            {recipe.image ? (
              <Image
                source={{ uri: recipe.image }}
                style={recipeDetailStyles.headerImage}
                contentFit="cover"
                transition={300}
                onError={(error) => {
                  console.error("Image load error:", error);
                  console.log("Image URL:", recipe.image);
                }}
              />
            ) : (
              <View
                style={[
                  recipeDetailStyles.headerImage,
                  {
                    backgroundColor: COLORS.border,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
              >
                <Ionicons
                  name="image-outline"
                  size={64}
                  color={COLORS.textLight}
                />
              </View>
            )}
          </View>

          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.9)"]}
            style={recipeDetailStyles.gradientOverlay}
          />

          <View style={recipeDetailStyles.floatingButtons}>
            <TouchableOpacity
              style={recipeDetailStyles.floatingButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                recipeDetailStyles.floatingButton,
                {
                  backgroundColor: toggleFavoriteMutation.isPending
                    ? COLORS.textLight
                    : isFavorited()
                    ? COLORS.primary
                    : COLORS.primary,
                },
              ]}
              onPress={handleToggleSave}
              disabled={toggleFavoriteMutation.isPending}
            >
              <Ionicons
                name={
                  toggleFavoriteMutation.isPending
                    ? "hourglass"
                    : isFavorited()
                    ? "checkmark-circle"
                    : "bookmark-outline"
                }
                size={24}
                color={COLORS.white}
              />
            </TouchableOpacity>
          </View>

          {/* Title Section */}
          <View style={recipeDetailStyles.titleSection}>
            <View style={recipeDetailStyles.categoryBadge}>
              <Text style={recipeDetailStyles.categoryText}>
                {recipe.category}
              </Text>
            </View>
            <Text style={recipeDetailStyles.recipeTitle}>{recipe.title}</Text>
            {recipe.area && (
              <View style={recipeDetailStyles.locationRow}>
                <Ionicons name="location" size={16} color={COLORS.white} />
                <Text style={recipeDetailStyles.locationText}>
                  {recipe.area} Cuisine
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={recipeDetailStyles.contentSection}>
          {/* QUICK STATS */}
          <View style={recipeDetailStyles.statsContainer}>
            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E53"]}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name="time" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>
                {recipe.cookTime}
              </Text>
              <Text style={recipeDetailStyles.statLabel}>Prep Time</Text>
            </View>

            <View style={recipeDetailStyles.statCard}>
              <LinearGradient
                colors={["#4ECDC4", "#44A08D"]}
                style={recipeDetailStyles.statIconContainer}
              >
                <Ionicons name="people" size={20} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.statValue}>
                {recipe.servings}
              </Text>
              <Text style={recipeDetailStyles.statLabel}>Servings</Text>
            </View>
          </View>

          {recipe.youtubeUrl && (
            <View style={recipeDetailStyles.sectionContainer}>
              <View style={recipeDetailStyles.sectionTitleRow}>
                <LinearGradient
                  colors={["#FF0000", "#CC0000"]}
                  style={recipeDetailStyles.sectionIcon}
                >
                  <Ionicons name="play" size={16} color={COLORS.white} />
                </LinearGradient>

                <Text style={recipeDetailStyles.sectionTitle}>
                  Video Tutorial
                </Text>
              </View>

              <View style={recipeDetailStyles.videoCard}>
                <WebView
                  style={recipeDetailStyles.webview}
                  source={{ uri: getYouTubeEmbedUrl(recipe.youtubeUrl) }}
                  allowsFullscreenVideo
                  mediaPlaybackRequiresUserAction={false}
                />
              </View>
            </View>
          )}

          {/* INGREDIENTS SECTION */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.primary + "80"]}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name="list" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Ingredients</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>
                  {recipe.ingredients.length}
                </Text>
              </View>
            </View>

            <View style={recipeDetailStyles.ingredientsGrid}>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={recipeDetailStyles.ingredientCard}>
                  <View style={recipeDetailStyles.ingredientNumber}>
                    <Text style={recipeDetailStyles.ingredientNumberText}>
                      {index + 1}
                    </Text>
                  </View>
                  <Text style={recipeDetailStyles.ingredientText}>
                    {ingredient}
                  </Text>
                  <View style={recipeDetailStyles.ingredientCheck}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color={COLORS.textLight}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* INSTRUCTIONS SECTION */}
          <View style={recipeDetailStyles.sectionContainer}>
            <View style={recipeDetailStyles.sectionTitleRow}>
              <LinearGradient
                colors={["#9C27B0", "#673AB7"]}
                style={recipeDetailStyles.sectionIcon}
              >
                <Ionicons name="book" size={16} color={COLORS.white} />
              </LinearGradient>
              <Text style={recipeDetailStyles.sectionTitle}>Instructions</Text>
              <View style={recipeDetailStyles.countBadge}>
                <Text style={recipeDetailStyles.countText}>
                  {recipe.instructions.length}
                </Text>
              </View>
            </View>

            <View style={recipeDetailStyles.instructionsContainer}>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={recipeDetailStyles.instructionCard}>
                  <LinearGradient
                    colors={[COLORS.primary, COLORS.primary + "CC"]}
                    style={recipeDetailStyles.stepIndicator}
                  >
                    <Text style={recipeDetailStyles.stepNumber}>
                      {index + 1}
                    </Text>
                  </LinearGradient>
                  <View style={recipeDetailStyles.instructionContent}>
                    <Text style={recipeDetailStyles.instructionText}>
                      {instruction}
                    </Text>
                    <View style={recipeDetailStyles.instructionFooter}>
                      <Text style={recipeDetailStyles.stepLabel}>
                        Step {index + 1}
                      </Text>
                      <TouchableOpacity
                        style={recipeDetailStyles.completeButton}
                      >
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={COLORS.primary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={recipeDetailStyles.primaryButton}
            onPress={handleToggleSave}
            disabled={toggleFavoriteMutation.isPending}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primary + "CC"]}
              style={recipeDetailStyles.buttonGradient}
            >
              <Ionicons
                name={isFavorited() ? "checkmark-circle" : "heart-outline"}
                size={20}
                color={COLORS.white}
              />
              <Text style={recipeDetailStyles.buttonText}>
                {isFavorited() ? "Saved to Favorites" : "Add to Favorites"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default RecipeDetailScreen;
