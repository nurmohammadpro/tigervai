"use client";
import { Trash2, ChevronLeft, ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/zustan-hook/cart";
import PageBanner from "../common/PageBanner";

export default function CartPage() {
  const router = useRouter();

  const {
    items,
    totalPrice,
    totalItems,
    subtotal,
    totalDiscount,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
  } = useCartStore();

  const handleCheckout = () => {
    router.push("/cart/shipment");
  };
  const route = [
    {
      title: "Cart",
      link: "/cart",
    },
  ];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-palette-bg">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingCart className="w-24 h-24 text-gray-300 mb-6" />
            <h2 className="text-2xl font-bold text-palette-text mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              Looks like you haven't added anything to your cart yet. Start
              shopping to fill it up!
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-palette-btn hover:bg-palette-btn/90 text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-palette-bg">
      <PageBanner title="Cart" routes={route} />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8 mt-6">
          <h1 className="text-3xl md:text-4xl font-bold text-palette-text">
            Your Shopping Cart
          </h1>
          <span className="text-sm text-gray-600">
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items - NO VENDOR GROUPING */}
          <div className="md:col-span-2 space-y-4">
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                {/* Simple header */}

                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/product-details/${item.slug}`}
                        className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden hover:opacity-80 transition"
                      >
                        <Image
                          src={item.thumbnail}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product-details/${item.slug}`}
                          className="font-semibold text-palette-text text-sm mb-1 hover:text-palette-btn transition line-clamp-2 block"
                        >
                          {item.name}
                        </Link>

                        {/* Variant Info */}
                        <div className="flex gap-2 mb-2">
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                            {item.variant.color}
                          </span>
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                            {item.variant.size}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                          {item.unitPrice < item.variant.price && (
                            <span className="text-xs text-gray-500 line-through">
                              ৳{item.variant.price.toLocaleString()}
                            </span>
                          )}
                          <span className="text-palette-btn font-bold text-sm">
                            ৳{item.unitPrice.toLocaleString()}
                          </span>
                        </div>

                        {/* Stock warning */}
                        {item.quantity >= item.variantStock && (
                          <p className="text-xs text-amber-600 mt-1">
                            Only {item.variantStock} in stock
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center border border-gray-200 rounded">
                          <button
                            onClick={() => decrementQuantity(item._id)}
                            className="px-3 py-1 text-gray-600 hover:text-palette-btn hover:bg-gray-50 transition"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 text-gray-700 font-medium min-w-[40px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => incrementQuantity(item._id)}
                            disabled={item.quantity >= item.variantStock}
                            className="px-3 py-1 text-gray-600 hover:text-palette-btn hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal & Remove */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-palette-text">
                            ৳{(item.unitPrice * item.quantity).toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeFromCart(item._id)}
                            className="text-red-500 hover:text-red-600 transition"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              variant="link"
              onClick={() => router.push("/")}
              className="text-palette-btn hover:text-palette-btn/80 p-0 justify-start font-medium"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </div>

          {/* Order Summary - SIMPLIFIED */}
          <div>
            <Card className="border border-gray-200 sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-palette-text mb-6">
                  Order Summary
                </h2>

                <div className="space-y-1.5 mb-6 max-h-40 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between items-start gap-2 text-xs py-1.5 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-gray-800 truncate">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-gray-600 text-xs truncate">
                          {item.variant.size}-{item.variant.color}
                        </span>
                      </div>
                      <span className="text-palette-text font-medium whitespace-nowrap text-xs">
                        ৳{(item.unitPrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-600 font-medium">
                    Total ({totalItems} items)
                  </span>
                  <span className="text-palette-btn text-2xl font-bold">
                    ৳{totalPrice.toLocaleString()}
                  </span>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-palette-btn hover:bg-palette-btn/90 text-white h-12 font-semibold rounded-lg transition"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  onClick={() => router.push("/")}
                  variant="outline"
                  className="w-full mt-3 border border-gray-200 h-11 rounded-lg text-palette-text font-medium hover:border-palette-btn hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </Button>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong className="text-palette-text">Note:</strong>{" "}
                    Shipping charges will be calculated during checkout based on
                    your delivery address.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
