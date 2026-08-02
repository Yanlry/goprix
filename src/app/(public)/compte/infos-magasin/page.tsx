"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, Store, ChevronDown } from "lucide-react";
import { StoreCard } from "@/components/common/StoreCard";
import { useStoresStore } from "@/stores/storesStore";

const faq = [
  { q: "Comment fonctionne le Click & Collect ?", a: "Ajoutez vos produits au panier, choisissez votre magasin et votre créneau horaire. Une fois votre réservation confirmée, présentez-vous simplement en caisse avec votre numéro de commande. Le retrait est 100% gratuit." },
  { q: "Combien de temps ma réservation est-elle valable ?", a: "Vos articles sont réservés pendant 48h. Passé ce délai, la réservation est automatiquement annulée et les produits remis en vente." },
  { q: "Puis-je payer en magasin ?", a: "Oui ! Votre réservation est gratuite et sans engagement. Vous payez uniquement au retrait, par CB, espèces, chèque, PayPal ou Apple Pay." },
];

export default function InfosMagasinPage() {
  const stores   = useStoresStore((s) => s.stores);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      <div>
        <nav className="text-xs text-gray-400 mb-1">
          <Link href="/compte" className="hover:text-purple-700">Mon compte</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-600">Infos magasin</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Infos magasin</h1>
      </div>

      {/* Contacts rapides */}
      <div className="grid sm:grid-cols-2 gap-3">
        {[
          { icon: Phone, label: "07 65 16 83 47", sub: "Lun–Sam 9h–18h", color: "bg-purple-50 text-purple-700" },
          { icon: Mail,  label: "contact@goprix.fr", sub: "Réponse sous 24h", color: "bg-blue-50 text-blue-700" },
        ].map(({ icon: Icon, label, sub, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{label}</p>
              <p className="text-xs text-gray-400">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Magasins */}
      <div>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Nos magasins</h2>
        {stores.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400">
            <Store className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">Aucun magasin disponible</p>
            <p className="text-sm mt-1">Les magasins apparaîtront ici dès leur ajout par l&apos;administrateur.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {stores.map((store) => <StoreCard key={store.id} store={store} />)}
          </div>
        )}
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Questions fréquentes</h2>
        <div className="space-y-2">
          {faq.map(({ q, a }, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                <span className="font-semibold text-gray-900 text-sm pr-4">{q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                  <p className="pt-3">{a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
