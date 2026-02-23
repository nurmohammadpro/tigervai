// app/dashboard/orders/page.tsx
"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Eye,
  Trash2,
  Clock,
  ChevronDown,
  Package,
  TrendingUp,
  X,
} from "lucide-react";
import { ViewOrderModal } from "@/components/ui/custom/admin/order-manage/ViewOrderModal";
import UpdateOrderStatusModal from "@/components/ui/custom/admin/order-manage/UpdateOrderStatusModal";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import { OrdersResponse } from "@/@types/order";
import { useQueryClient } from "@tanstack/react-query";
import { useCommonMutationApi } from "@/api-hook/mutation-common";
import { Spinner } from "@/components/ui/spinner";

// Order Status Colors
const STATUS_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  PENDING: {
    bg: "rgba(239, 68, 68, 0.1)",
    text: "text-red-600",
    border: "border-red-200",
  },
  CONFIRMED: {
    bg: "rgba(251, 191, 36, 0.1)",
    text: "text-yellow-600",
    border: "border-yellow-200",
  },
  PROCESSING: {
    bg: "rgba(59, 130, 246, 0.1)",
    text: "text-blue-600",
    border: "border-blue-200",
  },
  SHIPPED: {
    bg: "rgba(147, 51, 234, 0.1)",
    text: "text-purple-600",
    border: "border-purple-200",
  },
  DELIVERED: {
    bg: "rgba(34, 197, 94, 0.1)",
    text: "text-green-600",
    border: "border-green-200",
  },
  CANCELLED: {
    bg: "rgba(107, 114, 128, 0.1)",
    text: "text-gray-600",
    border: "border-gray-200",
  },
};

// Sort options
const SORT_OPTIONS = [
  { value: "createdAt", label: "Order Date" },
  { value: "orderTotal", label: "Total Amount" },
  { value: "orderStatus", label: "Status" },
  { value: "shipment.name", label: "Customer Name" },
];

// Status filter options
const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

// API Response Data

