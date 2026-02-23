import { Card, CardContent } from "@/components/ui/card";

export function ProductCardSkeleton() {
  return (
    <Card className="border border-gray-200/80 rounded-lg overflow-hidden bg-white flex flex-col animate-pulse">
      {/* Image Skeleton */}
      <div className="relative w-full h-44 sm:h-48 md:h-52 bg-gray-200 flex-shrink-0">
        {/* Badge Skeleton */}
        <div className="absolute top-2 left-2 h-5 w-16 bg-gray-300 rounded"></div>

        {/* Wishlist Button Skeleton */}
        <div className="absolute top-2 right-2 w-8 h-8 sm:w-9 sm:h-9 bg-gray-300 rounded-full"></div>

        {/* Stock Badge Skeleton */}
        <div className="absolute bottom-2 left-2 h-4 w-20 bg-gray-300/80 rounded"></div>
      </div>

      {/* Content Skeleton */}
      <CardContent className="p-3 sm:p-4 flex flex-col flex-grow space-y-2">
        {/* Brand Name Skeleton */}
        <div className="h-3 w-16 bg-gray-200 rounded"></div>

        {/* Product Name Skeleton - 2 lines */}
        <div className="space-y-1">
          <div className="h-4 w-full bg-gray-200 rounded"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
        </div>

        {/* Price Skeleton */}
        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-2">
            <div className="h-6 w-20 bg-gray-300 rounded"></div>
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
