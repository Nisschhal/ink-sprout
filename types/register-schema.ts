import * as z from "zod";

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Invalid Email Address!",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 character!",
  }),
  name: z.string().min(4, { message: "Please add atleast 4 character!" }),
});
