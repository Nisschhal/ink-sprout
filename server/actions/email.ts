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
    subject: "Hello world, from ink sprout",
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
