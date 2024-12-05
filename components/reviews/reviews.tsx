import { db } from "@/server";
import { ReviewsForm } from "./reviews-form";
import { desc, eq } from "drizzle-orm";
import { reviews } from "@/server/schema";
import Review from "./review";

export default async function Reviews({ productId }: { productId: number }) {
  const reviewsData = await db.query.reviews.findMany({
    where: eq(reviews.productId, productId),
    orderBy: [desc(reviews.created)],
    with: { user: true },
  });

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-2">Product Reviews</h2>
      <div className="flex gap-2 lg:gap-12 justify-stretch flex-col lg:flex-row">
        <div className="flex-1">
          <Review reviews={reviewsData} />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <ReviewsForm productId={productId} />
        </div>
      </div>
    </section>
  );
}
