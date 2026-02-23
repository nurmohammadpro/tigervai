// lib/store/editProductStore.ts
import { Product } from "@/@types/fullProduct";
import { create } from "zustand";


export interface EditProductState {
  formData: Partial<Product> | null;
  originalData: Partial<Product> | null;
  isLoading: boolean;

  // Load product for editing
  loadProduct: (product: Product) => void;

  // Update field
  updateField: (field: string, value: any) => void;

  // Get changed fields only
  getChangedFields: () => Record<string, any>;

  // Reset to original
  reset: () => void;

  // Clear all
  clearEditForm: () => void;
}

export const useEditProductStore = create<EditProductState>((set, get) => ({
  formData: null,
  originalData: null,
  isLoading: false,

  loadProduct: (product) => {
    set({
      formData: { ...product },
      originalData: { ...product },
    });
  },

  updateField: (field, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    }));
  },

  getChangedFields: () => {
    const state = get();
    if (!state.formData || !state.originalData) return {};

    const changed: Record<string, any> = {};

    Object.keys(state.formData).forEach((key) => {
      if (
        JSON.stringify(state.formData?.[key as keyof typeof state.formData]) !==
        JSON.stringify(state.originalData?.[key as keyof typeof state.originalData])
      ) {
        changed[key] = state.formData?.[key as keyof typeof state.formData];
      }
    });

    return changed;
  },

  reset: () => {
    const state = get();
    if (state.originalData) {
      set({ formData: { ...state.originalData } });
    }
  },

  clearEditForm: () => {
    set({
      formData: null,
      originalData: null,
      isLoading: false,
    });
  },
}));
