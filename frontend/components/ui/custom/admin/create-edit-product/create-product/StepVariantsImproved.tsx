// components/product/add-steps/StepVariantsImproved.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useAddProductStore } from "@/zustan-hook/addProductStore";

interface Variant {
  size: string;
  color?: string;
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

// Size row with comma-separated colors
interface SizeRow {
  id: string;
  size: string;
  regularPrice: number;
  offerPrice: number;
  stock: number;
  colors: string; // Comma-separated string
}

export default function StepVariantsImproved() {
  const { formData, updateField } = useAddProductStore();
  const variants = (formData.variants as Variant[]) || [];

  // State for table-like input
  const [sizeRows, setSizeRows] = useState<SizeRow[]>([]);

  // Initialize sizeRows from existing variants on mount
  React.useEffect(() => {
    if (variants.length > 0 && sizeRows.length === 0) {
      // Group variants by size
      const groupedBySize = new Map<string, Variant[]>();
      variants.forEach((v) => {
        const key = v.size;
        if (!groupedBySize.has(key)) {
          groupedBySize.set(key, []);
        }
        groupedBySize.get(key)!.push(v);
      });

      // Convert to SizeRow format
      const rows: SizeRow[] = [];
      groupedBySize.forEach((variantsOfSize, size) => {
        const firstVariant = variantsOfSize[0];
        // Extract colors and join them with commas
        const colors = variantsOfSize
          .map((v) => v.color)
          .filter(Boolean)
          .join(", ");
        rows.push({
          id: `size-${size}-${Date.now()}`,
          size,
          regularPrice: firstVariant.price,
          offerPrice: firstVariant.discountPrice || 0,
          stock: firstVariant.stock,
          colors,
        });
      });
      setSizeRows(rows);
    }
  }, [variants]);

  // Update formData.variants when sizeRows change
  React.useEffect(() => {
    if (sizeRows.length > 0) {
      // Flatten sizeRows back to variants array
      const flatVariants: Variant[] = [];
      sizeRows.forEach((row) => {
        // Parse comma-separated colors
        const colorList = row.colors
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);

        // If no colors, create a single variant with just size
        if (colorList.length === 0) {
          flatVariants.push({
            size: row.size,
            price: row.regularPrice,
            discountPrice: row.offerPrice || undefined,
            stock: row.stock,
          });
        } else {
          // Create a variant for each color
          colorList.forEach((color) => {
            flatVariants.push({
              size: row.size,
              color,
              price: row.regularPrice,
              discountPrice: row.offerPrice || undefined,
              stock: row.stock,
            });
          });
        }
      });
      updateField("variants", flatVariants);
    }
  }, [sizeRows]);

  // Add a new size row
  const handleAddSizeRow = () => {
    const newRow: SizeRow = {
      id: `size-${Date.now()}`,
      size: "",
      regularPrice: 0,
      offerPrice: 0,
      stock: 0,
      colors: "",
    };
    setSizeRows([...sizeRows, newRow]);
  };

  // Remove a size row
  const handleRemoveSizeRow = (rowId: string) => {
    setSizeRows(sizeRows.filter((row) => row.id !== rowId));
  };

  // Update size row fields
  const handleUpdateSizeRow = (
    rowId: string,
    field: keyof SizeRow,
    value: any,
  ) => {
    setSizeRows(
      sizeRows.map((row) =>
        row.id === rowId ? { ...row, [field]: value } : row,
      ),
    );
  };

