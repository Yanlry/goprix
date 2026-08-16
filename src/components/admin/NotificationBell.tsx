"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Package, CheckCheck, ShoppingBag } from "lucide-react";
import { useAdminNotificationsStore } from "@/stores/adminNotificationsStore";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "À l'instant";
  if (mins < 60) return `Il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

export function NotificationBell() {
  const router = useRouter();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useAdminNotificationsStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleNotifClick(id: string, orderNumber: string) {
    markAsRead(id);
    setOpen(false);
    router.push(`/administration/commandes?order=${orderNumber}`);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-bold text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} nouvelle{unreadCount > 1 ? "s" : ""}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-semibold transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Tout lire
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                <ShoppingBag className="w-8 h-8 mb-2 text-gray-200" />
                <p className="text-sm font-medium">Aucune notification</p>
                <p className="text-xs mt-1">Les nouvelles commandes apparaîtront ici</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotifClick(n.id, n.orderNumber)}
                  className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0 ${
                    !n.read ? "bg-purple-50/60" : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    !n.read ? "bg-purple-100" : "bg-gray-100"
                  }`}>
                    <Package className={`w-4 h-4 ${!n.read ? "text-purple-600" : "text-gray-400"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-bold truncate ${!n.read ? "text-gray-900" : "text-gray-600"}`}>
                        Nouvelle commande
                      </p>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />}
                    </div>
                    <p className="text-xs font-semibold text-purple-600">{n.orderNumber}</p>
                    <p className="text-xs text-gray-500 truncate">{n.customerName} · {n.storeName}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs font-bold text-gray-900">{n.total.toFixed(2)} €</p>
                      <p className="text-[10px] text-gray-400">{timeAgo(n.createdAt)}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-100 px-4 py-2.5">
              <button
                onClick={() => { setOpen(false); router.push("/administration/commandes"); }}
                className="text-xs text-purple-600 hover:text-purple-800 font-semibold w-full text-center transition-colors"
              >
                Voir toutes les commandes →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
