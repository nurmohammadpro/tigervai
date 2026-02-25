// lib/store/addProductStore.ts
import { create } from "zustand";


import { CreateProduct } from "@/@types/fullProduct";
import { calculateAverageOfferPrice, calculateAveragePrice, calculateTotalStock } from "@/lib/calculation-helper";

export interface AddProductState {
  formData: Partial<CreateProduct>;
  currentStep: number;

  // Set form data
  setFormData: (data: Partial<CreateProduct>) => void;

  // Update specific field
  updateField: (field: string, value: any) => void;

  // Move to next step
  nextStep: () => void;

  // Move to previous step
  prevStep: () => void;

  // Go to specific step
  goToStep: (step: number) => void;

  // Reset form
  resetForm: () => void;

  // Get current form data
  getFormData: () => Partial<CreateProduct>;

  // ✅ NEW: Calculate and finalize prices
  calculateAndFinalize: () => Partial<CreateProduct>;
}

const initialFormData: Partial<CreateProduct> = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  variants: [],
  category: { main: "",subMain: "", category: "" },
  brand: { id: "", name: "" },
  thumbnail: undefined,
  images: [],
 
  features: [],
  specifications: {},
  height: 0,
  width: 0,
  weight: "",
  size: "",
  colors: [],
  warrantyPeriod: "",
  returnPolicy: "",
  isDigital: false,
  hasOffer: false,
  offerPrice: 0,
  certifications: [],
  shippingTime: "",
  shippingCost: 0,
  freeShipping: false,
  isAdminCreated: false,
  shortDescription: "",
  special_offer:"",
  company_details: "",

};

export const useAddProductStore = create<AddProductState>((set, get) => ({
  formData: initialFormData,
  currentStep: 1,

  setFormData: (data) => {
    set({ formData: { ...get().formData, ...data } });
  },

  updateField: (field, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    }));
  },

  nextStep: () => {
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 7),
    }));
  },

  prevStep: () => {
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    }));
  },

  goToStep: (step) => {
    set({
      currentStep: Math.min(Math.max(step, 1), 7),
    });
  },

  resetForm: () => {
    set({
      formData: initialFormData,
      currentStep: 1,
    });
  },

  getFormData: () => get().formData,

  // ✅ NEW: Calculate prices from variants before submit
  calculateAndFinalize: () => {
    const formData = get().formData;
    const variants = (formData.variants as any[]) || [];

    if (variants.length === 0) {
      throw new Error("Please add at least one variant");
    }

    // Clean up variants: remove empty string colors
    const cleanedVariants = variants.map((variant) => ({
      ...variant,
      // Convert empty string to undefined for color
      color: variant.color && variant.color.trim() !== "" ? variant.color.trim() : undefined,
    }));

    // Calculate average price from variants
    const avgPrice = calculateAveragePrice(variants);

    // Calculate average offer price from variants
    const avgOfferPrice = calculateAverageOfferPrice(variants);

    // Calculate total stock
    const totalStock = calculateTotalStock(variants);

    // Helper to clean optional string fields (convert empty string to undefined)
    const cleanOptionalString = (value: any) => {
      if (typeof value === "string" && value.trim() === "") return undefined;
      return value;
    };

    // Clean the form data - convert empty strings to undefined for optional fields
    const cleanedData: any = {
      ...formData,
      variants: cleanedVariants,
      price: avgPrice,
      offerPrice: avgOfferPrice || 0,
      stock: totalStock,
      hasOffer: (avgOfferPrice ?? 0) > 0,
    };

    // Clean optional string fields that should be undefined if empty
    const optionalStringFields = [
      "shortDescription",
      "special_offer",
      "company_details",
      "description",
      "warrantyPeriod",
      "returnPolicy",
      "weight",
      "size",
      "shippingTime",
      "offerExpiresAt",
    ];

    optionalStringFields.forEach((field) => {
      if (cleanedData[field] !== undefined) {
        cleanedData[field] = cleanOptionalString(cleanedData[field]);
      }
    });

    // Clean nested object fields - remove empty id from brand
    if (cleanedData.brand && cleanedData.brand.id === "") {
      delete cleanedData.brand.id;
    }

    // Clean category fields - remove empty subMain/semiSub if present
    if (cleanedData.category) {
      if (cleanedData.category.subMain === "") {
        delete cleanedData.category.subMain;
      }
      if (cleanedData.category.semiSub === "") {
        delete cleanedData.category.semiSub;
      }
    }

    return cleanedData;
  },
}));
