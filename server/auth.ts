import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/server"; // server/index.ts
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/types/login-schema";
import { eq } from "drizzle-orm";
import { users } from "./schema";
import bcrypt from "bcrypt";
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // allowDangerousEmailAccountLinking: true,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      // allowDangerousEmailAccountLinking: true,
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
