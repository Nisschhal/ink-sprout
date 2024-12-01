import { db } from "@/server";
import {
  products,
  productVariants,
  variantImages,
  variantTags,
} from "@/server/schema";
import placeholder from "@/public/placeholder_small.jpg";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Products() {
  // get the products from the backend
  const productData = await db.query.products.findMany({
    with: {
      productVariants: { with: { variantImages: true, variantTags: true } },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  if (!products) throw new Error("No product Found!");

  const dataTable = productData.map((product) => ({
    id: product.id,
    title: product.title,
    price: product.price,
    variants: [],
    image: placeholder.src,
  }));

  return (
    <div className="rounded-md border">
      <Card>
        <CardHeader>
          <CardTitle>Your Products</CardTitle>
          <CardDescription>
            Update, delete and edit your products 💯
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={dataTable} />
        </CardContent>
      </Card>
    </div>
  );
}
