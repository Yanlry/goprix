"use client";

import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export interface VendorMessage {
  id:     string;
  text:   string;
  sentAt: string;
  read:   boolean;
}

interface ClientMessagesState {
  messages:     Record<string, VendorMessage[]>; // keyed by userId
  initialized:  boolean;

  initializeForUser: (userId: string) => Promise<void>;
  addMessage:        (userId: string, text: string) => void;
  markAllRead:       (userId: string) => void;
  getMessages:       (userId: string) => VendorMessage[];
  unreadCount:       (userId: string) => number;
}

export const useClientMessagesStore = create<ClientMessagesState>()((set, get) => ({
  messages:    {},
  initialized: false,

  initializeForUser: async (userId) => {
    const { data, error } = await supabase
      .from("client_messages")
      .select("*")
      .eq("user_id", userId)
      .order("sent_at", { ascending: false });
    if (error) { console.error("clientMessages:", error.message); return; }
    const msgs: VendorMessage[] = (data ?? []).map((r) => ({
      id:     String(r.id),
      text:   String(r.text),
      sentAt: String(r.sent_at),
      read:   Boolean(r.read),
    }));
    set((s) => ({ messages: { ...s.messages, [userId]: msgs }, initialized: true }));
  },

  addMessage: (userId, text) => {
    const msg: VendorMessage = {
      id:     `msg-${Date.now()}`,
      text,
      sentAt: new Date().toISOString(),
      read:   false,
    };
    set((s) => ({
      messages: { ...s.messages, [userId]: [msg, ...(s.messages[userId] ?? [])] },
    }));
    supabase.from("client_messages").insert({ user_id: userId, text }).then(({ error }) => {
      if (error) console.error("addMessage:", error.message);
    });
  },

  markAllRead: (userId) => {
    set((s) => ({
      messages: {
        ...s.messages,
        [userId]: (s.messages[userId] ?? []).map((m) => ({ ...m, read: true })),
      },
    }));
    supabase.from("client_messages")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false)
      .then(({ error }) => { if (error) console.error("markAllRead:", error.message); });
  },

  getMessages:  (userId) => get().messages[userId] ?? [],
  unreadCount:  (userId) => (get().messages[userId] ?? []).filter((m) => !m.read).length,
}));
