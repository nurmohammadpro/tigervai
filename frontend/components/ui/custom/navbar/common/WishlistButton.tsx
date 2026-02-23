"use client";

import { getUserInfo } from "@/actions/auth";
import { useCommonMutationApi } from "@/api-hook/mutation-common";
import { useWishHook } from "@/zustan-hook/wishListhook";
import { useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({
  productId,
  className = "",
}: WishlistButtonProps) {
  const query = useQueryClient();
  const { wishList, toggleWishList } = useWishHook((state) => state);
  const { mutate, isPending } = useCommonMutationApi({
    method: "POST",
    url: "/cart",
    successMessage: "updated to wishlist",
    onSuccess(data) {
      query.invalidateQueries({ queryKey: ["get-my-wish-list"], exact: false });
    },
  });

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();
    const user = await getUserInfo();
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }
    toggleWishList({ productId });
    console.log("Wishlist:", productId);
    mutate({ productId: productId, quantity: 1 });

    // TODO: Add your wishlist API call here
    // addToWishlist(productId);
  };

  return (
    <button
      onClick={handleWishlist}
      className={`w-8 h-8 sm:w-9 sm:h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110 z-10 ${className}`}
    >
      <Heart
        className={`w-4 h-4 transition-all duration-300 ${
          wishList.cartProducts.some((item) => item.productId === productId)
            ? "fill-red-500 text-red-500"
            : "text-gray-400 hover:text-red-500"
        }`}
      />
    </button>
  );
}
