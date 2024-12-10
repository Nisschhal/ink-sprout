"use client";

import { useCartStore } from "@/lib/client-store";
import { Check, CreditCard, ShoppingCart } from "lucide-react";
import { motion } from "motion/react";

export default function CartProgress() {
  const { checkoutProgress } = useCartStore();
  return (
    <div className="flex items-center justify-center">
      <div className="w-64 h-3 bg-muted rounded-md relative border ">
        {/* Steps:Icons Container */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-between">
          {/* Progress bar --------- ----------- ---------- */}
          <motion.span
            className="absolute bg-primary rounded-full top-0 left-0 h-full z-30 "
            initial={{ width: 0 }}
            animate={{
              width:
                checkoutProgress === "cart-page"
                  ? 0
                  : checkoutProgress === "payment-page"
                  ? "50%"
                  : "100%",
            }}
          />
          {/* ICON Shopping Cart */}
          <motion.div
            className=" bg-primary rounded-full p-2 z-50"
            initial={{ scale: 0 }}
            animate={{
              scale:
                checkoutProgress === "cart-page" ||
                checkoutProgress === "payment-page" ||
                checkoutProgress === "confirmation-page"
                  ? 1
                  : 0,
            }}
            transition={{ delay: 0.2 }}
          >
            <ShoppingCart className="text-white" size={14} />
          </motion.div>
          {/* ICON Payment Process */}
          <motion.div
            className=" bg-primary rounded-full p-2 z-50"
            initial={{ scale: 0 }}
            animate={{
              scale:
                checkoutProgress === "payment-page" ||
                checkoutProgress === "confirmation-page"
                  ? 1
                  : 0,
            }}
            transition={{ delay: 0.2 }}
          >
            <CreditCard className="text-white" size={14} />
          </motion.div>
          {/* ICON Order Confirmed */}
          <motion.div
            className=" bg-primary rounded-full p-2 z-50"
            initial={{ scale: 0 }}
            animate={{
              scale: checkoutProgress === "confirmation-page" ? 1 : 0,
            }}
            transition={{ delay: 0.2 }}
          >
            <Check className="text-white" size={14} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
