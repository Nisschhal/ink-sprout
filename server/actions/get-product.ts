"use server";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const action = createSafeActionClient();

export const getProduct = action
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      if (!id) return { error: "No such Product Delete!" };

      const product = await db.query.products.findFirst({
        where: eq(products.id, id),
      });

      if (!product) return { error: "No product Found!" };

      return {
        success: `Product ${product.title} created Successfully!`,
        product,
      };
    } catch (error) {
      console.log("error while deleting product", error);
    }
  });
