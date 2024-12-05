import { db } from "@/server";
import { ReviewsForm } from "./reviews-form";
import { desc, eq } from "drizzle-orm";
import { reviews } from "@/server/schema";
import Review from "./review";
import ReviewChart from "./reviews-chart";

export default async function Reviews({ productId }: { productId: number }) {
  const reviewsData = await db.query.reviews.findMany({
    where: eq(reviews.productId, productId),
    orderBy: [desc(reviews.created)],
    with: { user: true },
  });

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-2">Product Reviews</h2>
      <div className="flex gap-2 lg:gap-4justify-stretch flex-col lg:flex-row">
        {/* Left Side: User Review Section */}
        <div className="flex-1">
          <Review reviews={reviewsData} />
        </div>
        {/* Right Side: Review Form and Star List */}
        <div className="flex-1 flex flex-col gap-2">
          <ReviewsForm productId={productId} />
          <ReviewChart reviews={reviewsData} />
        </div>
      </div>
    </section>
  );
}
