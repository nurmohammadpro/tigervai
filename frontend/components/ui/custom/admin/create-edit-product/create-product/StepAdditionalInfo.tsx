// components/product/add-steps/StepAdditionalInfo.tsx
"use client";

import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useAddProductStore } from "@/zustan-hook/addProductStore";

export default function StepAdditionalInfo() {
  const { formData, updateField } = useAddProductStore();
  const [newSpec, setNewSpec] = useState({ key: "", value: "" });

  const specifications =
    (formData.specifications as Record<string, string>) || {};

  const handleAddSpec = () => {
    if (!newSpec.key || !newSpec.value) {
      alert("Please fill both key and value");
      return;
    }

    updateField("specifications", {
      ...specifications,
      [newSpec.key]: newSpec.value,
    });

    setNewSpec({ key: "", value: "" });
  };

  const handleRemoveSpec = (key: string) => {
    const newSpecs = { ...specifications };
    delete newSpecs[key];
    updateField("specifications", newSpecs);
  };

  return (
    <div className="space-y-6">
      {/* Dimensions */}
      <div>
        <h3 className="font-semibold mb-4 border border-palette-accent-3/10">
          Dimensions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              Height (cm)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={(formData.height ?? 0) > 0 ? formData.height : ""}
              onChange={(e) =>
                updateField("height", parseFloat(e.target.value) || 0)
              }
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            />
          </div>

          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              Width (cm)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={(formData.width ?? 0) > 0 ? formData.width : ""}
              onChange={(e) =>
                updateField("width", parseFloat(e.target.value) || 0)
              }
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            />
          </div>

          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              Weight (kg)
            </label>
            <Input
              placeholder="0"
              value={formData.weight || ""}
              onChange={(e) => updateField("weight", e.target.value)}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            />
          </div>

          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              Size
            </label>
            <Input
              placeholder="e.g., L"
              value={formData.size || ""}
              onChange={(e) => updateField("size", e.target.value)}
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            />
          </div>
        </div>
      </div>

      {/* Warranty & Returns */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--palette-accent-1)" }}
          >
            Warranty Period
          </label>
          <Input
            placeholder="e.g., 12 months"
            value={formData.warrantyPeriod || ""}
            onChange={(e) => updateField("warrantyPeriod", e.target.value)}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderColor: "var(--palette-accent-3)",
              color: "var(--palette-text)",
            }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold mb-2"
            style={{ color: "var(--palette-accent-1)" }}
          >
            Return Policy
          </label>
          <Input
            placeholder="e.g., 30 days"
            value={formData.returnPolicy || ""}
            onChange={(e) => updateField("returnPolicy", e.target.value)}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderColor: "var(--palette-accent-3)",
              color: "var(--palette-text)",
            }}
          />
        </div>
      </div>

      {/* Shipping Time */}
      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Shipping Time
        </label>
        <Input
          placeholder="e.g., 2-3 business days"
          value={formData.shippingTime || ""}
          onChange={(e) => updateField("shippingTime", e.target.value)}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "var(--palette-accent-3)",
            color: "var(--palette-text)",
          }}
        />
      </div>

      {/* ✅ UPDATED: Dynamic Key-Value Specifications */}
      <div>
        <h3
          className="font-semibold mb-4"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Specifications (Key-Value Pairs)
        </h3>

        {/* Add Specification Form */}
        <div
          className="p-4 rounded-lg mb-4 border"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            borderColor: "var(--palette-accent-3)",
          }}
        >
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label
                className="text-xs font-semibold mb-1 block"
                style={{ color: "var(--palette-accent-3)" }}
              >
                Specification Name
              </label>
              <Input
                placeholder="e.g., Material, Color, Brand"
                value={newSpec.key}
                onChange={(e) =>
                  setNewSpec({ ...newSpec, key: e.target.value })
                }
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "var(--palette-accent-3)",
                  color: "var(--palette-text)",
                }}
              />
            </div>

            <div>
              <label
                className="text-xs font-semibold mb-1 block"
                style={{ color: "var(--palette-accent-3)" }}
              >
                Value
              </label>
              <Input
                placeholder="e.g., Iron, Black, Nike"
                value={newSpec.value}
                onChange={(e) =>
                  setNewSpec({ ...newSpec, value: e.target.value })
                }
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "var(--palette-accent-3)",
                  color: "var(--palette-text)",
                }}
              />
            </div>
          </div>

          <Button
            onClick={handleAddSpec}
            className="w-full flex items-center justify-center gap-2 text-white"
            style={{ backgroundColor: "var(--palette-btn)" }}
          >
            <Plus size={18} />
            Add Specification
          </Button>
        </div>

        {/* Specifications List */}
        {Object.keys(specifications).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(specifications).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center p-3 rounded-lg"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  borderColor: "var(--palette-accent-3)",
                  border: "1px solid",
                }}
              >
                <div>
                  <p className="font-medium">{key}</p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--palette-accent-3)" }}
                  >
                    {value}
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveSpec(key)}
                  className="p-2 hover:bg-red-500/20 rounded transition"
                >
                  <Trash2 size={18} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="text-center p-6 rounded-lg"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              borderColor: "var(--palette-accent-3)",
              border: "2px dashed",
            }}
          >
            <p style={{ color: "var(--palette-accent-3)" }}>
              No specifications added yet. Add some to describe your product
              better.
            </p>
          </div>
        )}
      </div>

      {/* Certifications */}
      <div>
        <label
          className="block text-sm font-semibold mb-2"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Certifications (comma-separated)
        </label>
        <Input
          placeholder="e.g., ISO 9001, CE Certified"
          value={(formData.certifications as string[])?.join(", ") || ""}
          onChange={(e) =>
            updateField(
              "certifications",
              e.target.value.split(",").map((c) => c.trim())
            )
          }
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "var(--palette-accent-3)",
            color: "var(--palette-text)",
          }}
        />
      </div>
    </div>
  );
}
