"use client";

import React, { useState } from "react";
import { Product, ProductVariant } from "@/@types/fullProduct";

interface TyreVariantSelectorProps {
  product: Product;
  quantity: number;
  setQuantity: (qty: number) => void;
  selectedVariant: ProductVariant | undefined;
  setSelectedVariant: (variant: ProductVariant) => void;
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
}: TyreVariantSelectorProps) {
  const [variantQuantities, setVariantQuantities] = useState<VariantQuantity>({});
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

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
    // This could be stored in variant.recommended or derived from product data
    return variant.recommended || "";
  };

  // Get size specification
  const getSizeSpecification = (variant: ProductVariant) => {
    return variant.size || "";
  };

  // Handle variant selection
  const handleVariantSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    const cartItemId = `${product._id}|${variant.size}|${variant.color || ""}`;
    setSelectedVariantId(cartItemId);

    // Set quantity for this variant
    const currentQty = variantQuantities[cartItemId] || 1;
    setQuantity(currentQty);
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

    // Update the main quantity if this is the selected variant
    if (selectedVariantId === cartItemId) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="space-y-3">
      {product.variants?.map((variant, index) => {
        const priceInfo = getVariantPrice(variant);
        const cartItemId = `${product._id}|${variant.size}|${variant.color || ""}`;
        const currentQty = variantQuantities[cartItemId] || 0;
        const isSelected = selectedVariantId === cartItemId;
        const isOutOfStock = (variant.stock || 0) === 0;
        const compatibilityText = getCompatibilityText(variant);
        const sizeSpec = getSizeSpecification(variant);
        const variantImage = variant.image?.url || product.thumbnail?.url || product.images?.[0]?.url || "";

        return (
          <div
            key={`${variant.size}-${variant.color || ""}-${index}`}
            className={`bg-white rounded-lg border-2 transition-all cursor-pointer ${
              isSelected
                ? "border-black shadow-md"
                : "border-gray-200 hover:border-gray-300"
            } ${isOutOfStock ? "opacity-60" : ""}`}
            onClick={() => !isOutOfStock && handleVariantSelect(variant)}
          >
            <div className="flex p-3 gap-3">
              {/* Variant Image */}
              <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={variantImage}
                  alt={`${variant.size} tyre`}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Variant Details */}
              <div className="flex-1 min-w-0">
                {/* Variant Name/Size */}
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {variant.size}
                  {variant.color && ` - ${variant.color}`}
                </h3>

                {/* Compatibility Text */}
                {compatibilityText && (
                  <p className="text-xs text-gray-500 mb-1 line-clamp-1">
                    {compatibilityText}
                  </p>
                )}

                {/* Size Specification */}
                {sizeSpec && (
                  <p className="text-xs text-gray-600 mb-1">
                    Size: {sizeSpec}
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

                {/* Stock */}
                <p className="text-xs text-gray-500">
                  Stock: {variant.stock || 0}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="flex flex-col items-end justify-center">
                <div
                  className={`flex items-center gap-0 border-2 rounded-full ${
                    isSelected
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-gray-300 bg-white"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={isOutOfStock || currentQty <= 0}
                    onClick={() => handleQuantityChange(variant, currentQty - 1)}
                    className={`h-8 w-8 flex justify-center items-center font-bold text-sm rounded-l-full transition-colors ${
                      isOutOfStock || currentQty <= 0
                        ? "cursor-not-allowed opacity-50 bg-gray-200"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">
                    {currentQty}
                  </span>
                  <button
                    type="button"
                    disabled={isOutOfStock || currentQty >= (variant.stock || 0)}
                    onClick={() => handleQuantityChange(variant, currentQty + 1)}
                    className={`h-8 w-8 flex justify-center items-center font-bold text-sm rounded-r-full transition-colors ${
                      isOutOfStock || currentQty >= (variant.stock || 0)
                        ? "cursor-not-allowed opacity-50 bg-gray-200"
                        : isSelected
                          ? "bg-yellow-400 text-black hover:bg-yellow-500"
                          : "bg-gray-200 text-black hover:bg-gray-300"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
