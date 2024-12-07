"use client";

import { useCartStore } from "@/lib/client-store";
import { ShoppingBag } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { AnimatePresence, motion } from "motion/react";
import CartItems from "./cart-item";
import CartMessage from "./cart-message";
import Payment from "./payment";

export default function CartDrawer() {
  const { cart, checkoutProgress } = useCartStore();

  return (
    <Drawer>
      <DrawerTrigger>
        <div className="relative">
          <AnimatePresence>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute flex items-center justify-center -top-1 -right-2 w-4 h-4 dark:bg-primary bg-primary/50 text-xs font-bold rounded-full"
            >
              {cart.length}
            </motion.div>
          </AnimatePresence>
        </div>
        <ShoppingBag className="w-7 h-7" />
      </DrawerTrigger>
      <DrawerContent className="min-h-50vh">
        <DrawerHeader>
          <CartMessage />
        </DrawerHeader>
        <div className="overflow-auto p-4">
          {checkoutProgress === "cart-page" && <CartItems />}
          {checkoutProgress === "payment-page" && <Payment />}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
