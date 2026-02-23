"use client";

import { Star } from "lucide-react";

type Review = {
  _id: string;
  userId: {
    _id: string;
    name: string;
  };
  userName: string;
  productId: string;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

interface ReviewsListProps {
  reviews: Review[] | undefined;
  currentPage: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange: (page: number) => void;
}

export default function ReviewsList({
  reviews,
  currentPage,
  totalPages,
  isLoading = false,
  onPageChange,
}: ReviewsListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div
          className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: "var(--color-palette-btn)" }}
        />
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: "var(--color-palette-text)" }}>
          No reviews yet. Be the first to review!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="border-b pb-6"
            style={{ borderColor: "rgba(134, 146, 156, 0.2)" }}
          >
            <div className="flex items-center justify-between mb-2">
              <h5
                className="font-medium"
                style={{ color: "var(--color-palette-text)" }}
              >
                {review.userName || review.userId.name}
              </h5>
              <span
                className="text-sm"
                style={{ color: "var(--color-palette-accent-3)" }}
              >
                {formatDate(review.createdAt)}
              </span>
            </div>
            <div className="flex items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-4 h-4"
                  style={{
                    fill:
                      star <= review.rating
                        ? "var(--color-palette-btn)"
                        : "transparent",
                    color:
                      star <= review.rating
                        ? "var(--color-palette-btn)"
                        : "rgba(134, 146, 156, 0.4)",
                  }}
                />
              ))}
            </div>
            <p style={{ color: "var(--color-palette-accent-3)" }}>
              {review.comment}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--color-palette-bg)",
              color: "var(--color-palette-text)",
              border: "1px solid rgba(134, 146, 156, 0.3)",
            }}
            aria-label="Previous page"
          >
            ←
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className="px-4 py-2 rounded transition-all"
              style={{
                backgroundColor:
                  page === currentPage
                    ? "var(--color-palette-btn)"
                    : "var(--color-palette-bg)",
                color:
                  page === currentPage
                    ? "#ffffff"
                    : "var(--color-palette-text)",
                border: "1px solid rgba(134, 146, 156, 0.3)",
              }}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--color-palette-bg)",
              color: "var(--color-palette-text)",
              border: "1px solid rgba(134, 146, 156, 0.3)",
            }}
            aria-label="Next page"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
