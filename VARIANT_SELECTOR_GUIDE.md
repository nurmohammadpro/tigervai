# Variant Selector Implementation Guide

## 📋 Overview

Your e-commerce platform now has **TWO** variant selection interfaces:

1. **Admin Side** - Bulk variant generator for adding products
2. **Customer Side** - Beautiful variant selector for product detail pages

---

## 🎨 Customer-Facing Variant Selector

Based on the WhatsApp screenshot design, this component provides:

- ✅ Circular color swatches
- ✅ Selectable size buttons
- ✅ Smart filtering (only shows available combinations)
- ✅ Visual feedback for selected items
- ✅ Stock availability display
- ✅ Price display with discounts

### File Location
```
frontend/components/ui/custom/productDetails/VariantSelector.tsx
```

### Usage Example

```tsx
import VariantSelector from "@/components/ui/custom/productDetails/VariantSelector";

function ProductDetails({ product }: { product: Product }) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>();

  return (
    <VariantSelector
      variants={product.variants}
      onVariantSelect={(variant) => setSelectedVariant(variant)}
      selectedVariant={selectedVariant}
    />
  );
}
```

---

## 🎨 Color Mapping

The component includes a built-in color mapping for common colors:

```typescript
const COLOR_MAP = {
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
  // Add more as needed
};
```

### Adding Custom Colors

Edit the `COLOR_MAP` in `VariantSelector.tsx`:

```typescript
const COLOR_MAP: Record<string, string> = {
  // ... existing colors
  "burgundy": "#800020",
  "teal": "#008080",
  "lavender": "#e6e6fa",
};
```

---

## 🔧 Integration Steps

### Step 1: Import the Component

In your product details page:

```tsx
import VariantSelector from "@/components/ui/custom/productDetails/VariantSelector";
```

### Step 2: Add State Management

```tsx
const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(
  product.variants?.[0] // Default to first variant
);
```

### Step 3: Render the Component

```tsx
<div className="space-y-6">
  {/* Variant Selector */}
  <VariantSelector
    variants={product.variants || []}
    onVariantSelect={setSelectedVariant}
    selectedVariant={selectedVariant}
  />

  {/* Quantity Selector */}
  <div>...</div>

  {/* Add to Cart Button */}
  <button
    onClick={() => handleAddToCart(selectedVariant)}
    disabled={!selectedVariant || selectedVariant.stock === 0}
  >
    Add to Cart
  </button>
</div>
```

### Step 4: Handle Variant Selection

```tsx
const handleAddToCart = (variant: Variant) => {
  if (!variant) {
    toast.error("Please select a variant");
    return;
  }

  addToCart({
    productId: product._id,
    name: product.name,
    size: variant.size,
    color: variant.color,
    price: variant.discountPrice || variant.price,
    quantity: 1,
    image: variant.image || product.thumbnail,
  });

  toast.success("Added to cart!");
};
```

---

## 🎯 Admin vs Customer Interfaces

### Admin Side (Product Creation)
**Location:** `StepVariantsImproved.tsx`
**Purpose:** Quickly generate all size × color combinations
**Features:**
- Bulk generator (e.g., 5 sizes × 6 colors = 30 variants)
- Manual single variant addition
- Edit price/stock per variant
- Upload variant images

### Customer Side (Product Details)
**Location:** `VariantSelector.tsx`
**Purpose:** Let customers select variants to purchase
**Features:**
- Beautiful circular color swatches
- Selectable size buttons
- Smart availability filtering
- Stock display
- Price display
- Out of stock warnings

---

## 📊 Design System Alignment

The component uses your global CSS variables:

```css
--palette-btn: #ee4a23;     /* Primary button color */
--palette-text: #2b2724;    /* Text color */
--palette-accent-2: #ff8566; /* Secondary accent */
--palette-accent-3: #c43d1d; /* Tertiary accent */
```

### Selected States

- **Size buttons:** Orange border with light orange background
- **Color swatches:** Ring effect with checkmark
- **Disabled:** 30% opacity with no interaction

---

## 🚀 Deployment

1. Commit changes:
   ```bash
   git add .
   git commit -m "Add customer-facing variant selector"
   git push dev main
   ```

2. Trigger frontend deployment in EasyPanel

3. Test on product detail page

---

## 💡 Tips

### 1. Default Selection
Always pre-select the first available variant:

```tsx
const [selectedVariant, setSelectedVariant] = useState<Variant>(
  product.variants?.find(v => v.stock > 0) || product.variants?.[0]
);
```

### 2. Image Updates
Change product image when variant is selected:

```tsx
const handleVariantSelect = (variant: Variant) => {
  setSelectedVariant(variant);

  // Update main image if variant has custom image
  if (variant.image?.url) {
    setMainImage(variant.image.url);
  }
};
```

### 3. URL State
Save selected variant in URL for sharing:

```tsx
import { useQueryState } from "nuqs";

const [selectedSize, setSelectedSize] = useQueryState("size");
const [selectedColor, setSelectedColor] = useQueryState("color");
```

---

## 📱 Responsive Design

The component is fully responsive:
- **Mobile:** Wrapped sizes/colors
- **Tablet:** 2-column grid
- **Desktop:** Horizontal layout

---

## 🐛 Troubleshooting

### Colors not showing?
- Check color names match the `COLOR_MAP`
- Add custom colors to the map

### Variants not filtering?
- Ensure variants array has both `size` and `color` properties
- Check stock values are numbers

### Not styled correctly?
- Hard refresh browser (Ctrl + Shift + R)
- Check CSS variables are defined
- Verify global CSS is loaded

---

## 📞 Support

For issues or questions, check:
1. Component file: `VariantSelector.tsx`
2. Product page: `ProductPage.tsx`
3. Global CSS: `globals.css`
