"use client";

import { useCartStore } from "@/lib/client-store";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { createPaymentIntent } from "@/server/actions/stripe/create-payment-intent";

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  // stripe
  const stripe = useStripe();

  //  Stripe input elements
  const elements = useElements();
  const { cart } = useCartStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("clicked");
    setIsLoading(true);
    // if there is no stripe or elmenet do nothing
    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    // get the error if there is any from elements.submit()
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message!);
      setIsLoading(false);
      return;
    }

    const serverResult = await createPaymentIntent({
      amount: totalPrice * 100,
      currency: "usd",
      cart: cart.map((item) => ({
        quantity: item.variant.quantity,
        productId: item.id,
        title: item.name,
        price: item.price,
        image: item.image,
      })),
    });

    if (serverResult?.data?.success) {
      // when server action is done confirm with stripe and save the order to db
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: serverResult.data.success.clientSecretId!,
        redirect: "if_required", // mandatory
        confirmParams: {
          return_url: "http://localhost:3000/success",
          receipt_email: serverResult.data.success.user as string,
        },
      });
      if (error) {
        setErrorMessage(error.message!);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.log("Save the order!");
      }
    }
    if (serverResult?.data?.error) alert(serverResult?.data.error);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {/* // Accepted Countries */}
      <AddressElement options={{ mode: "shipping" }} />
      <Button type="submit" disabled={!stripe || !elements}>
        <span>Pay now</span>
      </Button>
    </form>
  );
}
