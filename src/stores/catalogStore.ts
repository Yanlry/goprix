"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, Category, Brand, ReservationItem } from "@/types";

interface CatalogState {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  addProduct: (p: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleProductActive: (id: string) => void;
  addCategory: (c: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addBrand: (b: Brand) => void;
  updateBrand: (id: string, updates: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;
  reduceStock: (items: ReservationItem[], storeId: string) => void;
  restoreStock: (items: ReservationItem[], storeId: string) => void;
}

export const useCatalogStore = create<CatalogState>()(
  persist(
    (set) => ({
      products: [],
      categories: [],
      brands: [],

      addProduct: (p) => set((s) => ({ products: [p, ...s.products] })),
      updateProduct: (id, updates) =>
        set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
      deleteProduct: (id) =>
        set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      toggleProductActive: (id) =>
        set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)) })),

      addCategory: (c) => set((s) => ({ categories: [...s.categories, c] })),
      updateCategory: (id, updates) =>
        set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)) })),
      deleteCategory: (id) =>
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) })),

      addBrand: (b) => set((s) => ({ brands: [...s.brands, b] })),
      updateBrand: (id, updates) =>
        set((s) => ({ brands: s.brands.map((b) => (b.id === id ? { ...b, ...updates } : b)) })),
      deleteBrand: (id) =>
        set((s) => ({ brands: s.brands.filter((b) => b.id !== id) })),

      reduceStock: (items, storeId) =>
        set((s) => ({
          products: s.products.map((p) => {
            const item = items.find((i) => i.product.id === p.id);
            if (!item) return p;
            const stockByStore = { ...(p.stockByStore ?? {}) };
            const key = storeId in stockByStore ? storeId : "_default";
            stockByStore[key] = Math.max(0, (stockByStore[key] ?? 0) - item.quantity);
            return { ...p, stockByStore };
          }),
        })),

      restoreStock: (items, storeId) =>
        set((s) => ({
          products: s.products.map((p) => {
            const item = items.find((i) => i.product.id === p.id);
            if (!item) return p;
            const stockByStore = { ...(p.stockByStore ?? {}) };
            const key = storeId in stockByStore ? storeId : "_default";
            stockByStore[key] = (stockByStore[key] ?? 0) + item.quantity;
            return { ...p, stockByStore };
          }),
        })),
    }),
    { name: "goprix-catalog", skipHydration: true }
  )
);
