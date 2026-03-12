// zustand-hook/addTyreProductStore.ts
import { create } from "zustand";
import { CreateProduct } from "@/@types/fullProduct";
import { calculateAverageOfferPrice, calculateAveragePrice, calculateTotalStock } from "@/lib/calculation-helper";

// Tyre-specific variant types
export type TyreVariantType = "front" | "rear" | "combo";

// Tyre variant with type support
export interface TyreVariant {
  id: string;
  type: TyreVariantType; // front, rear, or combo
  size: string; // e.g., "110/70 R17"
  season?: string; // Summer, Winter, All-Season
  loadIndex?: string; // e.g., "91"
  speedRating?: string; // e.g., "H"
  price: number;
  discountPrice?: number;
  stock: number;
  compatibleModels?: string; // e.g., "KTM Duke 125, KTM RC 125"
  image?: {
    url: string;
    key: string;
    id: string;
  };
}

export interface AddTyreProductState {
  formData: Partial<CreateProduct>;
  tyreVariants: TyreVariant[];
  currentStep: number;

  // Set form data
  setFormData: (data: Partial<CreateProduct>) => void;

  // Update specific field
  updateField: (field: string, value: any) => void;

  // Tyre variant operations
  addTyreVariant: (variant: Omit<TyreVariant, "id">) => void;
  updateTyreVariant: (id: string, updates: Partial<TyreVariant>) => void;
  removeTyreVariant: (id: string) => void;
  setTyreVariants: (variants: TyreVariant[]) => void;

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

  // Calculate and finalize prices
  calculateAndFinalize: () => Partial<CreateProduct>;
}

const initialFormData: Partial<CreateProduct> = {
  name: "",
  description: "",
  price: 0,
  stock: 0,
  variants: [],
  category: { main: "Car Tyre", subMain: "", category: "" },
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
  isAdminCreated: true, // Always true for tyre products
  shortDescription: "",
  special_offer: "",
  company_details: "",
  productType: "tyre",
};

export const useAddTyreProductStore = create<AddTyreProductState>((set, get) => ({
  formData: initialFormData,
  tyreVariants: [],
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

  addTyreVariant: (variant) => {
    const newVariant: TyreVariant = {
      ...variant,
      id: `tyre-${variant.type}-${Date.now()}-${Math.random()}`,
    };
    set((state) => ({
      tyreVariants: [...state.tyreVariants, newVariant],
    }));
  },

  updateTyreVariant: (id, updates) => {
    set((state) => ({
      tyreVariants: state.tyreVariants.map((v) =>
        v.id === id ? { ...v, ...updates } : v
      ),
    }));
  },

  removeTyreVariant: (id) => {
    set((state) => ({
      tyreVariants: state.tyreVariants.filter((v) => v.id !== id),
    }));
  },

  setTyreVariants: (variants) => {
    set({ tyreVariants: variants });
  },

  nextStep: () => {
    set((state) => ({
      currentStep: Math.min(state.currentStep + 1, 5),
    }));
  },

  prevStep: () => {
    set((state) => ({
      currentStep: Math.max(state.currentStep - 1, 1),
    }));
  },

  goToStep: (step) => {
    set({
      currentStep: Math.min(Math.max(step, 1), 5),
    });
  },

  resetForm: () => {
    set({
      formData: initialFormData,
      tyreVariants: [],
      currentStep: 1,
    });
  },

  getFormData: () => get().formData,

  // Calculate prices from tyre variants before submit
  calculateAndFinalize: () => {
    const formData = get().formData;
    const tyreVariants = get().tyreVariants;

    if (tyreVariants.length === 0) {
      throw new Error("Please add at least one tyre variant (front, rear, or combo)");
    }

    // Convert tyre variants to standard product variants
    const standardVariants = tyreVariants.map((tv) => ({
      size: `${tv.type} - ${tv.size}`, // Include type in size for identification
      price: tv.price,
      discountPrice: tv.discountPrice,
      stock: tv.stock,
      // Tyre-specific fields in the variant
      season: tv.season,
      loadIndex: tv.loadIndex,
      speedRating: tv.speedRating,
      recommended: tv.compatibleModels,
      // Store the type for frontend display
      variantType: tv.type,
    }));

    // Calculate average price from variants
    const avgPrice = calculateAveragePrice(standardVariants);

    // Calculate average offer price from variants
    const avgOfferPrice = calculateAverageOfferPrice(standardVariants);

    // Calculate total stock
    const totalStock = calculateTotalStock(standardVariants);

    // Helper to clean optional string fields
    const cleanOptionalString = (value: any) => {
      if (typeof value === "string" && value.trim() === "") return undefined;
      return value;
    };

    // Clean the form data
    const cleanedData: any = {
      ...formData,
      variants: standardVariants,
      price: avgPrice,
      offerPrice: avgOfferPrice || 0,
      stock: totalStock,
      hasOffer: (avgOfferPrice ?? 0) > 0,
      // Ensure product type is set to tyre
      productType: "tyre",
      // Always admin created for tyres
      isAdminCreated: true,
    };

    // Clean optional string fields
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
    ];

    optionalStringFields.forEach((field) => {
      if (cleanedData[field] !== undefined) {
        cleanedData[field] = cleanOptionalString(cleanedData[field]);
      }
    });

    // Clean brand
    if (cleanedData.brand && cleanedData.brand.id === "") {
      delete cleanedData.brand.id;
    }

    return cleanedData;
  },
}));
