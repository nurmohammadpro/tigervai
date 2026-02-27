"use client";

import {
  useQueryStates,
  parseAsString,
  parseAsInteger,
  parseAsBoolean,
} from "nuqs";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FilterSidebar } from "./FilterSidebar";
import { SortBar } from "./SortBar";
import { ProductCard } from "../navbar/common/CommonCard";
import { useDebounce, useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";

interface SearchClientProps {
  data: any;
}

export function SearchClient({ data }: SearchClientProps) {
  const [filters, setFilters] = useQueryStates(
    {
      q: parseAsString,
      category: parseAsString,
      subMain: parseAsString,
      brandName: parseAsString,
      main: parseAsString,
      hasOffer: parseAsBoolean,
      minPrice: parseAsInteger.withDefault(0),
      maxPrice: parseAsInteger.withDefault(100000),
      minRating: parseAsInteger.withDefault(0),
      maxRating: parseAsInteger.withDefault(5),
      sortBy: parseAsString,
      sortOrder: parseAsString,
      page: parseAsInteger.withDefault(1),
      limit: parseAsInteger.withDefault(20),
    },
    {
      history: "push",
      shallow: false,
    }
  );
  const [localChanges, setLocalChanges] = useState({
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minRating: filters.minRating,
    maxRating: filters.maxRating,
  });

  const handleReset = () => {
    setFilters({
      q: null,
      category: null,
      subMain: null,
      brandName: null,
      main: null,
      hasOffer: null,
      minPrice: 0,
      maxPrice: 100000,
      minRating: 0,
      maxRating: 5,
      sortBy: "createdAt",
      sortOrder: "desc",
      page: 1,
    });
  };

  const debouncedUpdateFilters = useDebouncedCallback(() => {
    setFilters({
      minPrice: localChanges.minPrice,
      maxPrice: localChanges.maxPrice,
      minRating: localChanges.minRating,
      maxRating: localChanges.maxRating,
      page: 1,
    });
  }, 600);
  useEffect(() => {
    debouncedUpdateFilters();
  }, [localChanges, debouncedUpdateFilters]);

  const filterProps = {
    facets: data.facets,
    selectedBrand: filters.brandName,
    selectedCategory: filters.category,
    selectedMain: filters.main,
    hasOffer: filters.hasOffer,
    priceRange: [localChanges.minPrice, localChanges.maxPrice] as [
      number,
      number
    ],
    ratingRange: [localChanges.minRating, localChanges.maxRating] as [
      number,
      number
    ],
    onBrandChange: (brandName: string | null) =>
      setFilters({ brandName, page: 1 }),
    onCategoryChange: (category: string | null) =>
      setFilters({ category, page: 1 }),
    onMainChange: (main: string | null) => setFilters({ main, page: 1 }),
    onHasOfferChange: (hasOffer: boolean | null) =>
      setFilters({ hasOffer, page: 1 }),
    onPriceRangeChange: ([minPrice, maxPrice]: [number, number]) =>
      setLocalChanges({
        minPrice,
        maxPrice,
        minRating: filters.minRating,
        maxRating: filters.maxRating,
      }),

    onRatingRangeChange: ([minRating, maxRating]: [number, number]) =>
      setLocalChanges({
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        minRating,
        maxRating,
      }),
    onReset: handleReset,
  };

  return (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-4 bg-white rounded-lg p-6 border border-gray-200">
          <FilterSidebar {...filterProps} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1">
        <SortBar
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onSortChange={(sortBy, sortOrder) => {
            console.log("onSortChange", sortBy, sortOrder);
            setFilters({ sortBy, sortOrder });
          }}
          totalProducts={data.total}
          mobileFilterProps={filterProps}
        />

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
          {data.items.map((product: any) => (
            <ProductCard
              key={product.id}
              product={{
                _id: product.id,
                name: product.name,
                thumbnail: product.thumbnail,
                main: product.main,
                category: product.category,
                price: product.price,
                offerPrice: product.offerPrice,
                hasOffer: product.hasOffer,
                brandName: product.brandName,
                slug: product.slug,
                stock: product.stock,
                rating: product.rating,
                // ✅ Add price range fields
                minPrice: product.minPrice ?? product.offerPrice ?? product.price ?? 0,
                maxPrice: product.maxPrice ?? product.offerPrice ?? product.price ?? 0,
                minOriginalPrice: product.minOriginalPrice ?? product.price ?? 0,
                maxOriginalPrice: product.maxOriginalPrice ?? product.price ?? 0,
              }}
            />
          ))}
        </div>

        {/* Pagination */}
        {data.pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ page: filters.page - 1 })}
              disabled={!data.pagination.hasPreviousPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from(
              { length: data.pagination.totalPages },
              (_, i) => i + 1
            ).map((p) => (
              <Button
                key={p}
                variant={p === filters.page ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters({ page: p })}
                className={p === filters.page ? "bg-palette-btn" : ""}
              >
                {p}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilters({ page: filters.page + 1 })}
              disabled={!data.pagination.hasNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
