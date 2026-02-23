// components/product/add-steps/StepShipping.tsx
"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck, AlertCircle } from "lucide-react";
import { useAddProductStore } from "@/zustan-hook/addProductStore";

export default function StepShipping() {
  const { formData, updateField } = useAddProductStore();

  return (
    <div className="space-y-6">
      {/* Info Alert */}
      <div
        className="p-4 rounded-lg flex gap-3"
        style={{
          backgroundColor: "rgba(240, 212, 168, 0.1)",
          borderColor: "var(--palette-accent-1)",
          border: "1px solid",
        }}
      >
        <Truck size={20} style={{ color: "var(--palette-accent-1)" }} />
        <div className="text-sm">
          <p className="font-semibold">Shipping Configuration</p>
          <p style={{ color: "var(--palette-accent-3)" }}>
            Set up shipping options for your product. You can offer free
            shipping or charge shipping cost.
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
              name="shippingMethod"
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
              name="shippingMethod"
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
            This is the cost customers will pay for shipping. Can be per unit or
            fixed.
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
          placeholder="e.g., 2-3 business days, Same day delivery, 5-7 days"
          value={formData.shippingTime || ""}
          onChange={(e) => updateField("shippingTime", e.target.value)}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "var(--palette-accent-3)",
            color: "var(--palette-text)",
          }}
        />
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
          💡 Tip: Free shipping attracts more customers, but paid shipping helps
          cover logistics costs.
        </p>
      </div>
    </div>
  );
}
