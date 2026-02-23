"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { useAddProductStore } from "@/zustan-hook/addProductStore";

interface Variant {
  size: string;
  color: string;
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

interface VariantSelectorProps {
  variants: Variant[];
  onVariantSelect: (variant: Variant) => void;
  selectedVariant?: Variant;
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
}: VariantSelectorProps) {
  // Extract unique sizes and colors
  const sizes = Array.from(new Set(variants.map((v) => v.size)));
  const colors = Array.from(new Set(variants.map((v) => v.color)));

  const [selectedSize, setSelectedSize] = useState<string>(
    selectedVariant?.size || ""
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    selectedVariant?.color || ""
  );

  // Filter available colors based on selected size
  const availableColors = selectedSize
    ? Array.from(
        new Set(
          variants
            .filter((v) => v.size === selectedSize)
            .map((v) => v.color)
        )
      )
    : colors;

  // Filter available sizes based on selected color
  const availableSizes = selectedColor
    ? Array.from(
        new Set(
          variants
            .filter((v) => v.color === selectedColor)
            .map((v) => v.size)
        )
      )
    : sizes;

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    // Find first available variant with this size
    const variant = variants.find(
      (v) => v.size === size && (v.color === selectedColor || !selectedColor)
    );
    if (variant) {
      onVariantSelect(variant);
    }
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    // Find first available variant with this color
    const variant = variants.find(
      (v) => v.color === color && (v.size === selectedSize || !selectedSize)
    );
    if (variant) {
      onVariantSelect(variant);
    }
  };

  const getColorSwatch = (colorName: string): string => {
    return COLOR_MAP[colorName.toLowerCase()] || "#cccccc";
  };

  const isColorAvailable = (color: string) => {
    return selectedSize
      ? variants.some((v) => v.size === selectedSize && v.color === color)
      : true;
  };

  const isSizeAvailable = (size: string) => {
    return selectedColor
      ? variants.some((v) => v.color === selectedColor && v.size === size)
      : true;
  };

  return (
    <div className="space-y-4">
      {/* Compact Layout: Sizes on Top, Colors on Bottom */}
      <div
        className="p-4 rounded-lg border"
        style={{
          backgroundColor: "rgba(238, 74, 35, 0.02)",
          borderColor: "var(--palette-accent-3)",
        }}
      >
        {/* Top Row: Size Selector */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold" style={{ color: "var(--palette-text)" }}>
              Size
            </h4>
            <span className="text-xs" style={{ color: "var(--palette-accent-3)" }}>
              {selectedSize || "Select"}
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
                    relative px-4 py-2 rounded-md border-2 font-medium text-sm transition-all
                    ${!isAvailable ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                  `}
                  style={{
                    borderColor: isSelected ? "var(--palette-btn)" : "var(--palette-accent-3)",
                    backgroundColor: isSelected ? "var(--palette-btn)" : "transparent",
                    color: isSelected ? "#ffffff" : "var(--palette-text)",
                    minWidth: "60px",
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Row: Color Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold" style={{ color: "var(--palette-text)" }}>
              Color
            </h4>
            <span className="text-xs" style={{ color: "var(--palette-accent-3)" }}>
              {selectedColor || "Select"}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
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
                    relative w-10 h-10 rounded-full border-3 transition-all
                    ${!isAvailable ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:scale-110"}
                  `}
                  style={{
                    backgroundColor: swatchColor,
                    borderColor: isSelected ? "var(--palette-btn)" : "#e5e7eb",
                    boxShadow: isSelected ? `0 0 0 2px var(--palette-btn)` : "none",
                  }}
                  title={color}
                >
                  {isSelected && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ color: swatchColor === "#ffffff" ? "#000" : "#fff" }}
                    >
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Variant Info - Compact */}
      {selectedVariant && (
        <div className="flex items-center justify-between px-4 py-2 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color: "var(--palette-accent-3)" }}>
                {selectedVariant.size} / {selectedVariant.color}
              </span>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  backgroundColor: selectedVariant.stock > 0
                    ? "rgba(34, 197, 94, 0.1)"
                    : "rgba(239, 68, 68, 0.1)",
                  color: selectedVariant.stock > 0 ? "#22c55e" : "#ef4444",
                }}
              >
                {selectedVariant.stock > 0
                  ? `${selectedVariant.stock} in stock`
                  : "Out of stock"}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-base font-bold" style={{ color: "var(--palette-btn)" }}>
              ৳{selectedVariant.discountPrice || selectedVariant.price}
            </p>
            {selectedVariant.discountPrice && (
              <p
                className="text-xs line-through"
                style={{ color: "var(--palette-accent-3)" }}
              >
                ৳{selectedVariant.price}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
