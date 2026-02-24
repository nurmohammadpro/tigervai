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
import {
  Shirt,
  Car,
  Zap,
  Watch,
  Package,
  Info,
} from "lucide-react";

// Product type configurations
const PRODUCT_TYPES = [
  {
    id: "clothing",
    name: "Clothing & Apparel",
    icon: Shirt,
    description: "T-shirts, pants, dresses, etc.",
    color: "bg-blue-500",
  },
  {
    id: "tyre",
    name: "Tyres & Wheels",
    icon: Car,
    description: "Car tyres, bike tyres, wheels",
    color: "bg-gray-700",
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: Zap,
    description: "Phones, laptops, accessories",
    color: "bg-yellow-500",
  },
  {
    id: "accessories",
    name: "Accessories",
    icon: Watch,
    description: "Jewelry, bags, watches",
    color: "bg-purple-500",
  },
  {
    id: "general",
    name: "Other Products",
    icon: Package,
    description: "Products not listed above",
    color: "bg-green-500",
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
  const { resetForm, calculateAndFinalize } = useAddProductStore();
  const [selectedProductType, setSelectedProductType] = useState<string | null>(
    null
  );
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["basic"])
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSuccess = (data) => {
    resetForm();
  };

  const { mutate, isPending } = useApiMutation(
    postNewProduct,
    undefined,
    "new product",
    onSuccess
  );

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const finalData = calculateAndFinalize();
      mutate(finalData);
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
        className="min-h-screen p-6"
        style={{
          backgroundColor: "var(--palette-bg)",
          color: "var(--palette-text)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link href="/admin/my-products">
              <button className="p-2 hover:bg-white/10 rounded transition inline-flex items-center gap-2 mb-4">
                <ArrowLeft size={20} />
                Back
              </button>
            </Link>
            <h1 className="text-4xl font-bold mb-3">Add New Product</h1>
            <p className="text-lg" style={{ color: "var(--palette-accent-3)" }}>
              What type of product are you adding?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCT_TYPES.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedProductType(type.id)}
                  className="p-6 bg-card rounded-xl border-2 hover:border-blue-500 hover:shadow-xl transition-all text-left group"
                  style={{
                    borderColor: "var(--palette-accent-3)",
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-4 ${type.color} rounded-xl group-hover:scale-110 transition-transform`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2">{type.name}</h3>
                      <p
                        className="text-sm"
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
      className="min-h-screen p-6"
      style={{
        backgroundColor: "var(--palette-bg)",
        color: "var(--palette-text)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur rounded-xl border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProductType(null)}
              >
                <ArrowLeft size={18} />
              </Button>
              <div className={`p-2 ${selectedType?.color} rounded-lg`}>
                <TypeIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">
                  Add {selectedType?.name}
                </h1>
                <p className="text-xs" style={{ color: "var(--palette-accent-3)" }}>
                  Fill in the required fields *
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting || isPending ? (
                  "Creating..."
                ) : (
                  <>
                    <Check size={18} className="mr-2" />
                    Create Product
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-4 flex items-center gap-2 text-sm">
            {sections.map((section, index) => (
              <React.Fragment key={section.id}>
                <div
                  className={`flex items-center gap-1 ${
                    expandedSections.has(section.id)
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      expandedSections.has(section.id)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {expandedSections.has(section.id) ? <Check size={12} /> : index + 1}
                  </div>
                  <span className="hidden sm:inline">{section.title}</span>
                </div>
                {index < sections.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-200 mx-1" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Collapsible Form Sections */}
        <div className="space-y-4">
          {sections.map((section) => {
            const isExpanded = expandedSections.has(section.id);
            const Icon = Info;

            return (
              <div
                key={section.id}
                className="bg-card rounded-xl border overflow-hidden"
                style={{
                  borderColor: "var(--palette-accent-3)",
                }}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-5 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{section.icon}</div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg">
                        {section.title}
                        {section.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </h3>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-5 pt-0 border-t" style={{ borderColor: "var(--palette-accent-3)" }}>
                    {section.id === "basic" && <StepBasicInfo />}
                    {section.id === "variants" && <StepVariants />}
                    {section.id === "media" && <StepMedia />}
                    {section.id === "shipping" && <StepShipping />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Review Section */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-1">
                {selectedType?.name} Product Tips:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
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
