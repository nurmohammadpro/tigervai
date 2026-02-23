// lib/store/checkoutStore.ts
import { create } from "zustand";

// ============ TYPES (Matches NestJS Schema) ============
export enum PaymentMethod {
  COD = "COD",
  ONLINE = "ONLINE",
}

export interface ShipmentDetails {
  name: string;
  phone: string;
  house: string;
  paymentMethod: PaymentMethod;
  comment?: string;
  thana?: string;
  district?: string;
}

export interface CheckoutState {
  shipment: ShipmentDetails | null;
  currentStep: number;
  isProcessing: boolean;
  orderId?: string;

  // ACTIONS
  setShipmentDetails: (details: ShipmentDetails) => void;
  updateShipmentField: <K extends keyof ShipmentDetails>(
    field: K,
    value: ShipmentDetails[K]
  ) => void;
  setCurrentStep: (step: number) => void;
  setProcessing: (processing: boolean) => void;
  setOrderId: (orderId: string) => void;
  clearCheckout: () => void;
  getShipmentDetails: () => ShipmentDetails | null;
  isShipmentValid: () => boolean;
}

// ============ ZUSTAND STORE (No Persistence) ============
export const useCheckoutStore = create<CheckoutState>()((set, get) => ({
  // INITIAL STATE
  shipment: null,
  currentStep: 1,
  isProcessing: false,
  orderId: undefined,

  // ✅ SET SHIPMENT DETAILS (all at once)
  setShipmentDetails: (details: ShipmentDetails) => {
    set({ shipment: details });
  },

  // ✅ FIXED: UPDATE SINGLE FIELD - Initialize if null
  updateShipmentField: (field, value) => {
    set((state) => ({
      shipment: {
        // Default values
        name: "",
        phone: "",
        house: "",
        paymentMethod: PaymentMethod.COD,
        comment: "",
        // Spread existing shipment if it exists
        ...state.shipment,
        // Override with new value
        [field]: value,
      },
    }));
  },

  // ✅ SET CURRENT STEP
  setCurrentStep: (step: number) => {
    set({ currentStep: step });
  },

  // ✅ SET PROCESSING STATE
  setProcessing: (processing: boolean) => {
    set({ isProcessing: processing });
  },

  // ✅ SET ORDER ID
  setOrderId: (orderId: string) => {
    set({ orderId });
  },

  // ✅ CLEAR CHECKOUT
  clearCheckout: () => {
    set({
      shipment: null,
      currentStep: 1,
      isProcessing: false,
      orderId: undefined,
    });
  },

  // ✅ GET SHIPMENT DETAILS
  getShipmentDetails: () => {
    return get().shipment;
  },

  // ✅ VALIDATE SHIPMENT
  isShipmentValid: () => {
    const shipment = get().shipment;
    if (!shipment) return false;

    return !!(
      shipment.name?.trim() &&
      shipment.phone?.trim() &&
      shipment.house?.trim() &&
      shipment.paymentMethod
    );
  },
}));