export default function OrderManagementPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedSortBy, setSelectedSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // Changed to single string
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [statusUpdateOrder, setStatusUpdateOrder] = useState<any>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const query = new URLSearchParams();
  query.set("page", page.toString());
  query.set("limit", limit.toString());
  query.set("sortOrder", sortOrder);
  query.set("sortBy", selectedSortBy);
  query.set("orderStatus", selectedStatus);

  const { data: orders, isPending } = useQueryWrapper<OrdersResponse>(
    ["orders", page, limit, sortOrder, selectedSortBy, selectedStatus],
    `/sell-product-item/get-all-order?${query.toString()}`
  );
  const queryClient = useQueryClient();
  const { mutate, isPending: IsDeleting } = useCommonMutationApi({
    url: `/sell-product-item/delete-sell`,
    method: "DELETE",
    successMessage: "Deleted successfully",
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["orders"] });
    },
  });

  // Filter orders by selected status
  const filteredOrders = selectedStatus
    ? orders?.data?.filter((order) => order.orderStatus === selectedStatus)
    : orders;

  const totalPages = orders?.totalPages;

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const handleOpenStatusUpdate = (order: any) => {
    setStatusUpdateOrder(order);
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatus = (newStatus: string) => {
    // Update logic here
    setIsStatusModalOpen(false);
    setStatusUpdateOrder(null);
  };

  const handleDeleteOrder = (orderId: string) => {
    mutate(orderId);
    // Delete logic here
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate statistics
  const totalRevenue = orders?.data?.reduce(
    (sum, order) => sum + order.orderTotal,
    0
  );
  const averageOrderValue = (totalRevenue ?? 0) / (orders?.data?.length ?? 1);

  // Get label for selected sort option
  const getSelectedSortLabel = () => {
    const option = SORT_OPTIONS.find((opt) => opt.value === selectedSortBy);
    return option ? option.label : "Order Date";
  };

  return (
    <div className="min-h-screen p-6 bg-[var(--palette-bg)]">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--palette-text)] mb-2">
            Order Management
          </h1>
          <p className="text-[var(--palette-accent-3)] mb-6">
            Manage and track all customer orders
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "white",
                borderColor: "var(--palette-accent-2)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--palette-accent-3)]">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold text-[var(--palette-text)] mt-1">
                    {orders?.data?.length}
                  </p>
                </div>
                <Package className="h-8 w-8 text-[var(--palette-btn)]" />
              </div>
            </div>

            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "white",
                borderColor: "var(--palette-accent-2)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--palette-accent-3)]">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-[var(--palette-text)] mt-1">
                    ৳{totalRevenue?.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: "white",
                borderColor: "var(--palette-accent-2)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--palette-accent-3)]">
                    Avg Order Value
                  </p>
                  <p className="text-2xl font-bold text-[var(--palette-text)] mt-1">
                    ৳{Math.round(averageOrderValue).toLocaleString()}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-[var(--palette-accent-1)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters with Popovers */}
        <div className="flex gap-3 mb-6 items-center flex-wrap">
          {/* Sort By Popover - SINGLE SELECTION */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-[var(--palette-accent-3)] text-[var(--palette-text)]"
              >
                Sort By:{" "}
                <span className="font-semibold ml-1">
                  {getSelectedSortLabel()}
                </span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 bg-white">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-[var(--palette-text)] mb-3">
                  Sort By
                </h4>
                <RadioGroup
                  value={selectedSortBy}
                  onValueChange={setSelectedSortBy}
                >
                  {SORT_OPTIONS.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={`sort-${option.value}`}
                      />
                      <Label
                        htmlFor={`sort-${option.value}`}
                        className="text-sm cursor-pointer text-[var(--palette-text)] font-normal"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </PopoverContent>
          </Popover>

          {/* Status Filter Popover - SINGLE SELECTION */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="border-[var(--palette-accent-3)] text-[var(--palette-text)]"
              >
                Status
                {selectedStatus && (
                  <span className="ml-2 font-semibold">: {selectedStatus}</span>
                )}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 bg-white">
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm text-[var(--palette-text)]">
                    Filter by Status
                  </h4>
                  {selectedStatus && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedStatus("")}
                      className="h-6 w-6 p-0"
                      title="Clear filter"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <RadioGroup
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <div key={status} className="flex items-center space-x-2">
                      <RadioGroupItem value={status} id={`status-${status}`} />
                      <Label
                        htmlFor={`status-${status}`}
                        className="text-sm cursor-pointer text-[var(--palette-text)] font-normal"
                      >
                        {status}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {selectedStatus && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStatus("")}
                    className="w-full mt-3 text-xs"
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* Sort Order Toggle */}
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="border-[var(--palette-accent-3)] text-[var(--palette-text)]"
          >
            {sortOrder === "asc" ? "↑ Ascending" : "↓ Descending"}
          </Button>

          {/* Clear Status Filter Button */}
          {selectedStatus && (
            <Button
              variant="ghost"
              onClick={() => setSelectedStatus("")}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Status Filter
            </Button>
          )}
        </div>

        {/* Table */}
        <div
          className="rounded-lg border overflow-hidden shadow-sm bg-white"
          style={{ borderColor: "var(--palette-accent-2)" }}
        >
          <Table>
            <TableHeader style={{ backgroundColor: "var(--palette-btn)" }}>
              <TableRow>
                <TableHead className="text-white font-semibold">
                  Order ID
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Customer
                </TableHead>
                <TableHead className="text-white font-semibold text-center">
                  Items
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Total
                </TableHead>
                <TableHead className="text-white font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-white font-semibold">Date</TableHead>
                <TableHead className="text-white font-semibold text-center">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.data?.map((order) => (
                <TableRow
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="font-mono text-xs text-[var(--palette-text)]">
                    {order?.orderNumber ?? "N/A"}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-[var(--palette-text)]">
                        {order.shipment.name}
                      </p>
                      <p className="text-sm text-[var(--palette-accent-3)]">
                        {order.shipment.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[var(--palette-btn)] text-white text-sm font-semibold">
                      {order.products.length}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-[var(--palette-text)]">
                        ৳{order.orderTotal.toLocaleString()}
                      </p>
                      {order.totalDiscount > 0 && (
                        <p className="text-xs text-green-600 font-medium">
                          Saved: ৳{order.totalDiscount}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                        STATUS_COLORS[order.orderStatus]?.text || ""
                      } ${STATUS_COLORS[order.orderStatus]?.border || ""}`}
                      style={{
                        backgroundColor: STATUS_COLORS[order.orderStatus]?.bg,
                      }}
                    >
                      {order.orderStatus}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-[var(--palette-text)]">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Order"
                      >
                        <Eye size={18} className="text-[var(--palette-btn)]" />
                      </button>
                      <button
                        onClick={() => handleOpenStatusUpdate(order)}
                        className="p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                        title="Update Status"
                      >
                        <Clock size={18} className="text-yellow-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Order"
                        disabled={IsDeleting}
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-[var(--palette-accent-3)]">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, orders?.total ?? 0)} of {orders?.total ?? 0}{" "}
            orders
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage(Math.max(page - 1, 1))}
              disabled={page === 1}
              variant="outline"
              className="border-[var(--palette-accent-3)]"
            >
              Previous
            </Button>
            <div
              className="px-4 py-2 rounded-lg font-semibold"
              style={{
                backgroundColor: "var(--palette-btn)",
                color: "white",
              }}
            >
              Page {page} of {totalPages}
            </div>
            <Button
              onClick={() =>
                setPage(Math.min(page + 1, orders?.totalPages ?? 0))
              }
              disabled={page === totalPages}
              variant="outline"
              className="border-[var(--palette-accent-3)]"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ViewOrderModal
        order={selectedOrder}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedOrder(null);
        }}
      />

      <UpdateOrderStatusModal
        order={statusUpdateOrder}
        isOpen={isStatusModalOpen}
        onClose={() => {
          setIsStatusModalOpen(false);
          setStatusUpdateOrder(null);
        }}
        onStatusUpdate={handleUpdateStatus}
      />
    </div>
  );
}
