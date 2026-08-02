"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Product, Category, Brand, ReservationItem } from "@/types";

// ─── Mappers Supabase → TypeScript ───────────────────────────────────────────

function mapProduct(r: Record<string, unknown>): Product {
  return {
    id:             String(r.id),
    slug:           String(r.slug),
    name:           String(r.name),
    brand:          String(r.brand ?? ""),
    brandSlug:      String(r.brand_slug ?? ""),
    category:       String(r.category ?? ""),
    categorySlug:   String(r.category_slug ?? ""),
    description:    String(r.description ?? ""),
    features:       (r.features as string[]) ?? [],
    specifications: (r.specifications as Record<string, string>) ?? {},
    images:         (r.images as string[]) ?? [],
    price:          Number(r.price),
    originalPrice:  Number(r.original_price),
    discount:       Number(r.discount ?? 0),
    isNew:          Boolean(r.is_new),
    isPromo:        Boolean(r.is_promo),
    isEndOfSeries:  Boolean(r.is_end_of_series),
    isActive:       Boolean(r.is_active),
    reference:      String(r.reference ?? ""),
    barcode:        String(r.barcode ?? ""),
    stockByStore:   (r.stock_by_store as Record<string, number>) ?? {},
    tags:           (r.tags as string[]) ?? [],
    weight:         r.weight as string | undefined,
    dimensions:     r.dimensions as string | undefined,
  };
}

function mapCategory(r: Record<string, unknown>): Category {
  return {
    id:           String(r.id),
    slug:         String(r.slug),
    name:         String(r.name),
    description:  String(r.description ?? ""),
    image:        String(r.image ?? ""),
    icon:         String(r.icon ?? ""),
    productCount: Number(r.product_count ?? 0),
    color:        String(r.color ?? ""),
  };
}

function mapBrand(r: Record<string, unknown>): Brand {
  return {
    id:           String(r.id),
    slug:         String(r.slug),
    name:         String(r.name),
    logo:         String(r.logo ?? ""),
    productCount: Number(r.product_count ?? 0),
    description:  String(r.description ?? ""),
    categories:   (r.categories as string[]) ?? [],
    isPartner:    Boolean(r.is_partner),
    discount:     r.discount !== null ? Number(r.discount) : undefined,
  };
}

// ─── Helpers TypeScript → Supabase ───────────────────────────────────────────

const toDbProduct = (p: Partial<Product>) => ({
  ...(p.id            !== undefined && { id: p.id }),
  ...(p.slug          !== undefined && { slug: p.slug }),
  ...(p.name          !== undefined && { name: p.name }),
  ...(p.brand         !== undefined && { brand: p.brand }),
  ...(p.brandSlug     !== undefined && { brand_slug: p.brandSlug }),
  ...(p.category      !== undefined && { category: p.category }),
  ...(p.categorySlug  !== undefined && { category_slug: p.categorySlug }),
  ...(p.description   !== undefined && { description: p.description }),
  ...(p.features      !== undefined && { features: p.features }),
  ...(p.specifications!== undefined && { specifications: p.specifications }),
  ...(p.images        !== undefined && { images: p.images }),
  ...(p.price         !== undefined && { price: p.price }),
  ...(p.originalPrice !== undefined && { original_price: p.originalPrice }),
  ...(p.discount      !== undefined && { discount: p.discount }),
  ...(p.isNew         !== undefined && { is_new: p.isNew }),
  ...(p.isPromo       !== undefined && { is_promo: p.isPromo }),
  ...(p.isEndOfSeries !== undefined && { is_end_of_series: p.isEndOfSeries }),
  ...(p.isActive      !== undefined && { is_active: p.isActive }),
  ...(p.reference     !== undefined && { reference: p.reference }),
  ...(p.barcode       !== undefined && { barcode: p.barcode }),
  ...(p.stockByStore  !== undefined && { stock_by_store: p.stockByStore }),
  ...(p.tags          !== undefined && { tags: p.tags }),
  ...(p.weight        !== undefined && { weight: p.weight }),
  ...(p.dimensions    !== undefined && { dimensions: p.dimensions }),
});

const toDbCategory = (c: Partial<Category>) => ({
  ...(c.id           !== undefined && { id: c.id }),
  ...(c.slug         !== undefined && { slug: c.slug }),
  ...(c.name         !== undefined && { name: c.name }),
  ...(c.description  !== undefined && { description: c.description }),
  ...(c.image        !== undefined && { image: c.image }),
  ...(c.icon         !== undefined && { icon: c.icon }),
  ...(c.productCount !== undefined && { product_count: c.productCount }),
  ...(c.color        !== undefined && { color: c.color }),
});

const toDbBrand = (b: Partial<Brand>) => ({
  ...(b.id           !== undefined && { id: b.id }),
  ...(b.slug         !== undefined && { slug: b.slug }),
  ...(b.name         !== undefined && { name: b.name }),
  ...(b.logo         !== undefined && { logo: b.logo }),
  ...(b.productCount !== undefined && { product_count: b.productCount }),
  ...(b.description  !== undefined && { description: b.description }),
  ...(b.categories   !== undefined && { categories: b.categories }),
  ...(b.isPartner    !== undefined && { is_partner: b.isPartner }),
  ...(b.discount     !== undefined && { discount: b.discount }),
});

// ─── Store ───────────────────────────────────────────────────────────────────

interface CatalogState {
  products:    Product[];
  categories:  Category[];
  brands:      Brand[];
  initialized: boolean;
  initialize:  () => Promise<void>;

