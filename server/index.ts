// Import necessary modules
import { drizzle } from "drizzle-orm/neon-http"; // ORM for Neon serverless PostgreSQL
import { neon } from "@neondatabase/serverless"; // Neon serverless PostgreSQL connection
import { config } from "dotenv"; // To load environment variables

// Import database schema
import * as schema from "@/server/schema"; // The schema defining tables and relationships

// Load environment variables from the .env.local file
config({ path: ".env.local" }); // Ensure sensitive data like database URL is not hardcoded

// Create a Neon connection using the database URL from environment variables
const sql = neon(process.env.DATABASE_URL!); // Initialize database connection
console.log(process.env.DATABASE_URL); // Log the database URL for debugging (remove in production!)

// Configure Drizzle ORM with the Neon connection and schema
export const db = drizzle(sql, {
  schema: schema, // Associate schema with the ORM instance
  logger: true, // Enable query logging for debugging
});

/**
 * Algorithm for Setting Up Drizzle ORM with Neon
 *
 * 1. **Load Environment Variables**:
 *    - Use a package like `dotenv` to read sensitive data (e.g., database connection URL) from a `.env.local` file.
 *    - Ensure the file path is correctly specified (e.g., `.env.local`).
 *
 * 2. **Establish Database Connection**:
 *    - Import the `neon` package to connect to the Neon serverless PostgreSQL database.
 *    - Retrieve the `DATABASE_URL` from the loaded environment variables.
 *    - Use the `neon` function with the `DATABASE_URL` to establish a connection to the database.
 *
 * 3. **Set Up Drizzle ORM**:
 *    - Import the `drizzle` function from `drizzle-orm/neon-http`.
 *    - Import the database schema, which defines the structure of tables and relationships.
 *    - Pass the Neon connection (`sql`) and schema to the `drizzle` function to initialize the ORM.
 *    - Enable query logging (optional) for debugging purposes.
 *
 * 4. **Export Database Instance**:
 *    - Export the `db` instance created by `drizzle` for use in the application wherever database operations are needed.
 */
