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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Eye,
  Search,
  ShoppingBag,
  Filter,
  X,
  User,
  Phone,
  Calendar,
  Package,
} from "lucide-react";
import { ViewOrderModal } from "@/components/ui/custom/admin/order-manage/ViewOrderModal";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import { OrdersResponse } from "@/@types/order";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "use-debounce";

// Order Status Colors
const STATUS_COLORS: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  PENDING: { bg: "bg-amber-50", text: "text-amber-700", icon: "⏳" },
  CONFIRMED: { bg: "bg-blue-50", text: "text-blue-700", icon: "✓" },
  PROCESSING: { bg: "bg-indigo-50", text: "text-indigo-700", icon: "📦" },
  SHIPPED: { bg: "bg-purple-50", text: "text-purple-700", icon: "🚚" },
  DELIVERED: { bg: "bg-green-50", text: "text-green-700", icon: "✅" },
  CANCELLED: { bg: "bg-red-50", text: "text-red-700", icon: "❌" },
};

const STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export default function MyOrdersPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 1000);
  const query = new URLSearchParams();
  query.set("page", page.toString());
  query.set("limit", limit.toString());
  if (searchQuery) query.set("search", debouncedSearchQuery);
  if (selectedStatus) query.set("orderStatus", selectedStatus);

  const { data: orders, isPending } = useQueryWrapper<OrdersResponse>(
    ["my-orders", page, limit, debouncedSearchQuery, selectedStatus],
    `/sell-product-item/get-my-order?${query.toString()}`
  );

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  // Loading skeleton
  if (isPending) {
    return (
      <div className="min-h-screen p-4 md:p-6 bg-palette-bg">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-palette-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-palette-text mb-2">
            My Orders
          </h1>
          <p className="text-sm md:text-base text-palette-text/60">
            Track and manage your orders
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-3"
          >
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-palette-text/40" />
              <Input
                placeholder="Search by order number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200"
              />
            </div>

            {/* Status Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-200 justify-between min-w-[140px]"
                >
                  <span className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {selectedStatus || "All Status"}
                  </span>
                  {selectedStatus && (
                    <X
                      className="h-3 w-3 ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStatus("");
                        setPage(1);
                      }}
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 bg-white border-gray-200">
                <div className="space-y-4">
                  <h4 className="font-semibold text-sm text-palette-text">
                    Filter by Status
                  </h4>
                  <RadioGroup
                    value={selectedStatus}
                    onValueChange={(value) => {
                      setSelectedStatus(value);
                      setPage(1);
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="" id="status-all" />
                      <Label
                        htmlFor="status-all"
                        className="text-sm cursor-pointer"
                      >
                        All Orders
                      </Label>
                    </div>
                    {STATUS_OPTIONS.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={status}
                          id={`status-${status}`}
                        />
                        <Label
                          htmlFor={`status-${status}`}
                          className="text-sm cursor-pointer flex items-center gap-2"
                        >
                          <span>{STATUS_COLORS[status].icon}</span>
                          <span>{status}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </PopoverContent>
            </Popover>

            {/* Search Button - Mobile */}
            <Button
              type="submit"
              className="md:hidden bg-palette-btn hover:bg-palette-btn/90"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
        </div>

        {/* Mobile/Tablet Card Layout - Updated with all table info */}
        <div className="space-y-3 lg:hidden">
          {orders?.data?.map((order) => (
            <Card
              key={order._id}
              className="bg-white border border-gray-200 overflow-hidden"
            >
              <CardContent className="p-3">
                {/* Order Header: Number + Status */}
                <div className="flex justify-between items-start gap-2 mb-3 pb-2 border-b border-gray-100">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs text-palette-text/60 mb-1">
                      #{order.orderNumber}
                    </p>
                    <p className="font-bold text-base text-palette-text">
                      ৳{order.orderTotal.toLocaleString()}
                    </p>
                    {order.totalDiscount > 0 && (
                      <p className="text-xs text-green-600 font-medium">
                        Saved ৳{order.totalDiscount.toLocaleString()}
                      </p>
                    )}
                  </div>
                  <Badge
                    className={`${STATUS_COLORS[order.orderStatus]?.bg} ${
                      STATUS_COLORS[order.orderStatus]?.text
                    } border-0 text-xs px-2 py-1 whitespace-nowrap`}
                  >
                    {STATUS_COLORS[order.orderStatus]?.icon} {order.orderStatus}
                  </Badge>
                </div>

                {/* Customer Info */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-start gap-2">
                    <User className="h-3.5 w-3.5 text-palette-text/60 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-palette-text truncate">
                        {order.shipment.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-palette-text/60 flex-shrink-0" />
                    <p className="text-sm text-palette-text/70">
                      {order.shipment.phone}
                    </p>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Package className="h-3.5 w-3.5 text-palette-text/60" />
                    <span className="text-palette-text/60">Items:</span>
                    <span className="font-semibold text-palette-text">
                      {order.products.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-palette-text/60" />
                    <span className="text-palette-text/60">Date:</span>
                    <span className="font-medium text-palette-text">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>

                {/* View Button */}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full border-gray-200 h-8 text-xs"
                  onClick={() => handleViewOrder(order)}
                >
                  <Eye className="h-3.5 w-3.5 mr-1.5" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Desktop Table - Hidden on mobile/tablet */}
        <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-palette-btn hover:bg-palette-btn">
                <TableHead className="text-white font-semibold">
                  Order Number
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
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.data?.map((order) => (
                <TableRow
                  key={order._id}
                  className="hover:bg-palette-bg/50 transition-colors"
                >
                  <TableCell className="font-mono text-xs">
                    #{order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-palette-text">
                        {order.shipment.name}
                      </p>
                      <p className="text-sm text-palette-text/60">
                        {order.shipment.phone}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-palette-btn text-white text-sm font-semibold">
                      {order.products.length}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-bold text-palette-text">
                        ৳{order.orderTotal.toLocaleString()}
                      </p>
                      {order.totalDiscount > 0 && (
                        <p className="text-xs text-green-600 font-medium">
                          Saved ৳{order.totalDiscount}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`${STATUS_COLORS[order.orderStatus]?.bg} ${
                        STATUS_COLORS[order.orderStatus]?.text
                      } border-0`}
                    >
                      {STATUS_COLORS[order.orderStatus]?.icon}{" "}
                      {order.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatDate(order.createdAt)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewOrder(order)}
                      className="border-gray-200"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Empty State */}
        {orders?.data?.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <div className="flex flex-col items-center">
              <div className="p-4 bg-palette-bg rounded-full mb-4">
                <ShoppingBag className="h-12 w-12 text-palette-text/40" />
              </div>
              <h3 className="text-xl font-semibold text-palette-text mb-2">
                No orders found
              </h3>
              <p className="text-palette-text/60 mb-6">
                {searchQuery || selectedStatus
                  ? "Try adjusting your filters"
                  : "You haven't placed any orders yet"}
              </p>
              <Button className="bg-palette-btn hover:bg-palette-btn/90">
                Start Shopping
              </Button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {orders && orders.totalPages > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-6">
            <p className="text-sm text-palette-text/60 text-center md:text-left">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, orders.total)} of {orders.total} orders
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setPage(Math.max(page - 1, 1))}
                disabled={page === 1}
                variant="outline"
                size="sm"
                className="border-gray-200"
              >
                Previous
              </Button>
              <div className="px-4 py-2 rounded-lg font-semibold bg-palette-btn text-white text-sm">
                {page} / {orders.totalPages}
              </div>
              <Button
                onClick={() => setPage(Math.min(page + 1, orders.totalPages))}
                disabled={page === orders.totalPages}
                variant="outline"
                size="sm"
                className="border-gray-200"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* View Order Modal */}
      <ViewOrderModal
        order={selectedOrder}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedOrder(null);
        }}
      />
    </div>
  );
}
