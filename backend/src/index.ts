import { ENV } from "@/lib/env";
import express from "express";
import db from "./lib/db";
import { favouritesTables } from "./db/schema";
import { and, eq } from "drizzle-orm";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({
    message: "Server is running",
    time: new Date().toISOString(),
    status: "ok",
  });
});

app.post("/api/favourites", async (req, res) => {
  try {
    const { userId, recipeId, title, image, cookTime, servings } = req.body;

    if (!userId || !recipeId || !title) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const favourite = await db
      .insert(favouritesTables)
      .values({
        userId,
        recipeId,
        title,
        image,
        cookTime,
        servings,
      })
      .returning();

    res.status(201).json(favourite[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/favourites/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userFavourites = await db
      .select()
      .from(favouritesTables)
      .where(eq(favouritesTables.userId, userId));
    res.status(200).json(userFavourites);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/favourites/:userId/:recipeId", async (req, res) => {
  try {
    const { userId, recipeId } = req.params;
    await db
      .delete(favouritesTables)
      .where(
        and(
          eq(favouritesTables.userId, userId),
          eq(favouritesTables.recipeId, recipeId)
        )
      );

    res.status(200).json({ message: "Favourite deleted Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
