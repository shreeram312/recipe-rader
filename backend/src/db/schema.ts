import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const favouritesTables = pgTable("favourites", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  recipeId: text("recipe_id").notNull(),
  title: text("title").notNull(),
  image: text("image").notNull(),
  cookTime: text("cook_time").notNull(),
  servings: text("servings").notNull(),
  isSaved: boolean("is_saved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
