// app/dashboard/products/add/page.tsx
"use client";

import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAddProductStore } from "@/zustan-hook/addProductStore";
import StepBasicInfo from "@/components/ui/custom/admin/create-edit-product/create-product/StepBasicInfo";
import StepPricing from "@/components/ui/custom/admin/create-edit-product/create-product/StepPricing";
import StepVariants from "@/components/ui/custom/admin/create-edit-product/create-product/StepVariants";
import StepMedia from "@/components/ui/custom/admin/create-edit-product/create-product/StepMedia";
import StepShipping from "@/components/ui/custom/admin/create-edit-product/create-product/StepShipping";
import StepAdditionalInfo from "@/components/ui/custom/admin/create-edit-product/create-product/StepAdditionalInfo";
import StepReview from "@/components/ui/custom/admin/create-edit-product/create-product/StepReview";
import { useApiMutation } from "@/api-hook/react-query-wrapper";
import { postNewProduct } from "@/actions/product";

// ✅ UPDATED: 7 steps instead of 6
const STEPS = [
  { number: 1, title: "Basic Information", icon: "📋" },
  { number: 2, title: "Pricing & Offers", icon: "💰" },
  { number: 3, title: "Variants", icon: "📦" },
  { number: 4, title: "Media", icon: "🖼️" },
  { number: 5, title: "Shipping", icon: "🚚" }, // ✅ NEW
  { number: 6, title: "Additional Info", icon: "ℹ️" },
  { number: 7, title: "Review & Submit", icon: "✅" },
];

export default function AddProductPage() {
  const router = useRouter();

  const {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    resetForm,
    calculateAndFinalize,
  } = useAddProductStore();

  const onSuccess = (data) => {
    resetForm();
  };
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { mutate, isPending } = useApiMutation(
    postNewProduct,
    undefined,
    "new product",
    onSuccess
  );

  // ✅ UPDATED: Max step is now 7
  const handleSubmit = async () => {
    // ✅ Calculate and finalize prices from variants
    const finalData = calculateAndFinalize();

    console.log(
      "Submitting product with auto-calculated prices:",
      JSON.stringify(finalData)
    );
    console.log(
      "Submitting product with auto-calculated thumbnail:",
      JSON.stringify(finalData.price)
    );

    // Here you would call your API to create the product
    // const response = await fetch('/api/products', {
    //   method: 'POST',
    //   body: JSON.stringify(finalData)
    // });
    mutate(finalData);
  };

  return (
    <div
      className="min-h-screen p-6"
      style={{
        backgroundColor: "var(--palette-bg)",
        color: "var(--palette-text)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/admin/my-products">
              <button className="p-2 hover:bg-white/10 rounded transition">
                <ArrowLeft size={24} />
              </button>
            </Link>
            <h1 className="text-3xl font-bold">Add New Product</h1>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6 overflow-x-auto pb-2">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.number}>
                <button
                  onClick={() => goToStep(step.number)}
                  className={`flex flex-col items-center gap-2 transition flex-shrink-0 ${
                    currentStep === step.number
                      ? "opacity-100"
                      : "opacity-60 hover:opacity-80"
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg"
                    style={{
                      backgroundColor:
                        currentStep >= step.number
                          ? "var(--palette-btn)"
                          : "var(--palette-accent-3)",
                      color:
                        currentStep >= step.number
                          ? "white"
                          : "var(--palette-text)",
                    }}
                  >
                    {currentStep > step.number ? (
                      <Check size={20} />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span className="text-xs text-center max-w-[80px]">
                    {step.title.split(" ")[0]}
                  </span>
                </button>

                {index < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-1 mx-2 mb-8 flex-shrink-0"
                    style={{
                      backgroundColor:
                        currentStep > step.number
                          ? "var(--palette-btn)"
                          : "var(--palette-accent-3)",
                      minWidth: "20px",
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="p-8 rounded-lg border border-palette-accent-2/30">
          {/* Step Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">
              {STEPS[currentStep - 1].icon} {STEPS[currentStep - 1].title}
            </h2>
            <p style={{ color: "var(--palette-accent-3)" }}>
              Step {currentStep} of {STEPS.length}
            </p>
          </div>

          {/* Step Content */}
          <div className="mb-8 ">
            {currentStep === 1 && <StepBasicInfo />}
            {currentStep === 2 && <StepPricing />}
            {currentStep === 3 && <StepVariants />}
            {currentStep === 4 && <StepMedia />}
            {currentStep === 5 && <StepShipping />} {/* ✅ NEW */}
            {currentStep === 6 && <StepAdditionalInfo />}
            {currentStep === 7 && <StepReview />}
          </div>

          {/* Navigation Buttons */}
          <div
            className="flex justify-between items-center pt-6 border-t"
            style={{ borderColor: "var(--palette-accent-3)" }}
          >
            <Button
              onClick={prevStep}
              disabled={currentStep === 1}
              variant="outline"
              className="flex items-center gap-2"
              style={{
                borderColor: "var(--palette-accent-3)",
                color:
                  currentStep === 1
                    ? "var(--palette-accent-3)"
                    : "var(--palette-text)",
              }}
            >
              <ArrowLeft size={18} />
              Previous
            </Button>

            <div style={{ color: "var(--palette-accent-3)" }}>
              Step {currentStep} of {STEPS.length}
            </div>

            {currentStep < STEPS.length ? (
              <Button
                onClick={nextStep}
                className="flex items-center gap-2 text-white"
                style={{ backgroundColor: "var(--palette-btn)" }}
              >
                Next
                <ArrowRight size={18} />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 text-white"
                style={{ backgroundColor: "var(--palette-btn)" }}
              >
                <Check size={18} />
                {isSubmitting ? "Creating..." : "Create Product"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
