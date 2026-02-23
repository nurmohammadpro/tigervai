// components/product/ViewProductModal.tsx
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Package, DollarSign, Layers, Tag } from "lucide-react";
import { Product } from "@/@types/short-product";

interface ViewProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ViewProductModal: React.FC<ViewProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{
          borderColor: "var(--palette-accent-3)",
          color: "var(--palette-text)",
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold capitalize flex items-center justify-between">
            <span>{product?.name}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Product Image */}
          <div>
            <img
              src={product?.thumbnail || "/placeholder-product.jpg"}
              alt={product?.name}
              className="w-full h-64 object-cover rounded-lg"
              style={{ border: "1px solid var(--palette-accent-3)" }}
            />
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <h3
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--palette-accent-1)" }}
              >
                PRICING
              </h3>
              <div className="flex items-center gap-3">
                {product?.offerPrice ? (
                  <>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: "var(--palette-btn)" }}
                    >
                      ৳{product?.offerPrice}
                    </span>
                    <span
                      className="text-lg line-through"
                      style={{ color: "var(--palette-accent-3)" }}
                    >
                      ৳{product?.price}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold">৳{product?.price}</span>
                )}
              </div>
            </div>

            <div>
              <h3
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--palette-accent-1)" }}
              >
                CATEGORY
              </h3>
              <div className="flex items-center gap-2">
                <Tag size={16} />
                <span>
                  {product?.main} → {product?.subMain} →{product?.category}
                </span>
              </div>
            </div>

            <div>
              <h3
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--palette-accent-1)" }}
              >
                BRAND
              </h3>
              <span>{product?.brandName}</span>
            </div>

            <div>
              <h3
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--palette-accent-1)" }}
              >
                STOCK
              </h3>
              <div className="flex items-center gap-2">
                <Package size={16} />
                <span className={product?.stock < 20 ? "text-red-400" : ""}>
                  {product?.stock} units available
                </span>
              </div>
            </div>

            <div>
              <h3
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--palette-accent-1)" }}
              >
                STATUS
              </h3>
              {/*  <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  product.isActive
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {product.isActive ? "Active" : "Inactive"}
              </span> */}
            </div>
          </div>
        </div>

        {/* Description */}
        {/*  {product.description && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--palette-accent-1)" }}>
              DESCRIPTION
            </h3>
            <p style={{ color: "var(--palette-text)" }}>{product.description}</p>
          </div>
        )} */}

        {/* Variants */}
        {product.variants && product.variants.length > 0 && (
          <div className="mt-6">
            <h3
              className="text-sm font-semibold mb-3 flex items-center gap-2"
              style={{ color: "var(--palette-accent-1)" }}
            >
              <Layers size={16} />
              VARIANTS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.variants.map((variant: any, index: number) => (
                <div
                  key={index}
                  className="p-3 rounded-lg"
                  style={{
                    border: "1px solid var(--palette-accent-3)",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {variant.size} - {variant.color}
                      </p>
                      <p
                        className="text-sm mt-1"
                        style={{ color: "var(--palette-accent-3)" }}
                      >
                        Stock: {variant.stock}
                      </p>
                    </div>
                    <div className="text-right">
                      {variant.discountPrice ? (
                        <>
                          <p
                            className="font-semibold"
                            style={{ color: "var(--palette-btn)" }}
                          >
                            ৳{variant.discountPrice}
                          </p>
                          <p
                            className="text-sm line-through"
                            style={{ color: "var(--palette-accent-3)" }}
                          >
                            ৳{variant.price}
                          </p>
                        </>
                      ) : (
                        <p className="font-semibold">৳{variant.price}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
