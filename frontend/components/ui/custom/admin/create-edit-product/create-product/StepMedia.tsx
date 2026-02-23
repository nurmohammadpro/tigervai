"use client";

import React from "react";
import { ImageUploadField } from "../ImageUploadField";
import { useAddProductStore } from "@/zustan-hook/addProductStore";
import { ReactSortable } from "react-sortablejs";
import { ProductImage } from "@/@types/fullProduct";

export default function StepMedia() {
  const { formData, updateField } = useAddProductStore();

  const handleThumbnailSelected = (
    images: Array<{ url: string; key: string; id: string }>
  ) => {
    if (images.length > 0) {
      updateField("thumbnail", images[0]);
    }
  };

  const handleImagesSelected = (
    images: Array<{ url: string; key: string; id: string }>
  ) => {
    updateField("images", images);
  };

  const images = (formData.images as ProductImage[]) || [];

  return (
    <div className="space-y-6">
      {/* Thumbnail upload field unchanged */}
      <ImageUploadField
        label="Product Thumbnail *"
        isThumbnail={true}
        maxFiles={1}
        onImagesSelected={handleThumbnailSelected}
      />

      {formData.thumbnail && (
        <div
          className="p-3 rounded-lg"
          style={{
            backgroundColor: "var(--palette-btn)/20",
            borderColor: "var(--palette-btn)",
            border: "1px solid",
          }}
        >
          <p className="text-sm font-medium mb-2">Thumbnail Selected ✓</p>
          <img
            src={formData.thumbnail?.url || ""}
            alt="Thumbnail"
            className="w-24 h-24 object-cover rounded"
          />
        </div>
      )}

      {/* Images upload field unchanged */}
      <ImageUploadField
        label="Product Images"
        isThumbnail={false}
        maxFiles={10}
        onImagesSelected={handleImagesSelected}
      />

      {images.length > 0 && (
        <div>
          <p
            className="text-sm font-medium mb-3"
            style={{ color: "var(--palette-accent-1)" }}
          >
            Uploaded Images ({images.length}) - Drag to reorder
          </p>
          <ReactSortable
            id="images-grid"
            list={images}
            setList={(newOrder) => updateField("images", newOrder)}
            className="grid grid-cols-4 gap-3"
            animation={200}
            handle=".drag-handle"
            itemClass="sortable-item"
            group="images"
            style={{ touchAction: "none" }}
          >
            {images.map((img, index) => (
              <div
                key={`${img.id || img.key}-${index}`}
                className="w-full h-24 relative sortable-item"
              >
                <div
                  className="w-full h-24 cursor-grab active:cursor-grabbing rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 border-2 border-transparent hover:border-blue-400 group relative drag-handle"
                  style={{
                    touchAction: "none",
                    userSelect: "none",
                  }}
                >
                  {/* Drag handle - unchanged */}
                  <div className="absolute top-1 right-1 w-6 h-6 bg-blue-500/80 hover:bg-blue-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10 cursor-grab active:cursor-grabbing">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 8h16M4 16h16"
                      />
                    </svg>
                  </div>

                  <img
                    src={img.url}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                    draggable={false}
                  />

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                    <span className="text-white text-xs font-medium px-2 py-1 bg-black/50 rounded">
                      Drag ↕️
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </ReactSortable>
        </div>
      )}
    </div>
  );
}
