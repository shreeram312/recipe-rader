import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";
import { homeStyles } from "@/assets/styles/home-styles";

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: any[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}) {
  return (
    <View style={homeStyles.categoryFilterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={homeStyles.categoryFilterScrollContent}
      >
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                homeStyles.categoryButton,
                isSelected && homeStyles.selectedCategory,
              ]}
              onPress={() => onSelectCategory(category.name)}
              activeOpacity={0.7}
            >
              <Image
                key={`${category.id}-${isSelected}`}
                source={{ uri: category.image }}
                style={[
                  homeStyles.categoryImage,
                  isSelected && homeStyles.selectedCategoryImage,
                ]}
                contentFit="cover"
                transition={300}
                cachePolicy="memory-disk"
              />
              <Text
                style={[
                  homeStyles.categoryText,
                  isSelected && homeStyles.selectedCategoryText,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
