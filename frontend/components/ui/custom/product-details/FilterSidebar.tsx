"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { RangeSlider } from "./RangeSlider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterSidebarProps {
  facets: {
    brandName: Record<string, number>;
    category: Record<string, number>;
    main: Record<string, number>;
    hasOffer: Record<string, number>;
  };
  selectedBrand: string | null;
  selectedCategory: string | null;
  selectedMain: string | null;
  hasOffer: boolean | null;
  priceRange: [number, number];
  ratingRange: [number, number];
  onBrandChange: (brand: string | null) => void;
  onCategoryChange: (category: string | null) => void;
  onMainChange: (main: string | null) => void;
  onHasOfferChange: (hasOffer: boolean | null) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onRatingRangeChange: (range: [number, number]) => void;
  onReset: () => void;
}

export function FilterSidebar({
  facets,
  selectedBrand,
  selectedCategory,
  selectedMain,
  hasOffer,
  priceRange,
  ratingRange,
  onBrandChange,
  onCategoryChange,
  onMainChange,
  onHasOfferChange,
  onPriceRangeChange,
  onRatingRangeChange,
  onReset,
}: FilterSidebarProps) {
  const hasActiveFilters =
    selectedBrand ||
    selectedCategory ||
    selectedMain ||
    hasOffer !== null ||
    priceRange[0] > 0 ||
    priceRange[1] < 100000 ||
    ratingRange[0] > 0 ||
    ratingRange[1] < 5;

  return (
    <div className="space-y-6">
      {/* Header with Reset */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-palette-text">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-palette-btn hover:bg-palette-btn/10"
          >
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Price Range */}
      <div className="border-b border-gray-200 pb-6">
        <RangeSlider
          label="Price Range"
          min={0}
          max={100000}
          step={100}
          value={priceRange}
          onValueChange={onPriceRangeChange}
          prefix="৳"
        />
      </div>

      {/* Rating Range */}
      <div className="border-b border-gray-200 pb-6">
        <RangeSlider
          label="Rating"
          min={0}
          max={5}
          step={1}
          value={ratingRange}
          onValueChange={onRatingRangeChange}
          suffix=" ★"
        />
      </div>

      {/* Has Offer */}
      {Object.keys(facets.hasOffer).length > 0 && (
        <div className="border-b border-gray-200 pb-6">
          <Label className="text-sm font-medium text-palette-text mb-3 block">
            Special Offers
          </Label>
          <RadioGroup
            value={hasOffer === null ? "all" : String(hasOffer)}
            onValueChange={(v) =>
              onHasOfferChange(v === "all" ? null : v === "true")
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="offer-all" />
              <label htmlFor="offer-all" className="text-sm cursor-pointer">
                All Products
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="offer-yes" />
              <label htmlFor="offer-yes" className="text-sm cursor-pointer">
                On Sale ({facets.hasOffer.true || 0})
              </label>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Brand */}
      {Object.keys(facets.brandName).length > 0 && (
        <div className="border-b border-gray-200 pb-6">
          <Label className="text-sm font-medium text-palette-text mb-3 block">
            Brand
          </Label>
          <RadioGroup
            value={selectedBrand || "all"}
            onValueChange={(v) => onBrandChange(v === "all" ? null : v)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="brand-all" />
              <label htmlFor="brand-all" className="text-sm cursor-pointer">
                All Brands
              </label>
            </div>
            {Object.entries(facets.brandName).map(([brand, count]) => (
              <div key={brand} className="flex items-center space-x-2">
                <RadioGroupItem value={brand} id={`brand-${brand}`} />
                <label
                  htmlFor={`brand-${brand}`}
                  className="text-sm cursor-pointer"
                >
                  {brand} ({count})
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Category */}
      {Object.keys(facets.category).length > 0 && (
        <div className="border-b border-gray-200 pb-6">
          <Label className="text-sm font-medium text-palette-text mb-3 block">
            Category
          </Label>
          <RadioGroup
            value={selectedCategory || "all"}
            onValueChange={(v) => onCategoryChange(v === "all" ? null : v)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="category-all" />
              <label htmlFor="category-all" className="text-sm cursor-pointer">
                All Categories
              </label>
            </div>
            {Object.entries(facets.category).map(([category, count]) => (
              <div key={category} className="flex items-center space-x-2">
                <RadioGroupItem value={category} id={`category-${category}`} />
                <label
                  htmlFor={`category-${category}`}
                  className="text-sm cursor-pointer"
                >
                  {category} ({count})
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {/* Main Category */}
      {Object.keys(facets.main).length > 0 && (
        <div className="pb-6">
          <Label className="text-sm font-medium text-palette-text mb-3 block">
            Main Category
          </Label>
          <RadioGroup
            value={selectedMain || "all"}
            onValueChange={(v) => onMainChange(v === "all" ? null : v)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="main-all" />
              <label htmlFor="main-all" className="text-sm cursor-pointer">
                All
              </label>
            </div>
            {Object.entries(facets.main).map(([main, count]) => (
              <div key={main} className="flex items-center space-x-2">
                <RadioGroupItem value={main} id={`main-${main}`} />
                <label
                  htmlFor={`main-${main}`}
                  className="text-sm cursor-pointer"
                >
                  {main} ({count})
                </label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}
    </div>
  );
}
