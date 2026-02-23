// components/order/ViewOrderModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Package,
  User,
  MapPin,
  Phone,
  CreditCard,
  MessageSquare,
  Calendar,
  ShoppingBag,
  Tag,
  TrendingUp,
  Clock,
} from "lucide-react";

interface ViewOrderModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { color: string; textColor: string; borderColor: string; label: string }
> = {
  PENDING: {
    color: "rgba(239, 68, 68, 0.1)",
    textColor: "text-red-600",
    borderColor: "border-red-200",
    label: "Pending",
  },
  CONFIRMED: {
    color: "rgba(251, 191, 36, 0.1)",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-200",
    label: "Confirmed",
  },
  PROCESSING: {
    color: "rgba(59, 130, 246, 0.1)",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    label: "Processing",
  },
  SHIPPED: {
    color: "rgba(147, 51, 234, 0.1)",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    label: "Shipped",
  },
  DELIVERED: {
    color: "rgba(34, 197, 94, 0.1)",
    textColor: "text-green-600",
    borderColor: "border-green-200",
    label: "Delivered",
  },
  CANCELLED: {
    color: "rgba(107, 114, 128, 0.1)",
    textColor: "text-gray-600",
    borderColor: "border-gray-200",
    label: "Cancelled",
  },
};

