"use client";

import { useCartStore } from "@/lib/client-store";
import getStripe from "@/lib/get-stripe";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "motion/react";
import PaymentForm from "./payment-form";

// get the stripe
const stripe = getStripe();

export default function Payment() {
  const { cart } = useCartStore();
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.variant.quantity * item.price,
    0
  );

  return (
    <motion.div>
      {/* // Wrapper for stripe configurations */}
      <Elements
        stripe={stripe}
        options={{
          mode: "payment",
          currency: "usd",
          amount: totalPrice * 100,
        }}
      >
        <PaymentForm totalPrice={totalPrice} />
      </Elements>
    </motion.div>
  );
}
