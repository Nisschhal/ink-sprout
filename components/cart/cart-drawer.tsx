"use client";

import { useCartStore } from "@/lib/client-store";
import { ShoppingBag } from "lucide-react";

export default function CartDrawer() {
  const { cart } = useCartStore();

  return (
    <div className="">
      <ShoppingBag className="w-5 h-5" />
    </div>
  );
}
