"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, MapPin, Calendar, Package,
  ChevronRight, MessageSquare, CheckCircle,
} from "lucide-react";
import { useReservationsStore } from "@/stores/reservationsStore";
import { useCatalogStore } from "@/stores/catalogStore";
import { useAuthStore } from "@/stores/authStore";
import { ReservationModal } from "@/components/common/ReservationModal";
import { OrderStatusBadge } from "@/components/common/OrderStatusBadge";
import { SafeImage } from "@/components/common/SafeImage";
import type { Reservation, ReservationStatus } from "@/types";

const ALL_STATUSES: { key: ReservationStatus | "all"; label: string }[] = [
  { key: "all",            label: "Toutes" },
  { key: "nouvelle",       label: "Reçue" },
  { key: "en_preparation", label: "En préparation" },
  { key: "prete",          label: "Prête 🎉" },
  { key: "retiree",        label: "Retirée" },
  { key: "annulee",        label: "Annulée" },
];

export default function ReservationsPage() {
  const { user }                       = useAuthStore();
  const { reservations, updateStatus } = useReservationsStore();
  const { restoreStock }               = useCatalogStore();
  const [query, setQuery]              = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">("all");
  const [selected, setSelected]         = useState<Reservation | null>(null);

  if (!user) return null;

  const userReservations = reservations.filter((r) => r.userId === user.id);

  const filtered = userReservations.filter((r) => {
    const matchQuery  = r.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
                        r.store.name.toLowerCase().includes(query.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchQuery && matchStatus;
  });

  const handleCancel = (id: string) => {
    const res = reservations.find((r) => r.id === id);
    if (res) restoreStock(res.items, res.store.id);
    updateStatus(id, "annulee");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <nav className="text-xs text-gray-400 mb-1">
            <Link href="/compte" className="hover:text-purple-700">Mon compte</Link>
            <span className="mx-1">/</span>
            <span className="text-gray-600">Mes réservations</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">Mes réservations</h1>
        </div>
        <span className="text-sm text-gray-500">{filtered.length} résultat{filtered.length > 1 ? "s" : ""}</span>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher par numéro ou magasin..."
            className="w-full pl-9 pr-4 h-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ALL_STATUSES.map(({ key, label }) => (
            <button key={key} onClick={() => setStatusFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === key ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-purple-50"
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {filtered.map((res) => {
          const hasMsg = (res.messages?.length ?? 0) > 0;
          return (
            <button key={res.id} onClick={() => setSelected(res)}
              className="w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all overflow-hidden">
              {res.status === "prete" && (
                <div className="bg-green-500 text-white text-xs font-bold text-center py-1.5 flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Prête à retirer — Cliquez pour voir les détails
                </div>
              )}
              <div className="flex items-center gap-4 p-4">
                <SafeImage
                  src={res.items[0]?.product.images[0]}
                  alt={res.items[0]?.product.name ?? "Article"}
                  className="w-14 h-14 flex-shrink-0 rounded-xl bg-gray-100"
                  imageClassName="object-cover"
                  sizes="56px"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-bold text-gray-900">{res.orderNumber}</p>
                    {hasMsg && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-full">
                        <MessageSquare className="w-3 h-3" /> {res.messages!.length}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {res.items.map((i) => i.product.name).join(", ")}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {res.store.name}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {res.pickupSlot.date.split("-").reverse().join("/")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <OrderStatusBadge status={res.status} size="sm" />
                  <p className="text-sm font-bold text-gray-900">{res.total.toFixed(2)} €</p>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Aucune réservation trouvée</p>
            <Link href="/categories" className="text-purple-700 text-sm hover:underline mt-1 inline-block">
              Parcourir le catalogue
            </Link>
          </div>
        )}
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
