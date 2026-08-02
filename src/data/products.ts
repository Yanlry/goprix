import type { Product } from "@/types";

export const products: Product[] = [];

export const getProductsByCategory = (slug: string) =>
  products.filter((p) => p.categorySlug === slug && p.isActive);

export const getPromoProducts = () =>
  products.filter((p) => p.isPromo && p.isActive);

export const getNewProducts = () =>
  products.filter((p) => p.isNew && p.isActive);

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);
