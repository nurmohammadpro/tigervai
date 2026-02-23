// lib/store/authStore.ts
import { create } from "zustand";

// ============ ENUMS ============
export enum UserRole {
  USER = "user",
  VENDOR = "vendor",
  ADMIN = 'admin'
}

// ============ TYPES ============
export interface CreateUserFormData {
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  shopName?: string;
  shopLogo?: string;
  shopAddress?: string;
  vendorDescription?: string;
}

export interface AuthState {
  // Form Data
  formData: CreateUserFormData;

  // Methods
  setFormData: <K extends keyof CreateUserFormData>(
    key: K,
    value: CreateUserFormData[K]
  ) => void;

  updateFormData: (data: Partial<CreateUserFormData>) => void;

  setRole: (role: UserRole) => void;

  resetForm: () => void;

  getFormData: () => CreateUserFormData;

  getCleanFormData: () => Partial<CreateUserFormData>;
}

// ============ INITIAL STATE ============
const initialFormData: CreateUserFormData = {
  role: UserRole.USER,
  name: "",
  email: "",
  phone: "",
  password: "",
  address: "",
  shopName: "",
  shopLogo: "",
  shopAddress: "",
  vendorDescription: "",
};

// ============ ZUSTAND STORE ============
export const useAuthStore = create<AuthState>((set, get) => ({
  formData: initialFormData,

  // SET SINGLE FIELD
  setFormData: <K extends keyof CreateUserFormData>(
    key: K,
    value: CreateUserFormData[K]
  ) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [key]: value,
      },
    }));
  },

  // UPDATE MULTIPLE FIELDS
  updateFormData: (data: Partial<CreateUserFormData>) => {
    set((state) => ({
      formData: {
        ...state.formData,
        ...data,
      },
    }));
  },

  // SET ROLE
  setRole: (role: UserRole) => {
    set((state) => ({
      formData: {
        ...state.formData,
        role,
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
    const cleanData: Partial<CreateUserFormData> = {};

    // Add only non-empty values
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof CreateUserFormData];
      if (value !== "" && value !== null && value !== undefined) {
        cleanData[key as keyof CreateUserFormData] = value;
      }
    });

    return cleanData;
  },
}));
