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
    <div className="space-y-6">
      {/* Size Selector */}
      <div>
        <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--palette-text)" }}>
          Size: <span className="font-normal">{selectedSize || "Select a size"}</span>
        </h4>
        <div className="flex flex-wrap gap-3">
          {sizes.map((size) => {
            const isAvailable = isSizeAvailable(size);
            const isSelected = selectedSize === size;

            return (
              <button
                key={size}
                onClick={() => isAvailable && handleSizeSelect(size)}
                disabled={!isAvailable}
                className={`
                  relative px-6 py-3 rounded-lg border-2 font-medium transition-all
                  ${!isAvailable ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
                  ${
                    isSelected
                      ? "border-orange-500 bg-orange-50 text-orange-600"
                      : "border-gray-300 hover:border-gray-400"
                  }
                `}
                style={{
                  borderColor: isSelected ? "var(--palette-btn)" : undefined,
                  backgroundColor: isSelected ? "rgba(238, 74, 35, 0.1)" : undefined,
                  color: isSelected ? "var(--palette-btn)" : "var(--palette-text)",
                }}
              >
                <span className="text-sm">{size}</span>
                {isSelected && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ color: "var(--palette-btn)" }}
                  >
                    <div
                      className="absolute top-1 right-1 w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--palette-btn)" }}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Selector */}
      <div>
        <h4 className="text-sm font-semibold mb-3" style={{ color: "var(--palette-text)" }}>
          Color: <span className="font-normal">{selectedColor || "Select a color"}</span>
        </h4>
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
                  relative w-12 h-12 rounded-full border-3 transition-all
                  ${!isAvailable ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:scale-110"}
                  ${isSelected ? "ring-4 ring-offset-2" : ""}
                `}
                style={{
                  backgroundColor: swatchColor,
                  borderColor: isSelected ? "var(--palette-btn)" : "#e5e7eb",
                  ringColor: isSelected ? "var(--palette-btn)" : undefined,
                }}
                title={color}
              >
                {isSelected && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ color: swatchColor === "#ffffff" ? "#000" : "#fff" }}
                  >
                    <Check size={16} strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Variant Info */}
      {selectedVariant && (
        <div
          className="p-4 rounded-lg border"
          style={{
            backgroundColor: "rgba(238, 74, 35, 0.05)",
            borderColor: "var(--palette-accent-3)",
          }}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm" style={{ color: "var(--palette-accent-3)" }}>
                Selected: {selectedVariant.size} - {selectedVariant.color}
              </p>
              <p className="text-xs mt-1" style={{ color: "var(--palette-accent-3)" }}>
                Stock: {selectedVariant.stock} available
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold" style={{ color: "var(--palette-btn)" }}>
                ৳{selectedVariant.discountPrice || selectedVariant.price}
              </p>
              {selectedVariant.discountPrice && (
                <p
                  className="text-sm line-through"
                  style={{ color: "var(--palette-accent-3)" }}
                >
                  ৳{selectedVariant.price}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Out of Stock Message */}
      {selectedVariant && selectedVariant.stock === 0 && (
        <div
          className="p-3 rounded-lg text-center text-sm font-medium"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444",
          }}
        >
          This variant is currently out of stock
        </div>
      )}
    </div>
  );
}
