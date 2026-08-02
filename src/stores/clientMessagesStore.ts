"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface VendorMessage {
  id: string;
  text: string;
  sentAt: string;
  read: boolean;
}

interface ClientMessagesStore {
  messages: Record<string, VendorMessage[]>; // keyed by userId
  addMessage: (userId: string, text: string) => void;
  markAllRead: (userId: string) => void;
  getMessages: (userId: string) => VendorMessage[];
  unreadCount: (userId: string) => number;
}

export const useClientMessagesStore = create<ClientMessagesStore>()(
  persist(
    (set, get) => ({
      messages: {},

      addMessage: (userId, text) => {
        const msg: VendorMessage = {
          id:     `msg-${Date.now()}`,
          text,
          sentAt: new Date().toISOString(),
          read:   false,
        };
        set((s) => ({
          messages: {
            ...s.messages,
            [userId]: [msg, ...(s.messages[userId] ?? [])],
          },
        }));
      },

      markAllRead: (userId) => {
        set((s) => ({
          messages: {
            ...s.messages,
            [userId]: (s.messages[userId] ?? []).map((m) => ({ ...m, read: true })),
          },
        }));
      },

      getMessages: (userId) => get().messages[userId] ?? [],

      unreadCount: (userId) =>
        (get().messages[userId] ?? []).filter((m) => !m.read).length,
    }),
    { name: "goprix-client-messages" }
  )
);
