"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { twoFactorTokens, users } from "../schema";
import { eq } from "drizzle-orm";
import {
  generateEmailVerificationToken,
  generateTwoFactorToken,
  getTwoFactorTokenByEmail,
} from "./tokens";
import { sendTwoFactorTokenByEmail, sendVerificationEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

// import the client action instance
//

const action = createSafeActionClient();

/**
 * 1. CHECK IF USER EXIST IN DB WITH LOGGED IN EMAIL
 * 2. CHECK IF EMAIL|USER isemailverified
 * 3. CHECK IF TWOFACTORENABLED
 */

export const emailSignIn = action
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password, code } }) => {
    try {
      // check if the user exists
      // GET THE USER
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      // IF NO USER WITH LOGGED IN EMAIL THEN return ERROR
      if (existingUser?.email !== email) {
        return { error: "Email not found!" };
      }

      // CHECK IF USER VERFIED //
      // iF NOT VERFIED
      if (!existingUser.emailVerified) {
        const verficationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
          verficationToken[0].email,
          verficationToken[0].token
        );

        return { success: "Confirmation Email Sent!" };
      }

      // Check for twofactor enabled
      if (existingUser.twoFactorEnabled) {
        // IF THERE IS CODE
        if (code) {
          const twoFactorToken = await getTwoFactorTokenByEmail(
            existingUser.email
          );

          // if no token fetched from db return error
          if (!twoFactorToken) return { error: "Invalid Token!" };

          // if fetched token is not equal to code
          if (twoFactorToken.token !== code) return { error: "Invalid Token!" };

          // check if token expired
          const hasExpired = new Date(twoFactorToken.expires) < new Date();
          if (hasExpired) {
            return { error: "Token has expired!" };
          }

          // if not expired then delete token from db
          await db
            .delete(twoFactorTokens)
            .where(eq(twoFactorTokens.id, twoFactorToken.id));
        } else {
          // THERE IS NOT CODE WHILE LOGIN then GENERATE AND SEND ONE
          // generate token
          const twoFactorToken = await generateTwoFactorToken(email);

          if (!twoFactorToken)
            return { error: "Error while generating two factor token!" };
          // send two factor token email
          await sendTwoFactorTokenByEmail(
            twoFactorToken[0].email,
            twoFactorToken[0].token
          );
          return { twoFactor: "Two Factor Token sent to email!" };
        }
      }

      // If USER VERFIEID
      // Call signIn from the `server/auth` for custom 'credentials' email/passowrd
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
      });
    } catch (error) {
      console.log("Error while handling Login operation");
      // Can also set custom error according to income error from 'AuthError'
      if (error instanceof AuthError) {
        switch (error.type) {
          case "CredentialsSignin":
            return { error: "Invalid Credentials!" };
          case "AccessDenied":
            return { error: error.message };
          case "OAuthSignInError":
            return { error: error.message };
          default:
            return { error: `Seomthing went wrong while: ${error.message} ` };
        }
      }
      // Handle errors other than AuthError
      throw error;
    }
  });
