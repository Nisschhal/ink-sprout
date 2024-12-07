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
  clearCart: (val: boolean) => void;
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
        setCheckoutProgress: (val) => set({ checkoutProgress: val }),
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
