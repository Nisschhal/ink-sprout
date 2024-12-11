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
import { useAction } from "next-safe-action/hooks";
import { createOrder } from "@/server/actions/stripe/create-order";
import { toast } from "sonner";

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  // stripe
  const stripe = useStripe();

  //  Stripe input elements
  const elements = useElements();
  const { cart, setCheckoutProgress, clearCart } = useCartStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // create order Action
  const { execute } = useAction(createOrder, {
    onSuccess({ data }) {
      if (data?.error) {
        toast.error(data.error);
      }
      // If order is created then get the drawer to confirmation page and clear the cart item
      if (data?.success) {
        toast.success(data.success);
        setIsLoading(false);
        setCheckoutProgress("confirmation-page");
        clearCart();
      }
    },
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    // PaymentIntent Server Action
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

    // IF success response then create a payment on stripe
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

      // if error while creating payment
      if (error) {
        setErrorMessage(error.message!);
        setIsLoading(false);
      } else {
        // console.log("Save the order!");
        execute({
          status: "pending",
          total: totalPrice,
          paymentIntentId: serverResult.data.success.paymentIntentId,
          products: cart.map((item) => ({
            productId: item.id,
            variantId: item.variant.variantId,
            quantity: item.variant.quantity,
          })),
        });
        // if no error then create a new order
        setIsLoading(false);
      }
    }
    if (serverResult?.data?.error) {
      toast.error(serverResult?.data.error);
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {/* // Accepted Countries */}
      <AddressElement options={{ mode: "shipping" }} />
      <Button
        className="my-4 w-full"
        type="submit"
        disabled={!stripe || !elements || isLoading}
      >
        <span>{isLoading ? "Processing..." : "Pay now"}</span>
      </Button>
    </form>
  );
}
