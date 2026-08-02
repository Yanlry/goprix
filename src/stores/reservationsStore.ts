"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { Reservation, ReservationStatus } from "@/types";

function mapReservation(r: Record<string, unknown>): Reservation {
  return {
    id:            String(r.id),
    orderNumber:   String(r.order_number),
    status:        String(r.status) as ReservationStatus,
    items:         (r.items as Reservation["items"]) ?? [],
    store:         r.store as Reservation["store"],
    pickupSlot:    r.pickup_slot as Reservation["pickupSlot"],
    total:         Number(r.total),
    discount:      Number(r.discount ?? 0),
    promoCode:     r.promo_code as string | undefined,
    userId:        String(r.user_id ?? ""),
    customerEmail: r.customer_email as string | undefined,
    customerName:  r.customer_name as string | undefined,
    messages:      (r.messages as Reservation["messages"]) ?? [],
    createdAt:     String(r.created_at),
    updatedAt:     String(r.updated_at ?? r.created_at),
  };
}

interface ReservationsState {
  reservations: Reservation[];
  initialized:  boolean;

  initializeForUser:  (userId: string) => Promise<void>;
  initializeForAdmin: () => Promise<void>;
  reset:              () => void;

  addReservation: (r: Reservation) => void;
  updateStatus:   (id: string, status: ReservationStatus) => void;
  addMessage:     (id: string, text: string) => void;
  getByUser:      (userId: string) => Reservation[];
}

export const useReservationsStore = create<ReservationsState>()((set, get) => ({
  reservations: [],
  initialized:  false,

  initializeForUser: async (userId) => {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) { console.error("reservations (user):", error.message); return; }
    set({ reservations: (data ?? []).map(mapReservation), initialized: true });
  },

  initializeForAdmin: async () => {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { console.error("reservations (admin):", error.message); return; }
    set({ reservations: (data ?? []).map(mapReservation), initialized: true });
  },

  reset: () => set({ reservations: [], initialized: false }),

  addReservation: (reservation) => {
    set((s) => ({ reservations: [reservation, ...s.reservations] }));
    supabase.from("reservations").insert({
      id:             reservation.id,
      order_number:   reservation.orderNumber,
      status:         reservation.status,
      items:          reservation.items,
      store:          reservation.store,
      pickup_slot:    reservation.pickupSlot,
      total:          reservation.total,
      discount:       reservation.discount,
      promo_code:     reservation.promoCode,
      user_id:        reservation.userId || null,
      customer_email: reservation.customerEmail,
      customer_name:  reservation.customerName,
      messages:       reservation.messages ?? [],
    }).then(({ error }) => {
      if (error) console.error("addReservation:", error.message);
    });
  },

  updateStatus: (id, status) => {
    set((s) => ({
      reservations: s.reservations.map((r) =>
        r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
      ),
    }));
    supabase.from("reservations")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .then(({ error }) => { if (error) console.error("updateStatus:", error.message); });
  },

  addMessage: (id, text) => {
    const msg = { text, sentAt: new Date().toISOString() };
    set((s) => ({
      reservations: s.reservations.map((r) =>
        r.id === id ? { ...r, messages: [...(r.messages ?? []), msg] } : r
      ),
    }));
    const reservation = get().reservations.find((r) => r.id === id);
    if (reservation) {
      const messages = [...(reservation.messages ?? []), msg];
      supabase.from("reservations").update({ messages }).eq("id", id)
        .then(({ error }) => { if (error) console.error("addMessage:", error.message); });
    }
  },

  getByUser: (userId) => get().reservations.filter((r) => r.userId === userId),
}));
