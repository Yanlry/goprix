"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Reservation, ReservationStatus } from "@/types";
import { mockAdminReservations } from "@/data";

interface ReservationsStore {
  reservations: Reservation[];
  addReservation: (reservation: Reservation) => void;
  updateStatus: (id: string, status: ReservationStatus) => void;
  addMessage: (id: string, text: string) => void;
  getByUser: (userId: string) => Reservation[];
}

export const useReservationsStore = create<ReservationsStore>()(
  persist(
    (set, get) => ({
      reservations: mockAdminReservations,

      addReservation: (reservation) => {
        set((state) => ({
          reservations: [reservation, ...state.reservations],
        }));
      },

      updateStatus: (id, status) => {
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
          ),
        }));
      },

      addMessage: (id, text) => {
        set((state) => ({
          reservations: state.reservations.map((r) =>
            r.id === id
              ? { ...r, messages: [...(r.messages ?? []), { text, sentAt: new Date().toISOString() }] }
              : r
          ),
        }));
      },

      getByUser: (userId) => {
        return get().reservations.filter((r) => r.userId === userId);
      },
    }),
    { name: "goprix-reservations" }
  )
);
