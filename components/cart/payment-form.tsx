"use client";

import { useCartStore } from "@/lib/client-store";
import {
  AddressElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Button } from "../ui/button";
import React, { useState } from "react";

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useCartStore();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
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
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentForm />
      {/* // Accepted Countries */}
      <AddressElement options={{ mode: "shipping" }} />
      <Button disabled={!stripe || !elements}>
        <span>Pay now</span>
      </Button>
    </form>
  );
}
