import { VariantsWithImagesTags } from "@/lib/infer-type";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { variantSchema, zVariantSchema } from "@/types/variant-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputTags from "./input-tags";

export default function ProductVariant({
  editMode,
  productId,
  variant,
  children,
}: {
  editMode: boolean;
  productId: number;
  variant?: VariantsWithImagesTags;
  children: React.ReactNode;
}) {
  const form = useForm<zVariantSchema>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      tags: [],
      variantImages: [],
      color: "#000",
      editMode,
      id: undefined,
      productId,
      productType: "Black Notebook",
    },
  });

  const onSubmit = (values: zVariantSchema) => {
    // do something with form value
  };
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit" : "Create"} your variant</DialogTitle>
          <DialogDescription>
            Manage your product variant here. You can add tags, images, and
            more.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Product Type: variant */}
            <FormField
              control={form.control}
              name="productType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pick a title for your variant"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Variant color: variant */}
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Variant Tags: variant */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Tags</FormLabel>
                  <FormControl>
                    <InputTags
                      {...field}
                      onChange={(e: any) => field.onChange(e)}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Variant Images:  */}
            <FormField
              control={form.control}
              name="variantImages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Images</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {editMode && variant && (
              <Button type="button" onClick={(e) => e.preventDefault()}>
                Delete Variant
              </Button>
            )}

            <Button type="submit">
              {editMode ? "Update Variant" : "Create Variant"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
