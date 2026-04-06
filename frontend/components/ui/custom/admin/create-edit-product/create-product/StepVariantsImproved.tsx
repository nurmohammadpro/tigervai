// components/product/add-steps/StepVariantsImproved.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Upload, X } from "lucide-react";
import { useAddProductStore } from "@/zustan-hook/addProductStore";
import { useEditProductStore } from "@/zustan-hook/editProductStore";
import { useUploadSingleImage } from "@/lib/useHandelImageUpload";
import { toast } from "sonner";

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
  // Tyre-specific fields
  season?: string;
  loadIndex?: string;
  speedRating?: string;
}

// Size row with comma-separated colors
interface SizeRow {
  id: string;
  size: string;
  regularPrice: number;
  offerPrice: number;
  stock: number;
  colors: string; // Comma-separated string
  // Tyre-specific fields
  variantType?: "front" | "rear" | "combo" | "standard";
  season?: string;
  loadIndex?: string;
  speedRating?: string;
  compatibleModels?: string;
  // Variant-specific image
  image?: {
    url: string;
    key: string;
    id: string;
  };
}

interface StepVariantsImprovedProps {
  mode?: "add" | "edit";
  productType?: "tyre" | "clothing" | "electronics" | "accessories" | "general";
}

export default function StepVariantsImproved({
  mode = "add",
  productType = "clothing",
}: StepVariantsImprovedProps) {
  // Use the appropriate store based on mode
  const addStore = useAddProductStore();
  const editStore = useEditProductStore();

  const { formData, updateField } =
    mode === "add" ? addStore : editStore;

  const variants = (formData?.variants as Variant[]) || [];
  const { mutate: uploadVariantImage } = useUploadSingleImage();

  // Handle variant image upload
  const handleVariantImageUpload = (rowId: string, file: File) => {
    const loadingToast = toast.loading("Uploading variant image...");
    const formData = new FormData();
    formData.append("file", file);

    uploadVariantImage(formData, {
      onSuccess: (data) => {
        toast.dismiss(loadingToast);
        if (data?.error) {
          toast.error(data.error.message);
          return;
        }
        if (!data?.data?.url) {
          toast.error("Upload failed - no URL returned");
          return;
        }

        const imageData = {
          url: data.data.url,
          key: data.data.key,
          id: data.data.key,
        };

        setSizeRows(sizeRows.map(row =>
          row.id === rowId ? { ...row, image: imageData } : row
        ));
        toast.success("Variant image uploaded successfully");
      },
      onError: (error) => {
        toast.dismiss(loadingToast);
        toast.error(error.message || "Failed to upload image");
      },
    });
  };

  const handleRemoveVariantImage = (rowId: string) => {
    setSizeRows(sizeRows.map(row =>
      row.id === rowId ? { ...row, image: undefined } : row
    ));
  };

  // State for table-like input
  const [sizeRows, setSizeRows] = useState<SizeRow[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize sizeRows from existing variants on mount (only once)
  React.useEffect(() => {
    if (variants.length > 0 && sizeRows.length === 0 && !isInitialized) {
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
        // Extract variantType from size if it's a tyre (e.g., "front - 110/70 R17")
        let variantType: "front" | "rear" | "combo" | "standard" = "standard";
        let rawSize = size; // Default to full size string
        if (productType === "tyre") {
          const sizeParts = size.split(" - ");
          const typePart = sizeParts[0]?.toLowerCase();
          if (typePart === "front" || typePart === "rear" || typePart === "combo") {
            variantType = typePart as "front" | "rear" | "combo";
            // Extract just the actual size part (after the prefix)
            rawSize = sizeParts.slice(1).join(" - ");
          }
        }
        rows.push({
          id: `size-${size}-${Date.now()}`,
          size: rawSize,
          regularPrice: firstVariant.price,
          offerPrice: firstVariant.discountPrice || 0,
          stock: firstVariant.stock,
          colors,
          variantType,
          season: firstVariant.season,
          loadIndex: firstVariant.loadIndex,
          speedRating: firstVariant.speedRating,
          compatibleModels: firstVariant.recommended,
          image: firstVariant.image,
        });
      });
      setSizeRows(rows);
      setIsInitialized(true);
    }
  }, [variants, productType, isInitialized]);

  // Update formData.variants when sizeRows change
  React.useEffect(() => {
    if (sizeRows.length > 0) {
      // Flatten sizeRows back to variants array
      const flatVariants: Variant[] = [];
      sizeRows.forEach((row) => {
        // Parse comma-separated colors (only for clothing)
        const colorList = productType === "tyre"
          ? []
          : row.colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean);

        // If no colors (or tyre type), create a single variant with just size
        if (colorList.length === 0) {
          flatVariants.push({
            // For tyres, prefix size with variant type for display
            size: productType === "tyre" && row.variantType && row.variantType !== "standard"
              ? `${row.variantType} - ${row.size}`
              : row.size,
            price: row.regularPrice,
            discountPrice: row.offerPrice || undefined,
            stock: row.stock,
            // Add image if present
            ...(row.image && { image: row.image }),
            // Add tyre-specific fields if present
            ...(productType === "tyre" && {
              variantType: row.variantType || "standard",
              season: row.season,
              loadIndex: row.loadIndex,
              speedRating: row.speedRating,
              recommended: row.compatibleModels,
            }),
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
  }, [sizeRows, productType]);

  // Add a new size row
  const handleAddSizeRow = () => {
    const newRow: SizeRow = {
      id: `size-${Date.now()}`,
      size: "",
      regularPrice: 0,
      offerPrice: 0,
      stock: 0,
      colors: "",
      variantType: productType === "tyre" ? "front" : "standard",
      // Initialize tyre-specific fields
      ...(productType === "tyre" && {
        season: "",
        loadIndex: "",
        speedRating: "",
        compatibleModels: "",
      }),
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
          {productType === "tyre" ? "Tyre Variants" : "Product Variants"}
        </h3>
        <p className="text-sm" style={{ color: "var(--palette-accent-3)" }}>
          {productType === "tyre"
            ? "Add tyre sizes with pricing, stock, and specifications."
            : "Add sizes with pricing, stock, and optional colors for your product variants."}
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
            <div className={`grid gap-3 items-end ${productType === "tyre" ? "grid-cols-1 md:grid-cols-10" : "grid-cols-1 md:grid-cols-6"}`}>
              {/* Variant Type (for tyres) */}
              {productType === "tyre" && (
                <div>
                  <label
                    className="text-xs font-semibold mb-1 block"
                    style={{ color: "var(--palette-accent-3)" }}
                  >
                    Type *
                  </label>
                  <select
                    value={row.variantType || "front"}
                    onChange={(e) =>
                      handleUpdateSizeRow(row.id, "variantType", e.target.value as "front" | "rear" | "combo" | "standard")
                    }
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      borderColor: "var(--palette-accent-3)",
                      color: "var(--palette-text)",
                      width: "100%",
                      padding: "8px",
                      borderRadius: "6px",
                    }}
                  >
                    <option value="front">Front</option>
                    <option value="rear">Rear</option>
                    <option value="combo">Combo</option>
                  </select>
                </div>
              )}

              {/* Size Name */}
              <div>
                <label
                  className="text-xs font-semibold mb-1 block"
                  style={{ color: "var(--palette-accent-3)" }}
                >
                  {productType === "tyre" ? "Tyre Size *" : "Size *"}
                </label>
                <Input
                  placeholder={productType === "tyre" ? "e.g., 175/65 R14" : "e.g., M, L, XL"}
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

              {/* Colors (Comma-separated) - Only show for non-tyre products */}
              {productType !== "tyre" && (
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
              )}

              {/* Tyre-specific fields: Season */}
              {productType === "tyre" && (
                <>
                  <div>
                    <label
                      className="text-xs font-semibold mb-1 block"
                      style={{ color: "var(--palette-accent-3)" }}
                    >
                      Season (Optional)
                    </label>
                    <Input
                      placeholder="e.g., Summer"
                      value={row.season || ""}
                      onChange={(e) =>
                        handleUpdateSizeRow(row.id, "season", e.target.value)
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
                      Load Index (Optional)
                    </label>
                    <Input
                      placeholder="e.g., 91"
                      value={row.loadIndex || ""}
                      onChange={(e) =>
                        handleUpdateSizeRow(row.id, "loadIndex", e.target.value)
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
                      Speed Rating (Optional)
                    </label>
                    <Input
                      placeholder="e.g., H"
                      value={row.speedRating || ""}
                      onChange={(e) =>
                        handleUpdateSizeRow(row.id, "speedRating", e.target.value)
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
                      Compatible Models (Optional)
                    </label>
                    <Input
                      placeholder="e.g., KTM Duke 125, Yamaha R15"
                      value={row.compatibleModels || ""}
                      onChange={(e) =>
                        handleUpdateSizeRow(row.id, "compatibleModels", e.target.value)
                      }
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderColor: "var(--palette-accent-3)",
                        color: "var(--palette-text)",
                      }}
                    />
                  </div>
                </>
              )}

              {/* Variant Image Upload (for tyres) */}
              {productType === "tyre" && (
                <div>
                  <label
                    className="text-xs font-semibold mb-1 block"
                    style={{ color: "var(--palette-accent-3)" }}
                  >
                    Variant Image (Optional)
                  </label>
                  {row.image ? (
                    <div className="relative group">
                      <img
                        src={row.image.url}
                        alt={`${row.variantType} variant`}
                        className="w-full h-10 object-cover rounded border"
                        style={{ borderColor: "var(--palette-accent-3)" }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveVariantImage(row.id)}
                        className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X size={12} className="text-white" />
                      </button>
                    </div>
                  ) : (
                    <label
                      className={`flex flex-col items-center justify-center gap-1 h-10 rounded border cursor-pointer transition-colors ${
                        true ? "hover:border-[var(--palette-btn)]" : ""
                      }`}
                      style={{
                        borderColor: "var(--palette-accent-3)",
                        backgroundColor: "rgba(255, 255, 255, 0.02)",
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleVariantImageUpload(row.id, file);
                        }}
                      />
                      <Upload size={14} style={{ color: "var(--palette-accent-3)" }} />
                    </label>
                  )}
                </div>
              )}

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
          {productType === "tyre" ? "Add New Tyre Size" : "Add New Size"}
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
            {productType === "tyre" ? (
              <>Summary: {sizeRows.length} tyre size(s)</>
            ) : (
              <>
                Summary: {sizeRows.length} size(s),{" "}
                {sizeRows.reduce(
                  (acc, row) =>
                    acc +
                    row.colors
                      .split(",")
                      .map((c) => c.trim())
                      .filter(Boolean).length,
                  0
                )}{" "}
                color variant(s)
              </>
            )}
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
            {productType === "tyre"
              ? 'No tyre sizes added yet. Click "Add New Tyre Size" to get started.'
              : 'No variants added yet. Click "Add New Size" to get started.'}
          </p>
        </div>
      )}
    </div>
  );
}
