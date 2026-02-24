"use client";

import React, { useState, useMemo } from "react";

interface Variant {
  size: string;
  color?: string;
  price: number;
  stock?: number;
  discountPrice?: number;
  sku?: string;
  image?: {
    url: string;
    key: string;
    id: string;
  };
}

interface ProductInfo {
  hasOffer: boolean;
  offerPrice?: number;
  price: number;
}

interface VariantSelectorProps {
  variants: Variant[];
  onVariantSelect: (variant: Variant) => void;
  selectedVariant?: Variant;
  productInfo?: ProductInfo;
  quantity: number;
  setQuantity: (qty: number) => void;
}

export default function VariantSelector({
  variants,
  onVariantSelect,
  selectedVariant,
  productInfo,
  quantity,
  setQuantity,
}: VariantSelectorProps) {

  // Helper function to calculate price for a variant
  const getVariantPriceInfo = (variant: Variant) => {
    // If variant has its own discountPrice, use it
    if (variant.discountPrice && variant.discountPrice > 0) {
      return {
        originalPrice: variant.price,
        currentPrice: variant.discountPrice,
        hasDiscount: true,
      };
    }
    // If product has offerPrice, calculate proportional discount
    if (productInfo?.hasOffer && productInfo.offerPrice && productInfo.offerPrice > 0 && productInfo.price) {
      const discountRatio = productInfo.offerPrice / productInfo.price;
      const discountedPrice = Math.round(variant.price * discountRatio);
      return {
        originalPrice: variant.price,
        currentPrice: discountedPrice,
        hasDiscount: discountedPrice < variant.price,
      };
    }
    // No discount
    return {
      originalPrice: variant.price,
      currentPrice: variant.price,
      hasDiscount: false,
    };
  };
  // Extract unique sizes and colors (only include non-undefined colors)
  const sizes = Array.from(new Set(variants.map((v) => v.size)));
  const colors = useMemo(
    () => Array.from(new Set(variants.map((v) => v.color).filter(Boolean))),
    [variants]
  );

  // Determine if this product has color variants
  const hasColorVariants = colors.length > 0;

  const [selectedSize, setSelectedSize] = useState<string>(
    selectedVariant?.size || ""
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    selectedVariant?.color || ""
  );

  // Filter available colors based on selected size
  const availableColors = useMemo(() => {
    if (!selectedSize || !hasColorVariants) return colors;

    return Array.from(
      new Set(
        variants
          .filter((v) => v.size === selectedSize && v.color)
          .map((v) => v.color)
      )
    );
  }, [selectedSize, variants, colors, hasColorVariants]);

  // Filter available sizes based on selected color (only if product has colors)
  const availableSizes = useMemo(() => {
    if (!hasColorVariants || !selectedColor) return sizes;

    return Array.from(
      new Set(
        variants
          .filter((v) => v.color === selectedColor)
          .map((v) => v.size)
      )
    );
  }, [selectedColor, variants, sizes, hasColorVariants]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);

    // Find the appropriate variant based on whether colors are used
    let variant;
    if (hasColorVariants && selectedColor) {
      // Try to match both size and color first
      variant = variants.find(
        (v) => v.size === size && v.color === selectedColor
      );
      // Fall back to first variant with this size
      if (!variant) {
        variant = variants.find((v) => v.size === size);
      }
    } else {
      // No colors, just find by size
      variant = variants.find((v) => v.size === size);
    }

    if (variant) {
      onVariantSelect(variant);
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);

    // Find variant with both size and color
    const variant = variants.find(
      (v) => v.color === color && v.size === selectedSize
    );
    if (variant) {
      onVariantSelect(variant);
    }
  };

  const isColorAvailable = (color: string) => {
    if (!selectedSize) return true;
    return variants.some((v) => v.size === selectedSize && v.color === color);
  };

  const isSizeAvailable = (size: string) => {
    // If no colors, all sizes are available
    if (!hasColorVariants || !selectedColor) return true;
    return variants.some((v) => v.color === selectedColor && v.size === size);
  };

  return (
    <div className="space-y-4">
      {/* Compact Layout: Sizes and Quantity in one row, Colors below */}
      <div
        className="p-4 rounded-xl border-2"
        style={{
          backgroundColor: "rgba(238, 74, 35, 0.04)",
          borderColor: "var(--palette-accent-3)",
        }}
      >
        {/* Row 1: Color Variant (Top) - Only if product has color variants */}
        {hasColorVariants && (
          <div className="mb-4">
            <div className="flex items-center gap-3">
              <h4
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: "var(--palette-text)" }}
              >
                Color:
              </h4>
              <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                  const isAvailable = isColorAvailable(color);
                  const isSelected = selectedColor === color;

                  return (
                    <button
                      key={color}
                      onClick={() => isAvailable && handleColorSelect(color)}
                      disabled={!isAvailable}
                      className={`
                        relative h-9 px-3 rounded-lg border-2 font-bold text-sm transition-all duration-200
                        ${
                          !isAvailable
                            ? "opacity-20 cursor-not-allowed grayscale"
                            : "cursor-pointer hover:scale-105 active:scale-95"
                        }
                      `}
                      style={{
                        borderColor: isSelected
                          ? "var(--palette-btn)"
                          : "var(--palette-accent-3)",
                        backgroundColor: isSelected
                          ? "var(--palette-btn)"
                          : "#ffffff",
                        color: isSelected ? "#ffffff" : "var(--palette-text)",
                        minWidth: "45px",
                      }}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Row 2: Size with Inline Stock Display */}
        <div className="mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h4
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: "var(--palette-text)" }}
            >
              Size:
            </h4>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => {
                const isAvailable = isSizeAvailable(size);
                const isSelected = selectedSize === size;
                // Get stock for this variant
                const variant = variants.find(
                  (v) => v.size === size && (!hasColorVariants || v.color === selectedColor)
                );
                const stock = variant?.stock || 0;

                return (
                  <button
                    key={size}
                    onClick={() => isAvailable && handleSizeSelect(size)}
                    disabled={!isAvailable}
                    className={`
                        relative h-9 px-3 rounded-lg border-2 font-bold text-sm transition-all duration-200
                        ${
                          !isAvailable
                            ? "opacity-20 cursor-not-allowed grayscale"
                            : "cursor-pointer hover:scale-105 active:scale-95"
                        }
                      `}
                    style={{
                      borderColor: isSelected
                        ? "var(--palette-btn)"
                        : "var(--palette-accent-3)",
                      backgroundColor: isSelected
                        ? "var(--palette-btn)"
                        : "#ffffff",
                      color: isSelected ? "#ffffff" : "var(--palette-text)",
                      minWidth: "45px",
                    }}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
            {/* Inline Stock Display */}
            {selectedVariant && (
              <span className="text-xs font-semibold" style={{ color: selectedVariant.stock <= 3 ? "#ef4444" : selectedVariant.stock <= 5 ? "#f97316" : "#22c55e" }}>
                Stock: {selectedVariant.stock} {selectedVariant.stock === 1 ? "item" : "items"}
              </span>
            )}
          </div>
        </div>

        {/* Row 3: Price & Quantity */}
        {selectedVariant && (
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-200">
            {/* Price Info (Regular, Offer, Discount %) */}
            <div className="flex flex-col">
              {getVariantPriceInfo(selectedVariant).hasDiscount ? (
                <>
                  {/* Original Price (strikethrough) */}
                  <span className="text-sm text-gray-500 line-through">
                    ৳{getVariantPriceInfo(selectedVariant).originalPrice.toLocaleString()}
                  </span>
                  {/* Offer Price */}
                  <span className="text-lg font-bold" style={{ color: "var(--palette-text)" }}>
                    ৳{getVariantPriceInfo(selectedVariant).currentPrice.toLocaleString()}
                  </span>
                  {/* Discount Percentage */}
                  <span className="text-xs font-semibold text-green-600">
                    Save {Math.round(((getVariantPriceInfo(selectedVariant).originalPrice - getVariantPriceInfo(selectedVariant).currentPrice) / getVariantPriceInfo(selectedVariant).originalPrice) * 100)}%
                  </span>
                </>
              ) : (
                // No Discount - Just Show Price
                <span className="text-lg font-bold" style={{ color: "var(--palette-text)" }}>
                  ৳{getVariantPriceInfo(selectedVariant).currentPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-0 border border-gray-300 rounded-full bg-white">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8 flex justify-center items-center text-gray-600 hover:bg-gray-100 rounded-l-full disabled:opacity-50 transition-colors"
              >
                <span className="text-lg font-bold">-</span>
              </button>
              <input
                type="text"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-10 text-center border-none outline-none text-foreground text-sm font-semibold"
                min={1}
                max={selectedVariant?.stock || 99}
              />
              <button
                type="button"
                disabled={quantity >= (selectedVariant?.stock || 99)}
                onClick={() =>
                  setQuantity(
                    Math.min(selectedVariant?.stock || 99, quantity + 1)
                  )
                }
                className="h-8 w-8 flex justify-center items-center text-gray-600 hover:bg-gray-100 rounded-r-full disabled:opacity-50 transition-colors"
              >
                <span className="text-lg font-bold">+</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
