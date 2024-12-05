"use client";
import { ReviewsWithUser } from "@/lib/infer-type";
import { motion } from "motion/react";
import { Card } from "../ui/card";
import Image from "next/image";
import { formatDistance, subDays } from "date-fns";
import Stars from "./stars";
export default function Review({ reviews }: { reviews: ReviewsWithUser[] }) {
  return (
    <motion.div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <Card key={review.id} className="p-2 border-2 border-purple-100">
          <div className="flex gap-2 items-center">
            {/* Avatar */}
            <Image
              src={review.user.image!}
              width={36}
              height={36}
              className="rounded-full "
              alt="Profile pic"
            />
            {/* Review Info */}
            <div className="flex flex-col">
              {/* Name and time */}
              <p className="text-sm font-bold">
                {review.user.name}
                <span className="ml-2 text-xs text-bold text-muted-foreground">
                  ({formatDistance(subDays(review.created!, 0), new Date())}{" "}
                  ago)
                </span>
              </p>
              {/* Star Rating */}
              <div className="flex items-center gap-2">
                <Stars rating={review.rating} />
              </div>
            </div>
          </div>

          <p className="py-2 font-medium">{review.comment}</p>
        </Card>
      ))}
    </motion.div>
  );
}
