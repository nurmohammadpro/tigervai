// components/order/UpdateOrderStatusModal.tsx
"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  X,
  CheckCircle,
  Clock,
  Package,
  Truck,
  Home,
  XCircle,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCommonMutationApi } from "@/api-hook/mutation-common";
import { Order } from "@/@types/order";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateOrderStatusModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate: (newStatus: string) => void;
}

// Enhanced status information with icons
const STATUS_CONFIG: Record<
  string,
  {
    icon: React.ReactNode;
    label: string;
    description: string;
    color: string;
    textColor: string;
    borderColor: string;
    bgGradient: string;
  }
> = {
  PENDING: {
    icon: <Clock className="h-6 w-6" />,
    label: "Pending",
    description: "Order placed and awaiting confirmation",
    color: "rgba(239, 68, 68, 0.1)",
    textColor: "text-red-600",
    borderColor: "border-red-200",
    bgGradient: "from-red-50 to-red-100",
  },
  CONFIRMED: {
    icon: <CheckCircle className="h-6 w-6" />,
    label: "Confirmed",
    description: "Order confirmed and payment verified",
    color: "rgba(251, 191, 36, 0.1)",
    textColor: "text-yellow-600",
    borderColor: "border-yellow-200",
    bgGradient: "from-yellow-50 to-yellow-100",
  },
  PROCESSING: {
    icon: <Package className="h-6 w-6" />,
    label: "Processing",
    description: "Order is being prepared for shipment",
    color: "rgba(59, 130, 246, 0.1)",
    textColor: "text-blue-600",
    borderColor: "border-blue-200",
    bgGradient: "from-blue-50 to-blue-100",
  },
  SHIPPED: {
    icon: <Truck className="h-6 w-6" />,
    label: "Shipped",
    description: "Order dispatched and on the way",
    color: "rgba(147, 51, 234, 0.1)",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
    bgGradient: "from-purple-50 to-purple-100",
  },
  DELIVERED: {
    icon: <Home className="h-6 w-6" />,
    label: "Delivered",
    description: "Order successfully delivered to customer",
    color: "rgba(34, 197, 94, 0.1)",
    textColor: "text-green-600",
    borderColor: "border-green-200",
    bgGradient: "from-green-50 to-green-100",
  },
  CANCELLED: {
    icon: <XCircle className="h-6 w-6" />,
    label: "Cancelled",
    description: "Order has been cancelled",
    color: "rgba(107, 114, 128, 0.1)",
    textColor: "text-gray-600",
    borderColor: "border-gray-200",
    bgGradient: "from-gray-50 to-gray-100",
  },
};

