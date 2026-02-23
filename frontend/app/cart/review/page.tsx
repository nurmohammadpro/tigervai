"use client";
import { ChevronLeft, Package, MapPin, CreditCard, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/zustan-hook/cart";
import { useCheckoutStore, PaymentMethod } from "@/zustan-hook/checkoutStore";
import { useEffect, useState } from "react";
import { useApiMutation } from "@/api-hook/react-query-wrapper";
import { postNewSell } from "@/actions/sells";
import { Spinner } from "@/components/ui/spinner";
import { purchaseEvent } from "@/lib/google-tag-manager";
import { v4 as uuidv4 } from "uuid";
import { getUserInfo } from "@/actions/auth";
import { purchaseServerEvent } from "@/actions/metaEvent";
export default function ReviewOrderPage() {
  const router = useRouter();
  const { items, totalPrice, totalDiscount, clearCart } = useCartStore();
  const { shipment, isShipmentValid, setProcessing, clearCheckout } =
    useCheckoutStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const finalTotal = totalPrice - totalDiscount;

  // Redirect if incomplete
  useEffect(() => {
    if (!isShipmentValid() || items.length === 0) {
      router.push("/cart");
    }
  }, [isShipmentValid, items.length, router]);

  // Group by vendor
  const groupedByVendor = items.reduce((acc, item) => {
    const vendor = item?.brandName || "Unknown Seller";
    if (!acc[vendor]) {
      acc[vendor] = [];
    }
    acc[vendor].push(item);
    return acc;
  }, {} as Record<string, typeof items>);
  const onCompleteOrder = () => {
    router.push("/cart/success");
  };
  const { mutate, isPending } = useApiMutation(
    postNewSell,
    undefined,
    "sell-product-item",
    onCompleteOrder
  );
  const handlePlaceOrder = async () => {
    const orderPayload = {
      // ✅ CORRECT: Map to 'products' array (not 'items')
      products: items.map((item) => ({
        // Basic product info
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,

        // ✅ REQUIRED: Variant object with all fields
        variant: {
          size: item?.variant?.size,
          color: item?.variant?.color,
          sku: item?.variant?.sku || undefined,
          ...(item?.variant?.sku && { sku: item?.variant?.sku }),
          price: item?.variant?.price,
          ...(item?.variant?.discountPrice && {
            discountPrice: item.variant.discountPrice,
          }),
        },

        // Optional fields
        totalPrice: item?.unitPrice * item?.quantity,
        discountApplied: item.variant.discountPrice
          ? (item.variant.price - item.variant.discountPrice) * item.quantity
          : undefined,
      })),

      // ✅ REQUIRED: Shipment details
      shipment: {
        name: shipment!.name,
        phone: shipment!.phone,
        house: shipment!.house,
        paymentMethod: shipment!.paymentMethod,
        ...(shipment?.comment?.trim() && { comment: shipment.comment }),
      },

      // ✅ REQUIRED: Order totals
      orderTotal: finalTotal,
      totalDiscount: totalDiscount || 0,
    };
    console.log("Order payload:", orderPayload);
    mutate(orderPayload);
    const eventId = uuidv4();
    const getUser = await getUserInfo();
    const extraData = {
      userId: getUser?.id,
      userName: getUser?.name,
      email: getUser?.email,
      event_id: eventId,
      ...orderPayload,
    };
    purchaseEvent(extraData);
    await purchaseServerEvent(extraData);
  };

  return (
    <div className="min-h-screen bg-palette-bg">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link href="/cart" className="hover:text-palette-btn transition">
            Cart
          </Link>
          <span>/</span>
          <Link
            href="/cart/shipment"
            className="hover:text-palette-btn transition"
          >
            Shipping
          </Link>
          <span>/</span>
          <Link
            href="/cart/payment"
            className="hover:text-palette-btn transition"
          >
            Payment
          </Link>
          <span>/</span>
          <span className="text-palette-btn font-semibold">Review</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <div className="w-full h-full bg-palette-btn rounded-full transition-all duration-300"></div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-palette-text mb-8">
          Review Your Order
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold text-palette-text flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-palette-btn" />
                    Shipping Address
                  </h2>
                  <Link
                    href="/cart/shipment"
                    className="text-sm text-palette-btn hover:text-palette-btn/80 font-medium"
                  >
                    Edit
                  </Link>
                </div>

                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-palette-text">
                    {shipment?.name}
                  </p>
                  <p className="text-gray-600">Phone: {shipment?.phone}</p>
                  <p className="text-gray-600">{shipment?.house}</p>
                  {shipment?.comment && (
                    <p className="text-gray-600 mt-2 pt-2 border-t border-gray-200">
                      <span className="font-medium text-palette-text">
                        Note:
                      </span>{" "}
                      {shipment.comment}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-semibold text-palette-text flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-palette-btn" />
                    Payment Method
                  </h2>
                  <Link
                    href="/cart/payment"
                    className="text-sm text-palette-btn hover:text-palette-btn/80 font-medium"
                  >
                    Edit
                  </Link>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-palette-text">
                    {shipment?.paymentMethod === PaymentMethod.COD
                      ? "Cash on Delivery (COD)"
                      : "Online Payment"}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {shipment?.paymentMethod === PaymentMethod.COD
                      ? "Pay with cash upon delivery of your order"
                      : "Pay securely with bKash, Nagad, Rocket, or Card"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Order Items by Vendor */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-palette-text flex items-center gap-2">
                <Package className="w-5 h-5 text-palette-btn" />
                Order Items
              </h2>

              {Object.entries(groupedByVendor).map(([vendor, vendorItems]) => (
                <Card key={vendor} className="border border-gray-200">
                  <CardContent className="p-6">
                    {/* Vendor Header */}
                    <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
                      <div>
                        <h3 className="font-semibold text-palette-text mb-1">
                          Sold by {vendor}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Truck className="w-3.5 h-3.5" />
                          <span>Estimated delivery: 3-5 business days</span>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="space-y-4">
                      {vendorItems.map((item) => (
                        <div
                          key={item._id}
                          className="flex gap-4 pb-4 border-b border-gray-100 last:border-0"
                        >
                          {/* Product Image */}
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            <Image
                              src={item.thumbnail}
                              alt={item.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1">
                            <p className="font-semibold text-palette-text text-sm mb-1">
                              {item.name}
                            </p>

                            <div className="flex gap-2 mb-2">
                              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                {item.variant.color}
                              </span>
                              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                                {item.variant.size}
                              </span>
                            </div>

                            <p className="text-xs text-gray-600">
                              Quantity: {item.quantity}
                            </p>

                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-palette-btn font-bold text-sm">
                                ${item.unitPrice.toFixed(2)}
                              </span>
                              {item.variant.discountPrice && (
                                <span className="text-xs text-gray-500 line-through">
                                  ${item.variant.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Item Total */}
                          <div className="text-right">
                            <span className="text-sm font-semibold text-palette-text">
                              ${(item.unitPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="border border-gray-200 sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-palette-text mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Subtotal ({items.length} items)
                    </span>
                    <span className="text-palette-text font-medium">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {totalDiscount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">Discount</span>
                      <span className="text-green-600 font-medium">
                        -${totalDiscount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-600">Free</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <span className="text-palette-text font-semibold">
                    Total Payable
                  </span>
                  <span className="text-palette-btn text-2xl font-bold">
                    ${finalTotal.toFixed(2)}
                  </span>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  className="w-full bg-palette-btn hover:bg-palette-btn/90 text-white h-12 font-semibold rounded-lg transition"
                  disabled={isPending}
                >
                  {isPending ? <Spinner /> : "Place Order Now"}
                </Button>

                {errors.form && (
                  <p className="text-red-500 text-sm mt-3 text-center">
                    {errors.form}
                  </p>
                )}

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong className="text-palette-text">Secure:</strong> By
                    placing your order, you agree to our terms and conditions
                  </p>
                </div>
              </CardContent>
            </Card>

            <Link
              href="/cart/payment"
              className="flex items-center justify-center w-full text-palette-btn hover:text-palette-btn/80 mt-4 font-medium text-sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Payment
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
