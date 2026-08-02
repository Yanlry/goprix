"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, CheckCircle, ArrowRight } from "lucide-react";
import { StoreCard } from "@/components/common/StoreCard";
import { SafeImage } from "@/components/common/SafeImage";
import { useCartStore } from "@/stores/cartStore";
import { useStorePickerStore } from "@/stores/storePickerStore";
import { useReservationsStore } from "@/stores/reservationsStore";
import { useStoresStore } from "@/stores/storesStore";
import { useCatalogStore } from "@/stores/catalogStore";
import { useAuthStore } from "@/stores/authStore";
import type { PickupSlot, Reservation, Store } from "@/types";

const CALENDAR_DAYS_TO_SHOW = 30;
const SLOT_DURATION_MINUTES = 60;

interface CalendarDay {
  date: string;
  weekday: string;
  day: string;
  month: string;
  isClosed: boolean;
  isDisabled: boolean;
  disabledLabel: string;
  slots: PickupSlot[];
}

function toLocalDateString(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseTimeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null;
  return hours * 60 + minutes;
}

function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}

function getStoreHoursForDate(store: Store, date: Date) {
  const fullDay = new Intl.DateTimeFormat("fr-FR", { weekday: "long" }).format(date);
  const dayName = fullDay.charAt(0).toUpperCase() + fullDay.slice(1);
  return store.hours.find((item) => item.day === dayName);
}

function buildSlotsForDate(store: Store, date: Date, now: Date): PickupSlot[] {
  const hours = getStoreHoursForDate(store, date);

  if (!hours || hours.isClosed || !hours.open || !hours.close) return [];

  const open = parseTimeToMinutes(hours.open);
  const close = parseTimeToMinutes(hours.close);

  if (open === null || close === null || close <= open) return [];

  const dateString = toLocalDateString(date);
  const isToday = dateString === toLocalDateString(now);
  const minimumStart = isToday
    ? now.getHours() * 60 + now.getMinutes() + store.clickAndCollectDelay * 60
    : open;

  const slots: PickupSlot[] = [];
  for (let start = open; start + SLOT_DURATION_MINUTES <= close; start += SLOT_DURATION_MINUTES) {
    if (start < minimumStart) continue;
    slots.push({
      date: dateString,
      startTime: formatMinutes(start),
      endTime: formatMinutes(start + SLOT_DURATION_MINUTES),
    });
  }

  return slots;
}

function buildCalendarDays(store: Store | null): CalendarDay[] {
  if (!store) return [];

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return Array.from({ length: CALENDAR_DAYS_TO_SHOW }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    const hours = getStoreHoursForDate(store, date);
    const slots = buildSlotsForDate(store, date, now);
    const isClosed = !hours || hours.isClosed || !hours.open || !hours.close;

    return {
      date: toLocalDateString(date),
      weekday: new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(date).replace(".", ""),
      day: new Intl.DateTimeFormat("fr-FR", { day: "2-digit" }).format(date),
      month: new Intl.DateTimeFormat("fr-FR", { month: "short" }).format(date).replace(".", ""),
      isClosed,
      isDisabled: isClosed || slots.length === 0,
      disabledLabel: isClosed ? "Fermé" : "Complet",
      slots,
    };
  });
}

