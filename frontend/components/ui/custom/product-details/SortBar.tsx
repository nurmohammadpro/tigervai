"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MobileFilterSheet } from "./MobileFilterSheet";

interface SortBarProps {
  sortBy: string;
  sortOrder: string;
  onSortChange: (sortBy: string, sortOrder: string) => void;
  totalProducts: number;
  mobileFilterProps?: any;
}

export function SortBar({
  sortBy,
  sortOrder,
  onSortChange,
  totalProducts,
  mobileFilterProps,
}: SortBarProps) {
  const currentValue = sortBy && sortOrder ? `${sortBy}-${sortOrder}` : null;
  console.log("currentValue", currentValue);

  return (
    <div className="flex items-center justify-between flex-wrap mb-6 bg-white p-4 rounded-lg border border-gray-200">
      <p className="text-sm text-gray-600">
        <span className="font-medium text-palette-text">{totalProducts}</span>{" "}
        products found
      </p>

      <div className="flex items-center gap-3">
        <div className=" block lg:hidden">
          {mobileFilterProps && <MobileFilterSheet {...mobileFilterProps} />}
        </div>

        <Select
          value={currentValue ?? undefined}
          onValueChange={(v) => {
            /* console.log("onValueChange", v); */
            const [newSortBy, newSortOrder] = v.split("-");
            /* console.log("onValueChange-break", newSortBy, newSortOrder); */
            onSortChange(newSortBy, newSortOrder);
          }}
        >
          <SelectTrigger className="w-[180px] border-gray-200">
            <SelectValue placeholder="Select a value" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="rating-desc">Highest Rated</SelectItem>
            <SelectItem value="stock-desc">Most Stock</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
