import { db } from "@/server";
import { products } from "@/server/schema";
import placeholder from "@/public/placeholder_small.jpg";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Products() {
  // get the products from the backend
  const productData = await db.query.products.findMany({
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
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}
