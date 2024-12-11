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

// Algorithm to handle Stripe integration:

// 1. **Initialize Stripe Promise:**
//    - Create a variable `stripePromise` of type `Promise<Stripe | null>` to store the Stripe instance once it is loaded.
//    - This promise will be used to load the Stripe library only once during the lifecycle.

// 2. **Set Stripe Publishable Key:**
//    - Retrieve the publishable key from the environment variables using `process.env.NEXT_PUBLIC_PUBLISH_KEY!`.
//    - This key is required to interact with Stripe's API for client-side operations (such as creating payments).

// 3. **getStripe Function:**
//    - This function is used to load and return the Stripe instance.
//    - If `stripePromise` has not been initialized (i.e., it's null), the `loadStripe` function is called to load Stripe using the provided publishable key.
//    - `loadStripe(publish_key)` returns a promise that resolves to a `Stripe` instance, which will be cached in `stripePromise`.
//    - On subsequent calls, the `stripePromise` will already be set, and the existing promise will be returned, avoiding redundant loading of Stripe.

// 4. **Return Stripe Promise:**
//    - Return the `stripePromise` so that it can be used by other parts of the application to interact with Stripe once it has been loaded.
