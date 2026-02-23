"use client";

import { CheckCircle, Package, ShoppingBag, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useCartStore } from "@/zustan-hook/cart";

import { CreateSellResponse } from "@/@types/success";

export interface Order {
  _id: string;
  products: Product[];
  shipment: Shipment;
  userId: string;
  isAdmin: boolean;
  orderStatus:
    | "PENDING"
    | "CONFIRMED"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | string;
  orderTotal: number;
  totalDiscount: number;
  orderNumber: string;
  vendorId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Product {
  productId: string;
  slug: string;
  name: string;
  quantity: number;
  totalPrice: number;
  variant: Variant;
  brandName: string;
  brandId: string;
  mainCategory: string;
  category: string;
  vendorId: string;
  vendorSlug: string;
  unitPrice: number;
  discountApplied: number;
}

export interface Variant {
  size: string;
  color: string;
  price: number;
  discountPrice: number;
}

export interface Shipment {
  name: string;
  phone: string;
  house: string;
  paymentMethod: "COD" | "ONLINE" | string;
  comment: string;
}

export default function OrderSuccessPage() {
  const router = useRouter();

  const [orderData, setOrderData] = useState<CreateSellResponse | null>();
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);
  useEffect(() => {
    const getData = () => {
      const data = sessionStorage.getItem("orderData");
      console.log("data", data);
      if (data) {
        setOrderData(JSON.parse(data));
        /*  sessionStorage.removeItem("orderData"); */ // Delete immediately after reading
      } else {
        router.push("/");
      }
    };
    getData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-y-20 translate-x-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full translate-y-16 -translate-x-16"></div>

          {/* Success Icon */}
          <div className="flex justify-center mb-4 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-white/30 rounded-full animate-ping"></div>
              <div className="relative bg-white rounded-full p-4">
                <CheckCircle
                  className="w-16 h-16 text-green-600"
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>

          {/* Thank You Message */}
          <h1 className="text-3xl font-bold text-white mb-2 relative z-10">
            Order Placed Successfully!
          </h1>
          <p className="text-green-100 text-sm relative z-10">
            Order #{orderData?.orderId}
          </p>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Order Items */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-gray-700" />
              Order Items
            </h2>

            <div className="space-y-3 mb-4">
              {orderData?.data?.products?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {item?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item?.quantity} • {item?.variant?.size} -{" "}
                      {item?.variant?.color}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm">
                    ৳{item?.totalPrice?.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="space-y-2">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ৳
                    {(
                      (orderData?.data?.orderTotal ?? 0) +
                      (orderData?.data?.totalDiscount ?? 0)
                    ).toFixed(2)}
                  </span>
                </div>

                {/* Discount */}
                {(orderData?.data?.totalDiscount ?? 0) > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">
                      -৳{orderData?.data?.totalDiscount.toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-green-200 pt-2"></div>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    ৳{orderData?.data?.orderTotal.toFixed(2)}
                  </span>
                </div>

                {/* Payment Method */}
                <div className="flex justify-between items-center mt-2 text-sm pt-2 border-t border-green-200">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium text-gray-900 uppercase">
                    {orderData?.data?.orderType}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          {/* <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">
              Shipping Details
            </h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-700">
                <span className="font-medium">{data.shipment.name}</span>
              </p>
              <p className="text-gray-600">{data.shipment.phone}</p>
              <p className="text-gray-600">{data.shipment.house}</p>
            </div>
          </div> */}

          {/* Delivery Info */}
          {/*   <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  Estimated Delivery
                </h3>
                <p className="text-gray-600 text-sm">{orderData?.data?.products?.[0]?.}</p>
              </div>
            </div>
          </div> */}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-xl border-2 border-gray-200 transition duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="text-sm">Continue Shopping</span>
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-200"
            >
              <Home className="w-5 h-5" />
              <span className="text-sm">Go Home</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-600">
            Need help?{" "}
            <a
              href="mailto:tigerbhaioffice@gmail.com"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
