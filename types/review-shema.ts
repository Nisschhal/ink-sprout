import * as z from "zod";

export const reviewSchema = z.object({
  productId: z.number(),
  rating: z.number().min(1, { message: "Please add at least 1 star!" }),
  comment: z
    .string()
    .min(10, { message: "Comment must be of at least 10 characters!" }),
});

export type zReviewSchema = z.infer<typeof reviewSchema>;
