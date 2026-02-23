"use client";

import React, { useState, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Edit2, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { ViewProductModal } from "@/components/ui/custom/admin/create-edit-product/ViewProductModal";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import { Product, ProductApiResponse } from "@/@types/short-product";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Replace with your radio components if different
import { useCommonMutationApi } from "@/api-hook/mutation-common";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Static product data (can remove after API integration)

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

export default function ProductManagementPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isMobile = useIsMobile();

  const query = new URLSearchParams();
  query.set("page", page.toString());
  query.set("limit", limit.toString());
  query.set("sortBy", sortBy);
  query.set("sortOrder", sortOrder);

  const { data, isLoading } = useQueryWrapper<ProductApiResponse>(
    ["products-data", page, limit, sortBy, sortOrder],
    `/product/getAllProductsAdmin?${query.toString()}`
  );
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCommonMutationApi({
    url: "/product",
    method: "DELETE",
    successMessage: "Product deleted successfully",
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ["products-data"],
        exact: false,
      });
      setIsDeleteModalOpen(false);
    },
  });

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleDeleteProduct = (productId: string) => {
    mutate(productId);
  };

  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div
      className="min-h-screen p-6"
      style={{
        color: "var(--palette-text)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Product Management Admin</h1>
          <Link href="/admin/my-products/add-product"></Link>
        </div>

        {/* Filters */}
        {isMobile ? (
          <div className="mb-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  style={{ color: "var(--palette-text)" }}
                >
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="center"
                className="w-64 p-4"
                style={{
                  backgroundColor: "var(--palette-bg)",
                  color: "var(--palette-text)",
                  borderColor: "var(--palette-accent-3)",
                }}
              >
                <div className="mb-4">
                  <label
                    className="block mb-1"
                    style={{ color: "var(--palette-accent-3)" }}
                  >
                    Sort By
                  </label>
                  <RadioGroup
                    value={sortBy}
                    onValueChange={(value) => setSortBy(value)}
                    className="flex flex-col gap-1"
                  >
                    <RadioGroupItem value="createdAt" id="sort-createdAt" />
                    <label htmlFor="sort-createdAt" className="cursor-pointer">
                      Created Date
                    </label>

                    <RadioGroupItem value="name" id="sort-name" />
                    <label htmlFor="sort-name" className="cursor-pointer">
                      Product Name
                    </label>

                    <RadioGroupItem value="price" id="sort-price" />
                    <label htmlFor="sort-price" className="cursor-pointer">
                      Price
                    </label>

                    <RadioGroupItem value="stock" id="sort-stock" />
                    <label htmlFor="sort-stock" className="cursor-pointer">
                      Stock
                    </label>
                  </RadioGroup>
                </div>

                <div className="mb-4">
                  <label
                    className="block mb-1"
                    style={{ color: "var(--palette-accent-3)" }}
                  >
                    Order
                  </label>
                  <RadioGroup
                    value={sortOrder}
                    onValueChange={(value) => setSortOrder(value)}
                    className="flex flex-col gap-1"
                  >
                    <RadioGroupItem value="asc" id="order-asc" />
                    <label htmlFor="order-asc" className="cursor-pointer">
                      Ascending
                    </label>

                    <RadioGroupItem value="desc" id="order-desc" />
                    <label htmlFor="order-desc" className="cursor-pointer">
                      Descending
                    </label>
                  </RadioGroup>
                </div>

                <div>
                  <label
                    className="block mb-1"
                    style={{ color: "var(--palette-accent-3)" }}
                  >
                    Per Page
                  </label>
                  <RadioGroup
                    value={limit.toString()}
                    onValueChange={(value) => setLimit(parseInt(value))}
                    className="flex flex-col gap-1"
                  >
                    <RadioGroupItem value="10" id="limit-10" />
                    <label htmlFor="limit-10" className="cursor-pointer">
                      10 per page
                    </label>

                    <RadioGroupItem value="20" id="limit-20" />
                    <label htmlFor="limit-20" className="cursor-pointer">
                      20 per page
                    </label>

                    <RadioGroupItem value="50" id="limit-50" />
                    <label htmlFor="limit-50" className="cursor-pointer">
                      50 per page
                    </label>
                  </RadioGroup>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          // Desktop Filters (unchanged, as in your initial code)
          <div className="flex gap-4 mb-6 items-center">
            <div className="flex-1">
              <label
                className="text-sm mb-1 block"
                style={{ color: "var(--palette-accent-3)" }}
              >
                Sort By
              </label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger
                  className="w-full"
                  style={{
                    borderColor: "var(--palette-accent-3)",
                    backgroundColor: "var(--palette-bg)",
                    color: "var(--palette-text)",
                  }}
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: "var(--palette-bg)",
                    color: "var(--palette-text)",
                  }}
                >
                  <SelectItem value="createdAt">Created Date</SelectItem>
                  <SelectItem value="name">Product Name</SelectItem>
                  <SelectItem value="price">Price</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label
                className="text-sm mb-1 block"
                style={{ color: "var(--palette-accent-3)" }}
              >
                Order
              </label>
              <Select
                value={sortOrder}
                onValueChange={(value: any) => setSortOrder(value)}
              >
                <SelectTrigger
                  className="w-full"
                  style={{
                    borderColor: "var(--palette-accent-3)",
                    backgroundColor: "var(--palette-bg)",
                    color: "var(--palette-text)",
                  }}
                >
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: "var(--palette-bg)",
                    color: "var(--palette-text)",
                  }}
                >
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label
                className="text-sm mb-1 block"
                style={{ color: "var(--palette-accent-3)" }}
              >
                Per Page
              </label>
              <Select
                value={limit.toString()}
                onValueChange={(value) => setLimit(parseInt(value))}
              >
                <SelectTrigger
                  className="w-full"
                  style={{
                    borderColor: "var(--palette-accent-3)",
                    backgroundColor: "var(--palette-bg)",
                    color: "var(--palette-text)",
                  }}
                >
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent
                  style={{
                    backgroundColor: "var(--palette-bg)",
                    color: "var(--palette-text)",
                  }}
                >
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="20">20 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Products List */}
        {isMobile ? (
          <div className="space-y-4">
            {data?.data?.map((product) => (
              <div
                key={product._id}
                className="p-4 rounded-lg border"
                style={{
                  borderColor: "var(--palette-accent-3)",
                  backgroundColor: "var(--palette-bg)",
                }}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={product?.thumbnail.url}
                    alt={product?.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3
                      className="font-semibold"
                      style={{ color: "var(--palette-text)" }}
                    >
                      {product?.name}
                    </h3>
                    <p style={{ color: "var(--palette-accent-1)" }}>
                      {product?.main} → {product?.category}
                    </p>
                    <p>{product?.name}</p>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div>
                    {product?.offerPrice ? (
                      <>
                        <span
                          className="line-through text-sm"
                          style={{ color: "var(--palette-accent-3)" }}
                        >
                          ৳{product?.price}
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: "var(--palette-btn)" }}
                        >
                          ৳{product?.offerPrice}
                        </span>
                      </>
                    ) : (
                      <span>৳{product?.price}</span>
                    )}
                  </div>
                  <div>
                    <span className={product?.stock < 20 ? "text-red-400" : ""}>
                      {product?.stock}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleViewProduct(product)}
                    title="View Product"
                  >
                    <Eye size={18} style={{ color: "var(--palette-btn)" }} />
                  </Button>
                  <Link
                    href={`/admin/my-products/edit-product/${product?.slug}`}
                  >
                    <Button variant="ghost" title="Edit Product">
                      <Edit2
                        size={18}
                        style={{ color: "var(--palette-accent-1)" }}
                      />
                    </Button>
                  </Link>

                  <Dialog
                    open={isDeleteModalOpen}
                    onOpenChange={setIsDeleteModalOpen}
                  >
                    <DialogTrigger
                      className="p-2 hover:bg-red-500/20 rounded transition"
                      title="Delete Product"
                    >
                      <Trash2 size={18} className="text-red-400" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription></DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                        <Button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="  hover:bg-red-700 "
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="rounded-lg border overflow-hidden"
            style={{ borderColor: "var(--palette-accent-3)" }}
          >
            <Table>
              <TableHeader style={{ backgroundColor: "var(--palette-btn)" }}>
                <TableRow>
                  <TableHead className="text-white font-semibold">
                    Product Name
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Category
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Brand
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Price
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Stock
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Status
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((product) => (
                  <TableRow
                    key={product._id}
                    style={{ borderColor: "var(--palette-accent-3)" }}
                    className="hover:bg-white/5 transition"
                  >
                    <TableCell className="font-medium">
                      {product?.name}
                    </TableCell>
                    <TableCell>
                      <span style={{ color: "var(--palette-accent-1)" }}>
                        {product?.main}
                      </span>{" "}
                      {" → "}
                      <span style={{ color: "var(--palette-accent-1)" }}>
                        {product?.category}
                      </span>
                    </TableCell>
                    <TableCell>{product?.name}</TableCell>
                    <TableCell>
                      {product?.offerPrice ? (
                        <div className="flex flex-col">
                          <span
                            className="line-through text-sm"
                            style={{ color: "var(--palette-accent-3)" }}
                          >
                            ৳{product?.price}
                          </span>
                          <span
                            className="font-semibold"
                            style={{ color: "var(--palette-btn)" }}
                          >
                            ৳{product?.offerPrice}
                          </span>
                        </div>
                      ) : (
                        <span>৳{product?.price}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={product?.stock < 20 ? "text-red-400" : ""}
                      >
                        {product?.stock}
                      </span>
                    </TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="p-2 hover:bg-blue-500/20 rounded transition"
                          title="View Product"
                        >
                          <Eye
                            size={18}
                            style={{ color: "var(--palette-btn)" }}
                          />
                        </button>
                        <Link
                          href={`/admin/my-products/edit-product/${product.slug}`}
                        >
                          <button
                            className="p-2 hover:bg-yellow-500/20 rounded transition"
                            title="Edit Product"
                          >
                            <Edit2
                              size={18}
                              style={{ color: "var(--palette-accent-1)" }}
                            />
                          </button>
                        </Link>

                        <Dialog
                          open={isDeleteModalOpen}
                          onOpenChange={setIsDeleteModalOpen}
                        >
                          <DialogTrigger
                            className="p-2 hover:bg-red-500/20 rounded transition"
                            title="Delete Product"
                          >
                            <Trash2 size={18} className="text-red-400" />
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Are you absolutely sure?
                              </DialogTitle>
                              <DialogDescription></DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="sm:justify-start">
                              <DialogClose asChild>
                                <Button type="button" variant="secondary">
                                  Close
                                </Button>
                              </DialogClose>
                              <Button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="  hover:bg-red-700 "
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div style={{ color: "var(--palette-accent-3)" }}>
            Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)}{" "}
            of {total}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage(Math.max(page - 1, 1))}
              disabled={page === 1}
              variant="outline"
              style={{
                borderColor: "var(--palette-accent-3)",
                color:
                  page === 1
                    ? "var(--palette-accent-3)"
                    : "var(--palette-text)",
              }}
            >
              Previous
            </Button>
            <div
              className="px-4 py-2 rounded"
              style={{
                backgroundColor: "var(--palette-btn)",
                color: "white",
              }}
            >
              Page {page} of {totalPages}
            </div>
            <Button
              onClick={() => setPage(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              variant="outline"
              style={{
                borderColor: "var(--palette-accent-3)",
                color:
                  page === totalPages
                    ? "var(--palette-accent-3)"
                    : "var(--palette-text)",
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* View Product Modal */}
      <ViewProductModal
        product={selectedProduct}
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
