"use client";

import React, { useState, useMemo } from "react";
import { Check } from "lucide-react";

interface Variant {
  size: string;
  color?: string;
  price: number;
  stock: number;
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
}

// Color mapping for visual swatches
const COLOR_MAP: Record<string, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#22c55e",
  black: "#000000",
  white: "#ffffff",
  yellow: "#eab308",
  orange: "#f97316",
  purple: "#a855f7",
  pink: "#ec4899",
  gray: "#6b7280",
  brown: "#92400e",
  navy: "#1e3a8a",
  beige: "#f5f5dc",
  cream: "#fffdd0",
  maroon: "#800000",
};

export default function VariantSelector({
  variants,
  onVariantSelect,
  selectedVariant,
  productInfo,
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

  const getColorSwatch = (colorName: string): string => {
    return COLOR_MAP[colorName.toLowerCase()] || "#cccccc";
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
      {/* Compact Layout: Sizes on Top, Colors on Bottom (if applicable) */}
      <div
        className="p-4 rounded-xl border-2"
        style={{
          backgroundColor: "rgba(238, 74, 35, 0.04)",
          borderColor: "var(--palette-accent-3)",
        }}
      >
        {/* Top Row: Size Selector */}
        <div className={hasColorVariants ? "mb-4" : ""}>
          <div className="flex items-center justify-between mb-3 px-1">
            <h4
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: "var(--palette-text)" }}
            >
              Size
            </h4>
            <span
              className="text-xs font-semibold uppercase tracking-wide opacity-70"
              style={{ color: "var(--palette-text)" }}
            >
              {selectedSize ? "Selected" : "Select"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const isAvailable = isSizeAvailable(size);
              const isSelected = selectedSize === size;

              return (
                <button
                  key={size}
                  onClick={() => isAvailable && handleSizeSelect(size)}
                  disabled={!isAvailable}
                  className={`
                    relative h-10 px-4 rounded-lg border-2 font-bold text-sm transition-all duration-200
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
                    minWidth: "50px",
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Row: Color Selector - Only if product has color variants */}
        {hasColorVariants && (
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <h4
                className="text-sm font-bold uppercase tracking-wider"
                style={{ color: "var(--palette-text)" }}
              >
                Color
              </h4>
              <span
                className="text-xs font-semibold uppercase tracking-wide opacity-70"
                style={{ color: "var(--palette-text)" }}
              >
                {selectedColor ? "Selected" : "Select"}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {colors.map((color) => {
                const isAvailable = isColorAvailable(color);
                const isSelected = selectedColor === color;
                const swatchColor = getColorSwatch(color);

                return (
                  <button
                    key={color}
                    onClick={() => isAvailable && handleColorSelect(color)}
                    disabled={!isAvailable}
                    className={`
                      relative w-10 h-10 rounded-full border-2 transition-all duration-200
                      ${
                        !isAvailable
                          ? "opacity-20 cursor-not-allowed grayscale"
                          : "cursor-pointer hover:scale-110 active:scale-90"
                      }
                    `}
                    style={{
                      backgroundColor: swatchColor,
                      borderColor: isSelected
                        ? "var(--palette-btn)"
                        : "transparent",
                      boxShadow: isSelected
                        ? `0 0 0 2px #fff, 0 0 0 4px var(--palette-btn)`
                        : "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                    title={color}
                  >
                    {isSelected && (
                      <div
                        className="absolute inset-0 flex items-center justify-center animate-in zoom-in duration-200"
                        style={{
                          color: swatchColor === "#ffffff" ? "#000" : "#fff",
                        }}
                      >
                        <Check size={16} strokeWidth={4} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Selected Variant Info - Compact Smart Stock Badge */}
      {selectedVariant && (
        <div
          className="flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
          style={{
            borderColor: selectedVariant.stock > 0 ? "#22c55e" : "#ef4444",
            backgroundColor:
              selectedVariant.stock > 0
                ? "rgba(34, 197, 94, 0.05)"
                : "rgba(239, 68, 68, 0.05)",
          }}
        >
          <div className="flex flex-col gap-0.5">
            <p className="text-xs font-bold uppercase tracking-wide opacity-60">
              {selectedVariant.size}
              {selectedVariant.color && ` / ${selectedVariant.color}`}
            </p>
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full animate-pulse`}
                style={{
                  backgroundColor:
                    selectedVariant.stock > 0 ? "#22c55e" : "#ef4444",
                }}
              />
              <span
                className="text-sm font-bold"
                style={{
                  color: selectedVariant.stock > 0 ? "#15803d" : "#b91c1c",
                }}
              >
                {selectedVariant.stock > 0
                  ? `${selectedVariant.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>
          </div>
          <div className="text-right">
            {(() => {
              const priceInfo = getVariantPriceInfo(selectedVariant);
              return (
                <>
                  {priceInfo.hasDiscount && priceInfo.originalPrice !== priceInfo.currentPrice && (
                    <p className="text-base line-through opacity-60 font-bold">
                      ৳{priceInfo.originalPrice.toLocaleString()}
                    </p>
                  )}
                  <p
                    className="text-lg font-black"
                    style={{ color: "var(--palette-text)" }}
                  >
                    ৳{priceInfo.currentPrice.toLocaleString()}
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
