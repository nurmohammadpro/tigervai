const ProductPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-white container mx-auto">
      <div className="w-full max-w-full mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images Section Skeleton */}
          <div className="space-y-4 lg:sticky lg:top-4 h-fit">
            {/* Main Image Skeleton */}
            <div className="relative bg-gray-200 rounded-lg overflow-hidden animate-pulse aspect-square"></div>

            {/* Thumbnail Images Skeleton */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-gray-200 animate-pulse shrink-0"
                ></div>
              ))}
            </div>

            {/* Desktop Description Skeleton */}
            <div className="hidden lg:block pt-6 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>

          {/* Product Info Section Skeleton */}
          <div className="space-y-6">
            {/* Breadcrumb Skeleton */}
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>

            {/* Product Title & Brand Skeleton */}
            <div className="space-y-3">
              <div className="h-8 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-5 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            {/* Short Description Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>

            {/* Price Range Skeleton */}
            <div className="space-y-2 bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200">
              <div className="flex items-baseline gap-3 flex-wrap">
                <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
            </div>

            {/* Variant Cards Skeleton */}
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-48 h-48 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                      <div className="flex gap-2">
                        <div className="h-11 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="h-11 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                        <div className="h-11 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                    <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features Skeleton */}
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 p-4 bg-palette-btn/5 rounded-lg border border-palette-btn/10"
                  >
                    <div className="w-5 h-5 bg-gray-200 rounded animate-pulse flex-shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Service Features Skeleton */}
            <div className="space-y-3 border-t border-gray-200 pt-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 p-3 rounded-lg"
                >
                  <div className="w-5 h-5 bg-gray-200 rounded animate-pulse flex-shrink-0 mt-1"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section Skeleton */}
        <div className="mt-12 sm:mt-16">
          {/* Mobile Description Skeleton */}
          <div className="lg:hidden mb-8 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          </div>

          {/* Tab Navigation Skeleton */}
          <div className="border-b-2 border-gray-200 overflow-x-auto">
            <nav className="flex gap-2 sm:gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="py-3 sm:py-4 px-2 sm:px-4 min-h-[44px]"
                >
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ))}
            </nav>
          </div>

          {/* Tab Content Skeleton */}
          <div className="py-6 sm:py-8">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6 bg-palette-btn/5 rounded-lg border border-palette-btn/10">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="text-center py-3 space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageSkeleton;
