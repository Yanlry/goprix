"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle, MapPin, Clock, Calendar, Package, Home, XCircle } from "lucide-react";
import { useReservationsStore } from "@/stores/reservationsStore";
import { useCatalogStore } from "@/stores/catalogStore";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { OrderStatusBadge } from "@/components/common/OrderStatusBadge";
import { OrderTimeline } from "@/components/common/OrderTimeline";
import { SafeImage } from "@/components/common/SafeImage";

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "GPX-00000";
  const { reservations, updateStatus } = useReservationsStore();
  const { restoreStock } = useCatalogStore();
  const [confirmCancel, setConfirmCancel] = useState(false);
  const reservation = reservations.find((r) => r.orderNumber === orderNumber) || reservations[0];

  if (!reservation) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Réservation introuvable</p>
        <Link href="/" className="text-purple-700 hover:underline mt-2 inline-block">Retour à l&apos;accueil</Link>
      </div>
    );
  }

  const canCancel = reservation.status === "nouvelle" || reservation.status === "en_preparation";

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Success header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre commande est <span className="text-[#22C55E]">réservée !</span></h1>
        <p className="text-gray-500">Merci pour votre achat. Vos articles sont en cours de préparation.</p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-green-600 font-medium">Réservation confirmée 48h</span>
        </div>
      </div>

      <div className="grid gap-6 mb-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left: order info */}
        <div className="space-y-4">
          {/* Order summary card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">N° de commande</p>
                <p className="text-base font-bold text-gray-900">{reservation.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Statut</p>
                <OrderStatusBadge status={reservation.status} size="sm" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Date</p>
                <p className="text-sm font-semibold text-gray-900">{new Date(reservation.createdAt).toLocaleDateString("fr-FR")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Total TTC</p>
                <p className="text-lg font-bold text-gray-900">{reservation.total.toFixed(2)} €</p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500 mb-2">Progression</p>
              <OrderTimeline status={reservation.status} />
            </div>
          </div>

          {/* Items list */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Articles commandés — {reservation.items.length}</h3>
            <div className="space-y-3">
              {reservation.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <SafeImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-50"
                    imageClassName="object-cover"
                    sizes="40px"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-gray-400">{item.product.brand} × {item.quantity}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-900">{(item.price * item.quantity).toFixed(2)} €</p>
                </div>
              ))}
            </div>
            <hr className="border-gray-100 my-3" />
            <div className="flex justify-between text-sm font-bold text-gray-900">
              <span>Total TTC</span>
              <span>{reservation.total.toFixed(2)} €</span>
            </div>
          </div>
        </div>

        {/* Right: store info */}
        <div className="space-y-4">
          {/* Store info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="relative h-[16.8rem] bg-gray-100 sm:h-[19.2rem]">
              <SafeImage
                src={reservation.store.image}
                alt={reservation.store.name}
                className="h-full w-full"
                imageClassName="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 720px"
                fallback={
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300">
                    <MapPin className="h-10 w-10" />
                  </div>
                }
              />
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">Magasin sélectionné</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900">{reservation.store.name}</h3>
              <div className="mt-3 space-y-2 text-sm text-gray-500">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-400" />
                  <span>{reservation.store.address}, {reservation.store.postalCode} {reservation.store.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Créneau : {reservation.pickupSlot.date.split("-").reverse().join("/")} — {reservation.pickupSlot.startTime} à {reservation.pickupSlot.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Préparation sous 1h environ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span>Réservation valable 48h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {canCancel && (
          <button
            type="button"
            onClick={() => setConfirmCancel(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-6 py-3 font-semibold text-red-600 transition-colors hover:bg-red-100"
          >
            <XCircle className="w-4 h-4" /> Annuler ma réservation
          </button>
        )}
        <Link href="/compte/reservations"
          className="flex items-center justify-center gap-2 bg-[#7C3AED] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#6D28D9] transition-colors">
          <Package className="w-4 h-4" /> Voir mes réservations
        </Link>
        <Link href="/"
          className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
          <Home className="w-4 h-4" /> Continuer mes achats
        </Link>
      </div>

      <ConfirmDialog
        open={confirmCancel}
        title="Annuler la réservation"
        message="Cette action annulera votre commande. Vous ne pourrez plus la retirer en magasin."
        confirmLabel="Oui, annuler"
        onConfirm={() => {
          restoreStock(reservation.items, reservation.store.id);
          updateStatus(reservation.id, "annulee");
          setConfirmCancel(false);
        }}
        onCancel={() => setConfirmCancel(false)}
        danger
      />
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" /></div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
