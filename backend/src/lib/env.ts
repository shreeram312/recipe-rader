import "dotenv/config";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .refine(
      (port: string) => parseInt(port) > 0 && parseInt(port) < 65536,
      "Invalid port number"
    ),
  DATABASE_URL: z.string("Invalid database URL"),
});

type Env = z.infer<typeof envSchema>;

export const ENV: Env = envSchema.parse(process.env);
