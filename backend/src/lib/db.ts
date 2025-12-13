import * as schema from "@/db/schema";
import { ENV } from "@/lib/env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(ENV.DATABASE_URL);
export const db = drizzle(sql, { schema });

export default db;
