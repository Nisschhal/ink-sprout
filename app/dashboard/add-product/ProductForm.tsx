"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prodcutSchema, zProductSchema } from "@/types/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DollarSign, Loader2 } from "lucide-react";
import Tiptap from "./tiptap";
import { useAction } from "next-safe-action/hooks";
import { createProduct } from "@/server/actions/create-product";
import { useEffect, useState } from "react";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProductForm() {
  // when product added push to '/product'
  const router = useRouter();

  const form = useForm<zProductSchema>({
    resolver: zodResolver(prodcutSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
    },
  });

  const { execute, status } = useAction(createProduct, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        console.log(data);
        router.push("/dashboard/products");
        // toast.success(data.success);
      }

      if (data?.error) {
        toast.error(data.error);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // submit handler
  const onSubmit = async (values: zProductSchema) => {
    const promise = () =>
      new Promise((resolve) =>
        setTimeout(() => resolve({ name: "Sonner" }), 2000)
      );

    toast.promise(promise, {
      loading: "Creating new product...",
      success: () => {
        return `${values.title} Product has been created Successfully!`;
      },
      error: "Error",
    });
    execute(values);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col gap-1">
        <CardTitle>Add Product</CardTitle>
        <CardDescription>Detail of your new stock</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:space-y-6"
          >
            {/* Product Title Field */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Marker" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Price  Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className="flex gap-2 items-center">
                      <DollarSign
                        size={36}
                        className="p-2 bg-muted rounded-md"
                      />
                      <Input
                        placeholder="Your price in USD"
                        type="number"
                        step={0.1}
                        min={0}
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={
                status == "executing" ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
              className="w-full"
              type="submit"
            >
              {status == "executing" ? (
                <>
                  <Loader2 className="animate-spin size-3.5" /> Submitting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
