import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type Variant = {
  variantId: number;
  quantity: number;
};

export type CartItem = {
  name: string;
  image: string;
  id: number;
  variant: Variant;
  price: number;
};

export type CheckOutProgressType =
  | "cart-page"
  | "payment-page"
  | "confirmation-page";

export type CartState = {
  cart: CartItem[];
  checkoutProgress: CheckOutProgressType;
  setCheckoutProgress: (val: CheckOutProgressType) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (val: boolean) => void;
};

// create a cart store with its type
export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set) => ({
        // state: cart: list of item
        cart: [],
        // Checkout progress
        checkoutProgress: "cart-page",

        // cartOpen status
        cartOpen: false,

        // cart open setter
        setCartOpen: (val) => set({ cartOpen: val }),
        // checkoutprogress function
        setCheckoutProgress: (val) => set(() => ({ checkoutProgress: val })),
        // setter: add item to cart list
        addToCart: (item) => {
          set((state) => {
            // check if carItem exist
            const existingItem = state.cart.find(
              (cartItem) =>
                cartItem.variant.variantId === item.variant.variantId
            );
            // if exist then update that item
            if (existingItem) {
              // create a new updatedCart
              const updatedCart = state.cart.map((cartItem) => {
                // if cart Item found then update the variant quantity
                if (cartItem.variant.variantId === item.variant.variantId) {
                  return {
                    ...cartItem,
                    variant: {
                      ...cartItem.variant,
                      quantity:
                        cartItem.variant.quantity + item.variant.quantity,
                    },
                  };
                }
                // if not found than return the item as it is
                return cartItem;
              });
              // return the new updatedCart state
              return { cart: updatedCart };
            } else {
              // NO existing cart so add a new item to the state
              return {
                cart: [
                  ...state.cart,
                  {
                    ...item,
                    variant: {
                      ...item.variant,
                      quantity: item.variant.quantity,
                    },
                  },
                ],
              };
            }
          });
        },
        // remove item from cart list
        removeFromCart: (item) => {
          set((state) => {
            // When remove is triggered only quanity is updated
            const updatedCart = state.cart.map((cartItem) => {
              if (cartItem.variant.variantId === item.variant.variantId) {
                return {
                  ...cartItem,
                  variant: {
                    ...cartItem.variant,
                    quantity: cartItem.variant.quantity - item.variant.quantity,
                  },
                };
              }
              return cartItem;
            });

            // once the quanitity is updated check if it is greated than 0
            // only add/filter out the item with quanity greater than 0
            return {
              cart: updatedCart.filter(
                (cartItem) => cartItem.variant.quantity > 0
              ),
            };
          });
        },

        // Set a new state:{} of empty cart list
        clearCart() {
          set({ cart: [] });
        },
      }),
      { name: "cart-storage" }
    )
  )
);

// Algorithm to manage the cart store:

// 1. **Initialize State:**
//    - cart: An empty array to store cart items (initially).
//    - checkoutProgress: Set to "cart-page" to track the current step of the checkout process.
//    - cartOpen: Boolean to track whether the cart is visible or hidden (initialized to false).

// 2. **Add Item to Cart (addToCart function):**
//    - Check if the item already exists in the cart by comparing the variantId of the item.
//    - If the item exists:
//      - Find the existing item in the cart.
//      - Update the item's quantity by adding the new quantity to the current quantity.
//    - If the item doesn't exist:
//      - Add the new item to the cart with the specified quantity.

// 3. **Remove Item from Cart (removeFromCart function):**
//    - Check if the item exists in the cart by comparing the variantId.
//    - If found, reduce the quantity of the item by subtracting the quantity to be removed.
//    - If the item's quantity becomes zero or negative:
//      - Remove the item from the cart.
//    - Otherwise, keep the item with the updated quantity.

// 4. **Clear Cart (clearCart function):**
//    - Reset the cart state to an empty array, effectively clearing all items from the cart.

// 5. **Update Checkout Progress (setCheckoutProgress function):**
//    - Update the checkoutProgress state to the new value, which could be "cart-page", "payment-page", or "confirmation-page".

// 6. **Toggle Cart Visibility (setCartOpen function):**
//    - Set the cartOpen state to the provided value (true or false), controlling the visibility of the cart.

// 7. **Persist State (persist middleware):**
//    - Store the cart data in local storage under the key "cart-storage" to persist the cart state across page reloads.
//    - Ensure that the cart state (cart items, checkout progress, and cart visibility) is saved and can be retrieved later.

// 8. **DevTools (devtools middleware):**
//    - Enable debugging and tracking of state changes in the cart store using Zustand DevTools for a better development experience.
