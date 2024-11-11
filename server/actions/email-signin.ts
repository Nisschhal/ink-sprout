"use server";

import { LoginSchema } from "@/types/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { users } from "../schema";
import { eq } from "drizzle-orm";

// import the client action instance
//

const action = createSafeActionClient();

export const emailSignIn = action
  .schema(LoginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    // check if the user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    
    if (existingUser?.email !== email) {
      return { error: "Email not found!" };
    } else {
      return { error: "Email exist" };
    }

    console.log(email, password);
  });
