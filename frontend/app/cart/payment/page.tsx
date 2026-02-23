"use client";
import { Truck, Wallet, CreditCard, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/zustan-hook/cart";
import { PaymentMethod, useCheckoutStore } from "@/zustan-hook/checkoutStore";
import { useEffect, useState } from "react";

export default function PaymentPage() {
  const router = useRouter();
  const { items, totalPrice, totalDiscount, clearCart } = useCartStore();
  const {
    shipment,
    updateShipmentField,
    isShipmentValid,
    setProcessing,
    clearCheckout,
  } = useCheckoutStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const finalTotal = totalPrice - totalDiscount;

  // Redirect if shipment not filled
  useEffect(() => {
    if (!isShipmentValid()) {
      router.push("/cart/review");
    }
  }, [isShipmentValid, router]);

  const paymentMethods = [
    {
      id: PaymentMethod.COD,
      name: "Cash on Delivery",
      desc: "Pay when you receive your order",
      icon: <Truck className="w-6 h-6" />,
    },
    /* {
      id: PaymentMethod.ONLINE,
      name: "Online Payment",
      desc: "Pay with bKash, Nagad, Rocket, or Card",
      icon: <Wallet className="w-6 h-6" />,
    } */
    ,
  ];

  const handlePlaceOrder = async () => {
    if (!shipment?.paymentMethod) {
      setErrors({ form: "Please select a payment method" });
      return;
    }

    router.push(`/cart/review`);
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
          <Link href="/cart" className="hover:text-palette-btn transition">
            Shipping
          </Link>
          <span>/</span>
          <span className="text-palette-btn font-semibold">Payment</span>
          <span>/</span>
          <span>Confirmation</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-gray-200 rounded-full mb-8 overflow-hidden">
          <div className="w-2/3 h-full bg-palette-btn rounded-full transition-all duration-300"></div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-palette-text">
                Select Payment Method
              </h1>
              <Link
                href="/cart/shipment"
                className="text-sm text-palette-btn hover:text-palette-btn/80 font-medium"
              >
                <ChevronLeft className="w-4 h-4 inline mr-1" />
                Back
              </Link>
            </div>

            {/* Shipping Summary */}
            <Card className="border border-gray-200 mb-6">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-palette-text mb-2">
                      Shipping To:
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong className="text-palette-text">
                        {shipment?.name}
                      </strong>
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      {shipment?.phone}
                    </p>
                    <p className="text-sm text-gray-600">{shipment?.house}</p>
                  </div>
                  <Link
                    href="/cart/shipment"
                    className="text-sm text-palette-btn hover:text-palette-btn/80 font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Payment Methods */}
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <Card
                  key={method.id}
                  className={`border-2 cursor-pointer transition ${
                    shipment?.paymentMethod === method.id
                      ? "border-palette-btn bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() =>
                    updateShipmentField("paymentMethod", method.id)
                  }
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                          shipment?.paymentMethod === method.id
                            ? "border-palette-btn bg-white"
                            : "border-gray-300"
                        }`}
                      >
                        {shipment?.paymentMethod === method.id && (
                          <div className="w-3 h-3 bg-palette-btn rounded-full"></div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <div
                            className={`${
                              shipment?.paymentMethod === method.id
                                ? "text-palette-btn"
                                : "text-gray-600"
                            }`}
                          >
                            {method.icon}
                          </div>
                          <h3 className="font-semibold text-palette-text">
                            {method.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600">{method.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {errors.form && (
              <p className="text-red-500 text-sm mt-4">{errors.form}</p>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="border border-gray-200 sticky top-8">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-palette-text mb-6">
                  Order Summary
                </h2>

                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between text-sm py-2 border-b border-gray-100 last:border-0"
                    >
                      <span className="text-gray-600 truncate pr-2">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-palette-text font-medium whitespace-nowrap">
                        ${(item.unitPrice * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
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

                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-palette-text font-semibold">
                      Total Payable
                    </span>
                    <span className="text-palette-btn text-2xl font-bold">
                      ${finalTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  className="w-full mt-6 bg-palette-btn hover:bg-palette-btn/90 text-white h-12 font-semibold rounded-lg transition"
                  disabled={!shipment?.paymentMethod}
                >
                  Review and Order
                </Button>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <strong className="text-palette-text">Secure:</strong> Your
                    payment is protected with industry-standard encryption
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
