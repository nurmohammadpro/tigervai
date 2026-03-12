// app/admin/my-products/add-tyre/page.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAddTyreProductStore } from "@/zustand-hook/addTyreProductStore";
import StepTyreBasicInfo from "@/components/ui/custom/admin/create-edit-product/tyre-product/StepTyreBasicInfo";
import StepTyreVariants from "@/components/ui/custom/admin/create-edit-product/tyre-product/StepTyreVariants";
import StepTyreMedia from "@/components/ui/custom/admin/create-edit-product/tyre-product/StepTyreMedia";
import StepTyreShipping from "@/components/ui/custom/admin/create-edit-product/tyre-product/StepTyreShipping";
import { useApiMutation } from "@/api-hook/react-query-wrapper";
import { postNewProduct } from "@/actions/product";
import { useQueryClient } from "@tanstack/react-query";

// Form sections for tyre products
const TYRE_FORM_SECTIONS = [
  { id: "basic", title: "Basic Info", icon: "📋", required: true },
  { id: "variants", title: "Tyre Variants", icon: "🛞", required: true },
  { id: "media", title: "Photos", icon: "🖼️", required: true },
  { id: "shipping", title: "Shipping", icon: "🚚", required: false },
];

export default function AddTyreProductPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { resetForm, calculateAndFinalize } = useAddTyreProductStore();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["basic"])
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate, isPending } = useApiMutation(
    postNewProduct,
    undefined,
    "new tyre product"
  );

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Validate and finalize data
      const finalData = calculateAndFinalize();

      // Check required fields
      if (!finalData.name || finalData.name.trim() === "") {
        alert("Please enter a tyre product name");
        setIsSubmitting(false);
        return;
      }

      if (!finalData.category?.main || finalData.category.main.trim() === "") {
        alert("Please select a tyre type (Car Tyre or Motorcycle Tyre)");
        setIsSubmitting(false);
        return;
      }

      if (!finalData.variants || finalData.variants.length === 0) {
        alert("Please add at least one tyre variant (front, rear, or combo)");
        setIsSubmitting(false);
        return;
      }

      console.log("Submitting tyre product data:", finalData);
      mutate(finalData, {
        onSuccess: (data) => {
          console.log("Tyre product created successfully:", data);
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
        onError: (error: any) {
          console.error("Error creating tyre product:", error);
          // Show detailed error message
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to create tyre product";
          alert(errorMessage);
          setIsSubmitting(false);
        },
        onSettled: () => {
          setIsSubmitting(false);
        },
      });
    } catch (error: any) {
      console.error("Error:", error);
      alert(error.message || "An error occurred while creating the tyre product");
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
        <div
          className="rounded-xl border p-4 mb-6"
          style={{
            backgroundColor: "rgba(43, 39, 44, 0.95)",
            borderColor: "var(--palette-accent-3)",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                style={{ color: "var(--palette-text)" }}
              >
                <ArrowLeft size={18} />
              </Button>
              <div
                className="p-2 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#342f2c" }}
              >
                <span className="text-xl">🛞</span>
              </div>
              <div>
                <h1
                  className="text-xl font-bold"
                  style={{ color: "var(--palette-text)" }}
                >
                  Add Tyre Product
                </h1>
                <p
                  className="text-xs"
                  style={{ color: "var(--palette-accent-3)" }}
                >
                  Add car or motorcycle tyres with front/rear/combo options
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.back()}
                style={{
                  borderColor: "var(--palette-accent-3)",
                  color: "var(--palette-text)",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || isPending}
                style={{
                  backgroundColor: "var(--palette-btn)",
                  color: "white",
                }}
                className="hover:opacity-90"
              >
                {isSubmitting || isPending ? (
                  "Creating..."
                ) : (
                  <>
                    <Check size={18} className="mr-2" />
                    Create Tyre Product
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-4 flex items-center gap-2 text-sm">
            {TYRE_FORM_SECTIONS.map((section, index) => (
              <React.Fragment key={section.id}>
                <div
                  className={`flex items-center gap-1 ${
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
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: expandedSections.has(section.id)
                        ? "var(--palette-btn)"
                        : "var(--palette-accent-3)",
                      color: "white",
                    }}
                  >
                    {expandedSections.has(section.id) ? (
                      <Check size={12} />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="hidden sm:inline">{section.title}</span>
                </div>
                {index < TYRE_FORM_SECTIONS.length - 1 && (
                  <div
                    className="flex-1 h-0.5 mx-1"
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
        <div className="space-y-4">
          {TYRE_FORM_SECTIONS.map((section) => {
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
                  className="w-full p-5 flex items-center justify-between transition-colors"
                  style={{ backgroundColor: "transparent" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "rgba(43, 39, 44, 0.05)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{section.icon}</div>
                    <div className="text-left">
                      <h3
                        className="font-bold text-lg"
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
                  {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>

                {isExpanded && (
                  <div
                    className="p-5 pt-0 border-t"
                    style={{ borderColor: "var(--palette-accent-3)" }}
                  >
                    {section.id === "basic" && <StepTyreBasicInfo />}
                    {section.id === "variants" && <StepTyreVariants />}
                    {section.id === "media" && <StepTyreMedia />}
                    {section.id === "shipping" && <StepTyreShipping />}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Review Section */}
        <div
          className="mt-8 p-6 rounded-xl border"
          style={{
            backgroundColor: "rgba(43, 39, 44, 0.08)",
            borderColor: "#342f2c",
          }}
        >
          <p className="text-sm font-semibold" style={{ color: "var(--palette-text)" }}>
            🛞 Tyre Product Creation Tips:
          </p>
          <ul className="text-xs mt-2 space-y-1" style={{ color: "var(--palette-accent-3)" }}>
            <li>• Create variants for Front Tyre, Rear Tyre, and Combo sets</li>
            <li>• Include tyre sizes like "110/70 R17" for motorcycle or "175/65 R14" for cars</li>
            <li>• Add compatible models to help customers find the right tyre</li>
            <li>• Combo sets (front + rear) often sell better with discounts</li>
            <li>• Upload clear images showing tread pattern and sidewall branding</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
