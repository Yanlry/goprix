"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, CheckCircle } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuthStore } from "@/stores/authStore";

/* ── Store local de préférences ── */
interface NotifPrefs {
  orderReady:   boolean;
  orderUpdated: boolean;
  promotions:   boolean;
  newProducts:  boolean;
  toggle: (key: keyof Omit<NotifPrefs, "toggle">) => void;
}

const useNotifStore = create<NotifPrefs>()(
  persist(
    (set) => ({
      orderReady:   true,
      orderUpdated: true,
      promotions:   false,
      newProducts:  false,
      toggle: (key) => set((s) => ({ [key]: !s[key] })),
    }),
    { name: "goprix-notif-prefs" }
  )
);

/* ── Composant Toggle ── */
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-1 ${
        checked ? "bg-purple-600" : "bg-gray-200"
      }`}
    >
      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`} />
    </button>
  );
}

/* ── Page ── */
const PREFS = [
  {
    key: "orderReady" as const,
    label: "Commande prête",
    desc: "Soyez averti quand votre commande est prête à être retirée en magasin.",
    badge: "Recommandé",
  },
  {
    key: "orderUpdated" as const,
    label: "Suivi de commande",
    desc: "Recevez une notification à chaque changement de statut de votre réservation.",
    badge: null,
  },
  {
    key: "promotions" as const,
    label: "Promotions & soldes",
    desc: "Soyez le premier informé de nos offres spéciales et codes promo exclusifs.",
    badge: null,
  },
  {
    key: "newProducts" as const,
    label: "Nouveaux produits",
    desc: "Découvrez les nouveautés et les arrivages en avant-première.",
    badge: null,
  },
];

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const { orderReady, orderUpdated, promotions, newProducts, toggle } = useNotifStore();
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const values = { orderReady, orderUpdated, promotions, newProducts };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <nav className="text-xs text-gray-400 mb-1">
          <Link href="/compte" className="hover:text-purple-700">Mon compte</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-600">Notifications</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-500 text-sm mt-1">Choisissez les alertes que vous souhaitez recevoir.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
        {PREFS.map(({ key, label, desc, badge }) => (
          <div key={key} className="flex items-start justify-between gap-4 p-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                {badge && (
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
            <div className="flex-shrink-0 pt-0.5">
              <Toggle checked={values[key]} onChange={() => toggle(key)} />
            </div>
          </div>
        ))}
      </div>

      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Préférences enregistrées !
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3">
        <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700">
          Les notifications de commande sont envoyées par email à <strong>{user.email}</strong>.
          Pour changer d&apos;adresse, contactez-nous.
        </p>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave}
          className="flex items-center gap-2 px-6 h-11 bg-[#7C3AED] text-white rounded-xl font-semibold hover:bg-[#6D28D9] transition-colors">
          <CheckCircle className="w-4 h-4" />
          Enregistrer mes préférences
        </button>
      </div>
    </div>
  );
}
