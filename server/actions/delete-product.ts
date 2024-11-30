"use server";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const action = createSafeActionClient();

export const deleteProduct = action
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    try {
      if (!id) return { error: "No such Product Delete!" };

      const deleteProduct = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();

      revalidatePath("/dashboard/products");
      return {
        success: `Product ${deleteProduct[0].title} deleted Successfully!`,
      };
    } catch (error) {
      console.log("error while deleting product", error);
    }
  });

// "use server";

// import { createSafeActionClient } from "next-safe-action";
// import * as z from "zod";
// import { db } from "..";
// import { products } from "../schema";
// import { eq } from "drizzle-orm";
// import { revalidatePath } from "next/cache";

// const action = createSafeActionClient();

// export const deleteProduct = action
//   .schema(z.object({ id: z.number() }))
//   .action(async ({ parsedInput: { id } }) => {
//     try {
//       const data = await db
//         .delete(products)
//         .where(eq(products.id, id))
//         .returning();
//       revalidatePath("/dashboard/products");
//       return { success: `Product ${data[0].title} has been deleted` };
//     } catch (error) {
//       return { error: "Failed to delete product" };
//     }
//   });
