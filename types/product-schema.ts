import * as z from "zod";

export const prodcutSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(5, { message: "Title must be least 5 character long!" }),
  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters!" }),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number!" })
    .positive({ message: "Price must be a postitive number!" }),
});

export type zProductSchema = z.infer<typeof prodcutSchema>;
