"use client";

import { VariantsWithImagesTags } from "@/lib/infer-type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { variantSchema, zVariantSchema } from "@/types/variant-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputTags from "./input-tags";
import VariantImages from "./variant-images";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { createVariant } from "@/server/actions/ceate-variant";
import { deleteVariant } from "@/server/actions/delete-variant";

type VariantProps = {
  children: React.ReactNode;
  editMode: boolean;
  productId?: number;
  variant?: VariantsWithImagesTags;
};

export default function ProductVariant({
  children,
  editMode,
  productId,
  variant,
}: VariantProps) {
  const form = useForm<zVariantSchema>({
    resolver: zodResolver(variantSchema),
    defaultValues: {
      tags: [],
      variantImages: [],
      color: "#000000",
      editMode,
      id: undefined,
      productId,
      productType: "Black Notebook",
    },
  });

  const [open, setOpen] = useState(false);

  const setEdit = () => {
    // form is new so reset() and return
    if (!editMode) {
      form.reset();
      return;
    }
    // if the variant form is editMode get set the incoming data from the variant onto the corresponding form fields
    if (editMode && variant) {
      console.log(variant, "variant");
      form.setValue("editMode", true);
      form.setValue("id", variant.id);
      form.setValue("productId", variant.productId);
      form.setValue("productType", variant.productType);
      form.setValue("color", variant.color);

      // array the variantTags
      form.setValue(
        "tags",
        variant.variantTags.map((tag) => tag.tag)
      );
      // array the variantImages
      form.setValue(
        "variantImages",

        variant.variantImages
      );
    }
  };

  // load up the form fields if editMode
  useEffect(() => {
    setEdit();
  }, [variant]);

  // spin up the server action
  const { execute, status } = useAction(createVariant, {
    onExecute() {
      toast.info(`${editMode ? "Updating" : "Creating"} variant...`, {
        duration: 2000,
      });
      setOpen(false);
    },
    onSuccess({ data }) {
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.success(data.success);
      }
    },
  });

  const variantAction = useAction(deleteVariant, {
    onExecute() {
      toast.info("Deleting variant", { duration: 2000 });
      setOpen(false);
    },
    onSuccess({ data }) {
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        toast.success(data.success);
      }
    },
  });

  // submit the form with values to server action
  function onSubmit(values: zVariantSchema) {
    execute(values);
  }

  return (
    // pass the mannual open state and the setter function to onOpenChange
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[860px]">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit" : "Create"} your variant</DialogTitle>
          <DialogDescription>
            Manage your product variants here. You can add tags, images, and
            more.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Variant Title Field */}
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

            {/* Varint Color Field */}
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

            {/* Variant Tag Field */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <InputTags {...field} onChange={(e) => field.onChange(e)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Variant Image Custom Field */}
            <VariantImages />

            {/* DELETE AND UPDATE BUTTON */}
            <div className="flex gap-4 items-center justify-center">
              {editMode && variant && (
                <Button
                  variant={"destructive"}
                  type="button"
                  disabled={variantAction.status === "executing"}
                  onClick={(e) => {
                    e.preventDefault();
                    variantAction.execute({ id: variant.id });
                  }}
                >
                  Delete Variant
                </Button>
              )}
              <Button
                disabled={
                  status === "executing" ||
                  !form.formState.isValid ||
                  !form.formState.isDirty
                }
                type="submit"
              >
                {editMode ? "Update Variant" : "Create Variant"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
