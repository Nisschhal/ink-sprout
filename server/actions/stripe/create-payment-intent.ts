"use server";

import Stripe from "stripe";
import { createSafeActionClient } from "next-safe-action";
import { paymentIntentSchema } from "@/types/paymentIntentSchema";
import { auth } from "@/server/auth";

// init Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET!);
// init server action
const action = createSafeActionClient();

export const createPaymentIntent = action
  .schema(paymentIntentSchema)
  .action(async ({ parsedInput: { amount, cart, currency } }) => {
    const session = await auth();
    if (!session) return { error: "Please login to continue!" };
    if (!amount) return { error: "No Product to checkout!" };

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: {
        cart: JSON.stringify(cart),
      },
    });

    return {
      success: {
        // paymentid and clientsecret is must for checkout | user is extra info
        paymentIntentId: paymentIntent.id,
        clientSecretId: paymentIntent.client_secret,
        user: session.user.email,
      },
    };
  });
