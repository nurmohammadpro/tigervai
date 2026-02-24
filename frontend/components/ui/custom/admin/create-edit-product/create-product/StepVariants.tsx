// components/product/add-steps/StepVariants.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pen, Plus, Trash2, Upload, X } from "lucide-react";
import { useAddProductStore } from "@/zustan-hook/addProductStore";
import { useUploadSingleImage } from "@/lib/useHandelImageUpload";

interface Variant {
  size: string;
  color?: string; // Optional for products like tyres
  price: number;
  stock: number;
  discountPrice?: number;
  sku?: string;
  recommended?: string;
  image?: {
    url: string;
    key: string;
    id: string;
  };
}

export default function StepVariants() {
  const { formData, updateField } = useAddProductStore();
  const [newVariant, setNewVariant] = useState<Variant>({
    size: "",
    color: "",
    price: 0,
    stock: 0,
  });

  const variants = (formData.variants as Variant[]) || [];

  const handleAddVariant = () => {
    if (
      !newVariant.size ||
      newVariant.price <= 0 ||
      newVariant.stock < 0
    ) {
      alert("Please fill all required variant fields (Size, Price, Stock)");
      return;
    }

    updateField("variants", [...variants, newVariant]);
    setNewVariant({
      size: "",
      color: "",
      price: 0,
      stock: 0,
      image: { url: "", key: "", id: "" },
    });
  };

  const handleRemoveVariant = (index: number) => {
    updateField(
      "variants",
      variants.filter((_, i) => i !== index)
    );
  };

  const { mutate, isPending } = useUploadSingleImage();

  const handelUploadImage = (file: File) => {
    const fromData = new FormData();
    fromData.append("file", file);
    mutate(fromData, {
      onSuccess: (data) => {
        setNewVariant({
          ...newVariant,
          image: {
            url: data?.data?.url as string,
            key: data?.data?.key as string,
            id: data?.data?.key as string,
          },
        });
      },
    });
  };

  const handleRemoveImage = () => {
    setNewVariant({
      ...newVariant,
      image: undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Add Variant Form */}
      <div
        className="p-4 rounded-lg border"
        style={{
          borderColor: "var(--palette-accent-3)",
          backgroundColor: "rgba(255, 255, 255, 0.02)",
        }}
      >
        <h3
          className="font-semibold mb-4"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Add New Variant
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              Size
            </label>
            <Input
              placeholder="e.g., M, L, 42"
              value={newVariant.size}
              onChange={(e) =>
                setNewVariant({ ...newVariant, size: e.target.value })
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
              Color (Optional)
            </label>
            <Input
              placeholder="e.g., Red, Blue"
              value={newVariant.color}
              onChange={(e) =>
                setNewVariant({ ...newVariant, color: e.target.value })
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
              Price
            </label>
            <Input
              type="number"
              placeholder="1000"
              value={newVariant.price > 0 ? newVariant.price : ""}
              onChange={(e) =>
                setNewVariant({
                  ...newVariant,
                  price: parseFloat(e.target.value) || 0,
                })
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
              Stock
            </label>
            <Input
              type="number"
              placeholder="0"
              value={newVariant.stock > 0 ? newVariant.stock : ""}
              onChange={(e) =>
                setNewVariant({
                  ...newVariant,
                  stock: parseFloat(e.target.value) || 0,
                })
              }
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label
              className="text-xs font-semibold mb-1 block"
              style={{ color: "var(--palette-accent-3)" }}
            >
              Discount Price (Optional)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={
                (newVariant.discountPrice ?? 0) > 0
                  ? newVariant.discountPrice
                  : ""
              }
              onChange={(e) =>
                setNewVariant({
                  ...newVariant,
                  discountPrice: parseFloat(e.target.value) || undefined,
                })
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
              SKU (Optional)
            </label>
            <Input
              placeholder="e.g., SKU-001"
              value={newVariant.sku || ""}
              onChange={(e) =>
                setNewVariant({ ...newVariant, sku: e.target.value })
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
              Recommended (Optional)
            </label>
            <Input
              placeholder="e.g., Use this variant"
              value={newVariant.recommended || ""}
              onChange={(e) =>
                setNewVariant({ ...newVariant, recommended: e.target.value })
              }
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            />
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="mb-4">
          <label
            className="text-xs font-semibold mb-2 block"
            style={{ color: "var(--palette-accent-3)" }}
          >
            Variant Image (Optional)
          </label>

          {!newVariant.image?.url ? (
            <div
              className="relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-white/5 transition-colors"
              style={{ borderColor: "var(--palette-accent-3)" }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handelUploadImage(file);
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isPending}
              />
              <div className="flex flex-col items-center gap-2">
                <Upload
                  size={32}
                  style={{ color: "var(--palette-accent-3)" }}
                />
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--palette-accent-3)" }}
                >
                  {isPending ? "Uploading..." : "Click to upload variant image"}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--palette-accent-3)", opacity: 0.7 }}
                >
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            </div>
          ) : (
            <div
              className="relative rounded-lg border p-2"
              style={{
                borderColor: "var(--palette-accent-3)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              }}
            >
              <div className="relative w-full h-32">
                <img
                  src={newVariant.image.url}
                  alt="Variant preview"
                  className="w-full h-full object-cover rounded"
                />
                <button
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full transition"
                  type="button"
                >
                  <X size={16} className="text-white" />
                </button>
              </div>
              <p
                className="text-xs mt-2 text-center"
                style={{ color: "var(--palette-accent-3)" }}
              >
                Image uploaded ✓
              </p>
            </div>
          )}
        </div>

        <Button
          onClick={handleAddVariant}
          className="flex items-center gap-2 text-white"
          style={{ backgroundColor: "var(--palette-btn)" }}
        >
          <Plus size={18} />
          Add Variant
        </Button>
      </div>

      {/* Variants List */}
      {variants.length > 0 && (
        <div>
          <h3
            className="font-semibold mb-3"
            style={{ color: "var(--palette-accent-1)" }}
          >
            Added Variants ({variants.length})
          </h3>
          <div className="space-y-2">
            {variants.map((variant, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-3 rounded-lg gap-3"
                style={{
                  borderColor: "var(--palette-accent-3)",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid",
                }}
              >
                {/* Variant Image Preview */}
                {variant.image?.url && (
                  <div className="flex-shrink-0">
                    <img
                      src={variant.image.url}
                      alt={`${variant.size} ${variant.color || ""}`}
                      className="w-16 h-16 object-cover rounded border"
                      style={{ borderColor: "var(--palette-accent-3)" }}
                    />
                  </div>
                )}

                <div className="flex-1">
                  <p className="font-medium">
                    {variant.size}
                    {variant.color && ` - ${variant.color}`}
                  </p>
                  <p
                    className="text-sm"
                    style={{ color: "var(--palette-accent-3)" }}
                  >
                    ৳{variant.price}
                    {variant.discountPrice && ` → ৳${variant.discountPrice}`} |
                    Stock: {variant.stock}
                    {variant.sku && ` | SKU: ${variant.sku}`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setNewVariant({
                      color: variant?.color || "",
                      price: variant?.price,
                      size: variant?.size,
                      stock: variant?.stock,
                      recommended: variant?.recommended,
                      discountPrice: variant?.discountPrice,
                      sku: variant?.sku,
                      image: variant?.image,
                    });
                    handleRemoveVariant(index);
                  }}
                  className="p-2 hover:bg-red-500/20 rounded transition"
                >
                  <Pen size={18} className="text-red-400" />
                </button>
                <button
                  onClick={() => handleRemoveVariant(index)}
                  className="p-2 hover:bg-red-500/20 rounded transition"
                >
                  <Trash2 size={18} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {variants.length === 0 && (
        <div
          className="text-center p-8 rounded-lg"
          style={{
            borderColor: "var(--palette-accent-3)",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "2px dashed",
          }}
        >
          <p style={{ color: "var(--palette-accent-3)" }}>
            No variants added yet. Add at least one variant for the product.
          </p>
        </div>
      )}
    </div>
  );
}
