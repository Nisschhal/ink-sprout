"use client";

import { useCartStore } from "@/lib/client-store";
import { useEffect, useMemo, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import formatPrice from "@/lib/format-price";
import Image from "next/image";
import { MinusCircle, PlusCircle } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import emptyCart from "@/public/emptyCart.json";
import Lottie from "react-lottie";
import { AnimatePresence, motion } from "motion/react";

export default function CartItems() {
  const { cart, addToCart, removeFromCart } = useCartStore();

  // GET THE TOTAL PRICE from all the cart item
  const totalPrice = useMemo(() => {
    return cart.reduce(
      (acc, item) => acc + item.price * item.variant.quantity,
      0
    );
  }, [cart]);

  // get the current total price
  const prevTotalPrice = useRef(totalPrice);

  // render if total price changes
  useEffect(() => {
    prevTotalPrice.current = totalPrice;
  }, [totalPrice]);

  // for visual effect determine if price has increased
  const isPriceIncreased = totalPrice > prevTotalPrice.current;

  // get the array of price in object for animation
  const priceInLetters = useMemo(() => {
    return [...totalPrice.toFixed(2).toString()].map((letter) => ({
      letter,
      id: crypto.randomUUID(),
    }));
  }, [totalPrice]);

  return (
    <motion.div>
      {cart.length === 0 && (
        <div className="flex-col w-full flex items-center justify-center text-center">
          <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl text-muted-foreground">
              Your cart is empty
            </h2>
            {/* <Lottie options={defaultOptions} height={320} width={320} /> */}
            <Lottie
              options={{ animationData: emptyCart }}
              height={320}
              width={320}
            />
            {/* <DotLottieReact src={"path/to/emptyCart"} loop autoplay /> */}
          </motion.div>
        </div>
      )}
      {cart.length > 0 && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell className="border">Product</TableCell>
                <TableCell className="border">Price</TableCell>
                <TableCell className="border">Image</TableCell>
                <TableCell className="border">Quantity</TableCell>
                <TableCell className="border">Total</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="border">{item.name}</TableCell>
                  <TableCell className="border">
                    {formatPrice(item.price)}
                  </TableCell>
                  <TableCell className="border">
                    <div>
                      <Image
                        className="rounded-md"
                        width={48}
                        height={48}
                        src={item.image}
                        alt={item.name}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="">
                    <div className="flex items-center justify-between ">
                      <MinusCircle
                        size={16}
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        onClick={() => {
                          removeFromCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantId: item.variant.variantId,
                            },
                          });
                        }}
                      />
                      <p className="text-md font-bold">
                        {item.variant.quantity}
                      </p>
                      <PlusCircle
                        size={16}
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        onClick={() => {
                          addToCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantId: item.variant.variantId,
                            },
                          });
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {/* Price */}
      {/* set the overflow-hidden and box to relative for visual effect to work */}
      <motion.div className="flex items-center justify-center relative overflow-hidden my-4">
        <span className="text-md">Total: $</span>
        <AnimatePresence mode="popLayout">
          {priceInLetters.map((letter, i) => (
            <motion.div key={letter.id}>
              {/* // animate the letter either in increment or decrement */}
              {/* to have effect span should be inline-block */}
              <motion.span
                key={letter.id}
                initial={{
                  y: isPriceIncreased || totalPrice === 0 ? 20 : -20,
                }}
                animate={{ y: 0 }}
                exit={{ y: isPriceIncreased || totalPrice === 0 ? -20 : 20 }}
                transition={{ delay: i * 0.1 }}
                className="text-md inline-block"
              >
                {letter.letter}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
