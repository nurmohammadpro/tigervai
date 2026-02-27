"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import Link from "next/link";
import { WishlistButton } from "./WishlistButton";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import { viewcontentEvent } from "@/lib/google-tag-manager";
import { getUserInfo } from "@/actions/auth";
import { Product } from "@/@types/short-product";
import { viewContentServerEvent } from "@/actions/metaEvent";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: Product;
  variant?: "default" | "compact" | "featured";
}

export function ProductCard({
  product,
  variant = "default",
}: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const router = useRouter();

  // ✅ Use price range fields for consistent display
  // For backward compatibility, fall back to old price/offerPrice fields
  const minPrice = product?.minPrice ?? product?.offerPrice ?? product?.price ?? 0;
  const maxPrice = product?.maxPrice ?? product?.offerPrice ?? product?.price ?? 0;
  const minOriginalPrice = product?.minOriginalPrice ?? product?.price ?? 0;
  const maxOriginalPrice = product?.maxOriginalPrice ?? product?.price ?? 0;
  const hasDiscount = product?.hasOffer && minPrice < minOriginalPrice;

  // Calculate discount percentage from price range
  const discount = hasDiscount && minOriginalPrice > 0
    ? Math.round(((minOriginalPrice - minPrice) / minOriginalPrice) * 100)
    : 0;

  const isOutOfStock = product?.stock === 0;
  const handlPushToProduct = async (slug: string) => {
    if (isOutOfStock) return;
    const eventId = uuidv4();
    const getUser = await getUserInfo();

    viewcontentEvent({
      event_id: eventId,
      userId: getUser?.id,
      userName: getUser?.name,
      email: getUser?.email,
      ...product,
    });
    viewContentServerEvent({
      event_id: eventId,
      userId: getUser?.id,
      userName: getUser?.name,
      email: getUser?.email,
      ...product,
    });
    router.push(`/product-details/${slug}`);
  };

  if (variant === "default") {
    return (
      <Card
        onClick={() => handlPushToProduct(product.slug)}
        className="group relative border pt-0 rounded-lg p-0 pb-1.5  overflow-hidden bg-white transition-all shadow-none duration-300 hover:border-gray-300 gap-0.5 flex flex-col"
      >
        {/* 1:1 Square Image Container */}
        <div className="relative w-full aspect-square  group bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0">
          <img
            src={
              imageError
                ? "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop"
                : product?.thumbnail
            }
            onError={() => setImageError(true)}
            alt={product?.name}
            className="w-full h-full   group-hover:scale-105 transition-transform duration-300"
          />

          {/* Wishlist Button */}
          <div className="absolute top-2 right-2">
            <WishlistButton productId={product._id} />
          </div>
          {product?.hasOffer && discount > 0 && (
            <Badge className=" absolute bottom-0 text-[9px] right-0 bg-[#ffff00]  text-gray-900 border-0  sm:text-xs px-1 md:px-2  font-bold ">
              {discount}% OFF
            </Badge>
          )}

          {/* Stock Badge */}
          <div className="absolute bottom-0 hidden left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 sm:p-3">
            {product?.stock > 0 ? (
              <p className="text-green-400 text-[10px] sm:text-xs font-semibold">
                {product?.stock} in stock
              </p>
            ) : (
              <p className="text-red-400 text-[10px] sm:text-xs font-semibold">
                Out of Stock
              </p>
            )}
          </div>

          <div className="absolute inset-0  flex opacity-0 group-hover:opacity-100 items-center justify-center z-20 transition-opacity duration-700">
            <span className="text-white font-bold text-sm bg-red-500 px-4 py-2 rounded-lg">
              Quick view
            </span>
          </div>
          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center z-20">
              <span className="text-white font-bold text-sm bg-red-500 px-4 py-2 rounded-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Card Content */}
        <CardContent className="p-1 px-2 flex flex-col flex-grow">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base line-clamp-2 group-hover:text-palette-btn transition-colors leading-tight ">
            {product?.name}
          </h3>

          {/* Price Section */}
          <div className="">
            <div className="flex items-baseline gap-2 flex-wrap">
              {hasDiscount && (
                <span className="text-xs sm:text-sm text-muted-foreground line-through">
                  TK {minOriginalPrice.toLocaleString()}
                  {minOriginalPrice !== maxOriginalPrice &&
                    ` - ${maxOriginalPrice.toLocaleString()}`}
                </span>
              )}
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-palette-btn">
                <span>TK </span>
                {minPrice.toLocaleString()}
                {minPrice !== maxPrice && ` - ${maxPrice.toLocaleString()}`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <Card className="group relative border border-gray-200 rounded-lg overflow-hidden bg-white transition-all duration-300 hover:shadow-md flex flex-col gap-1">
        <Link
          href={isOutOfStock ? "#" : `/product-details/${product?.slug}`}
          className={isOutOfStock ? "pointer-events-none opacity-60" : ""}
        >
          <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden flex-shrink-0">
            <img
              src={
                imageError
                  ? "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop"
                  : product?.thumbnail
              }
              onError={() => setImageError(true)}
              alt={product?.name}
              className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            />

            {product?.hasOffer && discount > 0 && (
              <Badge className="absolute top-1.5 left-1.5 bg-purple-600 text-white text-[9px] sm:text-[10px] px-1.5 py-0.5 font-bold">
                {discount}%
              </Badge>
            )}

            {/* Stock on image */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
              <p
                className={`text-[9px] sm:text-[10px] font-semibold ${
                  product?.stock > 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {product?.stock > 0
                  ? `${product?.stock} in stock`
                  : "Out of Stock"}
              </p>
            </div>
          </div>

          <CardContent className="px-2 sm:px-2.5 flex flex-col flex-grow">
            {/* Product Name */}
            <h4 className="font-medium text-gray-900 text-[11px] sm:text-xs md:text-sm line-clamp-2 group-hover:text-purple-600 transition-colors leading-tight h-8 sm:h-9 mb-1.5">
              {product?.name}
            </h4>

            {/* Price */}
            <div className="mt-auto flex items-baseline gap-1.5 flex-wrap">
              <p className="text-red-500 font-bold text-xs sm:text-sm md:text-base">
                ৳{minPrice.toLocaleString()}
                {minPrice !== maxPrice && ` - ${maxPrice.toLocaleString()}`}
              </p>
              {hasDiscount && (
                <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                  ৳{minOriginalPrice.toLocaleString()}
                  {minOriginalPrice !== maxOriginalPrice &&
                    ` - ${maxOriginalPrice.toLocaleString()}`}
                </span>
              )}
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  return null;
}
