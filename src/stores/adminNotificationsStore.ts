"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AdminNotification {
  id: string;
  reservationId: string;
  orderNumber: string;
  customerName: string;
  storeName: string;
  total: number;
  createdAt: string;
  read: boolean;
}

interface AdminNotificationsState {
  notifications: AdminNotification[];
  unreadCount: number;
  add: (n: Omit<AdminNotification, "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useAdminNotificationsStore = create<AdminNotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],
      unreadCount: 0,

      add: (n) => {
        const already = get().notifications.some((x) => x.id === n.id);
        if (already) return;
        const notification: AdminNotification = { ...n, read: false };
        set((s) => ({
          notifications: [notification, ...s.notifications].slice(0, 50),
          unreadCount: s.unreadCount + 1,
        }));
      },

      markAsRead: (id) => {
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, s.unreadCount - (s.notifications.find((n) => n.id === id && !n.read) ? 1 : 0)),
        }));
      },

      markAllAsRead: () => {
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        }));
      },
    }),
    {
      name: "goprix-admin-notifications",
      partialize: (s) => ({ notifications: s.notifications, unreadCount: s.unreadCount }),
    }
  )
);
