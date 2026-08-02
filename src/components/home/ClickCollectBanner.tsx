"use client";

import Link from "next/link";
import { Store, Clock, BadgeCheck, CreditCard } from "lucide-react";
import { useStoresStore } from "@/stores/storesStore";

const steps = [
  { icon: Store, title: "Click & Collect uniquement", desc: "Retrait gratuit en magasin, aucune livraison à domicile" },
  { icon: Clock, title: "Commande prête sous 1h", desc: "Nous préparons votre commande rapidement" },
  { icon: BadgeCheck, title: "Réservation 48h", desc: "Votre commande est réservée pendant 48 heures" },
  { icon: CreditCard, title: "Paiement 100% sécurisé", desc: "CB, PayPal, Apple Pay, Google Pay" },
];

export function ClickCollectBanner() {
  const stores = useStoresStore((state) => state.stores);
  const storeText = stores.length > 0
    ? `dans ${stores.length} magasin${stores.length > 1 ? "s" : ""}`
    : "dans les magasins renseignés par l'administrateur";

  return (
    <section className="py-14 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div>
              <span className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                100% Click &amp; Collect
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Ne manquez aucune bonne affaire !
              </h2>
              <p className="text-gray-400 max-w-md">
                Nos produits sont exclusivement disponibles en Click &amp; Collect {storeText}. Commandez en ligne, retirez gratuitement.
              </p>
            </div>
            <Link
              href="/contact"
              className="flex-shrink-0 inline-flex items-center gap-2 bg-[#22C55E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#16A34A] transition-colors"
            >
              <Store className="w-4 h-4" /> Infos retrait
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#7C3AED]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
