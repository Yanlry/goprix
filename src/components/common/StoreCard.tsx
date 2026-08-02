"use client";

import {
  Car,
  CheckCircle,
  CreditCard,
  Mail,
  MapPin,
  Phone,
  Store as StoreIcon,
} from "lucide-react";
import { SafeImage } from "@/components/common/SafeImage";
import type { Store } from "@/types";

interface Props {
  store: Store;
  selected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
}

function todayLabel() {
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long" });
  return today.charAt(0).toUpperCase() + today.slice(1);
}

function StoreImage({
  store,
  className = "",
  mode = "cover",
}: {
  store: Store;
  className?: string;
  mode?: "cover" | "contain";
}) {
  return (
    <SafeImage
      src={store.image}
      alt={store.name}
      className={className}
      imageClassName={mode === "contain" ? "object-contain" : "object-cover"}
      sizes={mode === "contain" ? "400px" : "80px"}
      fallback={
        <div className="flex h-full w-full items-center justify-center text-gray-300">
          <StoreIcon className="h-8 w-8" />
        </div>
      }
    />
  );
}

export function StoreCard({ store, selected, onSelect, compact }: Props) {
  const currentDay = todayLabel();
  const todayHours = store.hours.find((hour) => hour.day === currentDay);

  if (compact) {
    return (
      <button
        onClick={onSelect}
        className={`w-full text-left p-3.5 rounded-xl border-2 transition-all ${
          selected ? "border-purple-500 bg-purple-50" : "border-gray-100 hover:border-purple-200 bg-white"
        }`}
      >
        <div className="flex items-start gap-3">
          <StoreImage store={store} className="w-14 h-14 rounded-xl flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-900 truncate">{store.name}</p>
              {selected && <CheckCircle className="w-4 h-4 text-purple-600 flex-shrink-0" />}
            </div>
            <p className="text-xs text-gray-500 truncate">{store.address}</p>
            <p className="text-xs text-gray-500">{store.postalCode} {store.city}</p>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
              {todayHours && todayHours.isClosed ? (
                <span className="text-red-500">Fermé aujourd&apos;hui</span>
              ) : todayHours ? (
                <span className="text-green-700">Ouvert {todayHours.open} - {todayHours.close}</span>
              ) : null}
              <span className="text-purple-700 font-semibold">Retrait {store.clickAndCollectDelay}h</span>
            </div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${
      selected ? "border-purple-500 shadow-purple-100" : "border-gray-100 hover:border-gray-200"
    }`}>
      <div className="relative bg-gray-100">
        <StoreImage store={store} className="w-full min-h-48" mode="contain" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent p-4 pt-16">
          <div className="flex items-end justify-between gap-3">
          <div>
            <h3 className="font-black text-white text-lg">{store.name}</h3>
            <p className="text-xs text-white/80">{store.postalCode} {store.city}</p>
          </div>
          <span className="shrink-0 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg">
            Retrait {store.clickAndCollectDelay}h
          </span>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        <div className="grid sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <span>{store.address}<br />{store.postalCode} {store.city}</span>
          </div>
          <div className="space-y-2">
            <a href={`tel:${store.phone}`} className="flex items-center gap-2 text-purple-700 hover:underline">
              <Phone className="w-4 h-4 text-gray-400" />
              {store.phone}
            </a>
            <a href={`mailto:${store.email}`} className="flex items-center gap-2 text-purple-700 hover:underline break-all">
              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              {store.email}
            </a>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Horaires</p>
          <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1">
            {store.hours.map((hour) => (
              <div key={hour.day} className={`flex justify-between gap-3 text-xs ${hour.day === currentDay ? "font-bold text-purple-700" : "text-gray-600"}`}>
                <span>{hour.day}</span>
                <span>{hour.isClosed ? "Fermé" : `${hour.open} - ${hour.close}`}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Services</p>
            <div className="flex flex-wrap gap-2">
              {store.services.map((service) => (
                <span key={service} className="bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-lg">
                  {service}
                </span>
              ))}
              {store.hasParking && (
                <span className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Car className="w-3 h-3" /> Parking
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Paiement</p>
            <div className="flex flex-wrap gap-2">
              {store.paymentMethods.map((payment) => (
                <span key={payment} className="bg-purple-50 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> {payment}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <a href={`tel:${store.phone}`} className="flex-1 h-10 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2 transition-colors">
            <Phone className="w-4 h-4" /> Appeler
          </a>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(`${store.address} ${store.postalCode} ${store.city}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-10 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 flex items-center justify-center gap-2 transition-colors"
          >
            <MapPin className="w-4 h-4" /> Itinéraire
          </a>
          {onSelect && (
            <button onClick={onSelect} className={`flex-1 h-10 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              selected ? "bg-purple-100 text-purple-700" : "bg-purple-600 text-white hover:bg-purple-700"
            }`}>
              <CheckCircle className="w-4 h-4" />
              {selected ? "Sélectionné" : "Choisir"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
