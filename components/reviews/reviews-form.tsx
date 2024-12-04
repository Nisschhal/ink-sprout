"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { reviewSchema, zReviewSchema } from "@/types/review-shema";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
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
import { Textarea } from "../ui/textarea";

import { motion } from "motion/react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAction } from "next-safe-action/hooks";
import { createReview } from "@/server/actions/add-review";
import { toast } from "sonner";
export function ReviewsForm({ productId }: { productId: number }) {
  const searchParams = useSearchParams();
  const variantId = Number(searchParams.get("id"));

  // 1. Define your form.
  const form = useForm<zReviewSchema>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      productId,
    },
  });

  //   createReview Action
  const { execute, status } = useAction(createReview, {
    onSuccess({ data }) {
      if (data?.success) {
        toast.success(data.success);
        form.reset();
      }
      if (data?.warning) {
        toast.warning(data.warning);
      }
      if (data?.info) {
        toast.info(data.info);
      }
      if (data?.error) {
        toast.error(data.error);
      }
    },

    onError(error) {
      toast.error("Sorry, couldn't added your review!");
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: zReviewSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    execute({ comment: values.comment, rating: values.rating, productId });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full mt-4">
          <Button className="font-medium w-full">Leave a review!</Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Popover Content */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your review</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="How was the product?" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Start Rating  */}
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your Rating</FormLabel>
                  <FormControl>
                    <Input
                      type="hidden"
                      {...field}
                      placeholder="Star rating..."
                    />
                  </FormControl>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <motion.div
                        key={value}
                        className="relative cursor-pointer"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                      >
                        <Star
                          key={value}
                          onClick={() =>
                            form.setValue("rating", value, {
                              shouldValidate: true,
                            })
                          }
                          className={cn(
                            "text-primary bg-transparent transition-all duration-300 ease-in-out",
                            form.getValues("rating") >= value
                              ? "fill-primary"
                              : "fill-muted"
                          )}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={status === "executing"}
              className="w-full"
              type="submit"
            >
              {status === "executing" ? "Adding Review..." : "Add Review"}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
