import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;
const publish_key = process.env.NEXT_PUBLIC_PUBLISH_KEY!;
// console.log(publish_key, "publish+key");
const getStripe = () => {
  // If Stripe promise is null load the Stripe
  if (!stripePromise) {
    stripePromise = loadStripe(publish_key);
  }
  return stripePromise;
};

export default getStripe;
