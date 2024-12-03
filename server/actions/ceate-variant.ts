"use server";
import { variantSchema } from "@/types/variant-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { productVariants, variantImages, variantTags } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();

export const createVariant = action
  .schema(variantSchema)
  .action(
    async ({
      parsedInput: {
        editMode,
        id,
        productId,
        productType,
        color,
        tags,
        variantImages: newImages,
      },
    }) => {
      try {
        if (editMode && id) {
          const editVariant = await db
            .update(productVariants)
            .set({ color, productType, updated: new Date() })
            .where(eq(productVariants.id, id))
            .returning();

          // DELETE the old tags and INSERT THE INCOMING tags from the form
          await db
            .delete(variantTags)
            .where(eq(variantTags.variantId, editVariant[0].id));
          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantId: editVariant[0].id,
            }))
          );

          // DELETE the old image and save the incoming image from the form
          await db
            .delete(variantImages)
            .where(eq(variantImages.variantId, editVariant[0].id));
          await db.insert(variantImages).values(
            newImages.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantId: editVariant[0].id,
              order: idx,
            }))
          );

          // once everything done revalidate the cache
          revalidatePath("/dashboard/products");
          return { success: `Updated ${productType} Successfully!` };
        }

        // not a edit mode so create a new one
        if (!editMode) {
          const newVariant = await db
            .insert(productVariants)
            .values({
              color,
              productType,
              productId,
            })
            .returning();

          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantId: newVariant[0].id,
            }))
          );
          await db.insert(variantImages).values(
            newImages.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantId: newVariant[0].id,
              order: idx,
            }))
          );
          revalidatePath("/dashboard/products");
          return { success: `Created ${productType} Successfully!` };
        }
      } catch (error) {
        console.log("error while creating or updating variant", error);
        return { error: `Failed to create Variant! ` };
      }
    }
  );
