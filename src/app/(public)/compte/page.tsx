"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Package, Heart, MapPin, ChevronRight, MessageSquare, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useReservationsStore } from "@/stores/reservationsStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useStoresStore } from "@/stores/storesStore";
import { useCatalogStore } from "@/stores/catalogStore";
import { ReservationModal } from "@/components/common/ReservationModal";
import { OrderStatusBadge } from "@/components/common/OrderStatusBadge";
import { SafeImage } from "@/components/common/SafeImage";
import type { Reservation } from "@/types";

export default function ComptePage() {
  const { user }                       = useAuthStore();
  const { reservations, updateStatus } = useReservationsStore();
  const { restoreStock }               = useCatalogStore();
  const favorites                      = useFavoritesStore((s) => s.items);
  const stores                         = useStoresStore((s) => s.stores);
  const [selected, setSelected]        = useState<Reservation | null>(null);

  if (!user) return null;

  const userReservations   = reservations.filter((r) => r.userId === user.id);
  const recentReservations = userReservations.slice(0, 3);

  const handleCancel = (id: string) => {
    const res = reservations.find((r) => r.id === id);
    if (res) restoreStock(res.items, res.store.id);
    updateStatus(id, "annulee");
  };

  const stats = [
    { icon: ShoppingBag, label: "Réservations",    value: userReservations.length,                                       color: "text-purple-600", bg: "bg-purple-50", href: "/compte/reservations" },
    { icon: Package,     label: "Retirées",         value: userReservations.filter((r) => r.status === "retiree").length, color: "text-green-600",  bg: "bg-green-50",  href: "/compte/reservations" },
    { icon: Heart,       label: "Favoris",          value: favorites.length,                                              color: "text-pink-600",   bg: "bg-pink-50",   href: "/favoris" },
    { icon: MapPin,      label: "Points de retrait", value: stores.length,                                                color: "text-blue-600",   bg: "bg-blue-50",   href: "/contact" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 text-sm mt-1">
          Bienvenue {user.firstName} ! Gérez vos réservations et votre compte.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ icon: Icon, label, value, color, bg, href }) => (
          <Link key={label} href={href}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Réservations récentes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-4">
          <h2 className="font-bold text-gray-900">Réservations récentes</h2>
          <Link href="/compte/reservations" className="text-sm text-purple-700 hover:underline">
            Voir tout
          </Link>
        </div>

        {recentReservations.length === 0 ? (
          <div className="text-center pb-10 text-gray-400">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Aucune réservation pour l&apos;instant</p>
            <Link href="/categories" className="text-purple-700 text-sm hover:underline mt-1 inline-block">
              Parcourir le catalogue
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentReservations.map((res) => {
              const hasMsg = (res.messages?.length ?? 0) > 0;
              return (
                <button key={res.id} onClick={() => setSelected(res)}
                  className="w-full text-left hover:bg-gray-50 transition-colors overflow-hidden">
                  {res.status === "prete" && (
                    <div className="bg-green-500 text-white text-[10px] font-bold text-center py-1 flex items-center justify-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Prête à retirer — Cliquez pour voir les détails
                    </div>
                  )}
                  <div className="flex items-center gap-3 px-5 py-3">
                    <SafeImage
                      src={res.items[0]?.product.images[0]}
                      alt={res.items[0]?.product.name || "Article réservé"}
                      className="h-12 w-12 flex-shrink-0 rounded-xl bg-gray-100"
                      imageClassName="object-cover"
                      sizes="48px"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-gray-900">{res.orderNumber}</p>
                        {hasMsg && (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                            <MessageSquare className="w-3 h-3" /> {res.messages!.length}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">
                        {res.items.map((i) => i.product.name).join(", ")}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{res.store.name}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <OrderStatusBadge status={res.status} size="sm" />
                      <p className="text-xs font-bold text-gray-900">{res.total.toFixed(2)} €</p>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Raccourcis */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-gray-900 mb-4">Raccourcis</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: "🏪", label: "Infos magasin", href: "/contact" },
            { icon: "❤️",  label: "Mes favoris",  href: "/favoris" },
            { icon: "🏷️",  label: "Promotions",   href: "/promotions" },
            { icon: "📦",  label: "Nouveautés",   href: "/nouveautes" },
          ].map(({ icon, label, href }) => (
            <Link key={label} href={href}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors text-center">
              <span className="text-2xl">{icon}</span>
              <span className="text-xs font-medium text-gray-700">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {selected && (
        <ReservationModal
          res={reservations.find((r) => r.id === selected.id) ?? selected}
          onClose={() => setSelected(null)}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
