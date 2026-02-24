"use client";

import { useState, useMemo } from "react";

// ============================================
// COMPREHENSIVE COLOR MAPPING FOR CLOTHING
// ============================================
const COLOR_MAP: Record<string, string> = {
  // REDS & PINKS
  "red": "#E53935",
  "crimson": "#DC143C",
  "scarlet": "#FF2400",
  "burgundy": "#800020",
  "maroon": "#800000",
  "wine": "#722F37",
  "ruby": "#E0115F",
  "cherry": "#DE3163",
  "rose": "#FF007F",
  "pink": "#FFC0CB",
  "hot pink": "#FF69B4",
  "fuchsia": "#FF00FF",
  "magenta": "#FF00FF",
  "coral": "#FF7F50",
  "salmon": "#FA8072",
  "peach": "#FFCBA4",
  "apricot": "#FBCEB1",
  "blush": "#DE5D83",
  "raspberry": "#E30B5D",
  "mauve": "#E0B0FF",
  "orchid": "#DA70D6",
  "plum": "#DDA0DD",
  "fandango": "#B53389",
  "raspberry rose": "#B3446C",

  // BLUES
  "blue": "#2196F3",
  "navy": "#000080",
  "navy blue": "#000080",
  "cobalt": "#0047AB",
  "royal blue": "#4169E1",
  "sky blue": "#87CEEB",
  "baby blue": "#89CFF0",
  "azure": "#007FFF",
  "cerulean": "#007BA7",
  "teal": "#008080",
  "turquoise": "#40E0D0",
  "cyan": "#00FFFF",
  "aquamarine": "#7FFFD4",
  "powder blue": "#B0E0E6",
  "steel blue": "#4682B4",
  "slate blue": "#6A5ACD",
  "indigo": "#4B0082",
  "periwinkle": "#CCCCFF",
  "denim": "#1560BD",
  "cornflower": "#6495ED",
  "sapphire": "#0F52BA",
  "midnight blue": "#191970",
  "prussian blue": "#003153",
  "ultramarine": "#3F00FF",
  "duck blue": "#007791",

  // GREENS
  "green": "#4CAF50",
  "lime": "#32CD32",
  "lime green": "#32CD32",
  "forest green": "#228B22",
  "hunter green": "#355E3B",
  "olive": "#808000",
  "olive green": "#808000",
  "army green": "#4B5320",
  "army": "#4B5320",
  "sage": "#9DC183",
  "sage green": "#9DC183",
  "mint": "#98FF98",
  "mint green": "#98FF98",
  "emerald": "#50C878",
  "jade": "#00A86B",
  "pear": "#D1E231",
  "chartreuse": "#DFFF00",
  "khaki": "#F0E68C",
  "avocado": "#568203",
  "pickle": "#657220",
  "moss green": "#8A9A5B",
  "fern": "#4F7942",
  "sea green": "#2E8B57",
  "pine": "#01796F",
  "bottle green": "#006A4E",
  "celadon": "#ACE1AF",
  "laurel green": "#A9BA9D",

  // YELLOWS & ORANGES
  "yellow": "#FFEB3B",
  "gold": "#FFD700",
  "golden": "#FFD700",
  "orange": "#FF9800",
  "tangerine": "#FF9966",
  "coral": "#FF7F50",
  "amber": "#FFBF00",
  "honey": "#EB9605",
  "mustard": "#FFDB58",
  "lemon": "#FFF44F",
  "canary": "#FFEF00",
  "cream": "#FFFDD0",
  "ivory": "#FFFFF0",
  "beige": "#F5F5DC",
  "tan": "#D2B48C",
  "camel": "#C19A6B",
  "sand": "#C2B280",
  "butterscotch": "#E6BE8A",
  "apricot": "#FBCEB1",
  "peach": "#FFCBA4",
  "burnt orange": "#CC5500",
  "pumpkin": "#FF7518",
  "carrot": "#ED9121",
  "rust": "#B7410E",
  "terracotta": "#E2725B",
  "bronze": "#CD7F32",
  "copper": "#B87333",
  "sienna": "#A0522D",

  // BROWNS
  "brown": "#964B00",
  "chocolate": "#7B3F00",
  "coffee": "#6F4E37",
  "espresso": "#3C2415",
  "mocha": "#784421",
  "cappuccino": "#B69D7E",
  "latte": "#E6D0B3",
  "caramel": "#C6A664",
  "toffee": "#CBAB66",
  "cinnamon": "#D2691E",
  "nutmeg": "#804000",
  "almond": "#EFDECD",
  "hazelnut": "#C6A664",
  "walnut": "#593318",
  "chestnut": "#954535",
  "auburn": "#A52A2A",
  "chestnut": "#954535",
  "mahogany": "#C04000",
  "sepia": "#704214",
  "taupe": "#483C32",
  "taupe brown": "#483C32",
  "fawn": "#E5AA70",
  "buff": "#F0DC82",
  "ecru": "#C2B280",
  "biscuit": "#FFE4C4",
  "cookie": "#A97142",
  "ginger": "#B06500",

  // GRAYS, BLACKS, WHITES
  "black": "#000000",
  "charcoal": "#36454F",
  "onyx": "#353839",
  "graphite": "#383D41",
  "gray": "#808080",
  "grey": "#808080",
  "silver": "#C0C0C0",
  "platinum": "#E5E4E2",
  "white": "#FFFFFF",
  "off white": "#FAF9F6",
  "off-white": "#FAF9F6",
  "ivory": "#FFFFF0",
  "pearl": "#FDEEF4",
  "cream": "#FFFDD0",
  "eggshell": "#F0EAD6",
  "bone": "#E3DAC9",
  "snow": "#FFFAFA",
  "milk": "#FDF5E6",

  // PURPLES
  "purple": "#9C27B0",
  "violet": "#EE82EE",
  "lavender": "#E6E6FA",
  "lilac": "#C8A2C8",
  "mauve": "#E0B0FF",
  "plum": "#DDA0DD",
  "orchid": "#DA70D6",
  "fuchsia": "#FF00FF",
  "magenta": "#FF00FF",
  "grape": "#6F2DA8",
  "eggplant": "#614051",
  "aubergine": "#3B1816",
  "amethyst": "#9966CC",
  "heliotrope": "#DF73FF",
  "wisteria": "#C9A0DC",
  "thistle": "#D8BFD8",

  // METALLICS
  "silver": "#C0C0C0",
  "gold": "#FFD700",
  "golden": "#FFD700",
  "bronze": "#CD7F32",
  "copper": "#B87333",
  "platinum": "#E5E4E2",
  "chrome": "#CFD8DC",
  "nickel": "#727472",
  "steel": "#71797E",
  "iron": "#434B4D",
  "tin": "#82898F",

  // MULTICOLOR & PATTERNS
  "multicolor": "#FF6B6B",
  "multi-color": "#FF6B6B",
  "multi color": "#FF6B6B",
  "rainbow": "#FF6B6B",
  "tie dye": "#FF6B6B",
  "tie-dye": "#FF6B6B",
  "camouflage": "#78866B",
  "camo": "#78866B",
  "leopard": "#D5A04A",
  "zebra": "#404040",
  "floral": "#FFB6C1",
  "paisley": "#8B4513",
  "striped": "#A9A9A9",
  "checkered": "#2F4F4F",
  "polka dot": "#FFC0CB",
  "animal print": "#8B4513",
  "geometric": "#708090",

  // OTHERS
  "clear": "#F5F5F5",
  "transparent": "#F5F5F5",
  "nude": "#E3BC9A",
  "skin": "#E3BC9A",
  "natural": "#E3BC9A",
  "taupe": "#483C32",
  "camel": "#C19A6B",
};

