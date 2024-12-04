import ProductPick from "@/components/products/product-pick";
import ProductType from "@/components/products/product-type";
import { Separator } from "@/components/ui/separator";
import formatPrice from "@/lib/format-price";
import { db } from "@/server";
import { productVariants } from "@/server/schema";
import { eq } from "drizzle-orm";

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
        <h1>Variant not found</h1>
      </div>
    );
  }

  return (
    <main>
      <section>
        <div className="flex-1">
          <h1>Images</h1>
        </div>
        <div className="flex flex-col flex-1 gap-2">
          <h2 className="">{variant.products.title}</h2>
          <div>
            <ProductType variants={variant.products.productVariants} />
          </div>
          <Separator />
          <p className="text-2xl font-medium">
            {formatPrice(variant.products.price)}
          </p>
          <div
            dangerouslySetInnerHTML={{ __html: variant.products.description }}
          />
          <p className="text-secondary-foreground">Available Colors</p>
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
        </div>
      </section>
    </main>
  );
}
