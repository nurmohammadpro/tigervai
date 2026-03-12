// components/ui/custom/admin/create-edit-product/tyre-product/StepTyreVariants.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Copy } from "lucide-react";
import { useAddTyreProductStore, TyreVariant, TyreVariantType } from "@/zustand-hook/addTyreProductStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Variant type options
const VARIANT_TYPES: { value: TyreVariantType; label: string; description: string }[] = [
  { value: "front", label: "Front Tyre", description: "Single front tyre" },
  { value: "rear", label: "Rear Tyre", description: "Single rear tyre" },
  { value: "combo", label: "Combo Set", description: "Front + Rear pair" },
];

// Season options
const SEASONS = ["Summer", "Winter", "All-Season", "Rain", "Mud/Terrain"];

// Common speed ratings
const SPEED_RATINGS = [
  "Q", "R", "S", "T", "U", "H", "V", "W", "Y", "Z"
];

export default function StepTyreVariants() {
  const { tyreVariants, addTyreVariant, updateTyreVariant, removeTyreVariant, setTyreVariants } = useAddTyreProductStore();
  const [editingId, setEditingId] = useState<string | null>(null);

  // Add new variant
  const handleAddVariant = () => {
    addTyreVariant({
      type: "front",
      size: "",
      season: "All-Season",
      loadIndex: "",
      speedRating: "",
      price: 0,
      stock: 0,
      compatibleModels: "",
    });
  };

  // Duplicate variant
  const handleDuplicateVariant = (variant: TyreVariant) => {
    addTyreVariant({
      ...variant,
    });
  };

  // Calculate discount percentage
  const getDiscountPercentage = (variant: TyreVariant) => {
    if (!variant.discountPrice || variant.discountPrice >= variant.price) return 0;
    return Math.round(((variant.price - variant.discountPrice) / variant.price) * 100);
  };

  // Get count of variants without required fields
  const getIncompleteVariants = () => {
    return tyreVariants.filter(
      (v) => !v.size || !v.price || v.stock < 0
    );
  };

  const incompleteVariants = getIncompleteVariants();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="font-semibold mb-1" style={{ color: "var(--palette-accent-1)" }}>
          Tyre Variants (Front / Rear / Combo)
        </h3>
        <p className="text-sm" style={{ color: "var(--palette-accent-3)" }}>
          Add different tyre options with sizes, pricing, and stock. You can add front tyre, rear tyre, or combo sets.
        </p>
      </div>

      {/* Variant List */}
      <div className="space-y-4">
        {tyreVariants.map((variant) => (
          <div
            key={variant.id}
            className="rounded-lg border p-4"
            style={{
              borderColor: editingId === variant.id ? "var(--palette-btn)" : "var(--palette-accent-3)",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
            }}
          >
            {/* Variant Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: "var(--palette-accent-3)" }}>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase" style={{
                  backgroundColor: variant.type === "combo" ? "rgba(238, 74, 35, 0.2)" : "rgba(43, 39, 44, 0.1)",
                  color: "var(--palette-btn)"
                }}>
                  {variant.type}
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--palette-text)" }}>
                  {variant.size || "No size specified"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDuplicateVariant(variant)}
                  className="p-2 hover:bg-blue-500/20 rounded transition"
                  title="Duplicate variant"
                >
                  <Copy size={16} style={{ color: "var(--palette-accent-1)" }} />
                </button>
                <button
                  type="button"
                  onClick={() => removeTyreVariant(variant.id)}
                  className="p-2 hover:bg-red-500/20 rounded transition"
                  title="Remove variant"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>

            {/* Variant Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Variant Type */}
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--palette-accent-3)" }}>
                  Variant Type *
                </label>
                <Select
                  value={variant.type}
                  onValueChange={(value: TyreVariantType) =>
                    updateTyreVariant(variant.id, { type: value })
                  }
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderColor: "var(--palette-accent-3)",
                      color: "var(--palette-text)",
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: "var(--palette-bg)",
                      color: "var(--palette-text)",
                    }}
                  >
                    {VARIANT_TYPES.map((vt) => (
                      <SelectItem key={vt.value} value={vt.value}>
                        <div>
                          <div className="font-medium">{vt.label}</div>
                          <div className="text-xs opacity-70">{vt.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tyre Size */}
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--palette-accent-3)" }}>
                  Tyre Size *
                </label>
                <Input
                  placeholder="e.g., 110/70 R17"
                  value={variant.size}
                  onChange={(e) => updateTyreVariant(variant.id, { size: e.target.value })}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderColor: "var(--palette-accent-3)",
                    color: "var(--palette-text)",
                  }}
                />
              </div>

              {/* Season */}
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--palette-accent-3)" }}>
                  Season
                </label>
                <Select
                  value={variant.season || ""}
                  onValueChange={(value) => updateTyreVariant(variant.id, { season: value })}
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderColor: "var(--palette-accent-3)",
                      color: "var(--palette-text)",
                    }}
                  >
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: "var(--palette-bg)",
                      color: "var(--palette-text)",
                    }}
                  >
                    {SEASONS.map((season) => (
                      <SelectItem key={season} value={season}>
                        {season}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Load Index */}
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--palette-accent-3)" }}>
                  Load Index
                </label>
                <Input
                  placeholder="e.g., 91"
                  value={variant.loadIndex || ""}
                  onChange={(e) => updateTyreVariant(variant.id, { loadIndex: e.target.value })}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderColor: "var(--palette-accent-3)",
                    color: "var(--palette-text)",
                  }}
                />
              </div>

              {/* Speed Rating */}
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--palette-accent-3)" }}>
                  Speed Rating
                </label>
                <Select
                  value={variant.speedRating || ""}
                  onValueChange={(value) => updateTyreVariant(variant.id, { speedRating: value })}
                >
                  <SelectTrigger
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderColor: "var(--palette-accent-3)",
                      color: "var(--palette-text)",
                    }}
                  >
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent
                    style={{
                      backgroundColor: "var(--palette-bg)",
                      color: "var(--palette-text)",
                    }}
                  >
                    {SPEED_RATINGS.map((rating) => (
                      <SelectItem key={rating} value={rating}>
                        {rating}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Regular Price */}
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--palette-accent-3)" }}>
                  Regular Price *
                </label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={variant.price > 0 ? variant.price : ""}
                  onChange={(e) =>
                    updateTyreVariant(variant.id, { price: parseFloat(e.target.value) || 0 })
                  }
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderColor: "var(--palette-accent-3)",
                    color: "var(--palette-text)",
                  }}
                />
              </div>

              {/* Offer Price */}
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--palette-accent-3)" }}>
                  Offer Price (Optional)
                </label>
                <Input
                  type="number"
                  placeholder="4500"
                  value={variant.discountPrice && variant.discountPrice > 0 ? variant.discountPrice : ""}
                  onChange={(e) =>
                    updateTyreVariant(variant.id, {
                      discountPrice: parseFloat(e.target.value) || undefined
                    })
                  }
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderColor: "var(--palette-accent-3)",
                    color: "var(--palette-text)",
                  }}
                />
                {variant.discountPrice && variant.discountPrice > 0 && (
                  <p className="text-xs mt-1 text-green-600">
                    {getDiscountPercentage(variant)}% off
                  </p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--palette-accent-3)" }}>
                  Stock *
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={variant.stock > 0 ? variant.stock : ""}
                  onChange={(e) =>
                    updateTyreVariant(variant.id, {
                      stock: Math.max(0, parseFloat(e.target.value) || 0)
                    })
                  }
                  required
                  className={variant.stock <= 0 ? "border-red-500" : ""}
                  style={{
                    backgroundColor:
                      variant.stock <= 0
                        ? "rgba(239, 68, 68, 0.1)"
                        : "rgba(255, 255, 255, 0.05)",
                    borderColor:
                      variant.stock <= 0 ? "#ef4444" : "var(--palette-accent-3)",
                    color: "var(--palette-text)",
                  }}
                />
              </div>
            </div>

            {/* Compatible Models */}
            <div className="mt-3">
              <label className="text-xs font-semibold mb-1 block" style={{ color: "var(--palette-accent-3)" }}>
                Compatible Models (Optional)
              </label>
              <Input
                placeholder="e.g., KTM Duke 125, KTM RC 125, Yamaha R15 V3"
                value={variant.compatibleModels || ""}
                onChange={(e) => updateTyreVariant(variant.id, { compatibleModels: e.target.value })}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: "var(--palette-accent-3)",
                  color: "var(--palette-text)",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add New Variant Button */}
      <div className="mt-4">
        <Button
          type="button"
          onClick={handleAddVariant}
          className="flex items-center gap-2 text-white w-full"
          style={{ backgroundColor: "var(--palette-btn)" }}
        >
          <Plus size={18} />
          Add Tyre Variant
        </Button>
      </div>

      {/* Summary */}
      {tyreVariants.length > 0 && (
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor:
              incompleteVariants.length > 0
                ? "rgba(239, 68, 68, 0.1)"
                : "rgba(238, 74, 35, 0.05)",
            border: "1px solid var(--palette-accent-3)",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--palette-text)" }}>
            Summary: {tyreVariants.length} tyre variant(s)
            {tyreVariants.some((v) => v.type === "combo") && (
              <span className="ml-2 text-green-600">• Includes combo sets</span>
            )}
          </p>

          {/* Variant breakdown */}
          <div className="mt-2 text-xs" style={{ color: "var(--palette-accent-3)" }}>
            {tyreVariants.filter((v) => v.type === "front").length > 0 && (
              <span>Front: {tyreVariants.filter((v) => v.type === "front").length} • </span>
            )}
            {tyreVariants.filter((v) => v.type === "rear").length > 0 && (
              <span>Rear: {tyreVariants.filter((v) => v.type === "rear").length} • </span>
            )}
            {tyreVariants.filter((v) => v.type === "combo").length > 0 && (
              <span>Combo: {tyreVariants.filter((v) => v.type === "combo").length}</span>
            )}
          </div>

          {incompleteVariants.length > 0 && (
            <p className="text-sm text-red-600 mt-2 font-semibold flex items-center gap-2">
              ⚠️ {incompleteVariants.length} variant(s) incomplete - Size, Price, and Stock are required
            </p>
          )}
          {incompleteVariants.length === 0 && tyreVariants.length > 0 && (
            <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
              ✓ All variants have required fields configured
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {tyreVariants.length === 0 && (
        <div
          className="text-center p-8 rounded-lg"
          style={{
            borderColor: "var(--palette-accent-3)",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "2px dashed",
          }}
        >
          <p style={{ color: "var(--palette-accent-3)" }}>
            No tyre variants added yet. Click "Add Tyre Variant" to get started.
          </p>
        </div>
      )}
    </div>
  );
}
