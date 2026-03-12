// components/ui/custom/admin/create-edit-product/tyre-product/StepTyreShipping.tsx
"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Truck, AlertCircle, Package } from "lucide-react";
import { useAddTyreProductStore } from "@/zustand-hook/addTyreProductStore";

export default function StepTyreShipping() {
  const { formData, updateField } = useAddTyreProductStore();

  return (
    <div className="space-y-6">
      {/* Info Alert - Tyre Specific */}
      <div
        className="p-4 rounded-lg flex gap-3"
        style={{
          backgroundColor: "rgba(240, 212, 168, 0.1)",
          borderColor: "var(--palette-accent-1)",
          border: "1px solid",
        }}
      >
        <Package size={20} style={{ color: "var(--palette-accent-1)" }} />
        <div className="text-sm">
          <p className="font-semibold">Tyre Shipping Configuration</p>
          <p style={{ color: "var(--palette-accent-3)" }}>
            Tyres may require special handling. Configure shipping options considering weight and size.
          </p>
        </div>
      </div>

      {/* Shipping Method Selection */}
      <div>
        <h3
          className="font-semibold mb-4"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Shipping Method
        </h3>

        {/* Option 1: Paid Shipping */}
        <div
          className="p-4 rounded-lg mb-4 cursor-pointer transition"
          style={{
            backgroundColor: !formData.freeShipping
              ? "rgba(255, 107, 122, 0.1)"
              : "rgba(255, 255, 255, 0.02)",
            borderColor: !formData.freeShipping
              ? "var(--palette-btn)"
              : "var(--palette-accent-3)",
            border: "1px solid",
          }}
          onClick={() => updateField("freeShipping", false)}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="tyreShippingMethod"
              value="paid"
              checked={!formData.freeShipping}
              onChange={() => updateField("freeShipping", false)}
            />
            <div>
              <p className="font-semibold">Paid Shipping</p>
              <p
                className="text-sm"
                style={{ color: "var(--palette-accent-3)" }}
              >
                Charge customers a fixed shipping cost
              </p>
            </div>
          </div>
        </div>

        {/* Option 2: Free Shipping */}
        <div
          className="p-4 rounded-lg cursor-pointer transition"
          style={{
            backgroundColor: formData.freeShipping
              ? "rgba(34, 197, 94, 0.1)"
              : "rgba(255, 255, 255, 0.02)",
            borderColor: formData.freeShipping
              ? "rgb(34, 197, 94)"
              : "var(--palette-accent-3)",
            border: "1px solid",
          }}
          onClick={() => updateField("freeShipping", true)}
        >
          <div className="flex items-center gap-3">
            <input
              type="radio"
              name="tyreShippingMethod"
              value="free"
              checked={formData.freeShipping}
              onChange={() => updateField("freeShipping", true)}
            />
            <div>
              <p className="font-semibold">Free Shipping</p>
              <p
                className="text-sm"
                style={{ color: "var(--palette-accent-3)" }}
              >
                Offer free shipping to customers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Cost (if not free) */}
      {!formData.freeShipping && (
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: "rgba(255, 107, 122, 0.1)",
            borderColor: "var(--palette-btn)",
            border: "1px solid",
          }}
        >
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--palette-accent-1)" }}
          >
            Shipping Cost (৳) *
          </label>
          <Input
            type="number"
            placeholder="0"
            value={formData.shippingCost || 0}
            onChange={(e) =>
              updateField("shippingCost", parseFloat(e.target.value) || 0)
            }
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderColor: "var(--palette-btn)",
              color: "var(--palette-text)",
            }}
          />
          <p
            className="text-xs mt-2"
            style={{ color: "var(--palette-accent-3)" }}
          >
            Tyres are heavy - consider appropriate shipping costs. Can be per tyre or fixed.
          </p>
        </div>
      )}

      {/* Shipping Time */}
      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Estimated Shipping Time
        </label>
        <Input
          placeholder="e.g., 2-3 business days, Same day delivery in Dhaka"
          value={formData.shippingTime || ""}
          onChange={(e) => updateField("shippingTime", e.target.value)}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "var(--palette-accent-3)",
            color: "var(--palette-text)",
          }}
        />
      </div>

      {/* Weight (Optional for tyres) */}
      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Weight per Tyre (Optional)
        </label>
        <Input
          placeholder="e.g., 5kg, 8kg"
          value={formData.weight || ""}
          onChange={(e) => updateField("weight", e.target.value)}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "var(--palette-accent-3)",
            color: "var(--palette-text)",
          }}
        />
        <p
          className="text-xs mt-1"
          style={{ color: "var(--palette-accent-3)" }}
        >
          Providing weight helps calculate accurate shipping costs
        </p>
      </div>

      {/* Summary */}
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
          Shipping Summary
        </h3>
        <div className="space-y-2 text-sm">
          <div>
            <span style={{ color: "var(--palette-accent-3)" }}>Method:</span>{" "}
            <span className="font-semibold">
              {formData.freeShipping ? "✓ Free Shipping" : "✓ Paid Shipping"}
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
            <span style={{ color: "var(--palette-accent-3)" }}>
              Delivery Time:
            </span>{" "}
            <span className="font-semibold">
              {formData.shippingTime || "Not specified"}
            </span>
          </div>
          {formData.weight && (
            <div>
              <span style={{ color: "var(--palette-accent-3)" }}>Weight:</span>{" "}
              <span className="font-semibold">{formData.weight}</span>
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div
        className="p-4 rounded-lg flex gap-3"
        style={{
          backgroundColor: "rgba(168, 179, 191, 0.1)",
          borderColor: "var(--palette-accent-3)",
          border: "1px solid",
        }}
      >
        <AlertCircle size={20} style={{ color: "var(--palette-accent-3)" }} />
        <p className="text-sm" style={{ color: "var(--palette-accent-3)" }}>
          💡 Tip: Consider offering free shipping for combo sets (front + rear) to encourage bulk purchases.
        </p>
      </div>
    </div>
  );
}
