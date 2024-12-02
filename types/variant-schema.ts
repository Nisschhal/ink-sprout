import * as z from "zod";
export const variantSchema = z.object({
  id: z.number(),
  productId: z.number(),
  editMode: z.boolean(),
  productType: z
    .string()
    .min(3, { message: "Product type must be at least 3 characters long!" }),
  color: z
    .string()
    .min(3, { message: "Color must be at least 3 characters long!" }),
  tags: z.array(z.string(), { message: "Please provide at least 1 tag!" }),
  variantImages: z.array(
    z.object({
      url: z.string().refine((url) => url.search("blob:") !== 0, {
        message: "Please wait for the image to upload!",
      }),
      size: z.number(),
      key: z.string().optional(),
      id: z.number().optional(),
      name: z.string(),
    })
  ),
});

export type zVariantSchema = z.infer<typeof variantSchema>;