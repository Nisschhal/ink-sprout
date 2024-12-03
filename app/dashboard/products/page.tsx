import { db } from "@/server";
import { products } from "@/server/schema";
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
import { auth } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Products() {
  // Get the User and see if it's admin, if not redirect to setting page
  const session = await auth();

  if (session?.user.role !== "admin") return redirect("/dashboard/settings");

  // get the products from the backend
  const productData = await db.query.products.findMany({
    with: {
      productVariants: { with: { variantImages: true, variantTags: true } },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  if (!products) throw new Error("No product Found!");

  // get the formated product list with image and variants for dataTable

  const dataTable = productData.map((product) => {
    // if there is not productVariant then return empty list for variant
    if (product.productVariants.length === 0) {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: placeholder.src,
        variants: [],
      };
    }
    // if there is product variant then grab the first image to list out in product row
    const image = product.productVariants[0].variantImages[0].url;

    // product with variant return the product first image and variants
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      image,
      variants: product.productVariants,
    };
  });

  if (!dataTable) throw new Error("No product Found!");

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
