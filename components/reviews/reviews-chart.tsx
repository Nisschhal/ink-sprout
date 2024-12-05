"use client";

import { ReviewsWithUser } from "@/lib/infer-type";
import { Card, CardDescription, CardTitle } from "../ui/card";
import Stars from "./stars";
import { getReviewAverage } from "@/lib/review-average";
import { useMemo } from "react";
import { Progress } from "../ui/progress";

export default function ReviewChart({
  reviews,
}: {
  reviews: ReviewsWithUser[];
}) {
  const getRatingByStars = useMemo(() => {
    // Step 1: Create an array with 5 elements, all initialized to 0, to store the count of ratings for each star (1 to 5 stars).
    const ratingValues = Array.from({ length: 5 }, () => 0);

    // Step 2: Get the total number of reviews for further calculations.
    const totalReviews = reviews.length;

    // Step 3: Loop through each review to count how many times each star rating appears.
    reviews.forEach((review) => {
      // Calculate the index for the ratingValues array (e.g., rating 1 goes to index 0).
      const startIndex = review.rating - 1;
      // If the rating is between 1 and 5, increment the corresponding index in ratingValues.
      if (startIndex >= 0 && startIndex < 5) {
        ratingValues[startIndex]++;
      }
    });

    // Step 4: Convert the counts into percentages (each rating count divided by the total reviews, then multiplied by 100).
    return ratingValues.map((rating) => (rating / totalReviews) * 100);
  }, [reviews]); // The useMemo hook depends on the 'reviews' array. It will recompute the memoized value only when 'reviews' changes.

  // get the averate review from rating
  const totalRating = getReviewAverage(reviews.map((r) => r.rating));

  return (
    <Card className="flex flex-col p-8 rounded-md gap-2">
      <div className="flex gap-2  flex-col ">
        <CardTitle>Product Rating: </CardTitle>
        <Stars size={18} totalReviews={reviews.length} rating={totalRating} />
        <CardDescription className="text-lg font-medium">
          {totalRating.toFixed(1)} stars
        </CardDescription>
      </div>
      {getRatingByStars.map((rating, index) => (
        <div key={index} className="flex justify-between items-center gap-2">
          <p className="text-xs font-medium flex gap-1">
            {index + 1} <span>stars</span>
          </p>
          <Progress value={rating} />
        </div>
      ))}
    </Card>
  );
}
