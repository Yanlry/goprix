"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface FavoritesStore {
  items: Product[];
  toggle: (product: Product) => void;
  isFavorite: (productId: string) => boolean;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (product) => {
        set((state) => {
          const exists = state.items.find((p) => p.id === product.id);
          if (exists) {
            return { items: state.items.filter((p) => p.id !== product.id) };
          }
          return { items: [...state.items, product] };
        });
      },

      isFavorite: (productId) => {
        return get().items.some((p) => p.id === productId);
      },

      clear: () => set({ items: [] }),
    }),
    { name: "goprix-favorites" }
  )
);
