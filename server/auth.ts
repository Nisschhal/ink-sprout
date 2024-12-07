import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server"; // server/index.ts
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/types/login-schema";
import { eq } from "drizzle-orm";
import { accounts, users } from "./schema";
import bcrypt from "bcrypt";
import Stripe from "stripe";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  // events for creating customerId for stripe

  events: {
    createUser: async ({ user }) => {
      // init stripe
      const stripe = new Stripe(process.env.STRIPE_SECRET!, {
        apiVersion: "2024-11-20.acacia",
      });

      // Create customer into stripe using user email and name
      const customer = await stripe.customers.create({
        email: user.email!,
        name: user.name!,
      });

      // update the users table in db to add customerId of the user
      await db
        .update(users)
        .set({ customerId: customer.id })
        .where(eq(users.id, user.id!));
    },
  },
  callbacks: {
    // when session is created do this
    async session({ token, session }) {
      if (session && token.sub) {
        session.user.id = token.sub;
      }
      if (session.user && token.role) {
        session.user.role = token.role as string;
      }
      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.image = token.image as string;
      }
      return session;
    },

    // when jwt is created do this
    async jwt({ token }) {
      if (!token.sub) return token;
      const existingUser = await db.query.users.findFirst({
        where: eq(users.id, token.sub),
      });
      if (!existingUser) return token;
      const existingAccount = await db.query.accounts.findFirst({
        where: eq(accounts.userId, existingUser.id),
      });

      // attach new attributes to token Object
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.image = existingUser.image;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.twoFactorEnabled;

      return token;
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),

    //  Custom Login with Username || Password
    Credentials({
      // when loged in trigger
      authorize: async (credentials) => {
        // check if incoming data is valid with schema
        const validatedFields = LoginSchema.safeParse(credentials);
        // if validate check weather user exist
        if (validatedFields.success) {
          const userExist = await db.query.users.findFirst({
            where: eq(users.email, validatedFields.data.email),
          });

          if (!userExist || !userExist.password) return null;

          const passwordMatch = await bcrypt.compare(
            validatedFields.data.password,
            userExist.password
          );

          // return user if password matched
          if (passwordMatch) {
            return userExist;
          }
        }

        // not authorized
        return null;
      },
    }),
  ],
});
