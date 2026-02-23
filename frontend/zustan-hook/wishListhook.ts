import { CartData } from "@/@types/wishlist";
import { create } from "zustand";

interface WishState {
  wishList: CartData;
  setWishList: (payload: CartData) => void;
  toggleWishList: (payload: { productId: string }) => void; // ✅ Renamed for clarity
}

export const useWishHook = create<WishState>((set) => ({
  wishList: { _id: "", cartProducts: [] },

  // Set entire wishlist (from API)
  setWishList: (payload) => set({ wishList: payload }),

  // ✅ Toggle: Remove if exists, Add if doesn't exist
  toggleWishList: (payload) =>
    set((state) => {
      const exists = state.wishList.cartProducts.some(
        (item) => item.productId === payload.productId
      );

      if (exists) {
        // Remove from wishlist
        return {
          wishList: {
            ...state.wishList,
            cartProducts: state.wishList.cartProducts.filter(
              (item) => item.productId !== payload.productId
            ),
          },
        };
      } else {
        // Add to wishlist
        return {
          wishList: {
            ...state.wishList,
            cartProducts: [
              ...state.wishList.cartProducts,
              { productId: payload.productId, quantity: 1 },
            ],
          },
        };
      }
    }),
}));
