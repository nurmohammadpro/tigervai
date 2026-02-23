"use client";

import { getUserInfo } from "@/actions/auth";
import { useCommonMutationApi } from "@/api-hook/mutation-common";
import { useState } from "react";

interface ReviewFormProps {
  productId: string;
}

interface ReviewData {
  productId: string;
  comment: string;
  rating: number;
}

export default function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState("");

  const [error, setError] = useState<string>("");

  const { mutate, isPending } = useCommonMutationApi({
    url: "/product/review",
    method: "POST",
    successMessage: "Review submitted successfully, it will be live shortly",
    onSuccess(data) {
      setError("");
      setRating(0);
      setComment("");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await getUserInfo();
    if (!rating || !comment.trim()) return;
    const data = {
      productId,
      comment: comment.trim(),
      rating,
      userName: user?.name ?? "",
    };

    mutate(data);
  };

  const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Rating */}
      <div>
        <label
          className="block text-sm mb-3"
          style={{ color: "var(--color-palette-text)" }}
        >
          Your Rating
        </label>

        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="group relative focus:outline-none"
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-all duration-200 ease-out"
                style={{
                  transform:
                    (hoveredRating || rating) >= star
                      ? "scale(1.1)"
                      : "scale(1)",
                }}
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  fill={
                    (hoveredRating || rating) >= star
                      ? "var(--color-palette-btn)"
                      : "transparent"
                  }
                  stroke={
                    (hoveredRating || rating) >= star
                      ? "var(--color-palette-btn)"
                      : "var(--color-palette-accent-3)"
                  }
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all duration-200"
                />
              </svg>
            </button>
          ))}
        </div>

        {/* Rating Label */}
        {(hoveredRating || rating) > 0 && (
          <p
            className="text-sm mt-2 transition-opacity duration-200"
            style={{ color: "var(--color-palette-text)" }}
          >
            {ratingLabels[(hoveredRating || rating) - 1]}
          </p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label
          htmlFor="comment"
          className="block text-sm mb-2"
          style={{ color: "var(--color-palette-text)" }}
        >
          Your Review
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border rounded resize-none focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all"
          style={{
            backgroundColor: "var(--color-palette-bg)",
            borderColor: "rgba(134, 146, 156, 0.3)",
            color: "var(--color-palette-text)",
          }}
          placeholder="Share your experience..."
        />
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm" style={{ color: "var(--color-palette-btn)" }}>
          {error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!rating || !comment.trim() || isPending}
        className="px-6 py-2 text-white rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
        style={{ backgroundColor: "var(--color-palette-btn)" }}
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
