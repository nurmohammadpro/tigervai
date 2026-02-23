import { create } from "zustand";





const useProfilePopStore = create<{
    open: boolean;
    setOpen: (payload:boolean) => void;
   
}>((set) => ({
    open: false,
    setOpen: (payload) => set({ open: payload }),
   
}));


export default useProfilePopStore;

