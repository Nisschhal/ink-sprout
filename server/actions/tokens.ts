"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import { emailTokens, users } from "../schema";

// check if token already exist
const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, email),
    });
    return verificationToken;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
};

// generate token and save it to db for email
export const generateEmailVerificationToken = async (email: string) => {
  // create a random token
  const token = crypto.randomUUID();

  // set the expiry data
  const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 sec

  // check if token with that email already exist
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    // DELETE IF EXIST
    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
  }

  // CREATE A NEW EMAIL TOKEN TO DB
  const verificationToken = await db
    .insert(emailTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  // RETURN THE NEWLY CREATED TOKEN
  return verificationToken;
};

export const verifyEmail = async (token: string) => {
  // check if token already exist as email and token is index in getVerificationTokenByEmail so either token or email works as argument

  const existingToken = await getVerificationTokenByEmail(token);
  // if no token return error
  if (!existingToken) return { error: "Token not found!" };

  // if there is token but expired return error
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired" };

  // if there is token, check if user exist for that token
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });

  // if user don't exist for that token return error
  if (!existingUser) return { error: "User not found!" };

  // if user exist update the emailVerified to the date of update as it was null and
  await db.update(users).set({
    emailVerified: new Date(),
    email: existingToken.email,
  });

  // delete the existing emailToken as user is verified with that token
  await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
  return { success: "Email verified!" };
};
