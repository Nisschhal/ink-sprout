"use server";

import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";
import { RegisterSchema } from "@/types/register-schema";
import { generateEmailVerificationToken } from "./tokens";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "./email";

// get the action function from the createSafeActionClient()
const action = createSafeActionClient();

// create emailRegister action
export const emailRegister = action
  .schema(RegisterSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    if (!email || !password || !name) {
      return { error: "Invalid Inputs" };
    }

    // HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // check if the user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    // check if user exist
    if (existingUser) {
      // if user exist check if the user has email verfied
      if (!existingUser.emailVerified) {
        // if not verified, GENERATE TOKEN: returns array of tokens
        const verificationToken = await generateEmailVerificationToken(email);

        // SEND the first VERIFY TOKEN EMAIL
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );

        // return with EMAIL CONFIRMATION SEND SUCCESS
        return { success: "Email Confimation Sent!" };
      }
      // IF USER ALREADY VERIFIED, RETURN ERROR
      return { error: "Email already in use!" };
    }

    // USER DOESN'T EXIST, CREATE NEW USER in db
    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });

    // CREATE NEW TOKEN FROM NEW USER AND SEND VERIFY EMAIL
    const verificationToken = await generateEmailVerificationToken(email);
    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token
    );

    // mission acomplished, RETURN SUCCESS message
    return { success: "Confirmation Email sent!" };
  });
