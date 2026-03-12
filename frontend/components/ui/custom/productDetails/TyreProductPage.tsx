// components/ui/custom/productDetails/TyreProductPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Heart,
  Share2,
  ShoppingCart,
} from "lucide-react";
import { Product } from "@/@types/fullProduct";
import { CartItem, useCartStore } from "@/zustan-hook/cart";
import { toast } from "sonner";
import { useWishHook } from "@/zustan-hook/wishListhook";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface TyreProductPageProps {
  product: Product;
}

interface VariantQuantity {
  [variantKey: string]: number;
}

// Tyre variant type
type TyreVariantType = "front" | "rear" | "combo";

export default function TyreProductPage({ product }: TyreProductPageProps) {
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { addToWish, removeFromWish, wishItems } = useWishHook();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [variantQuantities, setVariantQuantities] = useState<VariantQuantity>({});
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check if product is wishlisted
  useEffect(() => {
    const wished = wishItems.some((item) => item.productId === product._id);
    setIsWishlisted(wished);
  }, [wishItems, product._id]);

  // Get all images (thumbnail + additional images)
  const allImages = [
    product.thumbnail?.url,
    ...(product.images?.map((img) => img.url) || []),
  ].filter(Boolean);

  // Group variants by type (front, rear, combo)
  const variantsByType = product.variants?.reduce((acc, variant, index) => {
    // Extract variant type from size (e.g., "front - 110/70 R17")
    const sizeParts = variant.size?.split(" - ") || [];
    const type = (sizeParts[0] || "front").toLowerCase() as TyreVariantType;

    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push({ ...variant, originalIndex: index });
    return acc;
  }, {} as Record<TyreVariantType, typeof product.variants>) || { front: [], rear: [], combo: [] };

  // Get variant price info
  const getVariantPrice = (variant: any) => {
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
    return {
      originalPrice: variant.price,
      currentPrice: variant.price,
      hasDiscount: false,
      discountPercentage: 0,
    };
  };

  // Handle quantity change
  const handleQuantityChange = (variant: any, delta: number) => {
    const key = `${product._id}-${variant.originalIndex}`;
    const currentQty = variantQuantities[key] || 0;
    const newQty = Math.max(0, Math.min(currentQty + delta, variant.stock || 999));

    setVariantQuantities((prev) => ({
      ...prev,
      [key]: newQty,
    }));
  };

  // Calculate totals
  const totalItems = Object.values(variantQuantities).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(variantQuantities).reduce((sum, [key, qty]) => {
    if (qty === 0) return sum;
    const index = parseInt(key.split("-").pop() || "0");
    const variant = product.variants?.[index];
    if (!variant) return sum;
    const priceInfo = getVariantPrice(variant);
    return sum + (priceInfo.currentPrice * qty);
  }, 0);

  // Handle add to cart
  const handleAddToCart = () => {
    const itemsToAdd: CartItem[] = [];

    Object.entries(variantQuantities).forEach(([key, qty]) => {
      if (qty === 0) return;
      const index = parseInt(key.split("-").pop() || "0");
      const variant = product.variants?.[index];
      if (!variant) return;

      itemsToAdd.push({
        productId: product._id,
        variantId: key,
        name: product.name,
        price: variant.discountPrice || variant.price,
        originalPrice: variant.price,
        quantity: qty,
        image: product.thumbnail?.url || product.images?.[0]?.url || "",
        size: variant.size,
        color: variant.color,
        stock: variant.stock,
        brand: product.brand?.name || "",
        category: product.category?.main || "",
        slug: product.slug || "",
      });
    });

    if (itemsToAdd.length === 0) {
      toast.error("Please select at least one tyre");
      return;
    }

    itemsToAdd.forEach((item) => addToCart(item));
    toast.success(`Added ${totalItems} tyre(s) to cart`);
    setVariantQuantities({});
  };

  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  // Toggle wishlist
  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWish(product._id);
      toast.success("Removed from wishlist");
    } else {
      addToWish({
        productId: product._id,
        name: product.name,
        price: product.offerPrice || product.price,
        image: product.thumbnail?.url || product.images?.[0]?.url || "",
        slug: product.slug || "",
        stock: product.stock,
        brand: product.brand?.name || "",
      });
      toast.success("Added to wishlist");
    }
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Selected Summary - Non-fixed, inline with content */}
        {totalItems > 0 && (
          <div
            className="mb-6 p-4 rounded-lg border"
            style={{
              backgroundColor: "var(--palette-bg)",
              borderColor: "var(--palette-accent-3)",
            }}
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--palette-accent-1)" }}>
                  Selected
                </p>
                <p className="text-sm" style={{ color: "var(--palette-accent-3)" }}>
                  {Object.entries(variantQuantities)
                    .filter(([_, qty]) => qty > 0)
                    .map(([key, qty]) => {
                      const index = parseInt(key.split("-").pop() || "0");
                      const variant = product.variants?.[index];
                      return `${qty}x ${variant?.size || "Tyre"}`;
                    })
                    .join(", ")}
                </p>
                <p className="text-lg font-bold" style={{ color: "var(--palette-text)" }}>
                  Total = {totalItems} item(s), Tk {totalPrice.toLocaleString()}
                </p>
              </div>
              <Button
                onClick={handleAddToCart}
                className="text-white"
                style={{ backgroundColor: "var(--palette-btn)" }}
              >
                <ShoppingCart size={18} className="mr-2" />
                Add All to Cart
              </Button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Image Gallery */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="bg-gray-50 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
                {allImages[selectedImageIndex] ? (
                  <Image
                    src={allImages[selectedImageIndex]}
                    alt={`${product.name} - Image ${selectedImageIndex + 1}`}
                    width={600}
                    height={600}
                    className="object-contain"
                  />
                ) : (
                  <div className="text-gray-400">No image available</div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {allImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {allImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? "border-primary"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tyre Variants Selector */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {/* Front Tyres */}
              {variantsByType.front && variantsByType.front.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    Front Tyre
                  </h3>
                  <div className="space-y-3">
                    {variantsByType.front.map((variant) => {
                      const key = `${product._id}-${variant.originalIndex}`;
                      const qty = variantQuantities[key] || 0;
                      const priceInfo = getVariantPrice(variant);
                      const isOutOfStock = (variant.stock || 0) === 0;

                      return (
                        <div
                          key={variant.originalIndex}
                          className={`border rounded-lg p-4 bg-white ${
                            qty > 0 ? "border-blue-500 shadow-md" : "border-gray-200"
                          } ${isOutOfStock ? "opacity-60" : ""}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-sm">{variant.size?.replace("front - ", "")}</h4>
                              {variant.recommended && (
                                <p className="text-xs text-gray-500 mt-1">{variant.recommended}</p>
                              )}
                              {variant.season && (
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                                  {variant.season}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            {priceInfo.hasDiscount ? (
                              <>
                                <span className="text-sm line-through text-gray-400">
                                  Tk {priceInfo.originalPrice.toLocaleString()}
                                </span>
                                <span className="text-lg font-bold text-green-600">
                                  Tk {priceInfo.currentPrice.toLocaleString()}
                                </span>
                                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                  {priceInfo.discountPercentage}% off
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold">
                                Tk {priceInfo.currentPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Stock: {variant.stock || 0}</span>
                            {!isOutOfStock && (
                              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                <button
                                  onClick={() => handleQuantityChange(variant, -1)}
                                  disabled={qty === 0}
                                  className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm disabled:opacity-50"
                                >
                                  −
                                </button>
                                <span className="w-8 text-center font-semibold">{qty}</span>
                                <button
                                  onClick={() => handleQuantityChange(variant, 1)}
                                  disabled={qty >= (variant.stock || 999)}
                                  className="w-8 h-8 flex items-center justify-center bg-amber-400 rounded shadow-sm disabled:opacity-50"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>

                          {isOutOfStock && (
                            <div className="mt-2 py-1 px-2 bg-red-50 border border-red-200 rounded text-xs text-red-600 text-center">
                              Out of Stock
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Rear Tyres */}
              {variantsByType.rear && variantsByType.rear.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    Rear Tyre
                  </h3>
                  <div className="space-y-3">
                    {variantsByType.rear.map((variant) => {
                      const key = `${product._id}-${variant.originalIndex}`;
                      const qty = variantQuantities[key] || 0;
                      const priceInfo = getVariantPrice(variant);
                      const isOutOfStock = (variant.stock || 0) === 0;

                      return (
                        <div
                          key={variant.originalIndex}
                          className={`border rounded-lg p-4 bg-white ${
                            qty > 0 ? "border-red-500 shadow-md" : "border-gray-200"
                          } ${isOutOfStock ? "opacity-60" : ""}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold text-sm">{variant.size?.replace("rear - ", "")}</h4>
                              {variant.recommended && (
                                <p className="text-xs text-gray-500 mt-1">{variant.recommended}</p>
                              )}
                              {variant.season && (
                                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded mt-1 inline-block">
                                  {variant.season}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            {priceInfo.hasDiscount ? (
                              <>
                                <span className="text-sm line-through text-gray-400">
                                  Tk {priceInfo.originalPrice.toLocaleString()}
                                </span>
                                <span className="text-lg font-bold text-green-600">
                                  Tk {priceInfo.currentPrice.toLocaleString()}
                                </span>
                                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                  {priceInfo.discountPercentage}% off
                                </span>
                              </>
                            ) : (
                              <span className="text-lg font-bold">
                                Tk {priceInfo.currentPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Stock: {variant.stock || 0}</span>
                            {!isOutOfStock && (
                              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                <button
                                  onClick={() => handleQuantityChange(variant, -1)}
                                  disabled={qty === 0}
                                  className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm disabled:opacity-50"
                                >
                                  −
                                </button>
                                <span className="w-8 text-center font-semibold">{qty}</span>
                                <button
                                  onClick={() => handleQuantityChange(variant, 1)}
                                  disabled={qty >= (variant.stock || 999)}
                                  className="w-8 h-8 flex items-center justify-center bg-amber-400 rounded shadow-sm disabled:opacity-50"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>

                          {isOutOfStock && (
                            <div className="mt-2 py-1 px-2 bg-red-50 border border-red-200 rounded text-xs text-red-600 text-center">
                              Out of Stock
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Combo Sets */}
              {variantsByType.combo && variantsByType.combo.length > 0 && (
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-red-500"></span>
                    Combo Set (Front + Rear)
                  </h3>
                  <div className="space-y-3">
                    {variantsByType.combo.map((variant) => {
                      const key = `${product._id}-${variant.originalIndex}`;
                      const qty = variantQuantities[key] || 0;
                      const priceInfo = getVariantPrice(variant);
                      const isOutOfStock = (variant.stock || 0) === 0;

                      return (
                        <div
                          key={variant.originalIndex}
                          className={`border-2 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-red-50 ${
                            qty > 0 ? "border-amber-500 shadow-md" : "border-blue-200"
                          } ${isOutOfStock ? "opacity-60" : ""}`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-sm">{variant.size?.replace("combo - ", "")}</h4>
                                <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">
                                  SAVE MONEY
                                </span>
                              </div>
                              {variant.recommended && (
                                <p className="text-xs text-gray-500 mt-1">{variant.recommended}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            {priceInfo.hasDiscount ? (
                              <>
                                <span className="text-sm line-through text-gray-400">
                                  Tk {priceInfo.originalPrice.toLocaleString()}
                                </span>
                                <span className="text-xl font-bold text-green-600">
                                  Tk {priceInfo.currentPrice.toLocaleString()}
                                </span>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                  {priceInfo.discountPercentage}% off
                                </span>
                              </>
                            ) : (
                              <span className="text-xl font-bold">
                                Tk {priceInfo.currentPrice.toLocaleString()}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Stock: {variant.stock || 0} sets</span>
                            {!isOutOfStock && (
                              <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
                                <button
                                  onClick={() => handleQuantityChange(variant, -1)}
                                  disabled={qty === 0}
                                  className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded disabled:opacity-50"
                                >
                                  −
                                </button>
                                <span className="w-8 text-center font-semibold">{qty}</span>
                                <button
                                  onClick={() => handleQuantityChange(variant, 1)}
                                  disabled={qty >= (variant.stock || 999)}
                                  className="w-8 h-8 flex items-center justify-center bg-amber-500 text-white rounded disabled:opacity-50"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>

                          {isOutOfStock && (
                            <div className="mt-2 py-1 px-2 bg-red-50 border border-red-200 rounded text-xs text-red-600 text-center">
                              Out of Stock
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 space-y-3 pt-4 border-t">
                <Button
                  className="w-full bg-amber-400 hover:bg-amber-500 text-black font-semibold text-base py-6"
                  onClick={handleAddToCart}
                  disabled={totalItems === 0}
                >
                  <ShoppingCart size={20} className="mr-2" />
                  Add To Cart
                </Button>
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-base py-6"
                  onClick={handleBuyNow}
                  disabled={totalItems === 0}
                >
                  Order Now (অর্ডার করুন)
                </Button>

                {/* Wishlist & Share */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={toggleWishlist}
                  >
                    <Heart
                      size={18}
                      className={`mr-2 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                    />
                    {isWishlisted ? "Wishlisted" : "Wishlist"}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 size={18} className="mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
