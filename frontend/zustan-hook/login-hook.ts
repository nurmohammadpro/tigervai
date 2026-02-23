// lib/store/loginStore.ts
import { create } from "zustand";

// ============ TYPES ============
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginState {
  // Form Data
  formData: LoginFormData;

  // Methods
  setFormData: <K extends keyof LoginFormData>(
    key: K,
    value: LoginFormData[K]
  ) => void;

  updateFormData: (data: Partial<LoginFormData>) => void;

  resetForm: () => void;

  getFormData: () => LoginFormData;

  getCleanFormData: () => Partial<LoginFormData>;
}

// ============ INITIAL STATE ============
const initialFormData: LoginFormData = {
  email: "",
  password: "",
};

// ============ ZUSTAND STORE ============
export const useLoginStore = create<LoginState>((set, get) => ({
  formData: initialFormData,

  // SET SINGLE FIELD
  setFormData: <K extends keyof LoginFormData>(
    key: K,
    value: LoginFormData[K]
  ) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: value,
      },
    }));
  },

  // UPDATE MULTIPLE FIELDS
  updateFormData: (data: Partial<LoginFormData>) => {
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    }));
  },

  // RESET FORM
  resetForm: () => {
    set({
      formData: initialFormData,
    });
  },

  // GET FORM DATA
  getFormData: () => {
    return get().formData;
  },

  // GET CLEAN FORM DATA (only non-empty/non-null values)
  getCleanFormData: () => {
    const formData = get().formData;
    const cleanData: Partial<LoginFormData> = {};

    // Add only non-empty values
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof LoginFormData];
      if (value !== "" && value !== null && value !== undefined) {
        cleanData[key as keyof LoginFormData] = value;
      }
    });

    return cleanData;
  },
}));
