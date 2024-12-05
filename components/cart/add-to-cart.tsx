"use client";

import { useCartStore } from "@/lib/client-store";
import { useState } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function AddCart() {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const searchParams = useSearchParams();

  // get the cart properties form url
  const variantId = Number(searchParams.get("id"));
  const productId = Number(searchParams.get("productId"));
  const title = searchParams.get("title");
  const type = searchParams.get("type");
  const image = searchParams.get("image");
  const price = Number(searchParams.get("price"));

  if (!variantId || !productId || !title || !type || !image || !price) {
    toast.error("Product not Found!");
    return redirect("/");
  }

  return (
    <>
      <div className="flex items-center gap-4 justify-stretch my-4">
        <Button
          variant={"secondary"}
          className="text-primary"
          onClick={() => {
            if (quantity > 1) setQuantity(quantity - 1);
          }}
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <Button className="flex-1">Quantity: {quantity}</Button>
        <Button
          variant={"secondary"}
          className="text-primary"
          onClick={() => setQuantity(quantity + 1)}
        >
          <Plus size={18} strokeWidth={3} />
        </Button>
      </div>
      <Button
        onClick={() => {
          console.log("clicked!");
          addToCart({
            id: productId,
            image,
            name: title,
            price,
            variant: { quantity, variantId },
          });
          toast.success(`Item  ${title} added to Cart! 👌🏼`);
        }}
      >
        Add to Cart
      </Button>
    </>
  );
}
