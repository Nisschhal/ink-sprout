"use server";
import { NewPasswordSchema } from "@/types/new-password-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "../schema";
import { getPasswordResetTokenByToken } from "./tokens";
import bcrypt from "bcrypt";

// websocket neon db transactions
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";

const action = createSafeActionClient();
neonConfig.webSocketConstructor = ws;
export const newPassword = action
  .schema(NewPasswordSchema)
  .action(async ({ parsedInput: { password, token } }) => {
    // configure websocket setting for db transactions
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const dbPool = drizzle({ client: pool });

    // if token exist
    if (!token) return { error: "Missing Token!" };
    // if token valid
    const existingToken = await getPasswordResetTokenByToken(token);

    // if no token in db
    if (!existingToken) {
      return { error: "Token not found!" };
    }

    // check if token expired
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) return { error: "Token has expired!" };

    // check if existingResetToken email has user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, existingToken.email),
    });

    if (!existingUser) {
      return { error: "User not found!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // make sure all transaction get clear
    await dbPool.transaction(async (tx) => {
      // update user password
      await tx
        .update(users)
        .set({
          password: hashedPassword,
        })
        .where(eq(users.id, existingUser.id));
      // delete existing reset token as well
      await tx
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    });

    return { success: " Password updated!" };
  });
