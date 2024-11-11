"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

// import the client action instance
//

const action = createSafeActionClient();

export const emailSignIn = action
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    try {
      // check if the user exists
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      // IF NO SUCH EMAIL MATCH PASS ERROR
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

      // If USER VERFIEID
      // Call signIn from the server/auth for custom 'credentials' email/passowrd
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
    console.log(email, password);
  });
