import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  // If Stripe promise is null load the Stripe
  if (!stripePromise) {
    stripePromise: loadStripe(process.env.NEXT_PUBLIC_PUBLISH_KEY!);
  }
  return stripePromise;
};

export default getStripe;
