// app/dashboard/products/add/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAddProductStore } from "@/zustan-hook/addProductStore";
import StepBasicInfo from "@/components/ui/custom/admin/create-edit-product/create-product/StepBasicInfo";
import StepVariants from "@/components/ui/custom/admin/create-edit-product/create-product/StepVariantsImproved";
import StepMedia from "@/components/ui/custom/admin/create-edit-product/create-product/StepMedia";
import StepShipping from "@/components/ui/custom/admin/create-edit-product/create-product/StepShipping";
import { useApiMutation } from "@/api-hook/react-query-wrapper";
import { postNewProduct } from "@/actions/product";
import { useQueryClient } from "@tanstack/react-query";
import {
  Shirt,
  Car,
  Zap,
  Watch,
  Package,
  Info,
} from "lucide-react";

// Product type configurations - using palette colors
const PRODUCT_TYPES = [
  {
    id: "clothing",
    name: "Clothing & Apparel",
    icon: Shirt,
    description: "T-shirts, pants, dresses, etc.",
    bgColor: "rgba(238, 74, 35, 0.1)",
    iconBg: "#ee4a23",
  },
  {
    id: "tyre",
    name: "Tyres & Wheels",
    icon: Car,
    description: "Car tyres, bike tyres, wheels",
    bgColor: "rgba(43, 39, 44, 0.1)",
    iconBg: "#342f2c",
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: Zap,
    description: "Phones, laptops, accessories",
    bgColor: "rgba(196, 61, 29, 0.1)",
    iconBg: "#c43d1d",
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: Watch,
    description: "Jewelry, bags, watches",
    bgColor: "rgba(255, 133, 102, 0.15)",
    iconBg: "#ff8566",
  },
  {
    id: "general",
    name: "Other Products",
    icon: Package,
    description: "Products not listed above",
    bgColor: "rgba(134, 146, 156, 0.1)",
    iconBg: "#86929c",
  },
];

// Form sections for each product type
const FORM_SECTIONS = {
  clothing: [
    { id: "basic", title: "Basic Info", icon: "📋", required: true },
    { id: "variants", title: "Sizes & Colors", icon: "📦", required: true },
    { id: "media", title: "Photos", icon: "🖼️", required: true },
    { id: "shipping", title: "Shipping", icon: "🚚", required: false },
  ],
  tyre: [
    { id: "basic", title: "Basic Info", icon: "📋", required: true },
    { id: "variants", title: "Tyre Sizes", icon: "📦", required: true },
    { id: "media", title: "Photos", icon: "🖼️", required: true },
    { id: "shipping", title: "Shipping", icon: "🚚", required: false },
  ],
  electronics: [
    { id: "basic", title: "Basic Info", icon: "📋", required: true },
    { id: "variants", title: "Variants", icon: "📦", required: false },
    { id: "media", title: "Photos", icon: "🖼️", required: true },
    { id: "shipping", title: "Shipping & Warranty", icon: "🚚", required: false },
  ],
  accessories: [
    { id: "basic", title: "Basic Info", icon: "📋", required: true },
    { id: "variants", title: "Colors", icon: "🎨", required: false },
    { id: "media", title: "Photos", icon: "🖼️", required: true },
    { id: "shipping", title: "Shipping", icon: "🚚", required: false },
  ],
  general: [
    { id: "basic", title: "Basic Info", icon: "📋", required: true },
    { id: "variants", title: "Variants (Optional)", icon: "📦", required: false },
    { id: "media", title: "Photos", icon: "🖼️", required: true },
    { id: "shipping", title: "Shipping", icon: "🚚", required: false },
  ],
};

