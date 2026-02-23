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

    /* // Calculate average price
    const avgPrice = calculateAveragePrice(variants); */

/*     // Calculate average offer price
    const avgOfferPrice = calculateAverageOfferPrice(variants); */

    // Calculate total stock
    const totalStock = calculateTotalStock(variants);

   

    return {
      ...formData,
  
      stock: totalStock,
      hasOffer:(formData?.offerPrice ?? 0) > 0 ? true : false,
  
    };
  },
}));
