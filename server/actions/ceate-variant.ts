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
          const editedVariant = await db
            .update(productVariants)
            .set({
              color,
              productType,
              updated: new Date(),
            })
            .returning();

          // delete the old existing variantTags
          await db
            .delete(variantTags)
            .where(eq(variantTags.variantId, editedVariant[0].id));

          // insert the new variantTags from the variantForm
          await db.insert(variantTags).values(
            tags.map((tag) => ({
              tag,
              variantID: editedVariant[0].id,
            }))
          );

          // delete old existing variantImages and create a new one
          await db
            .delete(variantImages)
            .where(eq(variantImages.variantId, editedVariant[0].id));
          await db.insert(variantImages).values(
            newImages.map((img, idx) => ({
              name: img.name,
              size: img.size,
              url: img.url,
              variantId: editedVariant[0].id,
              order: idx,
            }))
          );

          // once everything done revalidate the cache
          revalidatePath("/dashboard/products");
          return { success: `Edited ${productType} Successfully!` };
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
        return { error: `Failed to create Variant! ` };
      }
    }
  );
