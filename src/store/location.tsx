import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

interface locationStoreInterface {
  location?: {
    address?: any[],
    latitude: number,
    longitude: number
  } | null,
  setLocation: (data: any) => void;
  resetLocation: () => void;
}

const locationStore = persist<locationStoreInterface>(
  (set) => ({
    location: null,
    setLocation: (data) =>
      set(() => ({
        location: { ...data },
      })),
      resetLocation: () => set(() => ({ location: null })),

  }),
  {
    name: 'location', // name of the item in the storage (must be unique)
    storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
  }
);

export const useLocationStore = create(locationStore);