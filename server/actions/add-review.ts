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
      console.log(error);
      return { error: JSON.stringify(error) };
    }

    // try {
    //   const session = await auth();
    //   if (!session) return { error: "Please sign in" };

    //   const reviewExists = await db.query.reviews.findFirst({
    //     where: and(
    //       eq(reviews.productId, productId),
    //       eq(reviews.userId, session.user.id)
    //     ),
    //   });
    //   if (reviewExists)
    //     return { error: "You have already reviewed this product" };
    //   const newReview = await db
    //     .insert(reviews)
    //     .values({
    //       productId,
    //       rating,
    //       comment,
    //       userId: session.user.id,
    //     })
    //     .returning();
    //   revalidatePath(`/product/${productId}`);
    //   return { success: newReview[0] };
    // } catch (err) {
    //   console.log(err);
    //   return { error: JSON.stringify(err) };
    // }
  });