// Helper function to get color from color name
const getColorFromName = (colorName: string): string => {
  if (!colorName) return "#cccccc";
  const normalized = colorName.toLowerCase().trim();
  return COLOR_MAP[normalized] || "#cccccc";
};

// Helper function to determine if we should use white or black text based on background color
const getContrastColor = (hexColor: string): string => {
  // Remove hash if present
  const hex = hexColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate brightness using YIQ formula
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

  // Return black for light colors, white for dark colors
  return yiq >= 128 ? "#000000" : "#FFFFFF";
};

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
    () => Array.from(new Set(variants.map((v) => v.color).filter((c): c is string => Boolean(c)))),
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
          <div className="mb-3">
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
                  const colorValue = getColorFromName(color);

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
                          : "rgba(0, 0, 0, 0.15)",
                        backgroundColor: isSelected
                          ? "var(--palette-btn)"
                          : colorValue,
                        color: isSelected ? "#ffffff" : getContrastColor(colorValue),
                        minWidth: "45px",
                      }}
                      title={color}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Inline Stock Display - Between Color and Size */}
        {selectedVariant && selectedVariant.stock && (
          <div className="mb-3">
            <span className="text-xs font-semibold" style={{ color: selectedVariant.stock <= 3 ? "#ef4444" : selectedVariant.stock <= 5 ? "#f97316" : "#22c55e" }}>
              Stock: {selectedVariant.stock} {selectedVariant.stock === 1 ? "item" : "items"}
            </span>
          </div>
        )}

        {/* Row 2: Size */}
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
                        : "rgba(0, 0, 0, 0.15)",
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
          </div>
        </div>

        {/* Row 3: Price & Quantity */}
        {selectedVariant && (
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-200">
            {/* Price Info (Regular, Offer, Discount %) - Horizontal with Dynamic Total */}
            <div className="flex items-center gap-3">
              {getVariantPriceInfo(selectedVariant).hasDiscount ? (
                <>
                  {/* Original Price (strikethrough) - per unit */}
                  <span className="text-xs text-gray-500 line-through">
                    ৳{getVariantPriceInfo(selectedVariant).originalPrice.toLocaleString()} each
                  </span>
                  {/* Dynamic Total Price (Offer Price × Quantity) */}
                  <span className="text-lg font-bold" style={{ color: "var(--palette-text)" }}>
                    ৳{(getVariantPriceInfo(selectedVariant).currentPrice * quantity).toLocaleString()}
                  </span>
                  {/* Discount Percentage */}
                  <span className="text-xs font-semibold text-green-600">
                    Save {Math.round(((getVariantPriceInfo(selectedVariant).originalPrice - getVariantPriceInfo(selectedVariant).currentPrice) / getVariantPriceInfo(selectedVariant).originalPrice) * 100)}%
                  </span>
                </>
              ) : (
                // No Discount - Show Unit Price and Dynamic Total
                <>
                  <span className="text-sm text-gray-500">
                    ৳{getVariantPriceInfo(selectedVariant).currentPrice.toLocaleString()} each
                  </span>
                  <span className="text-lg font-bold" style={{ color: "var(--palette-text)" }}>
                    ৳{(getVariantPriceInfo(selectedVariant).currentPrice * quantity).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-0 border border-gray-300 rounded-full bg-white">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8 flex justify-center items-center font-bold text-gray-600 hover:bg-gray-100 rounded-l-full disabled:opacity-50 transition-colors"
              >
                <span className="text-lg">−</span>
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
                className="h-8 w-8 flex justify-center items-center font-bold text-gray-600 hover:bg-gray-100 rounded-r-full disabled:opacity-50 transition-colors"
              >
                <span className="text-lg">+</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
