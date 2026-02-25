// components/product/add-steps/StepVariantsImproved.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Upload, X, ChevronDown } from "lucide-react";
import { useAddProductStore } from "@/zustan-hook/addProductStore";
import { useUploadSingleImage } from "@/lib/useHandelImageUpload";

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

// Color group with image
interface ColorVariant {
  color: string;
  image?: {
    url: string;
    key: string;
    id: string;
  };
}

// Size row with multiple colors
interface SizeRow {
  id: string;
  size: string;
  regularPrice: number;
  offerPrice: number;
  stock: number;
  colors: ColorVariant[];
}

// Common color options for dropdown
const COLOR_OPTIONS = [
  "Red",
  "Blue",
  "Green",
  "Yellow",
  "Black",
  "White",
  "Pink",
  "Purple",
  "Orange",
  "Brown",
  "Gray",
  "Beige",
  "Navy",
  "Turquoise",
  "Maroon",
  "Lavender",
  "Teal",
  "Cream",
  "Gold",
  "Silver",
  "Coral",
  "Peach",
  "Magenta",
];

export default function StepVariantsImproved() {
  const { formData, updateField } = useAddProductStore();
  const variants = (formData.variants as Variant[]) || [];

  // State for table-like input
  const [sizeRows, setSizeRows] = useState<SizeRow[]>([]);

  // State for color dropdown
  const [openColorDropdowns, setOpenColorDropdowns] = useState<
    Record<string, boolean>
  >({});
  const dropdownRefs = useRef<
    Record<string, HTMLButtonElement | HTMLDivElement>
  >({});

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
        rows.push({
          id: `size-${size}-${Date.now()}`,
          size,
          regularPrice: firstVariant.price,
          offerPrice: firstVariant.discountPrice || 0,
          stock: firstVariant.stock,
          colors: variantsOfSize.map((v) => ({
            color: v.color || "",
            image: v.image,
          })),
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
        // If no colors, create a single variant with just size
        if (row.colors.length === 0) {
          flatVariants.push({
            size: row.size,
            price: row.regularPrice,
            discountPrice: row.offerPrice || undefined,
            stock: row.stock,
          });
        } else {
          row.colors.forEach((colorVar) => {
            flatVariants.push({
              size: row.size,
              color: colorVar.color || undefined,
              price: row.regularPrice,
              discountPrice: row.offerPrice || undefined,
              stock: row.stock,
              image: colorVar.image,
            });
          });
        }
      });
      updateField("variants", flatVariants);
    }
  }, [sizeRows]);

  const { mutate, isPending } = useUploadSingleImage();

  // Add a new size row
  const handleAddSizeRow = () => {
    const newRow: SizeRow = {
      id: `size-${Date.now()}`,
      size: "",
      regularPrice: 0,
      offerPrice: 0,
      stock: 0,
      colors: [],
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

  // Add color to a size row
  const handleAddColor = (rowId: string, color: string) => {
    const row = sizeRows.find((r) => r.id === rowId);
    if (!row) return;

    // Check if color already exists
    if (row.colors.some((c) => c.color === color)) {
      alert("This color is already added for this size");
      return;
    }

    const newColor: ColorVariant = {
      color,
    };

    handleUpdateSizeRow(rowId, "colors", [...row.colors, newColor]);
    setOpenColorDropdowns({ ...openColorDropdowns, [rowId]: false });
  };

  // Check if all sizes have stock
  const hasInvalidStock = () => {
    for (const row of sizeRows) {
      if (!row.stock || row.stock <= 0) return true;
    }
    return false;
  };

  // Get count of sizes without stock
  const getMissingStockCount = () => {
    let count = 0;
    for (const row of sizeRows) {
      if (!row.stock || row.stock <= 0) count++;
    }
    return count;
  };

  // Remove color from a size row
  const handleRemoveColor = (rowId: string, colorIndex: number) => {
    const row = sizeRows.find((r) => r.id === rowId);
    if (!row) return;

    const newColors = row.colors.filter((_, i) => i !== colorIndex);
    handleUpdateSizeRow(rowId, "colors", newColors);
  };

  // Update color variant (stock)
  const handleUpdateColorVariant = (
    rowId: string,
    colorIndex: number,
    field: keyof ColorVariant,
    value: any,
  ) => {
    const row = sizeRows.find((r) => r.id === rowId);
    if (!row) return;

    const newColors = [...row.colors];
    newColors[colorIndex] = { ...newColors[colorIndex], [field]: value };
    handleUpdateSizeRow(rowId, "colors", newColors);
  };

  // Upload image for a color
  const handleUploadColorImage = (
    rowId: string,
    colorIndex: number,
    file: File,
  ) => {
    const formData = new FormData();
    formData.append("file", file);
    mutate(formData, {
      onSuccess: (data) => {
        handleUpdateColorVariant(rowId, colorIndex, "image", {
          url: data?.data?.url as string,
          key: data?.data?.key as string,
          id: data?.data?.key as string,
        });
      },
    });
  };

  // Remove image from a color
  const handleRemoveColorImage = (rowId: string, colorIndex: number) => {
    handleUpdateColorVariant(rowId, colorIndex, "image", undefined);
  };

  // Get available colors for dropdown (exclude already added colors)
  const getAvailableColors = (rowId: string) => {
    const row = sizeRows.find((r) => r.id === rowId);
    if (!row) return COLOR_OPTIONS;
    return COLOR_OPTIONS.filter(
      (c) => !row.colors.some((rc) => rc.color === c),
    );
  };

  // Toggle color dropdown
  const toggleColorDropdown = (rowId: string) => {
    const isOpen = !openColorDropdowns[rowId];
    // Close all other dropdowns first
    setOpenColorDropdowns({});
    setOpenColorDropdowns({ [rowId]: isOpen });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const openDropdownId = Object.keys(openColorDropdowns).find(
        (id) => openColorDropdowns[id],
      );

      if (openDropdownId) {
        const container = dropdownRefs.current[openDropdownId];
        if (container && !container.contains(target)) {
          setOpenColorDropdowns({ [openDropdownId]: false });
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openColorDropdowns]);

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
            className="rounded-lg border overflow-hidden"
            style={{
              borderColor: "var(--palette-accent-3)",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
            }}
          >
            {/* Size Header Row */}
            <div
              className="p-4 border-b"
              style={{ borderColor: "var(--palette-accent-3)" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
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

                {/* Actions */}
                <div className="flex gap-2">
                  {/* Color Dropdown */}
                  <div
                    className="relative flex-1"
                    ref={(el) => {
                      if (el) dropdownRefs.current[row.id] = el;
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleColorDropdown(row.id)}
                      className="w-full h-10 px-3 rounded-lg border flex items-center justify-between gap-2 transition-colors"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderColor: "var(--palette-accent-3)",
                        color: "var(--palette-text)",
                      }}
                    >
                      <span className="text-sm">+ Add Color</span>
                      <ChevronDown size={16} />
                    </button>

                    {/* Dropdown Menu - Inline */}
                    {openColorDropdowns[row.id] && (
                      <div
                        className="rounded-lg border shadow-lg max-h-60 overflow-y-auto z-50 mt-1"
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          backgroundColor: "var(--palette-bg)",
                          borderColor: "var(--palette-accent-3)",
                        }}
                      >
                        {getAvailableColors(row.id).map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddColor(row.id, color);
                            }}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors flex items-center gap-2"
                            style={{ color: "var(--palette-text)" }}
                          >
                            <div
                              className="w-4 h-4 rounded-full border shrink-0"
                              style={{
                                backgroundColor:
                                  COLOR_OPTIONS.find((c) => c === color) ===
                                  color
                                    ? color.toLowerCase()
                                    : "#ccc",
                                borderColor: "rgba(0,0,0,0.2)",
                              }}
                            />
                            {color}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Delete Size Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveSizeRow(row.id)}
                    className="p-2 rounded-lg hover:bg-red-500/20 transition"
                    title="Remove this size"
                  >
                    <Trash2 size={18} className="text-red-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Colors List for this Size */}
            {row.colors.length > 0 && (
              <div style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
                {/* Table Header */}
                <div
                  className="px-4 py-2 grid grid-cols-12 gap-3 border-b text-xs font-semibold uppercase tracking-wider"
                  style={{
                    borderColor: "var(--palette-accent-3)",
                    color: "var(--palette-accent-3)",
                  }}
                >
                  <div className="col-span-3">Color</div>
                  <div className="col-span-7">Image (Optional)</div>
                  <div className="col-span-2 text-center">Actions</div>
                </div>

                {/* Color Rows */}
                <div className="p-4 space-y-3">
                  {row.colors.map((colorVar, colorIndex) => (
                    <div
                      key={colorIndex}
                      className="grid grid-cols-12 gap-3 p-3 rounded-lg border items-center"
                      style={{
                        borderColor: "var(--palette-accent-3)",
                        backgroundColor: "rgba(255, 255, 255, 0.03)",
                      }}
                    >
                      {/* Color Name */}
                      <div className="col-span-3 flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border flex-shrink-0"
                          style={{
                            backgroundColor: colorVar.color.toLowerCase(),
                            borderColor: "rgba(0,0,0,0.2)",
                          }}
                        />
                        <span
                          className="font-medium text-sm"
                          style={{ color: "var(--palette-text)" }}
                        >
                          {colorVar.color}
                        </span>
                      </div>

                      {/* Image Upload */}
                      <div className="col-span-7">
                        {!colorVar.image?.url ? (
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleUploadColorImage(
                                    row.id,
                                    colorIndex,
                                    file,
                                  );
                                }
                              }}
                              className="hidden"
                              id={`image-${row.id}-${colorIndex}`}
                              disabled={isPending}
                            />
                            <label
                              htmlFor={`image-${row.id}-${colorIndex}`}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer hover:bg-white/5 transition"
                              style={{
                                borderColor: "var(--palette-accent-3)",
                                color: "var(--palette-accent-3)",
                              }}
                            >
                              <Upload size={16} />
                              <span className="text-sm">
                                {isPending ? "Uploading..." : "Upload Image"}
                              </span>
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <img
                              src={colorVar.image.url}
                              alt={colorVar.color}
                              className="w-12 h-12 object-cover rounded border"
                              style={{ borderColor: "var(--palette-accent-3)" }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveColorImage(row.id, colorIndex)
                              }
                              className="p-1 hover:bg-red-500/20 rounded transition"
                              title="Remove image"
                            >
                              <X size={16} className="text-red-400" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Remove Color Button */}
                      <div className="col-span-2 flex justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(row.id, colorIndex)}
                          className="p-2 rounded-lg hover:bg-red-500/20 transition"
                          title="Remove this color"
                        >
                          <Trash2 size={16} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add New Size Button */}
      <Button
        type="button"
        onClick={handleAddSizeRow}
        className="flex items-center gap-2 text-white w-full"
        style={{ backgroundColor: "var(--palette-btn)" }}
      >
        <Plus size={18} />
        Add New Size
      </Button>

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
            {sizeRows.reduce((acc, row) => acc + row.colors.length, 0)} color
            variant(s)
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
