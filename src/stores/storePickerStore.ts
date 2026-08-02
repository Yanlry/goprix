"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Store, PickupSlot } from "@/types";

interface StorePickerState {
  selectedStore: Store | null;
  selectedSlot: PickupSlot | null;
  setStore: (store: Store) => void;
  setSlot: (slot: PickupSlot) => void;
  clearSelection: () => void;
}

export const useStorePickerStore = create<StorePickerState>()(
  persist(
    (set) => ({
      selectedStore: null,
      selectedSlot: null,
      setStore: (store) => set({ selectedStore: store }),
      setSlot: (slot) => set({ selectedSlot: slot }),
      clearSelection: () => set({ selectedStore: null, selectedSlot: null }),
    }),
    { name: "goprix-store-picker" }
  )
);
