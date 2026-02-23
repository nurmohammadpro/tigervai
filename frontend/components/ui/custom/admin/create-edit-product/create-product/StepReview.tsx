// components/product/add-steps/StepReview.tsx
"use client";

import React from "react";

import { AlertCircle, CheckCircle } from "lucide-react";
import { useAddProductStore } from "@/zustan-hook/addProductStore";
import {
  calculateAverageOfferPrice,
  calculateAveragePrice,
  calculateTotalStock,
} from "@/lib/calculation-helper";

export default function StepReview() {
  const { getFormData } = useAddProductStore();
  const formData = getFormData();

  const checkRequired = (value: any) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "object" && value !== null)
      return Object.keys(value).length > 0;
    return !!value;
  };

  const variants = (formData.variants as any[]) || [];
  const avgPrice = variants.length > 0 ? calculateAveragePrice(variants) : 0;
  const avgOfferPrice =
    variants.length > 0 ? calculateAverageOfferPrice(variants) : null;
  const totalStock = variants.length > 0 ? calculateTotalStock(variants) : 0;

  const requiredFields = {
    name: checkRequired(formData.name),
    category: checkRequired(
      formData.category?.main && formData.category?.category
    ),
    brand: checkRequired(formData.brand?.id),
    thumbnail: checkRequired(formData.thumbnail),
    variants: checkRequired(formData.variants),
  };

  const isComplete = Object.values(requiredFields).every((v) => v === true);

  return (
    <div className="space-y-6">
      {/* Status Check */}
      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: isComplete
            ? "rgba(34, 197, 94, 0.1)"
            : "rgba(239, 68, 68, 0.1)",
          borderColor: isComplete ? "rgb(34, 197, 94)" : "rgb(239, 68, 68)",
          border: "1px solid",
        }}
      >
        <div className="flex items-center gap-3">
          {isComplete ? (
            <CheckCircle size={24} className="text-green-500" />
          ) : (
            <AlertCircle size={24} className="text-red-500" />
          )}
          <div>
            <h4 className="font-semibold">
              {isComplete ? "Ready to Submit!" : "Complete Required Fields"}
            </h4>
            <p className="text-sm" style={{ color: "var(--palette-accent-3)" }}>
              {isComplete
                ? "All required fields are completed. You can now submit the product."
                : "Please fill all required fields before submitting."}
            </p>
          </div>
        </div>
      </div>

      {/* Review Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            borderColor: "var(--palette-accent-3)",
            border: "1px solid",
          }}
        >
          <h3
            className="font-semibold mb-3"
            style={{ color: "var(--palette-accent-1)" }}
          >
            Basic Information
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span style={{ color: "var(--palette-accent-3)" }}>Product:</span>{" "}
              {formData.name || "—"}
            </div>
            <div>
              <span style={{ color: "var(--palette-accent-3)" }}>
                Category:
              </span>{" "}
              {formData.category?.main} → {formData.category?.category || "—"}
            </div>
            <div>
              <span style={{ color: "var(--palette-accent-3)" }}>Brand:</span>{" "}
              {formData.brand?.name || "—"}
            </div>
          </div>
        </div>
        {/* ✅ AUTO-CALCULATED PRICING */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: "rgba(255, 107, 122, 0.1)",
            borderColor: "var(--palette-btn)",
            border: "1px solid",
          }}
        >
          <h3
            className="font-semibold mb-3"
            style={{ color: "var(--palette-accent-1)" }}
          >
            Auto-Calculated Pricing
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span style={{ color: "var(--palette-accent-3)" }}>
                Avg Price:
              </span>{" "}
              <span className="font-semibold">
                ৳{formData?.price ?? "set Price"}
              </span>
            </div>
            {formData?.offerPrice && (
              <div>
                <span style={{ color: "var(--palette-accent-3)" }}>
                  Avg Offer:
                </span>{" "}
                <span
                  className="font-semibold"
                  style={{ color: "var(--palette-btn)" }}
                >
                  ৳{formData?.offerPrice}
                </span>
              </div>
            )}
            <div>
              <span style={{ color: "var(--palette-accent-3)" }}>
                Total Stock:
              </span>{" "}
              <span className="font-semibold">{totalStock}</span>
            </div>
          </div>
        </div>
        {/* Variants */}
        <div
          className="p-4 rounded-lg md:col-span-2"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            borderColor: "var(--palette-accent-3)",
            border: "1px solid",
          }}
        >
          <h3
            className="font-semibold mb-3"
            style={{ color: "var(--palette-accent-1)" }}
          >
            Variants ({variants.length})
          </h3>
          {variants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {variants.map((v, i) => (
                <div
                  key={i}
                  className="text-sm"
                  style={{ color: "var(--palette-accent-3)" }}
                >
                  • {v.size} - {v.color}: ৳{v.price}
                  {v.discountPrice && ` → ৳${v.discountPrice}`} (Stock:{" "}
                  {v.stock})
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: "var(--palette-accent-3)" }}>
              No variants added
            </p>
          )}
        </div>
        {/* Shipping */}
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            borderColor: "var(--palette-accent-3)",
            border: "1px solid",
          }}
        >
          <h3
            className="font-semibold mb-3"
            style={{ color: "var(--palette-accent-1)" }}
          >
            Shipping Details
          </h3>
          <div className="space-y-2 text-sm">
            <div>
              <span style={{ color: "var(--palette-accent-3)" }}>Method:</span>{" "}
              <span className="font-semibold">
                {formData.freeShipping ? "✓ Free Shipping" : "✓ Paid"}
              </span>
            </div>
            {!formData.freeShipping && (
              <div>
                <span style={{ color: "var(--palette-accent-3)" }}>Cost:</span>{" "}
                <span className="font-semibold">
                  ৳{formData.shippingCost || 0}
                </span>
              </div>
            )}
            <div>
              <span style={{ color: "var(--palette-accent-3)" }}>Time:</span>{" "}
              <span className="font-semibold">
                {formData.shippingTime || "—"}
              </span>
            </div>
          </div>
        </div>
        s{/* Specifications */}
        {Object.keys(formData.specifications || {}).length > 0 && (
          <div
            className="p-4 rounded-lg md:col-span-2"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              borderColor: "var(--palette-accent-3)",
              border: "1px solid",
            }}
          >
            <h3
              className="font-semibold mb-3"
              style={{ color: "var(--palette-accent-1)" }}
            >
              Specifications
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(formData.specifications || {}).map(
                ([key, value]) => (
                  <div key={key} className="text-sm">
                    <span style={{ color: "var(--palette-accent-3)" }}>
                      {key}:
                    </span>{" "}
                    {String(value)}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Submission Info */}
      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: "rgba(212, 212, 216, 0.1)",
          borderColor: "var(--palette-accent-3)",
          border: "1px solid",
        }}
      >
        <p className="text-sm" style={{ color: "var(--palette-text)" }}>
          ✓ All prices will be automatically calculated from variants <br />✓
          You can edit this product later <br />✓ The product will be visible to
          customers immediately
        </p>
      </div>
    </div>
  );
}
