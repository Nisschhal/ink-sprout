"use server";

import { eq } from "drizzle-orm";
import { db } from "..";
import {
  emailTokens,
  passwordResetTokens,
  twoFactorTokens,
  users,
} from "../schema";
import crypto from "crypto";
// check if token already exist by email
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
// check if token already exist by token
const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, token),
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

  const existingToken = await getVerificationTokenByToken(token);
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

// get password reset token by toke from db
export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });

    return passwordResetToken;
  } catch (error) {
    console.log("error while getting password reset token by token", error);
  }
};
// get password reset token by email from db
export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email),
    });

    return passwordResetToken;
  } catch (error) {
    console.log("error while getting password reset token by email", error);
  }
};

// generate password reset token
export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = crypto.randomUUID();
    // set expiries
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour time limit

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    }

    const passwordResetToken = await db
      .insert(passwordResetTokens)
      .values({
        email,
        token,
        expires,
      })
      .returning();

    return passwordResetToken;
  } catch (error) {
    console.log("Error while generting password reset token", error);
  }
};

// ----------------- TWO FACTOR TOKENS ------------------------ //

// GET
// get the twofactor token row from the db via given email
export const getTwoFactorTokenByEmail = async (email: string) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.email, email),
    });

    return twoFactorToken;
  } catch (error) {
    console.log("error while getting two factor token by email", error);
  }
};
// get the twofactor token row from the db via given token
export const getTwoFactorTokenByToken = async (token: string) => {
  try {
    const twoFactorToken = await db.query.twoFactorTokens.findFirst({
      where: eq(twoFactorTokens.token, token),
    });

    return twoFactorToken;
  } catch (error) {
    console.log("error while getting two factor token by token", error);
  }
};

// GNERATE
// generate password reset token
export const generateTwoFactorToken = async (email: string) => {
  try {
    const token = crypto.randomInt(100_000, 1_000_000).toString();

    // set expiries
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour time limit

    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
      await db
        .delete(twoFactorTokens)
        .where(eq(twoFactorTokens.id, existingToken.id));
    }

    const twoFactorToken = await db
      .insert(twoFactorTokens)
      .values({
        email,
        token,
        expires,
      })
      .returning();

    return twoFactorToken;
  } catch (error) {
    console.log("Error while generting two factor token", error);
  }
};
