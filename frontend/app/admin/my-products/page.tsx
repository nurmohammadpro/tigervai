// app/dashboard/products/page.tsx
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Edit2, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { ViewProductModal } from "@/components/ui/custom/admin/create-edit-product/ViewProductModal";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import { Product, ProductApiResponse } from "@/@types/short-product";
import { useQueryClient } from "@tanstack/react-query";
import { useCommonMutationApi } from "@/api-hook/mutation-common";
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

// Static product data
const STATIC_PRODUCTS = [
  {
    _id: "1",
    name: "Premium Cotton T-Shirt",
    price: 1200,
    offerPrice: 999,
    stock: 45,
    category: { main: "MEN", category: "T-Shirts" },
    brand: { id: "brand1", name: "Nike" },
    isActive: true,
    createdAt: "2025-11-01T10:00:00Z",
    thumbnail: { url: "/placeholder-product.jpg", key: "thumb1", id: "t1" },
    variants: [
      { size: "M", color: "Red", price: 1200, discountPrice: 999, stock: 15 },
      { size: "L", color: "Red", price: 1200, discountPrice: 999, stock: 20 },
      { size: "M", color: "Blue", price: 1200, stock: 10 },
    ],
    description: "High-quality cotton t-shirt perfect for everyday wear",
  },
  {
    _id: "2",
    name: "Running Shoes Pro",
    price: 5500,
    offerPrice: 4800,
    stock: 30,
    category: { main: "MEN", category: "Shoes" },
    brand: { id: "brand2", name: "Adidas" },
    isActive: true,
    createdAt: "2025-11-02T10:00:00Z",
    thumbnail: { url: "/placeholder-product.jpg", key: "thumb2", id: "t2" },
    variants: [
      {
        size: "42",
        color: "Black",
        price: 5500,
        discountPrice: 4800,
        stock: 10,
      },
      {
        size: "43",
        color: "Black",
        price: 5500,
        discountPrice: 4800,
        stock: 12,
      },
      { size: "42", color: "White", price: 5500, stock: 8 },
    ],
    description: "Professional running shoes with advanced cushioning",
  },
  {
    _id: "3",
    name: "Denim Jeans Slim Fit",
    price: 2500,
    stock: 60,
    category: { main: "MEN", category: "Jeans" },
    brand: { id: "brand3", name: "Levi's" },
    isActive: true,
    createdAt: "2025-11-03T10:00:00Z",
    thumbnail: { url: "/placeholder-product.jpg", key: "thumb3", id: "t3" },
    variants: [
      { size: "32", color: "Dark Blue", price: 2500, stock: 20 },
      { size: "34", color: "Dark Blue", price: 2500, stock: 25 },
      { size: "32", color: "Light Blue", price: 2500, stock: 15 },
    ],
    description: "Classic slim-fit denim jeans",
  },
  {
    _id: "4",
    name: "Summer Floral Dress",
    price: 3200,
    offerPrice: 2800,
    stock: 25,
    category: { main: "WOMEN", category: "Dresses" },
    brand: { id: "brand4", name: "Zara" },
    isActive: true,
    createdAt: "2025-11-04T10:00:00Z",
    thumbnail: { url: "/placeholder-product.jpg", key: "thumb4", id: "t4" },
    variants: [
      {
        size: "S",
        color: "Floral Pink",
        price: 3200,
        discountPrice: 2800,
        stock: 10,
      },
      {
        size: "M",
        color: "Floral Pink",
        price: 3200,
        discountPrice: 2800,
        stock: 15,
      },
    ],
    description: "Beautiful summer dress with floral patterns",
  },
  {
    _id: "5",
    name: "Leather Wallet",
    price: 800,
    stock: 100,
    category: { main: "MEN", category: "Accessories" },
    brand: { id: "brand5", name: "Fossil" },
    isActive: false,
    createdAt: "2025-11-05T10:00:00Z",
    thumbnail: { url: "/placeholder-product.jpg", key: "thumb5", id: "t5" },
    variants: [
      { size: "Standard", color: "Brown", price: 800, stock: 50 },
      { size: "Standard", color: "Black", price: 800, stock: 50 },
    ],
    description: "Premium leather wallet with multiple card slots",
  },
];

export default function ProductManagementPage() {
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const query = new URLSearchParams();
  query.set("page", page.toString());
  query.set("limit", limit.toString());
  query.set("sortBy", sortBy);
  query.set("sortOrder", sortOrder);

  const { data, isLoading } = useQueryWrapper<ProductApiResponse>(
    ["products", page, limit, sortBy, sortOrder],
    `/product/getProductVendorAdmin?${query.toString()}`
  );
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCommonMutationApi({
    url: "/product",
    method: "DELETE",
    successMessage: "Product deleted successfully",
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ["products"],
        exact: false,
      });
      setIsDeleteModalOpen(false);
    },
  });
  const handleDeleteProduct = (productId: string) => {
    mutate(productId);
  };

  const openDeleteDialog = (productId: string) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      mutate(productToDelete);
      setProductToDelete(null);
    }
  };

  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const paginatedProducts = products.slice((page - 1) * limit, page * limit);

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
          <h1 className="text-3xl font-bold">Product Management</h1>
          <Link href="/admin/my-products/add-product">
            <Button
              className="flex items-center gap-2 text-white"
              style={{ backgroundColor: "var(--palette-btn)" }}
            >
              <Plus size={20} />
              Add New Product
            </Button>
          </Link>
        </div>

        {/* Filters - Fixed positioning */}
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

        {/* Table */}
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
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <span style={{ color: "var(--palette-accent-1)" }}>
                      {product?.main}
                    </span>{" "}
                    {" → "}
                    <span style={{ color: "var(--palette-accent-1)" }}>
                      {product?.subMain}
                    </span>
                    {" → "}
                    {product?.category}
                  </TableCell>
                  <TableCell>{product?.brandName}</TableCell>
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
                    <span className={product.stock < 20 ? "text-red-400" : ""}>
                      {product?.stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    {/*  <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span> */}
                    N/A
                  </TableCell>
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
                      <button
                        onClick={() => openDeleteDialog(product._id)}
                        className="p-2 hover:bg-red-500/20 rounded transition"
                        title="Delete Product"
                      >
                        <Trash2 size={18} className="text-red-400" />
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteModalOpen}
        onOpenChange={(open) => {
          setIsDeleteModalOpen(open);
          if (!open) setProductToDelete(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the product.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={confirmDelete}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
