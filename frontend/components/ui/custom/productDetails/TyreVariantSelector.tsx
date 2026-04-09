"use client";

import React from "react";
import { Product, ProductVariant } from "@/@types/fullProduct";

interface TyreVariantSelectorProps {
  product: Product;
  quantity: number;
  setQuantity: (qty: number) => void;
  selectedVariant: ProductVariant | undefined;
  setSelectedVariant: (variant: ProductVariant) => void;
  variantQuantities: VariantQuantity;
  setVariantQuantities: React.Dispatch<React.SetStateAction<VariantQuantity>>;
}

interface VariantQuantity {
  [cartItemId: string]: number;
}

export default function TyreVariantSelector({
  product,
  quantity,
  setQuantity,
  selectedVariant,
  setSelectedVariant,
  variantQuantities,
  setVariantQuantities,
}: TyreVariantSelectorProps) {
  // --- HELPER TO CALCULATE EFFECTIVE PRICE FOR A VARIANT ---
  const getVariantPrice = (variant: ProductVariant) => {
    // If variant has its own discountPrice, use it
    if (variant.discountPrice && variant.discountPrice > 0) {
      return {
        originalPrice: variant.price,
        currentPrice: variant.discountPrice,
        hasDiscount: true,
        discountPercentage: Math.round(
          ((variant.price - variant.discountPrice) / variant.price) * 100
        ),
      };
    }
    // If product has offerPrice, calculate proportional discount
    if (
      product.hasOffer &&
      product.offerPrice &&
      product.offerPrice > 0 &&
      product.price
    ) {
      const discountRatio = product.offerPrice / product.price;
      const discountedPrice = Math.round(variant.price * discountRatio);
      return {
        originalPrice: variant.price,
        currentPrice: discountedPrice,
        hasDiscount: discountedPrice < variant.price,
        discountPercentage: Math.round(
          ((variant.price - discountedPrice) / variant.price) * 100
        ),
      };
    }
    // No discount
    return {
      originalPrice: variant.price,
      currentPrice: variant.price,
      hasDiscount: false,
      discountPercentage: 0,
    };
  };

  // Get compatibility text (could be from description or variant data)
  const getCompatibilityText = (variant: ProductVariant) => {
    return variant.recommended || "";
  };

  // Get variant type (Front, Rear, or Combo) from size string
  const getVariantType = (variant: ProductVariant) => {
    const size = variant.size || "";
    const parts = size.split(" - ");
    const typePart = parts[0]?.toLowerCase();
    if (typePart === "front" || typePart === "rear" || typePart === "combo") {
      return typePart.charAt(0).toUpperCase() + typePart.slice(1);
    }
    return "Standard";
  };

  // Get size specification (actual size without type prefix)
  const getSizeSpecification = (variant: ProductVariant) => {
    const size = variant.size || "";
    const parts = size.split(" - ");
    const typePart = parts[0]?.toLowerCase();
    if (typePart === "front" || typePart === "rear" || typePart === "combo") {
      return parts.slice(1).join(" - ");
    }
    return size;
  };

  // Handle quantity change for a variant
  const handleQuantityChange = (
    variant: ProductVariant,
    newQuantity: number
  ) => {
    const cartItemId = `${product._id}|${variant.size}|${variant.color || ""}`;

    if (newQuantity < 0) return;
    if (newQuantity > (variant.stock || 0)) {
      newQuantity = variant.stock || 0;
    }

    setVariantQuantities((prev) => ({
      ...prev,
      [cartItemId]: newQuantity,
    }));
  };

  return (
    <div className="space-y-3">
      {product.variants?.map((variant, index) => {
        const priceInfo = getVariantPrice(variant);
        const cartItemId = `${product._id}|${variant.size}|${variant.color || ""}`;
        const currentQty = variantQuantities[cartItemId] || 0;
        const isOutOfStock = (variant.stock || 0) === 0;
        const compatibilityText = getCompatibilityText(variant);
        const variantType = getVariantType(variant);
        const sizeSpec = getSizeSpecification(variant);
        const variantImage = variant.image?.url || product.thumbnail?.url || product.images?.[0]?.url || "";

        return (
          <div
            key={`${variant.size}-${variant.color || ""}-${index}`}
            className={`bg-white rounded-lg border-2 transition-all ${
              isOutOfStock ? "opacity-60" : "border-gray-200"
            }`}
          >
            <div className="flex p-3 gap-3">
              {/* Variant Image */}
              <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={variantImage}
                  alt={`${variantType} ${sizeSpec} tyre`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Variant Details */}
              <div className="flex-1 min-w-0">
                {/* Size with Type - Combined display */}
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {sizeSpec && `Size: ${sizeSpec}`}
                  {variantType !== "Standard" && ` ${variantType} Tyre`}
                </h3>

                {/* Compatibility Text */}
                {compatibilityText && (
                  <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                    {compatibilityText}
                  </p>
                )}

                {/* Price */}
                <div className="flex items-center gap-2 mb-1">
                  {priceInfo.hasDiscount ? (
                    <>
                      <span className="text-xs text-gray-400 line-through">
                        Tk {priceInfo.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        Tk {priceInfo.currentPrice.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                        {priceInfo.discountPercentage}% off
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-gray-900">
                      Tk {priceInfo.currentPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Stock and Quantity Selector */}
                <div className="flex items-center justify-between gap-2 mt-2">
                  <p className="text-xs text-gray-500">
                    Stock: {variant.stock || 0}
                  </p>

                  {/* Quantity Selector */}
                  <div
                    className="flex items-center gap-0 border-2 border-black rounded-full bg-white"
                    style={{
                      opacity: isOutOfStock ? 0.5 : 1,
                      pointerEvents: isOutOfStock ? "none" : "auto",
                    }}
                  >
                    <button
                      type="button"
                      disabled={isOutOfStock || currentQty <= 0}
                      onClick={() => handleQuantityChange(variant, currentQty - 1)}
                      className="h-10 w-12 py-4 flex justify-center items-center font-bold text-gray-600 bg-red-200 hover:bg-red-500 rounded-l-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="text-xl font-semibold">−</span>
                    </button>
                    <span className="w-10 px-8 md:px-12 text-center text-foreground text-sm font-semibold">
                      {currentQty}
                    </span>
                    <button
                      type="button"
                      disabled={isOutOfStock || currentQty >= (variant.stock || 0)}
                      onClick={() => handleQuantityChange(variant, currentQty + 1)}
                      className="h-10 w-12 py-4 flex justify-center items-center font-bold text-white rounded-r-full disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      style={{
                        backgroundColor:
                          currentQty > 0 ? "var(--palette-btn)" : "#fca5a5",
                      }}
                    >
                      <span className="text-xl font-semibold">+</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
