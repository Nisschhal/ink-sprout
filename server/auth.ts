// Import necessary modules and dependencies
import NextAuth from "next-auth"; // Main NextAuth library
import { DrizzleAdapter } from "@auth/drizzle-adapter"; // Drizzle adapter for database connection
import { db } from "@/server"; // Custom database configuration
import Google from "next-auth/providers/google"; // Google OAuth provider
import GitHub from "next-auth/providers/github"; // GitHub OAuth provider
import Credentials from "next-auth/providers/credentials"; // Custom username/password provider
import { LoginSchema } from "@/types/login-schema"; // Schema for login validation
import { eq } from "drizzle-orm"; // SQL query builder for equality checks
import { accounts, users } from "./schema"; // Database schema for accounts and users
import bcrypt from "bcrypt"; // Library for hashing and comparing passwords
import Stripe from "stripe"; // Stripe library for payment handling

// Exporting NextAuth functions and handlers
export const { handlers, auth, signIn, signOut } = NextAuth({
  // Adapter configuration for connecting to the database
  adapter: DrizzleAdapter(db),

  // Secret key for encrypting session tokens
  secret: process.env.AUTH_SECRET,

  // Use JWT (JSON Web Token) for session management
  session: { strategy: "jwt" },

  // Events configuration for lifecycle hooks
  events: {
    // Triggered when a new user is created
    createUser: async ({ user }) => {
      // Initialize Stripe with the API secret
      const stripe = new Stripe(process.env.STRIPE_SECRET!, {
        apiVersion: "2024-11-20.acacia",
      });

      // Create a new customer in Stripe using the user's email and name
      const customer = await stripe.customers.create({
        email: user.email!, // Ensure email is provided
        name: user.name!, // Ensure name is provided
      });

      // Update the user's record in the database with the Stripe customer ID
      await db
        .update(users)
        .set({ customerId: customer.id }) // Add Stripe's customer ID
        .where(eq(users.id, user.id!)); // Match the user by ID
    },
  },

  // Callbacks for customizing session and JWT behavior
  callbacks: {
    // When a session is created, attach additional user attributes
    async session({ token, session }) {
      if (session && token.sub) {
        session.user.id = token.sub; // Attach user ID
      }
      if (session.user && token.role) {
        session.user.role = token.role as string; // Attach user role
      }
      if (session.user) {
        // Attach additional attributes
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image = token.image as string;
      }
      return session; // Return the modified session
    },

    // When a JWT is created, enrich it with user and account details
    async jwt({ token }) {
      if (!token.sub) return token; // Return early if no user ID (sub) is present

      // Fetch the user from the database
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });
      if (!existingUser) return token; // Return token if user does not exist

      // Fetch the account associated with the user
      const existingAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, existingUser.id),
      });

      // Add additional attributes to the token
      token.isOAuth = !!existingAccount; // Check if the account is OAuth
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.twoFactorEnabled;

      return token; // Return the enriched token
    },
  },

  // Authentication providers (e.g., Google, GitHub, custom login)
  providers: [
    // Google OAuth provider
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!, // Google client ID from environment
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Google client secret
      allowDangerousEmailAccountLinking: true, // Allow linking accounts with same email
    }),

    // GitHub OAuth provider
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!, // GitHub client ID
      clientSecret: process.env.GITHUB_CLIENT_SECRET!, // GitHub client secret
      allowDangerousEmailAccountLinking: true, // Same as above
    }),

    // Custom Credentials provider (username/password)
    Credentials({
      // Function triggered during user login
      authorize: async (credentials) => {
        // Validate the incoming login data using the schema
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          // Check if the user exists in the database
          const userExist = await db.query.users.findFirst({
            where: eq(users.email, validatedFields.data.email),
          });

          // If user or password does not exist, reject login
          if (!userExist || !userExist.password) return null;

          // Compare the provided password with the hashed password in the database
          const passwordMatch = await bcrypt.compare(
            validatedFields.data.password,
            userExist.password
          );

          // If the password matches, return the user object
          if (passwordMatch) {
            return userExist;
          }
        }

        // If validation fails, return null (unauthorized)
        return null;
      },
    }),
  ],
});

/**
 * Algorithm: Authentication Workflow
 *
 * 1. **Initialize NextAuth with Configuration**:
 *    - Set up a database adapter (`DrizzleAdapter`) to interact with the database.
 *    - Define a secret key (`AUTH_SECRET`) for managing secure sessions.
 *    - Configure the session strategy to use JSON Web Tokens (JWT).
 *
 * 2. **Define Event Handlers**:
 *    - On the `createUser` event:
 *      a. Initialize Stripe using the API key from the environment variables.
 *      b. Create a new Stripe customer using the user's email and name.
 *      c. Update the user's record in the database with the Stripe customer ID.
 *
 * 3. **Define Session Callback**:
 *    - Check if the session and token contain a user ID (`sub`).
 *    - Attach user-specific data (e.g., `id`, `role`, `name`, `email`, `isOAuth`, etc.) to the session.
 *    - Return the enriched session object to include these attributes.
 *
 * 4. **Define JWT Callback**:
 *    - If the token does not contain a user ID, return the token unchanged.
 *    - Query the database to fetch the user's details using the ID.
 *    - Retrieve any associated account information (if applicable).
 *    - Enrich the token with additional user attributes (e.g., role, OAuth status, etc.).
 *    - Return the updated token object.
 *
 * 5. **Configure Authentication Providers**:
 *    - Set up OAuth providers (e.g., Google, GitHub):
 *      a. Use client ID and client secret values from environment variables.
 *      b. Enable email account linking for seamless logins.
 *    - Set up a custom credentials provider for manual login:
 *      a. Validate the provided credentials against a schema (e.g., email and password).
 *      b. Check if the user exists in the database.
 *      c. Compare the provided password with the stored hashed password.
 *      d. If the credentials are valid, return the user object; otherwise, reject the login attempt.
 *
 * 6. **Return Configured Handlers**:
 *    - Export the NextAuth handlers for use in the application to enable authentication.
 */
