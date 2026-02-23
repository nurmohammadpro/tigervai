import { Product, ReviewStats } from "@/@types/fullProduct";
import React, { JSX } from "react";
import ReviewForm from "./Rating-form";
import ReviewsList from "./user-review";
import { Star } from "lucide-react";
import { Review } from "@/@types/review";
import DescriptionComponent from "./RenderDesription";

const RatingBreakdown = ({ stats }: { stats: ReviewStats | undefined }) => {
  const getCount = (rating: number): number => {
    switch (rating) {
      case 5:
        return stats?.count5 ?? 0;
      case 4:
        return stats?.count4 ?? 0;
      case 3:
        return stats?.count3 ?? 0;
      case 2:
        return stats?.count2 ?? 0;
      case 1:
        return stats?.count1 ?? 0;
      default:
        return 0;
    }
  };

  const getWidth = (rating: number): string => {
    const count = getCount(rating);
    const total = stats?.totalReviews ?? 0;
    if (total === 0) return "0%";
    return `${Math.round((count / total) * 100)}%`;
  };

  return (
    <div className="flex-1">
      {[5, 4, 3, 2, 1].map((rating) => (
        <div key={rating} className="flex items-center gap-3 mb-2">
          <span className="text-sm w-3 text-gray-700 font-medium">
            {rating}
          </span>
          <Star className="w-4 h-4 fill-palette-btn text-palette-btn flex-shrink-0" />
          <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden min-w-0">
            <div
              className="bg-palette-btn h-full rounded-full transition-all duration-300"
              style={{ width: getWidth(rating) }}
            ></div>
          </div>
          <span className="text-sm text-gray-500 w-10 text-right flex-shrink-0">
            {getCount(rating)}
          </span>
        </div>
      ))}
    </div>
  );
};
const ProductTabs = ({
  params,
  activeTab,
  setActiveTab,
  renderRating,
  page,
  setPage,
  reviews,
  totalPages,
  isLoading,
}: {
  params: Product;
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  renderRating: (
    rating: number | undefined,
    totalReviews: number
  ) => JSX.Element;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  reviews: Review[] | undefined;
  totalPages: number;
  isLoading: boolean;
}) => {
  return (
    <>
      <div className="border-b-2 border-gray-200 overflow-x-auto">
        <nav className="flex gap-2 sm:gap-6">
          {["Details", "specifications", "reviews", "shipping"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 sm:py-4 px-2 sm:px-4 border-b-2 font-semibold text-sm sm:text-base capitalize transition-all whitespace-nowrap min-h-[44px] ${
                activeTab === tab
                  ? "border-palette-btn text-palette-btn"
                  : "border-transparent text-gray-500 hover:text-palette-text"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div className="py-3">
        {activeTab === "Details" && (
          <div className="space-y-2">
            <div className="lg:hidden mb-1 w-full">
              <h3 className="text-2xl font-bold text-palette-text mb-1.5">
                Product Description
              </h3>
              <div className="w-full">
                <DescriptionComponent params={params?.description} />
              </div>
            </div>
            {params?.company_details && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h4 className="text-2xl font-bold text-palette-text mb-3">
                  Company Details
                </h4>
                <p className="text-base text-gray-700">
                  {params?.company_details}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 sm:gap-3 p-2.5 sm:p-4 bg-palette-btn/5 rounded-lg border border-palette-btn/10">
              <div className=" flex-col hidden items-center justify-center py-2 px-1">
                <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">
                  Size
                </span>
                <p className="text-xs sm:text-sm font-semibold text-palette-text leading-tight">
                  {params?.height || params?.width
                    ? `${params?.height ?? 0}×${params?.width ?? 0}`
                    : "N/A"}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center py-2 px-1 border-r  border-gray-200">
                <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">
                  Weight
                </span>
                <p className="text-xs sm:text-sm font-semibold text-palette-text leading-tight">
                  {params?.weight ?? "N/A"}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center py-2 px-1">
                <span className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">
                  Brand
                </span>
                <p className="text-xs sm:text-sm font-semibold text-palette-text leading-tight truncate max-w-full">
                  {params?.brand?.name ?? "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "specifications" && (
          <div className="p-4 sm:p-5 border border-gray-200 rounded-lg bg-white">
            <h3 className="text-base sm:text-lg font-bold text-palette-text mb-4">
              Technical Specifications
            </h3>

            {/* Compact table */}
            {params?.specifications &&
              Object.keys(params.specifications).length > 0 && (
                <div className="space-y-1 mb-4">
                  {Object.entries(params.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center py-1.5 px-1 text-xs sm:text-sm"
                    >
                      <span className="font-medium text-gray-700 truncate flex-1 pr-2">
                        {key}
                      </span>
                      <span className="text-gray-600 font-medium min-w-0 truncate">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

            {/* Inline certifications */}
            {(params?.certifications?.length ?? 0) > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold text-xs sm:text-sm text-palette-text">
                  Certifications
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {params?.certifications?.map((cert, index) => (
                    <span
                      key={index}
                      className="bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-palette-text">
              Customer Reviews
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-4 sm:p-6 bg-palette-btn/5 rounded-lg border border-palette-btn/10">
              <div className="text-center sm:text-left">
                <div className="text-4xl sm:text-5xl font-bold text-palette-text">
                  {params?.stats?.averageRating?.toFixed(1) ?? "0.0"}
                </div>
                <div className="flex justify-center sm:justify-start mt-2">
                  {renderRating(
                    params?.stats?.averageRating ?? 0,
                    params?.stats?.totalReviews ?? 0
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  {params?.stats?.totalReviews ?? 0} total
                </div>
              </div>
              <RatingBreakdown stats={params?.stats} />
            </div>

            <ReviewForm productId={params?._id} />
            <ReviewsList
              currentPage={page}
              onPageChange={setPage}
              reviews={reviews}
              totalPages={totalPages}
              isLoading={isLoading}
            />
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-palette-text">
              Shipping & Returns
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Shipping Information */}
              <div className="p-3 border border-gray-200 rounded-lg bg-gradient-to-br from-white to-gray-50">
                <h4 className="font-semibold text-palette-text mb-2.5 text-xs sm:text-sm flex items-center gap-1.5">
                  <span className="w-1 h-4 bg-palette-btn rounded-full"></span>
                  Shipping Info
                </h4>
                <div className="space-y-1.5 text-xs sm:text-sm">
                  {params?.shippingTime && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Delivery</span>
                      <span className="font-medium text-palette-text">
                        {params.shippingTime}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cost</span>
                    <span className="font-medium text-palette-text">
                      {params?.freeShipping
                        ? "Free"
                        : `৳${params?.shippingCost ?? 0}/kg`}
                    </span>
                  </div>
                  {/* <div className="flex justify-between items-center">
          <span className="text-gray-600">Express</span>
          <span className="font-medium text-green-600">Available</span>
        </div> */}
                </div>
              </div>

              {/* Return Policy */}
              <div className="p-3 border border-gray-200 rounded-lg bg-gradient-to-br from-white to-gray-50">
                <h4 className="font-semibold text-palette-text mb-2.5 text-xs sm:text-sm flex items-center gap-1.5">
                  <span className="w-1 h-4 bg-palette-btn rounded-full"></span>
                  Return Policy
                </h4>
                <div className="space-y-1.5 text-xs sm:text-sm">
                  {params?.returnPolicy && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Period</span>
                      <span className="font-medium text-palette-text">
                        {params.returnPolicy}
                      </span>
                    </div>
                  )}

                  {/*  <div className="flex justify-between items-center">
          <span className="text-gray-600">Return Ship</span>
          <span className="font-medium text-green-600">Free</span>
        </div> */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductTabs;
