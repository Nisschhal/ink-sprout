"use server";

import { db } from "@/server";
import { auth } from "@/server/auth";
import { orderProduct, orders } from "@/server/schema";
import { orderSchema } from "@/types/order-schema";
import { createSafeActionClient } from "next-safe-action";

const action = createSafeActionClient();

export const createOrder = action
  .schema(orderSchema)
  .action(async ({ parsedInput: { products, status, total } }) => {
    const session = await auth();
    if (!session?.user) return { error: "User not Found!" };
    const order = await db
      .insert(orders)
      .values({
        status,
        total,
        userId: session.user.id,
      })
      .returning();

    const orderProducts = products.map(
      async ({ productId, variantId, quantity }) => {
        const newOrderProduct = await db
          .insert(orderProduct)
          .values({
            quantity,
            orderId: order[0].id,
            productId,
            productVariantId: variantId,
          })
          .returning();
      }
    );
    return { success: "New Order Created! 📦" };
  });
