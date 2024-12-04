"use server";

import { reviewSchema } from "@/types/review-shema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { and, eq } from "drizzle-orm";
import { reviews } from "../schema";
import { revalidatePath } from "next/cache";
const action = createSafeActionClient();

export const createReview = action
  .schema(reviewSchema)
  .action(async ({ parsedInput: { rating, comment, productId } }) => {
    try {
      const session = await auth();
      if (!session) return { info: "Please sign in to add review!" };

      const reviewExist = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productId, productId),
          eq(reviews.userId, session.user.id)
        ),
      });

      if (reviewExist)
        return { warning: "You have already reviewed this product!" };
      const newReview = await db
        .insert(reviews)
        .values({
          productId,
          rating,
          comment,
          userId: session.user.id,
        })
        .returning();
      revalidatePath(`/product/${productId}`);
      return { success: "Your Review added! 👌🏼" };
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
