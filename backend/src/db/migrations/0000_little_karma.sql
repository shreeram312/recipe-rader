CREATE TABLE "favourites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"recipe_id" text NOT NULL,
	"title" text NOT NULL,
	"image" text NOT NULL,
	"cook_time" text NOT NULL,
	"servings" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