export default function RetraitPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const stores = useStoresStore((state) => state.stores);

  useEffect(() => {
    if (!user) router.push("/connexion?redirect=/retrait");
  }, [user, router]);

  if (!user) return null;
  const [query, setQuery] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<PickupSlot | null>(null);

  const { items, total, clearCart } = useCartStore();
  const { setStore, setSlot } = useStorePickerStore();
  const { addReservation } = useReservationsStore();
  const { reduceStock } = useCatalogStore();

  const filteredStores = stores.filter((s) =>
    `${s.name} ${s.city} ${s.postalCode}`.toLowerCase().includes(query.toLowerCase())
  );
  const selectedStore = stores.find((store) => store.id === selectedStoreId) || stores[0] || null;
  const calendarDays = useMemo(() => buildCalendarDays(selectedStore), [selectedStore]);
  const firstAvailableDate = calendarDays.find((day) => !day.isDisabled)?.date;
  const activeDate = calendarDays.some((day) => day.date === selectedDate && !day.isDisabled)
    ? selectedDate
    : firstAvailableDate || calendarDays[0]?.date || "";
  const activeDay = calendarDays.find((day) => day.date === activeDate);
  const slotsForDate = activeDay?.slots || [];

  const handleSelectStore = (storeId: string) => {
    setSelectedStoreId(storeId);
    setSelectedDate(null);
    setSelectedSlot(null);
  };

  const handleConfirm = () => {
    if (!selectedStore || !selectedSlot) return;
    setStore(selectedStore);
    setSlot(selectedSlot);

    const reservation: Reservation = {
      id: crypto.randomUUID(),
      orderNumber: `GPX-${Math.floor(10000 + Math.random() * 90000)}`,
      status: "nouvelle",
      items: items.map((i) => ({ product: i.product, quantity: i.quantity, price: i.product.price })),
      store: selectedStore,
      pickupSlot: selectedSlot,
      total: total(),
      discount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: user.id,
      customerEmail: user.email,
      customerName: `${user.firstName} ${user.lastName}`,
    };
    addReservation(reservation);
    reduceStock(reservation.items, selectedStore.id);
    clearCart();
    router.push(`/reservation/confirmation?order=${reservation.orderNumber}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/">Accueil</Link>
        <span className="mx-2">/</span>
        <Link href="/panier" className="hover:text-purple-700">Panier</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Choisir le retrait</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        1. Choisissez votre <span className="text-[#7C3AED]">point de retrait</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: step 1 + step 2 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store selection */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">1</div>
              Sélectionner un magasin
            </h2>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher par ville ou code postal"
                className="w-full pl-9 pr-4 h-10 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
            </div>

            <div className="mb-4 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
              <SafeImage
                src={selectedStore?.image}
                alt={selectedStore ? selectedStore.name : "Point de retrait"}
                className="h-80 w-full sm:h-[26.5rem]"
                imageClassName="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 900px"
              />
              {selectedStore && (
                <div className="border-t border-white/20 bg-gray-950 px-4 py-3 text-white">
                  <p className="text-sm font-bold">{selectedStore.name}</p>
                  <p className="text-xs text-white/75">
                    {selectedStore.address}, {selectedStore.postalCode} {selectedStore.city}
                  </p>
                </div>
              )}
            </div>

            {stores.length === 0 ? (
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-700">
                Aucun point de retrait n&apos;est disponible pour le moment.
              </div>
            ) : filteredStores.length === 0 ? (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500">
                Aucun magasin ne correspond à votre recherche.
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {filteredStores.map((store) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    selected={selectedStore?.id === store.id}
                    onSelect={() => handleSelectStore(store.id)}
                    compact
                  />
                ))}
              </div>
            )}
          </div>

          {/* Slot selection */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold">2</div>
              Choisir vos créneaux de retrait
            </h2>

            {/* Calendar */}
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {calendarDays.map((calendarDay) => (
                <button
                  key={calendarDay.date}
                  type="button"
                  disabled={calendarDay.isDisabled}
                  onClick={() => { setSelectedDate(calendarDay.date); setSelectedSlot(null); }}
                  className={`flex-shrink-0 w-16 h-20 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${
                    activeDate === calendarDay.date && !calendarDay.isDisabled
                      ? "border-purple-500 bg-purple-600 text-white"
                      : calendarDay.isDisabled
                        ? "border-gray-100 bg-gray-100 text-gray-300 cursor-not-allowed"
                        : "border-gray-100 bg-white text-gray-700 hover:border-purple-200"
                  }`}
                >
                  <span className="text-xs capitalize opacity-70">{calendarDay.weekday}</span>
                  <span className="text-lg font-bold leading-tight">{calendarDay.day}</span>
                  <span className="text-[10px] capitalize opacity-70">{calendarDay.month}</span>
                  {calendarDay.isDisabled && (
                    <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wide">
                      {calendarDay.disabledLabel}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Time slots */}
            {slotsForDate.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {slotsForDate.map((slot, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                      selectedSlot === slot
                        ? "border-purple-500 bg-purple-600 text-white"
                        : "border-gray-100 text-gray-700 hover:border-purple-200"
                    }`}
                  >
                    {slot.startTime}–{slot.endTime}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                {selectedStore
                  ? "Aucun créneau disponible sur cette période."
                  : "Sélectionnez un magasin pour afficher les créneaux."}
              </p>
            )}

            {selectedSlot && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-sm text-green-700">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                Créneau sélectionné : {selectedSlot.date.split("-").reverse().join("/")} de {selectedSlot.startTime} à {selectedSlot.endTime}
              </div>
            )}
          </div>

          {/* Info blocks */}
          <div className="grid sm:grid-cols-4 gap-3">
            {[
              { icon: "🏪", title: "Click & Collect uniquement", desc: "Retrait gratuit en magasin" },
              { icon: "⚡", title: "Commande prête sous 1h", desc: "Préparation rapide" },
              { icon: "📱", title: "Réservation 48h", desc: "Retrait sous 48h" },
              { icon: "🔒", title: "Paiement 100% sécurisé", desc: "CB, PayPal, Apple Pay" },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
                <p className="text-2xl mb-1.5">{icon}</p>
                <p className="text-xs font-semibold text-gray-900">{title}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: order summary */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Récapitulatif de la commande</h3>
            <div className="space-y-3 mb-4 max-h-56 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <SafeImage
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="h-10 w-10 flex-shrink-0 rounded-lg bg-gray-50"
                    imageClassName="object-cover"
                    sizes="40px"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-gray-400">x{item.quantity}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-900 flex-shrink-0">
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </p>
                </div>
              ))}
            </div>
            <hr className="border-gray-100 mb-3" />
            <div className="space-y-1.5 text-sm mb-4">
              <div className="flex justify-between text-gray-500">
                <span>Sous-total</span>
                <span>{total().toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Retrait C&amp;C</span>
                <span className="font-semibold">GRATUIT</span>
              </div>
              <hr className="border-gray-100 my-1" />
              <div className="flex justify-between font-bold text-gray-900 text-base">
                <span>Total TTC</span>
                <span>{total().toFixed(2)} €</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 rounded-xl p-3 mb-4">
              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
              Paiement garanti sécurisé. Annulation possible avant retrait.
            </div>

            <button
              onClick={handleConfirm}
              disabled={!selectedStore || !selectedSlot || items.length === 0 || stores.length === 0}
              className="w-full h-12 bg-[#7C3AED] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#6D28D9] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
            >
              Continuer et valider ma réservation
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
