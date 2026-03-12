// components/ui/custom/admin/create-edit-product/tyre-product/StepTyreBasicInfo.tsx
"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddTyreProductStore } from "@/zustand-hook/addTyreProductStore";
import { useQueryWrapper } from "@/api-hook/react-query-wrapper";
import { BrandResponse, CategoryResponse } from "@/@types/category-brand";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import RichTextEditor from "../../addProduct/Description";

// Tyre-specific categories
const TYRE_MAIN_CATEGORIES = ["Car Tyre", "Motorcycle Tyre"];

export default function StepTyreBasicInfo() {
  const { formData, updateField } = useAddTyreProductStore();
  const [isBrandInputMode, setIsBrandInputMode] = useState(false);

  const {
    data: brandsData,
  } = useQueryWrapper<BrandResponse>(["brands"], `/brand?page=1&limit=20`);

  const { data: categoriesData } = useQueryWrapper<CategoryResponse>(
    ["categories"],
    `/category?page=1&limit=30`
  );

  // Find tyre categories
  const tyreCategory = categoriesData?.data?.find(
    (cat) => cat.name === formData.category?.main
  );

  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--palette-accent-1)" }}>
          Tyre Product Name *
        </label>
        <Input
          placeholder="e.g., Michelin City Grip, Apollo Amper 4G"
          value={formData.name || ""}
          onChange={(e) => updateField("name", e.target.value)}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "var(--palette-accent-3)",
            color: "var(--palette-text)",
          }}
        />
        <p className="text-xs mt-1" style={{ color: "var(--palette-accent-3)" }}>
          Include brand and model name for better visibility
        </p>
      </div>

      {/* Tyre Type Selection */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--palette-accent-1)" }}>
          Tyre Type *
        </label>
        <Select
          value={formData.category?.main || ""}
          onValueChange={(value) => {
            updateField("category", {
              main: value,
              subMain: "",
              category: "",
            });
          }}
        >
          <SelectTrigger
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderColor: "var(--palette-accent-3)",
              color: "var(--palette-text)",
            }}
          >
            <SelectValue placeholder="Select tyre type" />
          </SelectTrigger>
          <SelectContent
            style={{
              backgroundColor: "var(--palette-bg)",
              color: "var(--palette-text)",
            }}
          >
            {TYRE_MAIN_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Sub Category (if available) */}
      {tyreCategory?.sub && tyreCategory.sub.length > 0 && (
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--palette-accent-1)" }}>
            Sub Category *
          </label>
          <Select
            value={formData.category?.subMain || ""}
            onValueChange={(value) => {
              updateField("category", {
                ...formData.category,
                subMain: value,
                category: "",
              });
            }}
          >
            <SelectTrigger
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            >
              <SelectValue placeholder="Select sub category" />
            </SelectTrigger>
            <SelectContent
              style={{
                backgroundColor: "var(--palette-bg)",
                color: "var(--palette-text)",
              }}
            >
              {tyreCategory.sub.map((subcat) => (
                <SelectItem key={subcat.SubMain} value={subcat.SubMain}>
                  {subcat.SubMain}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Sub Sub Category (if available) */}
      {formData.category?.subMain && (() => {
        const selectedSub = tyreCategory?.sub?.find(
          (s) => s.SubMain === formData.category?.subMain
        );
        return selectedSub?.subCategory && selectedSub.subCategory.length > 0;
      })() && (
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--palette-accent-1)" }}>
            Tyre Category *
          </label>
          <Select
            value={formData.category?.category || ""}
            onValueChange={(value) => {
              updateField("category", {
                ...formData.category,
                category: value,
              });
            }}
          >
            <SelectTrigger
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            >
              <SelectValue placeholder="Select tyre category" />
            </SelectTrigger>
            <SelectContent
              style={{
                backgroundColor: "var(--palette-bg)",
                color: "var(--palette-text)",
              }}
            >
              {tyreCategory?.sub
                ?.find((s) => s.SubMain === formData.category?.subMain)
                ?.subCategory?.map((subcat) => (
                  <SelectItem key={subcat} value={subcat}>
                    {subcat}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Brand */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Switch
            id="tyre-brand-mode"
            checked={isBrandInputMode}
            onCheckedChange={setIsBrandInputMode}
          />
          <Label
            htmlFor="tyre-brand-mode"
            className="text-sm"
            style={{ color: "var(--palette-text)" }}
          >
            {isBrandInputMode ? "Custom Brand Name" : "Select from Existing"}
          </Label>
        </div>

        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--palette-accent-1)" }}>
          Brand *
        </label>

        {!isBrandInputMode ? (
          <Select
            value={formData.brand?.id || ""}
            onValueChange={(value) => {
              const brand = brandsData?.data?.find((b) => b._id === value);
              if (brand) {
                updateField("brand", { id: brand._id, name: brand.name });
              }
            }}
          >
            <SelectTrigger
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "var(--palette-accent-3)",
                color: "var(--palette-text)",
              }}
            >
              <SelectValue placeholder="Select tyre brand" />
            </SelectTrigger>
            <SelectContent
              style={{
                backgroundColor: "var(--palette-bg)",
                color: "var(--palette-text)",
              }}
            >
              {brandsData?.data?.map((brand) => (
                <SelectItem key={brand._id} value={brand._id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            type="text"
            placeholder="e.g., Michelin, Apollo, MRF"
            value={formData.brand?.name || ""}
            onChange={(e) => {
              updateField("brand", { id: "", name: e.target.value });
            }}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderColor: "var(--palette-accent-3)",
              color: "var(--palette-text)",
            }}
            className="w-full"
          />
        )}
      </div>

      {/* Short Description */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--palette-accent-1)" }}>
          Short Description
        </label>
        <Textarea
          placeholder="Brief description of the tyre (will appear in product cards)"
          value={formData.shortDescription || ""}
          onChange={(e) => updateField("shortDescription", e.target.value)}
          rows={2}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "var(--palette-accent-3)",
            color: "var(--palette-text)",
          }}
        />
      </div>

      {/* Full Description */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--palette-accent-1)" }}>
          Full Description
        </label>
        <RichTextEditor
          description={formData.description}
          updateField={updateField}
        />
      </div>

      {/* Company Details */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--palette-accent-1)" }}>
          Company Details
        </label>
        <Textarea
          placeholder="Manufacturer/importer details, warranty info, etc."
          value={formData.company_details || ""}
          onChange={(e) => updateField("company_details", e.target.value)}
          rows={3}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "var(--palette-accent-3)",
            color: "var(--palette-text)",
          }}
        />
      </div>

      {/* Special Offer */}
      <div>
        <label className="block text-sm font-semibold mb-2" style={{ color: "var(--palette-accent-1)" }}>
          Special Offer (Optional)
        </label>
        <Textarea
          placeholder="e.g., Free fitting service, Buy 2 get 1 free, etc."
          value={formData.special_offer || ""}
          onChange={(e) => updateField("special_offer", e.target.value)}
          rows={2}
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderColor: "var(--palette-accent-3)",
            color: "var(--palette-text)",
          }}
        />
      </div>

      {/* Info Box */}
      <div
        className="p-4 rounded-lg"
        style={{
          backgroundColor: "rgba(238, 74, 35, 0.08)",
          borderColor: "var(--palette-btn)",
          border: "1px solid",
        }}
      >
        <p className="text-sm font-semibold" style={{ color: "var(--palette-text)" }}>
          🛞 Tyre Product Tips:
        </p>
        <ul className="text-xs mt-2 space-y-1" style={{ color: "var(--palette-accent-3)" }}>
          <li>• Include the full tyre model name (e.g., "Michelin City Grip 2")</li>
          <li>• Select the correct tyre type (Car or Motorcycle)</li>
          <li>• Add compatible models in variant section for better search</li>
          <li>• Include specifications like load index and speed rating</li>
        </ul>
      </div>
    </div>
  );
}
