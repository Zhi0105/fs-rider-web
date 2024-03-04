import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';


interface orderStoreInterface {
  order?: any,
  setOrder: (data: any) => void;
  resetOrder: () => void;
}

const orderStore = persist<orderStoreInterface>(
  (set) => ({
    order: "",
    setOrder: (data) =>
      set(() => ({
        order: data,
      })),
      resetOrder: () => set(() => ({ order: "" })),

  }),
  {
    name: 'q', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  }
);

export const useOrderStore = create(orderStore);