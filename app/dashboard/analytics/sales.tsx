"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableCaption,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { TotalOrders } from "@/lib/infer-type";
import Image from "next/image";
import placeholder from "@/public/placeholder_user.jpg";
export default function Sales({ totalOrders }: { totalOrders: TotalOrders[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New sales</CardTitle>
        <CardDescription>Here are your recent sales</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customers</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Image</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {totalOrders.map(
              ({
                orders,
                products,
                productVariants,
                orderId,
                productId,
                productVariantId,
                id,
                quantity,
              }) => (
                <TableRow key={id}>
                  <TableCell className="font-medium">
                    {orders.users.image && orders.users.name ? (
                      <div className="flex gap-2 items-center ">
                        <Image
                          src={orders.users.image}
                          alt={orders.users.name}
                          height={25}
                          width={25}
                          className="rounded-full"
                        />
                        <p className="text-sm font-medium">
                          {orders.users.name}
                        </p>
                      </div>
                    ) : (
                      <div className="flex gap-2 items-center ">
                        <Image
                          src={placeholder.src}
                          alt="user not found"
                          height={25}
                          width={25}
                          className="rounded-full"
                        />
                        <p className="text-sm font-medium">
                          {orders.users.name}
                        </p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{products.title}</TableCell>
                  <TableCell>{products.price}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>
                    <Image
                      src={productVariants.variantImages[0].url}
                      alt={products.title}
                      height={48}
                      width={48}
                    />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
