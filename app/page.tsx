import Products from "@/components/products/products";
import { db } from "@/server";

export default async function Home() {
  const productVariantsData = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      products: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  return (
    <main>
      <Products variants={productVariantsData} />
    </main>
  );
}
