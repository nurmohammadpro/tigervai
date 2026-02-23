// app/account/wishlist/page.tsx
"use client";

import { useState, useMemo } from "react";
import { Trash2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductCard } from "@/components/ui/custom/navbar/common/CommonCard";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";

interface ShortProduct {
  _id: string;
  name: string;
  thumbnail: string;
  main: string;
  category: string;
  price: number;
  offerPrice?: number;
  hasOffer: boolean;
  brandName: string;
  slug: string;
  stock: number;
  hotDeals?: boolean;
  hotOffer?: boolean;
  productOfTheDay?: boolean;
  rating?: number;
  reviews?: number;
}

export interface Root {
  cartProducts: CartProductWrapper[];
  totalPage: number;
}

export interface CartProductWrapper {
  _id: string;
  userId: string;
  cartProducts: CartItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CartItem {
  productId: Product;
  quantity: number;
}

export interface Product {
  _id: string;
  name: string;
  thumbnail: string;
  main: string;
  category: string;
  subMain: string;
  price: number;
  offerPrice: number;
  hasOffer: boolean;
  isDigital: boolean;
  brandId: string;
  brandName: string;
  slug: string;
  isAdminCreated: boolean;
  hotDeals: boolean;
  hotOffer: boolean;
  productOfTheDay: boolean;
  stock: number;
  vendorId: string;
  variants: Variant[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  isActive: boolean;
}

export interface Variant {
  size: string;
  color: string;
  price: number;
  discountPrice: number;
  stock: number;
}

const ITEMS_PER_PAGE = 8;

export default function WishlistPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    "newest" | "price-low" | "price-high" | "popular"
  >("newest");

  // Fetch wishlist data with page parameter
  const { data, isPending, isError, refetch } = useQueryWrapper<Root>(
    ["wish-list-for-user", currentPage],
    `/cart/get-cart?page=${currentPage}`,
    {},
    120
  );

  // Transform API data to ShortProduct format
  const transformedProducts: ShortProduct[] = useMemo(() => {
    if (!data?.cartProducts?.[0]?.cartProducts) return [];

    return data.cartProducts[0].cartProducts.map((item) => ({
      _id: item.productId._id,
      name: item.productId.name,
      thumbnail: item.productId.thumbnail,
      main: item.productId.main,
      category: item.productId.category,
      price: item.productId.price,
      offerPrice: item.productId.hasOffer
        ? item.productId.offerPrice
        : undefined,
      hasOffer: item.productId.hasOffer,
      brandName: item.productId.brandName,
      slug: item.productId.slug,
      stock: item.productId.stock,
      hotDeals: item.productId.hotDeals,
      hotOffer: item.productId.hotOffer,
      productOfTheDay: item.productId.productOfTheDay,
    }));
  }, [data]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...transformedProducts];
    switch (sortBy) {
      case "price-low":
        return sorted.sort(
          (a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price)
        );
      case "price-high":
        return sorted.sort(
          (a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price)
        );
      case "popular":
        return sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
      case "newest":
      default:
        return sorted;
    }
  }, [transformedProducts, sortBy]);

  const totalPages = data?.totalPage || 1;
  const totalItems = transformedProducts.length;

  const handleRemoveFromWishlist = async (productId: string) => {
    console.log("Removed from wishlist:", productId);
    // Add your API call to remove from wishlist here
    // await removeFromWishlistAPI(productId);
    // Then refetch the data
    refetch();
  };

  const handleAddToCart = (productId: string) => {
    console.log("Add to cart:", productId);
    // Add to cart logic here
  };

  const handleViewDetails = (slug: string) => {
    console.log("View details:", slug);
    // Navigate to product details
  };

  // Loading state
  if (isPending) {
    return (
      <div className="w-full container mx-auto">
        <div className="flex items-center justify-center h-96">
          <div className="text-palette-text/60">Loading wishlist...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="w-full container mx-auto">
        <Card className="border border-gray-200 shadow-none">
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="text-6xl">⚠️</div>
              <h3 className="text-2xl font-bold text-palette-text">
                Failed to load wishlist
              </h3>
              <p className="text-palette-text/60">
                There was an error loading your wishlist. Please try again.
              </p>
              <Button
                onClick={() => refetch()}
                className="bg-palette-btn hover:bg-palette-btn/90 text-white mt-4"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 container mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-palette-text">My Wishlist</h2>
        <p className="text-palette-text/60 text-sm mt-2">
          {totalItems} item{totalItems !== 1 ? "s" : ""} saved
        </p>
      </div>

      {sortedProducts.length === 0 ? (
        // Empty State
        <Card className="border border-gray-200 shadow-none">
          <CardContent className="p-12 text-center">
            <div className="space-y-4">
              <div className="text-6xl">🛍️</div>
              <h3 className="text-2xl font-bold text-palette-text">
                Your wishlist is empty
              </h3>
              <p className="text-palette-text/60">
                Add items to your wishlist to save them for later
              </p>
              <Button className="bg-palette-btn hover:bg-palette-btn/90 text-white mt-4">
                Start Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filters & Sort */}
          <div className="flex justify-between items-center gap-4">
            <div className="text-sm text-palette-text/60">
              Showing {totalItems} item{totalItems !== 1 ? "s" : ""} on page{" "}
              {currentPage}
            </div>
            {/*  <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-palette-text">
                Sort by:
              </label>
              <Select
                value={sortBy}
                onValueChange={(value: any) => {
                  setSortBy(value);
                }}
              >
                <SelectTrigger className="w-[180px] border border-gray-200">
                  <SelectValue placeholder="Select sort option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sortedProducts.map((product) => (
              <div key={product._id} className="relative">
                <ProductCard product={product} variant="default" />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div className="text-sm text-palette-text/60">
                Page {currentPage} of {totalPages}
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <PaginationItem key={idx + 1}>
                      <PaginationLink
                        onClick={() => setCurrentPage(idx + 1)}
                        isActive={currentPage === idx + 1}
                        className={
                          currentPage === idx + 1
                            ? "bg-palette-btn text-white hover:bg-palette-btn/90"
                            : "cursor-pointer"
                        }
                      >
                        {idx + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
