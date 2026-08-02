"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  promoCode: string;
  promoDiscount: number;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  subtotal: () => number;
  total: () => number;
  itemCount: () => number;
}

export const CART_ITEM_ADDED_EVENT = "goprix:cart-item-added";

export interface CartItemAddedEventDetail {
  product: Product;
  quantity: number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: "",
      promoDiscount: 0,

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        });

        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent<CartItemAddedEventDetail>(CART_ITEM_ADDED_EVENT, {
              detail: { product, quantity },
            })
          );
        }
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [], promoCode: "", promoDiscount: 0 }),

      applyPromoCode: (code) => {
        const validCodes: Record<string, number> = {
          GOPRIX10: 10,
          DESTOC20: 20,
          BIENVENUE15: 15,
        };
        const discount = validCodes[code.toUpperCase()];
        if (discount) {
          set({ promoCode: code.toUpperCase(), promoDiscount: discount });
          return true;
        }
        return false;
      },

      removePromoCode: () => set({ promoCode: "", promoDiscount: 0 }),

      subtotal: () => {
        const { items } = get();
        return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
      },

      total: () => {
        const { promoDiscount } = get();
        const sub = get().subtotal();
        return sub * (1 - promoDiscount / 100);
      },

      itemCount: () => {
        const { items } = get();
        return items.reduce((sum, i) => sum + i.quantity, 0);
      },
    }),
    { name: "goprix-cart" }
  )
);