  // Get count of sizes without stock
  const getMissingStockCount = () => {
    let count = 0;
    for (const row of sizeRows) {
      if (!row.stock || row.stock <= 0) count++;
    }
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3
          className="font-semibold mb-1"
          style={{ color: "var(--palette-accent-1)" }}
        >
          Product Variants
        </h3>
        <p className="text-sm" style={{ color: "var(--palette-accent-3)" }}>
          Add sizes with pricing, stock, and optional colors for your product
          variants.
        </p>
      </div>

      {/* Size Rows */}
      <div className="space-y-4">
        {sizeRows.map((row) => (
          <div
            key={row.id}
            className="rounded-lg border p-4"
            style={{
              borderColor: "var(--palette-accent-3)",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
              {/* Size Name */}
              <div>
                <label
                  className="text-xs font-semibold mb-1 block"
                  style={{ color: "var(--palette-accent-3)" }}
                >
                  Size *
                </label>
                <Input
                  placeholder="e.g., M, L, XL"
                  value={row.size}
                  onChange={(e) =>
                    handleUpdateSizeRow(row.id, "size", e.target.value)
                  }
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderColor: "var(--palette-accent-3)",
                    color: "var(--palette-text)",
                  }}
                />
              </div>

              {/* Regular Price */}
              <div>
                <label
                  className="text-xs font-semibold mb-1 block"
                  style={{ color: "var(--palette-accent-3)" }}
                >
                  Regular Price *
                </label>
                <Input
                  type="number"
                  placeholder="500"
                  value={row.regularPrice > 0 ? row.regularPrice : ""}
                  onChange={(e) =>
                    handleUpdateSizeRow(
                      row.id,
                      "regularPrice",
                      parseFloat(e.target.value) || 0,
                    )
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
                <label
                  className="text-xs font-semibold mb-1 block"
                  style={{ color: "var(--palette-accent-3)" }}
                >
                  Offer Price (Optional)
                </label>
                <Input
                  type="number"
                  placeholder="450"
                  value={row.offerPrice > 0 ? row.offerPrice : ""}
                  onChange={(e) =>
                    handleUpdateSizeRow(
                      row.id,
                      "offerPrice",
                      parseFloat(e.target.value) || 0,
                    )
                  }
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderColor: "var(--palette-accent-3)",
                    color: "var(--palette-text)",
                  }}
                />
              </div>

              {/* Stock */}
              <div>
                <label
                  className="text-xs font-semibold mb-1 block"
                  style={{ color: "var(--palette-accent-3)" }}
                >
                  Stock *
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={row.stock > 0 ? row.stock : ""}
                  onChange={(e) =>
                    handleUpdateSizeRow(
                      row.id,
                      "stock",
                      Math.max(0, parseFloat(e.target.value) || 0),
                    )
                  }
                  required
                  className={row.stock <= 0 ? "border-red-500" : ""}
                  style={{
                    backgroundColor:
                      row.stock <= 0
                        ? "rgba(239, 68, 68, 0.1)"
                        : "rgba(255, 255, 255, 0.05)",
                    borderColor:
                      row.stock <= 0 ? "#ef4444" : "var(--palette-accent-3)",
                    color: "var(--palette-text)",
                  }}
                />
              </div>

              {/* Colors (Comma-separated) */}
              <div>
                <label
                  className="text-xs font-semibold mb-1 block"
                  style={{ color: "var(--palette-accent-3)" }}
                >
                  Colors (Optional)
                </label>
                <Input
                  placeholder="Red, Blue, Green"
                  value={row.colors}
                  onChange={(e) =>
                    handleUpdateSizeRow(row.id, "colors", e.target.value)
                  }
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    borderColor: "var(--palette-accent-3)",
                    color: "var(--palette-text)",
                  }}
                />
              </div>

              {/* Delete Size Button */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => handleRemoveSizeRow(row.id)}
                  className="h-10 px-3 rounded-lg hover:bg-red-500/20 transition flex items-center justify-center"
                  title="Remove this size"
                  style={{
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#ef4444",
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Size Button */}
      <div className="mt-4">
        <Button
          type="button"
          onClick={handleAddSizeRow}
          className="flex items-center gap-2 text-white w-full"
          style={{ backgroundColor: "var(--palette-btn)" }}
        >
          <Plus size={18} />
          Add New Size
        </Button>
      </div>

      {/* Summary */}
      {sizeRows.length > 0 && (
        <div
          className="p-4 rounded-lg"
          style={{
            backgroundColor:
              getMissingStockCount() > 0
                ? "rgba(239, 68, 68, 0.1)"
                : "rgba(238, 74, 35, 0.05)",
            border: "1px solid var(--palette-accent-3)",
          }}
        >
          <p
            className="text-sm font-semibold"
            style={{ color: "var(--palette-text)" }}
          >
            Summary: {sizeRows.length} size(s),{" "}
            {sizeRows.reduce(
              (acc, row) =>
                acc +
                row.colors
                  .split(",")
                  .map((c) => c.trim())
                  .filter(Boolean).length,
              0,
            )}{" "}
            color variant(s)
          </p>
          {getMissingStockCount() > 0 && (
            <p className="text-sm text-red-600 mt-2 font-semibold flex items-center gap-2">
              ⚠️ {getMissingStockCount()} size(s) missing stock - Stock is
              required for all sizes
            </p>
          )}
          {getMissingStockCount() === 0 && (
            <p className="text-sm text-green-600 mt-2 flex items-center gap-2">
              ✓ All sizes have stock configured
            </p>
          )}
        </div>
      )}

      {/* Empty State */}
      {sizeRows.length === 0 && (
        <div
          className="text-center p-8 rounded-lg"
          style={{
            borderColor: "var(--palette-accent-3)",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            border: "2px dashed",
          }}
        >
          <p style={{ color: "var(--palette-accent-3)" }}>
            No variants added yet. Click "Add New Size" to get started.
          </p>
        </div>
      )}
    </div>
  );
}
