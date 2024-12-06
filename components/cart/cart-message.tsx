"use client";

import { useCartStore } from "@/lib/client-store";
import { motion } from "motion/react";
import { DrawerDescription, DrawerTitle } from "../ui/drawer";
import { ArrowLeft } from "lucide-react";

export default function CartMessage() {
  const { checkoutProgress, setCheckoutProgress } = useCartStore();

  return (
    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
      <DrawerTitle className="text-center">
        {checkoutProgress === "cart-page" && "Your Cart Item"}
        {checkoutProgress === "payment-page" && "Choose  a payment method"}
        {checkoutProgress === "confirmation-page" && "Ordered Confirmed"}
      </DrawerTitle>
      <DrawerDescription className="py-1 text-center">
        {checkoutProgress === "cart-page" && "View and edit your bag."}
        {checkoutProgress === "payment-page" && (
          <span
            className="flex items-center justify-center gap-1 cursor-pointer hover:text-primary"
            onClick={() => setCheckoutProgress("cart-page")}
          >
            <ArrowLeft size={16} className="" /> Head back to cart
          </span>
        )}
        {checkoutProgress === "confirmation-page" && "Ordered Confirmed"}
      </DrawerDescription>
    </motion.div>
  );
}
