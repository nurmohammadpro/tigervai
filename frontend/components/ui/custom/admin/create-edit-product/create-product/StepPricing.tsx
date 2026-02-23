// components/product/add-steps/StepPricing.tsx
"use client";

import React from "react";

import { AlertCircle } from "lucide-react";
import { useAddProductStore } from "@/zustan-hook/addProductStore";
import {
  calculateAverageOfferPrice,
  calculateAveragePrice,
} from "@/lib/calculation-helper";
import { Input } from "@/components/ui/input";

export default function StepPricing() {
  const { formData, updateField } = useAddProductStore();
  const variants = (formData.variants as any[]) || [];

  const avgPrice = variants.length > 0 ? calculateAveragePrice(variants) : 0;
  const avgOfferPrice =
    variants.length > 0 ? calculateAverageOfferPrice(variants) : null;

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <div
        className="p-4 rounded-lg flex gap-3"
        style={{
          backgroundColor: "rgba(168, 179, 191, 0.1)",
          borderColor: "var(--palette-accent-3)",
          border: "1px solid",
        }}
      >
        <AlertCircle size={20} style={{ color: "var(--palette-accent-3)" }} />
        <div className="text-sm">
          <p className="font-semibold">Pricing Information</p>
          <p style={{ color: "var(--palette-accent-3)" }}>
            {variants.length > 0
              ? `Auto-calculated values shown below. You can override them by entering your own prices.`
              : "Add variants first, then set your pricing here."}
          </p>
        </div>
      </div>

      {/* Regular Price (Editable) */}
      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.02)",
          borderColor: "var(--palette-accent-3)",
          border: "1px solid",
        }}
      >
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Regular Price (৳) <span className="text-red-500">*</span>
        </label>
        <Input
          type="number"
          placeholder="Enter regular price"
          value={formData.price || ""}
          onChange={(e) =>
            updateField("price", e.target.value ? Number(e.target.value) : 0)
          }
          className="text-lg font-semibold"
          min={0}
        />
        {variants.length > 0 && avgPrice > 0 && (
          <p
            className="text-xs mt-2"
            style={{ color: "var(--palette-accent-3)" }}
          >
            Suggested from variants: ৳{avgPrice} (Average of{" "}
            {variants.map((v) => v.price).join(" + ")})
          </p>
        )}
      </div>

      {/* Offer Price (Editable) */}
      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: "rgba(240, 212, 168, 0.1)",
          borderColor: "var(--palette-accent-1)",
          border: "1px solid",
        }}
      >
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Offer Price (৳){" "}
          <span className="text-xs text-gray-500">(Optional)</span>
        </label>
        <Input
          type="number"
          placeholder="Enter offer price (leave empty if no discount)"
          value={formData.offerPrice || ""}
          onChange={(e) =>
            updateField(
              "offerPrice",
              e.target.value ? Number(e.target.value) : null
            )
          }
          className="text-lg font-semibold"
          style={{ color: "var(--palette-btn)" }}
          min={0}
        />
        {variants.length > 0 && avgOfferPrice && (
          <p
            className="text-xs mt-2"
            style={{ color: "var(--palette-accent-3)" }}
          >
            Suggested from variants: ৳{avgOfferPrice} (Average from{" "}
            {variants.filter((v) => v.discountPrice).length} variant(s) with
            discount)
          </p>
        )}
        {formData.price &&
          formData.offerPrice &&
          formData.offerPrice >= formData.price && (
            <p className="text-xs mt-2 text-red-500">
              ⚠️ Offer price should be less than regular price
            </p>
          )}
      </div>

      {/* Shipping Settings */}
      <div className="space-y-4">
        <h3
          className="font-semibold"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Shipping Settings
        </h3>
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "1px solid var(--palette-accent-3)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--palette-text)" }}>
            Shipping settings are optional and will be configured in the next
            steps.
          </p>
        </div>
      </div>
    </div>
  );
}
