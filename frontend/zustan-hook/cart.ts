// lib/store/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============ TYPES ============
export interface ProductVariant {
  size: string;
  color: string;
  price: number;
  discountPrice?: number;
}

export interface CartItem {
  _id: string; // unique key: productId|size|color
  productId: string;
  name: string;
  thumbnail: string;
  quantity: number;
  brandName: string;
  slug: string;
  variant: ProductVariant;
  unitPrice: number; // discountPrice if exists, else price
  variantStock: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number; // ✅ CHANGED: Original total before discount
  totalPrice: number; // ✅ CHANGED: Final price after discount
  totalDiscount: number;
  totalItems: number;

  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  incrementQuantity: (cartItemId: string) => void;
  decrementQuantity: (cartItemId: string) => void;
  getCartItems: () => CartItem[];
  clearCart: () => void;
  getCartSummary: () => {
    items: CartItem[];
    subtotal: number;
    totalPrice: number;
    totalDiscount: number;
    totalItems: number;
  };
}

// ✅ HELPER: Calculate totals from items
const calculateTotals = (items: CartItem[]) => {
  // Subtotal = sum of ORIGINAL prices
  const subtotal = items.reduce((sum, item) => {
    return sum + item.variant.price * item.quantity;
  }, 0);

  // Total Discount = difference between original and discounted price
  const totalDiscount = items.reduce((sum, item) => {
    if (item.variant.discountPrice) {
      const discount =
        (item.variant.price - item.variant.discountPrice) * item.quantity;
      return sum + discount;
    }
    return sum;
  }, 0);

  // Total Price = what customer actually pays (discounted)
  const totalPrice = items.reduce((sum, item) => {
    return sum + item.unitPrice * item.quantity;
  }, 0);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, totalPrice, totalDiscount, totalItems };
};

// ============ ZUSTAND STORE ============
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      totalPrice: 0,
      totalDiscount: 0,
      totalItems: 0,

      // ✅ ADD TO CART
      addToCart: (product: Omit<CartItem, "quantity">) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item._id === product._id
          );

          let newItems: CartItem[];

          if (existingItem) {
            newItems = state.items.map((item) =>
              item._id === product._id
                ? {
                    ...item,
                    quantity: Math.min(
                      item.quantity + 1,
                      product.variantStock
                    ),
                  }
                : item
            );
          } else {
            newItems = [...state.items, { ...product, quantity: 1 }];
          }

          return { items: newItems, ...calculateTotals(newItems) };
        });
      },

      // ✅ REMOVE FROM CART
      removeFromCart: (cartItemId: string) => {
        set((state) => {
          const newItems = state.items.filter(
            (item) => item._id !== cartItemId
          );
          return { items: newItems, ...calculateTotals(newItems) };
        });
      },

      // ✅ UPDATE QUANTITY
      updateQuantity: (cartItemId: string, quantity: number) => {
        set((state) => {
          let newItems: CartItem[];

          if (quantity <= 0) {
            newItems = state.items.filter((item) => item._id !== cartItemId);
          } else {
            newItems = state.items.map((item) =>
              item._id === cartItemId
                ? {
                    ...item,
                    quantity: Math.min(quantity, item.variantStock),
                  }
                : item
            );
          }

          return { items: newItems, ...calculateTotals(newItems) };
        });
      },

      // ✅ INCREMENT QUANTITY
      incrementQuantity: (cartItemId: string) => {
        set((state) => {
          const newItems = state.items.map((item) => {
            if (item._id === cartItemId) {
              return {
                ...item,
                quantity: Math.min(item.quantity + 1, item.variantStock),
              };
            }
            return item;
          });

          return { items: newItems, ...calculateTotals(newItems) };
        });
      },

      // ✅ DECREMENT QUANTITY
      decrementQuantity: (cartItemId: string) => {
        set((state) => {
          const newItems = state.items
            .map((item) => {
              if (item._id === cartItemId) {
                return {
                  ...item,
                  quantity: Math.max(item.quantity - 1, 0),
                };
              }
              return item;
            })
            .filter((item) => item.quantity > 0);

          return { items: newItems, ...calculateTotals(newItems) };
        });
      },

      // GET CART ITEMS
      getCartItems: () => {
        return get().items;
      },

      // CLEAR CART
      clearCart: () => {
        set({
          items: [],
          subtotal: 0,
          totalPrice: 0,
          totalDiscount: 0,
          totalItems: 0,
        });
      },

      // ✅ GET CART SUMMARY
      getCartSummary: () => {
        const state = get();
        return {
          items: state.items,
          subtotal: state.subtotal,
          totalPrice: state.totalPrice,
          totalDiscount: state.totalDiscount,
          totalItems: state.totalItems,
        };
      },
    }),
    {
      name: "cart-store",
    }
  )
);
