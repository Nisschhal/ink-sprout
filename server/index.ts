import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

// Schema
import * as schema from "@/server/schema";

config({ path: ".env.local" }); // or .env.local

// Setup database and drizzle connection to that db:neon serverless
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, {
  schema: schema,
  logger: true,
});