// Status flow - what's the next valid status
const NEXT_STATUS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PROCESSING", "CANCELLED"],
  PROCESSING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const UpdateOrderStatusModal: React.FC<UpdateOrderStatusModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusUpdate,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const query = useQueryClient();
  const { mutate, isPending } = useCommonMutationApi({
    url: `/sell-product-item/status/${order?._id}`,
    method: "PATCH",
    successMessage: "Status updated successfully",
    onSuccess: () => {
      onClose();
      query.refetchQueries({ queryKey: ["orders"], exact: false });
      query.refetchQueries({ queryKey: ["orders-admin"], exact: false });

      setSelectedStatus(null);
    },
  });

  if (!order) return null;

  const currentStatus = order.orderStatus;
  const nextStatuses = NEXT_STATUS[currentStatus] || [];
  const currentConfig = STATUS_CONFIG[currentStatus];

  const handleStatusUpdate = async () => {
    if (!selectedStatus) return;
    mutate({ newStatus: selectedStatus });

    // Simulate API call
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-dvh overflow-y-scroll bg-white border-gray-200">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-[var(--palette-text)] flex items-center gap-2">
              <Package className="h-6 w-6 text-[var(--palette-btn)]" />
              Update Order Status
            </DialogTitle>
          </div>
          <p className="text-sm text-[var(--palette-accent-3)] mt-1">
            Order ID:{" "}
            <span className="font-mono font-semibold">
              {order?.orderNumber ?? "N/A"}
            </span>
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Current Status Card */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--palette-accent-3)] mb-3 uppercase tracking-wide">
              Current Status
            </h3>
            <div
              className={`p-5 rounded-xl border ${currentConfig.borderColor} bg-gradient-to-br ${currentConfig.bgGradient} shadow-sm`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 bg-white rounded-lg ${currentConfig.textColor}`}
                >
                  {currentConfig.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-xl font-bold text-[var(--palette-text)]">
                      {currentConfig.label}
                    </h4>
                    <Badge
                      variant="outline"
                      className={`${currentConfig.borderColor} ${currentConfig.textColor}`}
                    >
                      Active
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--palette-accent-3)]">
                    {currentConfig.description}
                  </p>
                </div>
              </div>

              {/* Order Details Summary */}
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-[var(--palette-accent-3)] text-xs mb-1">
                    Customer
                  </p>
                  <p className="font-semibold text-[var(--palette-text)]">
                    {order.shipment?.name}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--palette-accent-3)] text-xs mb-1">
                    Total Amount
                  </p>
                  <p className="font-semibold text-[var(--palette-text)]">
                    ৳{order.orderTotal?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[var(--palette-accent-3)] text-xs mb-1">
                    Items
                  </p>
                  <p className="font-semibold text-[var(--palette-text)]">
                    {order.products?.length} product(s)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Status Options */}
          {nextStatuses.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-[var(--palette-accent-3)] mb-3 uppercase tracking-wide flex items-center gap-2">
                <ArrowRight className="h-4 w-4" />
                Available Status Updates
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {nextStatuses.map((status) => {
                  const config = STATUS_CONFIG[status];
                  const isSelected = selectedStatus === status;

                  return (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status.toUpperCase())}
                      className={`
                        p-4 rounded-xl text-left transition-all duration-200 border
                        ${
                          isSelected
                            ? `${config.borderColor} bg-gradient-to-br ${config.bgGradient} shadow-md scale-[1.02]`
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                        }
                      `}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`
                          p-3 rounded-lg transition-colors
                          ${isSelected ? "bg-white" : "bg-gray-50"}
                          ${config.textColor}
                        `}
                        >
                          {config.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-[var(--palette-text)]">
                              {config.label}
                            </p>
                            {status === "CANCELLED" && (
                              <Badge variant="destructive" className="text-xs">
                                Final
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-[var(--palette-accent-3)]">
                            {config.description}
                          </p>
                        </div>
                        <div
                          className={`
                          w-6 h-6 rounded-full border flex items-center justify-center transition-all
                          ${isSelected ? ` bg-green-500 ` : "border-gray-300"}
                        `}
                        >
                          {/*   {isSelected && (
                            <div
                              className={`w-3 h-3 rounded-full ${config.textColor.replace(
                                "text-",
                                "bg-"
                              )}`}
                            />
                          )} */}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-white rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <p className="text-green-700 font-bold text-lg mb-1">
                Order Complete
              </p>
              <p className="text-sm text-green-600">
                This order has reached its final status. No further updates
                available.
              </p>
            </div>
          )}

          {/* Warning for Cancellation */}
          {selectedStatus === "CANCELLED" && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-700 mb-1">
                  Warning: Cancellation
                </p>
                <p className="text-sm text-red-600">
                  Cancelling this order is a final action and cannot be undone.
                  Please confirm with the customer before proceeding.
                </p>
              </div>
            </div>
          )}

          {/* Info Tip */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-700">
                <span className="font-semibold">Pro Tip:</span> Status updates
                follow a sequential workflow. You can only move to the next
                valid status in the order lifecycle.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={handleStatusUpdate}
            disabled={isPending}
            className="bg-[var(--palette-btn)] hover:bg-[var(--palette-accent-3)] text-white px-6"
          >
            {isPending ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Updating...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Update Status
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateOrderStatusModal;
