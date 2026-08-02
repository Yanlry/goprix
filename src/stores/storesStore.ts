"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Store } from "@/types";

function mapStore(r: Record<string, unknown>): Store {
  return {
    id:                    String(r.id),
    name:                  String(r.name),
    address:               String(r.address ?? ""),
    city:                  String(r.city ?? ""),
    postalCode:            String(r.postal_code ?? ""),
    phone:                 String(r.phone ?? ""),
    email:                 String(r.email ?? ""),
    image:                 String(r.image ?? ""),
    coordinates:           (r.coordinates as { lat: number; lng: number }) ?? { lat: 0, lng: 0 },
    hours:                 (r.hours as Store["hours"]) ?? [],
    services:              (r.services as string[]) ?? [],
    hasParking:            Boolean(r.has_parking),
    paymentMethods:        (r.payment_methods as string[]) ?? [],
    clickAndCollectDelay:  Number(r.click_and_collect_delay ?? 60),
  };
}

const toDb = (s: Partial<Store>) => ({
  ...(s.id                   !== undefined && { id: s.id }),
  ...(s.name                 !== undefined && { name: s.name }),
  ...(s.address              !== undefined && { address: s.address }),
  ...(s.city                 !== undefined && { city: s.city }),
  ...(s.postalCode           !== undefined && { postal_code: s.postalCode }),
  ...(s.phone                !== undefined && { phone: s.phone }),
  ...(s.email                !== undefined && { email: s.email }),
  ...(s.image                !== undefined && { image: s.image }),
  ...(s.coordinates          !== undefined && { coordinates: s.coordinates }),
  ...(s.hours                !== undefined && { hours: s.hours }),
  ...(s.services             !== undefined && { services: s.services }),
  ...(s.hasParking           !== undefined && { has_parking: s.hasParking }),
  ...(s.paymentMethods       !== undefined && { payment_methods: s.paymentMethods }),
  ...(s.clickAndCollectDelay !== undefined && { click_and_collect_delay: s.clickAndCollectDelay }),
});

interface StoresState {
  stores:      Store[];
  initialized: boolean;
  initialize:  () => Promise<void>;
  addStore:    (store: Store) => void;
  updateStore: (id: string, updates: Partial<Store>) => void;
  deleteStore: (id: string) => void;
}

export const useStoresStore = create<StoresState>()((set, get) => ({
  stores:      [],
  initialized: false,

  initialize: async () => {
    if (get().initialized) return;
    const { data, error } = await supabase.from("stores").select("*").order("created_at");
    if (error) { console.error("storesStore.initialize:", error.message); return; }
    set({ stores: (data ?? []).map(mapStore), initialized: true });
  },

  addStore: (store) => {
    set((s) => ({ stores: [store, ...s.stores] }));
    supabase.from("stores").insert(toDb(store)).then(({ error }) => {
      if (error) console.error("addStore:", error.message);
    });
  },

  updateStore: (id, updates) => {
    set((s) => ({ stores: s.stores.map((s) => (s.id === id ? { ...s, ...updates } : s)) }));
    supabase.from("stores").update(toDb(updates)).eq("id", id).then(({ error }) => {
      if (error) console.error("updateStore:", error.message);
    });
  },

  deleteStore: (id) => {
    set((s) => ({ stores: s.stores.filter((s) => s.id !== id) }));
    supabase.from("stores").delete().eq("id", id).then(({ error }) => {
      if (error) console.error("deleteStore:", error.message);
    });
  },
}));