  addProduct:          (p: Product) => void;
  updateProduct:       (id: string, updates: Partial<Product>) => void;
  deleteProduct:       (id: string) => void;
  toggleProductActive: (id: string) => void;

  addCategory:    (c: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  addBrand:    (b: Brand) => void;
  updateBrand: (id: string, updates: Partial<Brand>) => void;
  deleteBrand: (id: string) => void;

  reduceStock:  (items: ReservationItem[], storeId: string) => void;
  restoreStock: (items: ReservationItem[], storeId: string) => void;
}

export const useCatalogStore = create<CatalogState>()((set, get) => ({
  products:    [],
  categories:  [],
  brands:      [],
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;
    const [{ data: products }, { data: categories }, { data: brands }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*"),
      supabase.from("brands").select("*"),
    ]);
    set({
      products:    (products ?? []).map(mapProduct),
      categories:  (categories ?? []).map(mapCategory),
      brands:      (brands ?? []).map(mapBrand),
      initialized: true,
    });
  },

  // ── Products ─────────────────────────────────────────────
  addProduct: (p) => {
    set((s) => ({ products: [p, ...s.products] }));
    supabase.from("products").insert(toDbProduct(p)).then(({ error }) => {
      if (error) console.error("addProduct:", error.message);
    });
  },

  updateProduct: (id, updates) => {
    set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, ...updates } : p)) }));
    supabase.from("products").update(toDbProduct(updates)).eq("id", id).then(({ error }) => {
      if (error) console.error("updateProduct:", error.message);
    });
  },

  deleteProduct: (id) => {
    set((s) => ({ products: s.products.filter((p) => p.id !== id) }));
    supabase.from("products").delete().eq("id", id).then(({ error }) => {
      if (error) console.error("deleteProduct:", error.message);
    });
  },

  toggleProductActive: (id) => {
    const product = get().products.find((p) => p.id === id);
    if (!product) return;
    const isActive = !product.isActive;
    set((s) => ({ products: s.products.map((p) => (p.id === id ? { ...p, isActive } : p)) }));
    supabase.from("products").update({ is_active: isActive }).eq("id", id).then(({ error }) => {
      if (error) console.error("toggleProductActive:", error.message);
    });
  },

  // ── Categories ───────────────────────────────────────────
  addCategory: (c) => {
    set((s) => ({ categories: [...s.categories, c] }));
    supabase.from("categories").insert(toDbCategory(c)).then(({ error }) => {
      if (error) console.error("addCategory:", error.message);
    });
  },

  updateCategory: (id, updates) => {
    set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)) }));
    supabase.from("categories").update(toDbCategory(updates)).eq("id", id).then(({ error }) => {
      if (error) console.error("updateCategory:", error.message);
    });
  },

  deleteCategory: (id) => {
    set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
    supabase.from("categories").delete().eq("id", id).then(({ error }) => {
      if (error) console.error("deleteCategory:", error.message);
    });
  },

  // ── Brands ───────────────────────────────────────────────
  addBrand: (b) => {
    set((s) => ({ brands: [...s.brands, b] }));
    supabase.from("brands").insert(toDbBrand(b)).then(({ error }) => {
      if (error) console.error("addBrand:", error.message);
    });
  },

  updateBrand: (id, updates) => {
    set((s) => ({ brands: s.brands.map((b) => (b.id === id ? { ...b, ...updates } : b)) }));
    supabase.from("brands").update(toDbBrand(updates)).eq("id", id).then(({ error }) => {
      if (error) console.error("updateBrand:", error.message);
    });
  },

  deleteBrand: (id) => {
    set((s) => ({ brands: s.brands.filter((b) => b.id !== id) }));
    supabase.from("brands").delete().eq("id", id).then(({ error }) => {
      if (error) console.error("deleteBrand:", error.message);
    });
  },

  // ── Stock ────────────────────────────────────────────────
  reduceStock: (items, storeId) => {
    const updated: Product[] = get().products.map((p) => {
      const item = items.find((i) => i.product.id === p.id);
      if (!item) return p;
      const stockByStore = { ...(p.stockByStore ?? {}) };
      const key = storeId in stockByStore ? storeId : "_default";
      stockByStore[key] = Math.max(0, (stockByStore[key] ?? 0) - item.quantity);
      return { ...p, stockByStore };
    });
    set({ products: updated });
    updated.forEach((p) => {
      const changed = items.find((i) => i.product.id === p.id);
      if (changed) {
        supabase.from("products").update({ stock_by_store: p.stockByStore }).eq("id", p.id)
          .then(({ error }) => { if (error) console.error("reduceStock:", error.message); });
      }
    });
  },

  restoreStock: (items, storeId) => {
    const updated: Product[] = get().products.map((p) => {
      const item = items.find((i) => i.product.id === p.id);
      if (!item) return p;
      const stockByStore = { ...(p.stockByStore ?? {}) };
      const key = storeId in stockByStore ? storeId : "_default";
      stockByStore[key] = (stockByStore[key] ?? 0) + item.quantity;
      return { ...p, stockByStore };
    });
    set({ products: updated });
    updated.forEach((p) => {
      const changed = items.find((i) => i.product.id === p.id);
      if (changed) {
        supabase.from("products").update({ stock_by_store: p.stockByStore }).eq("id", p.id)
          .then(({ error }) => { if (error) console.error("restoreStock:", error.message); });
      }
    });
  },
}));
