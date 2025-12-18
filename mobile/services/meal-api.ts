const BASE_URL = process.env.EXPO_PUBLIC_API_URL as string;
console.log(BASE_URL);

export const MEAL_API = {
  searchMealsByName: async (name: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/search.php?s=en${encodeURIComponent(name)}`
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error(error, "Error searching meals by name");
      return [];
    }
  },

  getMealById: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data = await response.json();
      return data.meals || data.meal[0];
    } catch (error) {
      console.error(error, "Error getting meal by id");
      return [];
    }
  },

  getRandomMeal: async () => {
    try {
      const response = await fetch(`${BASE_URL}/random.php`);
      const data = await response.json();
      return data.meals || data.measl[0];
    } catch (error) {
      console.error(error, "Error getting random meal");
      return [];
    }
  },

  getMultipleRandomMeals: async (count: number = 6) => {
    try {
      const promises = Array(count)
        .fill(null)
        .map(() => MEAL_API.getRandomMeal());
      const results = await Promise.all(promises);
      return results.filter((meal) => meal !== null);
    } catch (error) {
      console.error(error, "Error getting multiple random meals");
      return [];
    }
  },

  getCategories: async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories.php`);
      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error(error, "Error getting categories");
      return [];
    }
  },

  filterByIngredient: async (ingredient: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error(error, "Error filtering by ingredient");
      return [];
    }
  },

  filterByCategory: async (category: string) => {
    try {
      const response = await fetch(
        `${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
      );
      const data = await response.json();
      return data.meals || [];
    } catch (error) {
      console.error(error, "Error filtering by category");
      return [];
    }
  },

  transformMealData: (meal: any) => {
    if (!meal) return null;

    // extract ingredients from the meal object
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim()) {
        const measureText =
          measure && measure.trim() ? `${measure.trim()} ` : "";
        ingredients.push(`${measureText}${ingredient.trim()}`);
      }
    }

    // extract instructions
    const instructions = meal.strInstructions
      ? meal.strInstructions
          .split(/\r?\n/)
          .filter((step: string) => step.trim())
      : [];

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: meal.strInstructions
        ? meal.strInstructions.substring(0, 120) + "..."
        : "Delicious meal from TheMealDB",
      image: meal.strMealThumb,
      cookTime: "30 minutes",
      servings: 4,
      category: meal.strCategory || "Main Course",
      area: meal.strArea,
      ingredients,
      instructions,
      originalData: meal,
    };
  },
};
