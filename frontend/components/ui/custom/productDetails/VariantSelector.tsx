"use client";

import { useState, useMemo } from "react";

// ============================================
// COMPREHENSIVE COLOR MAPPING FOR CLOTHING
// ============================================
const COLOR_MAP: Record<string, string> = {
  // REDS & PINKS
  red: "#DC143C",
  "bright red": "#FF0000",
  "dark red": "#8B0000",
  "light red": "#FF6347",
  crimson: "#DC143C",
  scarlet: "#FF2400",
  vermilion: "#E34234",
  ruby: "#E0115F",
  burgundy: "#800020",
  maroon: "#800000",
  wine: "#722F37",
  merlot: "#722F37",
  cherry: "#DE3163",
  "cherry red": "#D2042D",
  rose: "#FF007F",
  "rose red": "#FF0040",
  pink: "#FFC0CB",
  "hot pink": "#FF69B4",
  "deep pink": "#FF1493",
  "light pink": "#FFB6C1",
  "baby pink": "#F4C2C2",
  "blush pink": "#DE5D83",
  carnation: "#FFA6C9",
  fuchsia: "#FF00FF",
  magenta: "#FF00FF",
  "shocking pink": "#FC0FC0",
  coral: "#FF7F50",
  "light coral": "#F08080",
  salmon: "#FA8072",
  "dark salmon": "#E9967A",
  peach: "#FFCBA4",
  "peach puff": "#FFDAB9",
  apricot: "#FBCEB1",
  melon: "#FEBAAD",
  raspberry: "#E30B5D",
  "dark raspberry": "#872657",
  mauve: "#E0B0FF",
  orchid: "#DA70D6",
  "dark orchid": "#9932CC",
  plum: "#DDA0DD",
  "wild orchid": "#D65982",
  fandango: "#B53389",
  "raspberry rose": "#B3446C",
  "burgundy rose": "#9E1B32",
  "apple blossom": "#AF4445",
  cardinal: "#C41E3A",
  carmine: "#960018",
  cerise: "#DE3163",
  "fire engine red": "#CE2029",
  "indian red": "#CD5C5C",
  "persian red": "#CC3333",
  rosewood: "#65000B",

  // BLUES
  blue: "#0066CC",
  "bright blue": "#0074D9",
  "dark blue": "#00008B",
  "light blue": "#ADD8E6",
  "pale blue": "#B0E0E6",
  "powder blue": "#B0E0E6",
  "sky blue": "#87CEEB",
  "baby blue": "#89CFF0",
  azure: "#007FFF",
  "azure blue": "#007FFF",
  cerulean: "#007BA7",
  "cerulean blue": "#2A52BE",
  navy: "#000080",
  "navy blue": "#000080",
  "midnight blue": "#191970",
  "royal blue": "#4169E1",
  cobalt: "#0047AB",
  "cobalt blue": "#0047AB",
  "steel blue": "#4682B4",
  "slate blue": "#6A5ACD",
  "light slate blue": "#8470FF",
  "dark slate blue": "#483D8B",
  cornflower: "#6495ED",
  "cornflower blue": "#6495ED",
  sapphire: "#0F52BA",
  "sapphire blue": "#0F52BA",
  indigo: "#4B0082",
  denim: "#1560BD",
  jean: "#3F629D",
  teal: "#008080",
  "dark teal": "#004D40",
  turquoise: "#40E0D0",
  "dark turquoise": "#00CED1",
  cyan: "#00FFFF",
  aquamarine: "#7FFFD4",
  "pale turquoise": "#AFEEEE",
  paleturquoise: "#AFEEEE",
  "prussian blue": "#003153",
  ultramarine: "#3F00FF",
  "duke blue": "#003087",
  "duck blue": "#007791",
  "olympic blue": "#0077C0",
  "columbia blue": "#9BDDFF",
  "ice blue": "#99D9EA",
  "arctic blue": "#0077BE",
  "pacific blue": "#1CA9C9",
  "ocean blue": "#4F97A3",
  "mediterranean blue": "#006994",
  "carolina blue": "#4B9CD3",
  "yale blue": "#00356B",
  "oxford blue": "#002147",
  "cambridge blue": "#A3C1AD",
  "bleu de france": "#318CE7",
  "eerie black": "#1B1B1B",

  // GREENS
  green: "#008000",
  "bright green": "#00FF00",
  "dark green": "#006400",
  "light green": "#90EE90",
  "pale green": "#98FB98",
  "forest green": "#228B22",
  "hunter green": "#355E3B",
  lime: "#32CD32",
  "lime green": "#32CD32",
  "kelly green": "#4CBB17",
  emerald: "#50C878",
  jade: "#00A86B",
  olive: "#808000",
  "olive green": "#808000",
  "olive drab": "#6B8E23",
  "army green": "#4B5320",
  army: "#4B5320",
  sage: "#9DC183",
  "sage green": "#9DC183",
  mint: "#98FF98",
  "mint green": "#98FF98",
  pear: "#D1E231",
  "pear green": "#C9D22A",
  chartreuse: "#DFFF00",
  "chartreuse green": "#7FFF00",
  "moss green": "#8A9A5B",
  fern: "#4F7942",
  "sea green": "#2E8B57",
  "medium sea green": "#3CB371",
  "light sea green": "#20B2AA",
  pine: "#01796F",
  "pine green": "#01796F",
  "bottle green": "#006A4E",
  celadon: "#ACE1AF",
  "laurel green": "#A9BA9D",
  artichoke: "#8F9779",
  asparagus: "#87A96B",
  avocado: "#568203",
  pickle: "#657220",
  crocodile: "#7B9F80",
  juniper: "#699B7A",
  "ivy green": "#1B4D3E",
  clover: "#3AA84F",
  shamrock: "#009E60",
  "islamic green": "#009900",
  "spanish green": "#009150",
  verdigris: "#43B3AE",
  "tea green": "#D0F0C0",
  honeydew: "#F0FFF0",
  bamboo: "#7DA55A",
  "neon green": "#39FF14",
  harlequin: "#3FFF00",
  "surface green": "#6B8E23",
  "tropical rain forest": "#00755E",
  rainforest: "#00755E",

  // YELLOWS & ORANGES
  yellow: "#FFFF00",
  "bright yellow": "#FFD700",
  "dark yellow": "#FFB90F",
  "light yellow": "#FFFFE0",
  "pale yellow": "#FFFACD",
  canary: "#FFEF00",
  "canary yellow": "#FFEF00",
  gold: "#FFD700",
  golden: "#FFD700",
  goldenrod: "#DAA520",
  "pale goldenrod": "#EEE8AA",
  orange: "#FF9800",
  "bright orange": "#FF6600",
  "dark orange": "#FF8C00",
  "light orange": "#FFB347",
  tangerine: "#FF9966",
  tangelo: "#F94D00",
  amber: "#FFBF00",
  saffron: "#F4C430",
  honey: "#EB9605",
  mustard: "#FFDB58",
  "mustard yellow": "#FFDB58",
  lemon: "#FFF44F",
  "lemon yellow": "#FFF44F",
  cream: "#FFFDD0",
  ivory: "#FFFFF0",
  beige: "#F5F5DC",
  tan: "#D2B48C",
  camel: "#C19A6B",
  sand: "#C2B280",
  sandstone: "#786D5F",
  "desert sand": "#EDC9AF",
  butterscotch: "#E6BE8A",
  apricot: "#FBCEB1",
  peach: "#FFCBA4",
  "peach puff": "#FFDAB9",
  "burnt orange": "#CC5500",
  pumpkin: "#FF7518",
  carrot: "#ED9121",
  rust: "#B7410E",
  terracotta: "#E2725B",
  bronze: "#CD7F32",
  copper: "#B87333",
  sienna: "#A0522D",
  ochre: "#CC7722",
  persimmon: "#EC5800",
  bittersweet: "#FE6F5E",
  marigold: "#B8860B",
  sunflower: "#FFC31C",
  dandelion: "#F0E130",
  banana: "#FFE135",
  champagne: "#F7E7CE",
  flax: "#EEDC82",
  vanilla: "#F3E5AB",
  bisque: "#FFE4C4",
  wheat: "#F5DEB3",
  burlywood: "#DEB887",
  moccasin: "#FFE4B5",
  "papaya whip": "#FFEFD5",
  "navajo white": "#FFDEAD",
  blond: "#FAF0BE",
  champagne: "#F7E7CE",
  cornsilk: "#FFF8DC",
  "cosmic latte": "#FFF8E7",

  // BROWNS
  brown: "#964B00",
  "dark brown": "#654321",
  "light brown": "#C4A484",
  chocolate: "#7B3F00",
  coffee: "#6F4E37",
  espresso: "#3C2415",
  mocha: "#784421",
  cappuccino: "#B69D7E",
  latte: "#E6D0B3",
  caramel: "#C6A664",
  toffee: "#CBAB66",
  cinnamon: "#D2691E",
  nutmeg: "#804000",
  almond: "#EFDECD",
  hazelnut: "#C6A664",
  walnut: "#593318",
  chestnut: "#954535",
  auburn: "#A52A2A",
  mahogany: "#C04000",
  sepia: "#704214",
  taupe: "#483C32",
  "taupe brown": "#483C32",
  fawn: "#E5AA70",
  buff: "#F0DC82",
  ecru: "#C2B280",
  biscuit: "#FFE4C4",
  cookie: "#A97142",
  ginger: "#B06500",
  cocoa: "#D2691E",
  "roasted coffee": "#513518",
  russet: "#80461B",
  bole: "#79443B",
  "burnt sienna": "#E97451",
  "raw sienna": "#D68A59",
  peru: "#CD853F",
  "saddle brown": "#8B4513",
  kobe: "#882D17",
  wood: "#966F33",
  umber: "#635147",
  "burnt umber": "#8A3324",
  "raw umber": "#826644",
  "fuzzy wuzzy": "#CC6666",
  cinereous: "#98817B",
  drab: "#967117",
  almond: "#EFDECD",
  cashew: "#C4A77D",
  pecan: "#9D8659",

  // GRAYS, BLACKS, WHITES
  black: "#000000",
  "jet black": "#0A0A0A",
  charcoal: "#36454F",
  onyx: "#353839",
  graphite: "#383D41",
  gray: "#808080",
  grey: "#808080",
  "dark gray": "#A9A9A9",
  "dark grey": "#A9A9A9",
  "light gray": "#D3D3D3",
  "light grey": "#D3D3D3",
  "dim gray": "#696969",
  "dim grey": "#696969",
  silver: "#C0C0C0",
  platinum: "#E5E4E2",
  white: "#FFFFFF",
  "pure white": "#FFFFFF",
  "off white": "#FAF9F6",
  "off-white": "#FAF9F6",
  ivory: "#FFFFF0",
  pearl: "#FDEEF4",
  cream: "#FFFDD0",
  eggshell: "#F0EAD6",
  bone: "#E3DAC9",
  snow: "#FFFAFA",
  milk: "#FDF5E6",
  "antique white": "#FAEBD7",
  "floral white": "#FFFAF0",
  "ghost white": "#F8F8FF",
  "alice blue": "#F0F8FF",
  "lavender blush": "#FFF0F5",
  "misty rose": "#FFE4E1",
  linen: "#FAF0E6",
  "old lace": "#FDF5E6",
  seashell: "#FFF5EE",
  smoke: "#F5F5F5",
  ash: "#B2BEB5",
  slate: "#708090",
  "slate gray": "#708090",
  "light slate gray": "#778899",
  "cool gray": "#8C92AC",
  "warm gray": "#A6A6A6",
  lava: "#CF1020",

  // PURPLES
  purple: "#9C27B0",
  "bright purple": "#BF00FF",
  "dark purple": "#4B0082",
  "light purple": "#B39EB5",
  violet: "#EE82EE",
  "dark violet": "#9400D3",
  "blue violet": "#8A2BE2",
  lavender: "#E6E6FA",
  "dark lavender": "#7E5E9F",
  "pale lavender": "#DCD0FF",
  lilac: "#C8A2C8",
  "dark lilac": "#9370DB",
  grape: "#6F2DA8",
  eggplant: "#614051",
  aubergine: "#3B1816",
  amethyst: "#9966CC",
  heliotrope: "#DF73FF",
  wisteria: "#C9A0DC",
  thistle: "#D8BFD8",
  "royal purple": "#7851A9",
  imperial: "#602D70",
  byzantium: "#702963",
  patriarch: "#800080",
  "han purple": "#5218FA",
  "tyrian purple": "#66023C",
  phlox: "#DF00FF",
  "orchid purple": "#9932CC",
  "medium purple": "#9370DB",
  "rebecca purple": "#663399",
  boysenberry: "#873260",
  mulberry: "#80005C",
  perrywinkle: "#8F8CE7",
  "mardi gras": "#880085",

  // METALLICS
  silver: "#C0C0C0",
  "metallic silver": "#BCC6CC",
  gold: "#FFD700",
  golden: "#FFD700",
  "metallic gold": "#D4AF37",
  bronze: "#CD7F32",
  copper: "#B87333",
  platinum: "#E5E4E2",
  chrome: "#CFD8DC",
  nickel: "#727472",
  steel: "#71797E",
  iron: "#434B4D",
  tin: "#82898F",
  zinc: "#B9B9B9",
  aluminum: "#A9A9A9",
  titanium: "#878989",
  magnesium: "#BEBEC0",

  // MULTICOLOR & PATTERNS
  multicolor: "#FF6B6B",
  "multi-color": "#FF6B6B",
  "multi color": "#FF6B6B",
  rainbow: "#FF6B6B",
  "tie dye": "#FF6B6B",
  "tie-dye": "#FF6B6B",
  camouflage: "#78866B",
  camo: "#78866B",
  leopard: "#D5A04A",
  zebra: "#404040",
  floral: "#FFB6C1",
  paisley: "#8B4513",
  striped: "#A9A9A9",
  checkered: "#2F4F4F",
  "polka dot": "#FFC0CB",
  "polka-dot": "#FFC0CB",
  "animal print": "#8B4513",
  geometric: "#708090",
  plaid: "#E5E4E2",
  tartan: "#8B4513",
  abstract: "#A9A9A9",
  tribal: "#8B4513",
  ethnic: "#A0522D",
  bohemian: "#8B4513",
  boho: "#8B4513",
  ikat: "#CD5C5C",
  batik: "#8B4513",
  houndstooth: "#2F4F4F",
  herringbone: "#708090",
  chevron: "#708090",
  colorblock: "#FF6B6B",
  "color block": "#FF6B6B",
  ombre: "#DDA0DD",
  gradient: "#A9A9A9",
  solid: "#708090",
  heather: "#8C92AC",
  marl: "#B0BEC5",

  // SKIN TONES & NUDES (unique colors only)
  nude: "#E3BC9A",
  skin: "#E3BC9A",
  natural: "#E3BC9A",

  // OTHERS
  clear: "#F5F5F5",
  transparent: "#F5F5F5",
  crystal: "#F0F8FF",
  diamond: "#B9F2FF",
  pearlescent: "#FDEEF4",
  iridescent: "#FFD700",
  holographic: "#B0E0E6",
  metallic: "#BCC6CC",
  glitter: "#FFD700",
  sparkle: "#FFD700",
  neon: "#FF6B6B",
  pastel: "#E6E6FA",
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
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

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
    if (
      productInfo?.hasOffer &&
      productInfo.offerPrice &&
      productInfo.offerPrice > 0 &&
      productInfo.price
    ) {
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
    () =>
      Array.from(
        new Set(
          variants.map((v) => v.color).filter((c): c is string => Boolean(c)),
        ),
      ),
    [variants],
  );

  // Determine if this product has color variants
  const hasColorVariants = colors.length > 0;

  const [selectedSize, setSelectedSize] = useState<string>(
    selectedVariant?.size || "",
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    selectedVariant?.color || "",
  );

  // Filter available colors based on selected size
  const availableColors = useMemo(() => {
    if (!selectedSize || !hasColorVariants) return colors;

    return Array.from(
      new Set(
        variants
          .filter((v) => v.size === selectedSize && v.color)
          .map((v) => v.color),
      ),
    );
  }, [selectedSize, variants, colors, hasColorVariants]);

  // Filter available sizes based on selected color (only if product has colors)
  const availableSizes = useMemo(() => {
    if (!hasColorVariants || !selectedColor) return sizes;

    return Array.from(
      new Set(
        variants.filter((v) => v.color === selectedColor).map((v) => v.size),
      ),
    );
  }, [selectedColor, variants, sizes, hasColorVariants]);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);

    // Find the appropriate variant based on whether colors are used
    let variant;
    if (hasColorVariants && selectedColor) {
      // Try to match both size and color first
      variant = variants.find(
        (v) => v.size === size && v.color === selectedColor,
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
      (v) => v.color === color && v.size === selectedSize,
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
        className="p-4 rounded-xl border border-black"
        style={{
          backgroundColor: "rgba(238, 74, 35, 0.04)",
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
                        color: isSelected
                          ? "#ffffff"
                          : getContrastColor(colorValue),
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
            <span
              className="text-xs font-semibold"
              style={{
                color:
                  selectedVariant.stock <= 3
                    ? "#ef4444"
                    : selectedVariant.stock <= 5
                      ? "#f97316"
                      : "#22c55e",
              }}
            >
              Stock: {selectedVariant.stock}{" "}
              {selectedVariant.stock === 1 ? "item" : "items"}
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
          <div className="flex items-center justify-between md:justify-start gap-3 pt-2 border-t border-gray-200">
            {/* Price Info - Horizontal Layout */}
            <div className="flex items-center gap-2 flex-wrap">
              {getVariantPriceInfo(selectedVariant).hasDiscount ? (
                <>
                  {/* Original Price (strikethrough) */}
                  <span className="text-xs text-gray-500 line-through">
                    {getVariantPriceInfo(
                      selectedVariant,
                    ).originalPrice.toLocaleString()}
                  </span>
                  {/* Current Total Price */}
                  <span
                    className="text-base font-bold"
                    style={{ color: "var(--palette-text)" }}
                  >
                    {getVariantPriceInfo(
                      selectedVariant,
                    ).currentPrice.toLocaleString()}
                  </span>
                  {/* Discount Badge */}
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                    {Math.round(
                      ((getVariantPriceInfo(selectedVariant).originalPrice -
                        getVariantPriceInfo(selectedVariant).currentPrice) /
                        getVariantPriceInfo(selectedVariant).originalPrice) *
                        100,
                    )}
                    % OFF
                  </span>
                </>
              ) : (
                <>
                  {/* Unit Price */}
                  <span className="text-sm text-gray-500">
                    {getVariantPriceInfo(
                      selectedVariant,
                    ).currentPrice.toLocaleString()}
                  </span>
                  {/* Current Total Price */}
                  <span
                    className="text-base font-bold"
                    style={{ color: "var(--palette-text)" }}
                  >
                    {getVariantPriceInfo(
                      selectedVariant,
                    ).currentPrice.toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-0 border-2 border-black rounded-full bg-white">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="h-8 w-8 flex justify-center items-center font-bold text-gray-600 bg-red-200 hover:bg-red-500 rounded-l-full disabled:opacity-50 transition-colors"
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
                    Math.min(selectedVariant?.stock || 99, quantity + 1),
                  )
                }
                className="h-8 w-8 flex justify-center items-center font-bold text-white bg-red-200 hover:bg-red-500 <hover:bg-red-600</hover:bg-red-6> rounded-r-full disabled:opacity-50 transition-colors"
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
