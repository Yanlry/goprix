"use client";

import { useState } from "react";
import {
  Package, X, Bell, CheckCircle, MapPin, Calendar,
  Phone, Clock, XCircle,
} from "lucide-react";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { OrderStatusBadge } from "@/components/common/OrderStatusBadge";
import { OrderTimeline } from "@/components/common/OrderTimeline";
import { SafeImage } from "@/components/common/SafeImage";
import type { Reservation, ReservationStatus } from "@/types";

const canCancel = (s: ReservationStatus) => s === "nouvelle" || s === "en_preparation";

interface Props {
  res: Reservation;
  onClose: () => void;
  onCancel: (id: string) => void;
}

export function ReservationModal({ res, onClose, onCancel }: Props) {
  const [confirmCancel, setConfirmCancel] = useState(false);
  const dateFormatted = res.pickupSlot.date.split("-").reverse().join("/");
  const hasMessages   = (res.messages?.length ?? 0) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl shadow-2xl max-h-[95vh] flex flex-col overflow-hidden rounded-t-2xl">

        {/* En-tête */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{res.orderNumber}</p>
              <p className="text-xs text-gray-400">
                {new Date(res.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <OrderStatusBadge status={res.status} />
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Corps */}
        <div className="flex-1 overflow-y-auto">

          {hasMessages && (
            <div className="mx-5 mt-5 bg-purple-50 border border-purple-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-4 h-4 text-purple-600" />
                <p className="text-sm font-bold text-purple-800">
                  Message{res.messages!.length > 1 ? "s" : ""} du magasin
                </p>
              </div>
              <div className="space-y-2">
                {res.messages!.map((msg, i) => (
                  <div key={i} className="bg-white rounded-xl p-3 border border-purple-100">
                    <p className="text-sm text-gray-700">{msg.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(msg.sentAt).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {res.status === "prete" && (
            <div className="mx-5 mt-5 bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
              <p className="text-2xl mb-1">🎉</p>
              <p className="font-bold text-green-800 text-sm">Votre commande est prête !</p>
              <p className="text-xs text-green-600 mt-0.5">Rendez-vous en magasin pour la retirer</p>
            </div>
          )}

          <div className="p-5 space-y-5">

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Suivi de commande</p>
              <OrderTimeline status={res.status} />
            </div>

            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Articles ({res.items.length})
              </p>
              <div className="space-y-2">
                {res.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <SafeImage
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 flex-shrink-0 rounded-lg bg-white"
                      imageClassName="object-cover"
                      sizes="48px"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-400">{item.product.brand} · ×{item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0">
                      {(item.price * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-3 px-1">
                <span className="text-sm text-gray-500">Total TTC</span>
                <span className="text-base font-bold text-purple-700">{res.total.toFixed(2)} €</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Point de retrait</p>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{res.store.name}</p>
                  <p className="text-xs text-gray-500">{res.store.address}, {res.store.postalCode} {res.store.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span>Le {dateFormatted} de {res.pickupSlot.startTime} à {res.pickupSlot.endTime}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <Phone className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span>{res.store.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span>Réservation valable 48h après confirmation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pied */}
        {canCancel(res.status) && (
          <div className="border-t border-gray-100 p-4 flex-shrink-0">
            <button onClick={() => setConfirmCancel(true)}
              className="w-full flex items-center justify-center gap-2 h-11 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors">
              <XCircle className="w-4 h-4" />
              Annuler cette réservation
            </button>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmCancel}
        title="Annuler la réservation"
        message="Cette action annulera votre commande. Vous ne pourrez plus la retirer en magasin."
        confirmLabel="Oui, annuler"
        onConfirm={() => { onCancel(res.id); setConfirmCancel(false); onClose(); }}
        onCancel={() => setConfirmCancel(false)}
        danger
      />
    </div>
  );
}
