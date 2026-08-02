"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Store } from "@/types";

interface StoresState {
  stores: Store[];
  addStore: (store: Store) => void;
  updateStore: (id: string, updates: Partial<Store>) => void;
  deleteStore: (id: string) => void;
}

export const useStoresStore = create<StoresState>()(
  persist(
    (set) => ({
      stores: [],

      addStore: (store) => set((state) => ({ stores: [store, ...state.stores] })),
      updateStore: (id, updates) =>
        set((state) => ({
          stores: state.stores.map((store) => (store.id === id ? { ...store, ...updates } : store)),
        })),
      deleteStore: (id) =>
        set((state) => ({ stores: state.stores.filter((store) => store.id !== id) })),
    }),
    { name: "goprix-stores", skipHydration: true }
  )
);
