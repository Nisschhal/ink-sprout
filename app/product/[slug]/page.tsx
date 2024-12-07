import AddCart from "@/components/cart/add-to-cart";
import ProductPick from "@/components/products/product-pick";
import ProductShowcase from "@/components/products/product-showcase";
import ProductType from "@/components/products/product-type";
import Reviews from "@/components/reviews/reviews";
import Stars from "@/components/reviews/stars";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/format-price";
import { getReviewAverage } from "@/lib/review-average";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";

export const revalidate = 60;

export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      products: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  if (data) {
    const slugIds = data.map((variant) => ({
      slug: variant.id.toString(),
    }));
    return slugIds;
  }

  return [];
}

export default async function ProductVariantDetails({
  params,
}: {
  params: { slug: string };
}) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      products: {
        with: {
          reviews: true,
          productVariants: {
            with: { variantTags: true, variantImages: true },
          },
        },
      },
    },
  });

  if (!variant) {
    return (
      <div>
        <h1>Product Variant not found!</h1>
      </div>
    );
  }

  const reviewAverage = getReviewAverage(
    variant.products.reviews.map((review) => review.rating)
  );

  return (
    <main>
      <section className="flex flex-col lg:flex-row gap-4 lg:gap-12">
        {/* Left Side: Images */}
        <div className="flex-1">
          <ProductShowcase varaints={variant.products.productVariants} />
        </div>
        {/* Right Side: Content */}
        <div className="flex flex-col flex-1 ">
          {/* Heading */}
          <h2 className="text-2xl font-bold">{variant.products.title}</h2>
          {/* Subheadig & Reviews */}
          <div>
            <ProductType variants={variant.products.productVariants} />
          </div>
          {/* Reviews */}
          <Stars
            rating={reviewAverage}
            totalReviews={variant.products.reviews.length}
          />
          {/* --------------- */}
          <Separator className=" my-2" />
          {/* --------------- */}

          {/* Price */}
          <p className="text-2xl font-medium py-2">
            {formatPrice(variant.products.price)}
          </p>
          {/* Description as it is in Database using: dangerouslySetInnerHTML */}
          <div
            dangerouslySetInnerHTML={{ __html: variant.products.description }}
          />
          {/* Available Colors based on the variant.product.productVariants */}
          <p className="text-secondary-foreground my-2 font-semibold">
            Available Colors
          </p>
          {/* List of colors */}
          <div className="flex gap-2">
            {variant.products.productVariants.map((prodVariant) => (
              <ProductPick
                key={prodVariant.id}
                color={prodVariant.color}
                id={prodVariant.id}
                image={prodVariant.variantImages[0].url}
                productType={prodVariant.productType}
                productId={variant.productId}
                price={variant.products.price}
                title={variant.products.title}
              />
            ))}
          </div>
          <AddCart />
        </div>
      </section>
      <Reviews productId={variant.productId} />
    </main>
  );
}
