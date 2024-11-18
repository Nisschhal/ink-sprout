"use server";

import getBaseURL from "@/lib/base-url";
import { Resend } from "resend";

// Setup the resend server
const resend = new Resend(process.env.RESEND_API_KEY);

// function to send email
export const sendVerificationEmail = async (email: string, token: string) => {
  // get the host domain name
  const domain = getBaseURL();

  // create a hyperlink for email to redirect for verify token
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  // send the email with the hyperlink
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Ink Sprout - Confirmation Link",
    html: `<p style="font-size: 14px; color: black;">Click to <a href="${confirmLink}" style="color: blue; text-decoration: underline;">confirm your email</a></p>
`,
  });

  // if some error while sending email
  if (error) {
    console.log("error while sending email", error);
    return;
  }

  // if email sent succesfully
  if (data) {
    console.log("email sent successfully", data);
    return;
  }
};
// function to send reset email
export const sendPasswordResetEmail = async (email: string, token: string) => {
  // get the host domain name
  const domain = getBaseURL();

  // create a hyperlink for email to redirect for verify token
  const confirmLink = `${domain}/auth/new-password?token=${token}`;

  // send the email with the hyperlink
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Ink Sprout - Reset password",
    html: `<p style="font-size: 14px; color: black;">Click to <a href="${confirmLink}" style="color: blue; text-decoration: underline;">Reset your Password</a></p>
`,
  });

  // if some error while sending email
  if (error) {
    console.log("error while sending reset email", error);
    return;
  }

  // if email sent succesfully
  if (data) {
    console.log("reset email sent successfully", data);
    return;
  }
};

// send two factor email token
export const sendTwoFactorTokenByEmail = async (
  email: string,
  token: string
) => {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Ink Sprout - Your 2 Factor Token",
    html: `<p>Your Confirmation Code: ${token}</p>`,
  });
  if (error) return console.log(error);
  if (data) return data;
};
