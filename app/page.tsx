import Search from "@/components/products/algolia";
import Products from "@/components/products/products";
import { db } from "@/server";

export const revalidate = 60 * 60;

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
      <Search />
      <Products variants={productVariantsData} />
    </main>
  );
}
