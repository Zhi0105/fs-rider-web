import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';


interface watermarkStoreInterface {
  watermark?: any,
  setWaterMark: (data: any) => void;
  resetWatermark: () => void;
}

const watermarkStore = persist<watermarkStoreInterface>(
  (set) => ({
    watermark: "",
    setWaterMark: (data) =>
      set(() => ({
        watermark: data,
      })),
      resetWatermark: () => set(() => ({ watermark: "" })),

  }),
  {
    name: 'watermark', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  }
);

export const  useWaterMarkStore = create(watermarkStore);