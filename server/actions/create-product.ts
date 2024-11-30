"use server";

import { prodcutSchema } from "@/types/product-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { products } from "../schema";

const action = createSafeActionClient();
export const createProduct = action
  .schema(prodcutSchema)
  .action(async ({ parsedInput: { id, title, description, price } }) => {
    try {
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });
        if (!currentProduct) return { error: "Product not Found!" };

        const foundProduct = await db
          .update(products)
          .set({ title, description, price })
          .where(eq(products.id, id))
          .returning();
        console.log(foundProduct);
        return {
          success: `Product Fetched Successfully! `,
          product: foundProduct,
        };
      } else {
        if (!id) {
          const newProduct = await db
            .insert(products)
            .values({ title, price, description })
            .returning();

          return { success: `New Product ${title} created successfully! ` };
        }
      }
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