export const ViewOrderModal: React.FC<ViewOrderModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;

  const statusConfig = STATUS_CONFIG[order.orderStatus];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const orderDate = formatDateTime(order.createdAt);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!w-[95vw] sm:!w-[90vw] lg:!w-[80vw] !max-w-[80vw] max-h-[95vh] overflow-y-auto bg-white">
        {/* Header */}
        <DialogHeader className="border-b border-gray-200 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl sm:text-2xl font-bold text-[var(--palette-text)] mb-2 flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--palette-btn)]" />
                Order Details
              </DialogTitle>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[var(--palette-accent-3)]">
                  <span className="font-mono font-semibold text-[var(--palette-text)]">
                    #{order?.orderNumber ?? "N/A"}
                  </span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1 text-xs sm:text-sm text-[var(--palette-accent-3)]">
                  <Calendar className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>{orderDate.date}</span>
                  <span className="text-xs">at {orderDate.time}</span>
                </div>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 mt-4 sm:mt-6">
          {/* Status & Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Status Card */}
            <div
              className={`p-3 sm:p-4 rounded-xl  border ${statusConfig.borderColor} bg-gradient-to-br ${statusConfig.color}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${statusConfig.textColor}`}
                />
                <p className="text-[10px] sm:text-xs font-medium text-[var(--palette-accent-3)] uppercase tracking-wide">
                  Status
                </p>
              </div>
              <Badge
                variant="outline"
                className={`${statusConfig.borderColor} ${statusConfig.textColor} font-semibold text-xs`}
              >
                {statusConfig.label}
              </Badge>
            </div>

            {/* Total Amount Card */}
            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100  border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                <p className="text-[10px] sm:text-xs font-medium text-blue-600 uppercase tracking-wide">
                  Total Amount
                </p>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-[var(--palette-text)]">
                ৳{order.orderTotal.toLocaleString()}
              </p>
            </div>

            {/* Items Card */}
            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100  border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <Package className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600" />
                <p className="text-[10px] sm:text-xs font-medium text-purple-600 uppercase tracking-wide">
                  Items
                </p>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-[var(--palette-text)]">
                {order.products.length}
              </p>
            </div>

            {/* Discount Card */}
            <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100  border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                <p className="text-[10px] sm:text-xs font-medium text-green-600 uppercase tracking-wide">
                  Saved
                </p>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-green-700">
                ৳{order.totalDiscount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="bg-white rounded-xl  border border-gray-200 p-4 sm:p-5 ">
            <h3 className="text-base sm:text-lg font-bold text-[var(--palette-text)] mb-3 sm:mb-4 flex items-center gap-2">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--palette-btn)]" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--palette-accent-3)] mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-[var(--palette-accent-3)] mb-1">
                    Full Name
                  </p>
                  <p className="font-semibold text-sm sm:text-base text-[var(--palette-text)] break-words">
                    {order?.shipment?.name}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--palette-accent-3)] mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-[var(--palette-accent-3)] mb-1">
                    Phone Number
                  </p>
                  <p className="font-semibold text-sm sm:text-base text-[var(--palette-text)]">
                    {order?.shipment?.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:col-span-2">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--palette-accent-3)] mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-[var(--palette-accent-3)] mb-1">
                    Delivery Address
                  </p>
                  <p className="font-semibold text-sm sm:text-base text-[var(--palette-text)] break-words">
                    {order?.shipment?.house}
                  </p>
                </div>
              </div>
              <div className=" grid grid-cols-1 md:grid-cols-2 gap-1">
                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:col-span-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--palette-accent-3)] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-[var(--palette-accent-3)] mb-1">
                      Thana
                    </p>
                    <p className="font-semibold text-sm sm:text-base text-[var(--palette-text)] break-words">
                      {order?.shipment?.thana}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:col-span-2">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--palette-accent-3)] mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-[var(--palette-accent-3)] mb-1">
                      District
                    </p>
                    <p className="font-semibold text-sm sm:text-base text-[var(--palette-text)] break-words">
                      {order?.shipment?.district}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--palette-accent-3)] mt-0.5" />
                <div>
                  <p className="text-[10px] sm:text-xs text-[var(--palette-accent-3)] mb-1">
                    Payment Method
                  </p>
                  <Badge className="bg-[var(--palette-btn)] text-white text-xs">
                    {order.shipment.paymentMethod}
                  </Badge>
                </div>
              </div>

              {order.shipment.comment && (
                <div className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-amber-50 rounded-lg border border-amber-200 sm:col-span-2">
                  <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] sm:text-xs text-amber-700 mb-1 font-medium">
                      Customer Note
                    </p>
                    <p className="text-xs sm:text-sm text-[var(--palette-text)] italic break-words">
                      "{order.shipment.comment}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl  border border-gray-200 p-4 sm:p-5 ">
            <h3 className="text-base sm:text-lg font-bold text-[var(--palette-text)] mb-3 sm:mb-4 flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--palette-btn)]" />
                Order Items
              </div>
              <Badge variant="secondary" className="ml-auto text-xs">
                {order.products.length}{" "}
                {order.products.length === 1 ? "item" : "items"}
              </Badge>
            </h3>
            <div className="space-y-3">
              {order.products.map((product: any, index: number) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-[var(--palette-btn)] transition-colors"
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-sm sm:text-base text-[var(--palette-text)] break-words flex-1">
                          {product.name}
                        </h4>
                        <div className="text-right flex-shrink-0">
                          <p className="text-base sm:text-lg font-bold text-[var(--palette-text)]">
                            ৳{product.totalPrice.toLocaleString()}
                          </p>
                          <p className="text-[10px] sm:text-xs text-[var(--palette-accent-3)]">
                            ৳{product.unitPrice.toLocaleString()} ×{" "}
                            {product.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.variant?.size && (
                          <Badge variant="outline" className="text-xs">
                            Size: {product.variant.size}
                          </Badge>
                        )}
                        {product.variant?.color && (
                          <Badge variant="outline" className="text-xs">
                            Color: {product.variant.color}
                          </Badge>
                        )}
                        {product.brandName && (
                          <Badge
                            variant="secondary"
                            className="text-xs bg-[var(--palette-btn)] text-white"
                          >
                            {product.brandName}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          Qty: {product.quantity}
                        </Badge>
                      </div>

                      {(product.mainCategory || product.category) && (
                        <div className="mt-2 text-[10px] sm:text-xs text-[var(--palette-accent-3)]">
                          <span>
                            {product.mainCategory}{" "}
                            {product.category && `> ${product.category}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl  border border-gray-200 p-4 sm:p-5 ">
            <h3 className="text-base sm:text-lg font-bold text-[var(--palette-text)] mb-3 sm:mb-4 flex items-center gap-2">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--palette-btn)]" />
              Payment Summary
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="text-[var(--palette-accent-3)]">Subtotal</span>
                <span className="font-semibold text-[var(--palette-text)]">
                  ৳{(order.orderTotal + order.totalDiscount).toLocaleString()}
                </span>
              </div>

              {order.totalDiscount > 0 && (
                <div className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-[var(--palette-accent-3)]">
                    Discount Applied
                  </span>
                  <span className="font-semibold text-green-600">
                    -৳{order.totalDiscount.toLocaleString()}
                  </span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between items-center pt-2">
                <span className="text-base sm:text-lg font-bold text-[var(--palette-text)]">
                  Total Amount
                </span>
                <span className="text-xl sm:text-2xl font-bold text-[var(--palette-btn)]">
                  ৳{order.orderTotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-xl  border border-gray-200 p-4 sm:p-5 ">
            <h3 className="text-base sm:text-lg font-bold text-[var(--palette-text)] mb-3 sm:mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--palette-btn)]" />
              Order Timeline
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-xs sm:text-sm">
                <div className="sm:w-32 text-[var(--palette-accent-3)] font-medium">
                  Created:
                </div>
                <div className="font-semibold text-[var(--palette-text)]">
                  {formatDate(order.createdAt)}
                </div>
              </div>
              {order.updatedAt !== order.createdAt && (
                <div className="flex flex-col sm:flex-row gap-1 sm:gap-3 text-xs sm:text-sm">
                  <div className="sm:w-32 text-[var(--palette-accent-3)] font-medium">
                    Last Updated:
                  </div>
                  <div className="font-semibold text-[var(--palette-text)]">
                    {formatDate(order.updatedAt)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
