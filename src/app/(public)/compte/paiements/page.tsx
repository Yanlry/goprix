"use client";

import Link from "next/link";
import { CreditCard, Banknote, Smartphone, Store, Info } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const PAYMENT_METHODS = [
  {
    icon: CreditCard,
    label: "Carte bancaire",
    desc: "Visa, Mastercard, American Express",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Banknote,
    label: "Espèces",
    desc: "Paiement en liquide à la caisse",
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    icon: Smartphone,
    label: "Paiement sans contact",
    desc: "Apple Pay, Google Pay, Samsung Pay",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Store,
    label: "Chèque",
    desc: "Accepté dans certains magasins (renseignez-vous en caisse)",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

export default function PaiementsPage() {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <nav className="text-xs text-gray-400 mb-1">
          <Link href="/compte" className="hover:text-purple-700">Mon compte</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-600">Paiements</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Paiements</h1>
        <p className="text-gray-500 text-sm mt-1">Moyens de paiement acceptés dans nos magasins.</p>
      </div>

      {/* Info Click & Collect */}
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5 flex gap-3">
        <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-purple-800 mb-1">Paiement en magasin uniquement</p>
          <p className="text-sm text-purple-700">
            Goprix fonctionne en <strong>Click &amp; Collect</strong> : vous réservez en ligne gratuitement,
            puis vous payez directement en magasin au moment du retrait. Aucun prélèvement n&apos;est effectué
            lors de la réservation.
          </p>
        </div>
      </div>

      {/* Moyens de paiement */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">Moyens de paiement acceptés</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {PAYMENT_METHODS.map(({ icon: Icon, label, desc, color, bg }) => (
            <div key={label} className={`flex items-start gap-3 rounded-xl border border-gray-100 p-4`}>
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Processus */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-900 mb-4">Comment ça fonctionne ?</h2>
        <ol className="space-y-3">
          {[
            { step: "1", text: "Ajoutez vos articles au panier et réservez en ligne — c'est gratuit." },
            { step: "2", text: "Choisissez votre magasin et votre créneau de retrait." },
            { step: "3", text: "Votre commande est préparée et disponible sous 1h environ." },
            { step: "4", text: "Venez retirer vos articles et réglez en caisse au moment du retrait." },
          ].map(({ step, text }) => (
            <li key={step} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {step}
              </span>
              <p className="text-sm text-gray-700">{text}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 text-sm text-gray-500 text-center">
        Une question sur le paiement ?{" "}
        <Link href="/contact" className="text-purple-700 font-semibold hover:underline">
          Contactez-nous
        </Link>
      </div>
    </div>
  );
}