export default function AddProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { resetForm, calculateAndFinalize, updateField } = useAddProductStore();
  const [selectedProductType, setSelectedProductType] = useState<string | null>(
    null
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["basic"])
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update productType in store when selected
  React.useEffect(() => {
    if (selectedProductType) {
      updateField("productType", selectedProductType);
    }
  }, [selectedProductType, updateField]);

  const { mutate, isPending } = useApiMutation(
    postNewProduct,
    undefined,
    "new product"
  );

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields before submitting
      const finalData = calculateAndFinalize();

      // Check required fields
      if (!finalData.name || finalData.name.trim() === "") {
        alert("Please enter a product name");
        setIsSubmitting(false);
        return;
      }

      if (!finalData.category?.main || finalData.category.main.trim() === "") {
        alert("Please select a main category");
        setIsSubmitting(false);
        return;
      }

      if (!finalData.variants || finalData.variants.length === 0) {
        alert("Please add at least one variant (size)");
        setIsSubmitting(false);
        return;
      }

      console.log("Submitting product data:", finalData);
      mutate(finalData, {
        onSuccess: (data) => {
          console.log("Product created successfully:", data);
          setIsSubmitting(false);
          // Invalidate the products query cache to refresh the list
          queryClient.invalidateQueries({
            queryKey: ["products"],
            exact: false,
          });
          // Reset form and navigate to products list
          resetForm();
          router.push("/admin/my-products");
        },
        onError: (error) => {
          console.error("Error creating product:", error);
          setIsSubmitting(false);
        },
        onSettled: () => {
          // Always reset submitting state, whether success or error
          setIsSubmitting(false);
        },
      });
    } catch (error: any) {
      console.error("Error:", error);
      setIsSubmitting(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  // Step 1: Product Type Selection
  if (!selectedProductType) {
    return (
      <div
        className="min-h-screen p-3 sm:p-6"
        style={{
          backgroundColor: "var(--palette-bg)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <Link href="/admin/my-products">
              <button
                className="p-2 hover:opacity-70 rounded transition inline-flex items-center gap-2 mb-4"
                style={{ color: "var(--palette-text)" }}
              >
                <ArrowLeft size={20} />
                Back
              </button>
            </Link>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3"
              style={{ color: "var(--palette-text)" }}
            >
              Add New Product
            </h1>
            <p
              className="text-sm sm:text-lg"
              style={{ color: "var(--palette-accent-3)" }}
            >
              What type of product are you adding?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {PRODUCT_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedProductType(type.id)}
                  className="p-4 sm:p-6 rounded-xl border-2 hover:shadow-xl transition-all text-left group"
                  style={{
                    backgroundColor: "var(--palette-bg)",
                    borderColor: "var(--palette-accent-3)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "var(--palette-btn)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "var(--palette-accent-3)")
                  }
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div
                      className="p-3 sm:p-4 rounded-xl group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: type.iconBg }}
                    >
                      <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className="font-bold text-base sm:text-xl mb-1 sm:mb-2"
                        style={{ color: "var(--palette-text)" }}
                      >
                        {type.name}
                      </h3>
                      <p
                        className="text-xs sm:text-sm"
                        style={{ color: "var(--palette-accent-3)" }}
                      >
                        {type.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const sections = FORM_SECTIONS[selectedProductType as keyof typeof FORM_SECTIONS] || FORM_SECTIONS.general;
  const selectedType = PRODUCT_TYPES.find((t) => t.id === selectedProductType);
  const TypeIcon = selectedType?.icon || Package;

  // Step 2: Smart Form
  return (
    <div
      className="min-h-screen p-3 sm:p-6"
      style={{
        backgroundColor: "var(--palette-bg)",
        color: "var(--palette-text)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Sticky Header */}
        <div
          className="sticky top-0 z-10 rounded-xl border p-3 sm:p-4 mb-4 sm:mb-6"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderColor: "var(--palette-accent-3)",
          }}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProductType(null)}
                className="shrink-0"
              >
                <ArrowLeft size={18} />
              </Button>
              <div
                className="p-2 rounded-lg shrink-0"
                style={{ backgroundColor: selectedType?.iconBg || "#86929c" }}
              >
                <TypeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1
                  className="text-base sm:text-xl font-bold truncate"
                  style={{ color: "var(--palette-text)" }}
                >
                  Add {selectedType?.name}
                </h1>
                <p
                  className="text-[10px] sm:text-xs hidden sm:block"
                  style={{ color: "var(--palette-accent-3)" }}
                >
                  Fill in the required fields *
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="text-xs sm:text-sm px-2 sm:px-4"
                style={{
                  borderColor: "var(--palette-accent-3)",
                  color: "var(--palette-text)",
                }}
              >
                <span className="hidden sm:inline">Cancel</span>
                <span className="sm:hidden">✕</span>
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isPending}
                className="text-xs sm:text-sm px-2 sm:px-4"
                style={{
                  backgroundColor: "var(--palette-btn)",
                  color: "white",
                }}
              >
                {isSubmitting || isPending ? (
                  <span className="hidden sm:inline">Creating...</span>
                ) : (
                  <>
                    <Check size={16} className="sm:mr-2" />
                    <span className="hidden sm:inline">Create Product</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm overflow-x-auto pb-1">
            {sections.map((section, index) => (
              <React.Fragment key={section.id}>
                <div
                  className={`flex items-center gap-1 shrink-0 ${
                    expandedSections.has(section.id)
                      ? "opacity-100"
                      : "opacity-50"
                  }`}
                  style={{
                    color: expandedSections.has(section.id)
                      ? "var(--palette-btn)"
                      : "var(--palette-accent-3)",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0"
                    style={{
                      backgroundColor: expandedSections.has(section.id)
                        ? "var(--palette-btn)"
                        : "var(--palette-accent-3)",
                      color: "white",
                    }}
                  >
                    {expandedSections.has(section.id) ? (
                      <Check size={10} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="hidden md:inline">{section.title}</span>
                </div>
                {index < sections.length - 1 && (
                  <div
                    className="flex-1 h-0.5 min-w-4"
                    style={{
                      backgroundColor: expandedSections.has(section.id)
                        ? "var(--palette-btn)"
                        : "var(--palette-accent-3)",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Collapsible Form Sections */}
        <div className="space-y-3 sm:space-y-4">
          {sections.map((section) => {
            const isExpanded = expandedSections.has(section.id);

            return (
              <div
                key={section.id}
                className="rounded-xl border overflow-hidden"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  borderColor: "var(--palette-accent-3)",
                }}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-3 sm:p-5 flex items-center justify-between transition-colors"
                  style={{ backgroundColor: "transparent" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(238, 74, 35, 0.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="text-xl sm:text-2xl">{section.icon}</div>
                    <div className="text-left">
                      <h3
                        className="font-bold text-sm sm:text-lg"
                        style={{ color: "var(--palette-text)" }}
                      >
                        {section.title}
                        {section.required && (
                          <span style={{ color: "var(--palette-btn)" }} className="ml-1">
                            *
                          </span>
                        )}
                      </h3>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {isExpanded && (
                  <div
                    className="p-3 sm:p-5 pt-0 border-t"
                    style={{ borderColor: "var(--palette-accent-3)" }}
                  >
                    {section.id === "basic" && <StepBasicInfo />}
                    {section.id === "variants" && <StepVariants productType={selectedProductType as any} />}
                    {section.id === "media" && <StepMedia />}
                    {section.id === "shipping" && <StepShipping />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Review Section */}
        <div
          className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl border"
          style={{
            backgroundColor: "rgba(238, 74, 35, 0.08)",
            borderColor: "var(--palette-btn)",
          }}
        >
          <div className="flex items-start gap-2 sm:gap-3">
            <Info
              className="shrink-0 mt-0.5 w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: "var(--palette-btn)" }}
            />
            <div
              className="text-xs sm:text-sm"
              style={{ color: "var(--palette-text)" }}
            >
              <p className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                {selectedType?.name} Product Tips:
              </p>
              <ul className="list-disc list-inside space-y-1 text-[10px] sm:text-xs">
                {selectedProductType === "clothing" && (
                  <>
                    <li>Enter sizes like: S, M, L, XL or 28, 30, 32</li>
                    <li>Add colors to generate size × color combinations automatically</li>
                    <li>Upload clear photos showing the product details</li>
                  </>
                )}
                {selectedProductType === "tyre" && (
                  <>
                    <li>Enter tyre sizes like: 175/65 R14, 195/65 R15</li>
                    <li>No need to add colors for tyres</li>
                    <li>You can upload separate images for Front, Rear, and Combo variants</li>
                    <li>Include brand and model in the product name</li>
                  </>
                )}
                {(selectedProductType === "electronics" ||
                  selectedProductType === "accessories") && (
                  <>
                    <li>Include warranty period in the description</li>
                    <li>Add specifications like model, compatibility, etc.</li>
                    <li>High-quality photos increase sales</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
