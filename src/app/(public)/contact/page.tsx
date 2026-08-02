"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, CheckCircle, Store, ChevronDown } from "lucide-react";
import { StoreCard } from "@/components/common/StoreCard";
import { useStoresStore } from "@/stores/storesStore";

const faq = [
  {
    q: "Comment fonctionne le Click & Collect ?",
    a: "Ajoutez vos produits au panier, choisissez votre magasin et votre créneau horaire. Une fois votre réservation confirmée, présentez-vous simplement en caisse avec votre numéro de commande. Le retrait est 100% gratuit.",
  },
  {
    q: "Puis-je me faire livrer à domicile ?",
    a: "Non. Goprix fonctionne exclusivement en Click & Collect. Ce choix nous permet de réduire nos coûts et de vous offrir des prix encore plus bas.",
  },
  {
    q: "Les produits sont-ils neufs et garantis ?",
    a: "Oui, tous nos produits sont neufs, sous emballage d'origine. Il n'y a aucun produit reconditionné ou abîmé.",
  },
  {
    q: "Comment annuler une réservation ?",
    a: "Rendez-vous dans Mon compte > Mes réservations et cliquez sur Annuler. Les annulations sont acceptées jusqu'à 1h avant le créneau de retrait.",
  },
  {
    q: "Puis-je payer en magasin ?",
    a: "Oui ! Votre réservation est gratuite et sans engagement. Vous payez uniquement au retrait, par CB, espèces, chèque, PayPal ou Apple Pay.",
  },
  {
    q: "Combien de temps puis-je garder ma réservation ?",
    a: "Vos articles sont réservés pendant 48h. Passé ce délai, la réservation est automatiquement annulée et les produits remis en vente.",
  },
];

export default function ContactPage() {
  const stores = useStoresStore((state) => state.stores);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", store: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSent(true);
  };

  type FormField = keyof typeof form;
  const set = (field: FormField) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value } as typeof f));

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8 flex items-center gap-1">
        <Link href="/" className="hover:text-purple-700">Accueil</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Contact</span>
      </nav>

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Comment pouvons-nous vous aider ?</h1>
        <p className="text-gray-500 max-w-xl mx-auto">Notre équipe répond du lundi au samedi de 9h à 18h. Nous nous engageons à vous répondre sous 24h ouvrées.</p>
      </div>

      {/* Contact cards */}
      <div className="grid sm:grid-cols-2 gap-5 mb-14">
        {[
          {
            icon: Phone,
            title: "Par téléphone",
            lines: ["07 65 16 83 47", "Lun–Sam  9h–18h"],
            color: "purple",
          },
          {
            icon: Mail,
            title: "Par email",
            lines: ["contact@goprix.fr", "Réponse sous 24h ouvrées"],
            color: "blue",
          },
        ].map(({ icon: Icon, title, lines, color }) => (
          <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
              color === "purple" ? "bg-purple-100" : color === "blue" ? "bg-blue-100" : "bg-green-100"
            }`}>
              <Icon className={`w-7 h-7 ${
                color === "purple" ? "text-purple-700" : color === "blue" ? "text-blue-700" : "text-green-700"
              }`} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
            {lines.map((l) => <p key={l} className="text-sm text-gray-500">{l}</p>)}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-10 mb-16">

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Envoyer un message</h2>

          {sent ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">Message envoyé !</h3>
              <p className="text-gray-500 text-sm">Nous vous répondrons dans les 24h ouvrées à l&apos;adresse <strong>{form.email}</strong>.</p>
              <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "", store: "" }); }}
                className="mt-5 text-sm text-purple-700 font-semibold hover:underline">
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Votre nom *</label>
                  <input required value={form.name} onChange={set("name")} placeholder="Jean Dupont"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Email *</label>
                  <input required type="email" value={form.email} onChange={set("email")} placeholder="jean@email.fr"
                    className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Magasin concerné</label>
                <select value={form.store} onChange={set("store")}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white">
                  <option value="">Tous les magasins / Général</option>
                  {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Sujet *</label>
                <select required value={form.subject} onChange={set("subject")}
                  className="w-full h-10 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white">
                  <option value="">Choisir un sujet...</option>
                  <option value="reservation">Question sur une réservation</option>
                  <option value="produit">Disponibilité d&apos;un produit</option>
                  <option value="retour">Retour / Réclamation</option>
                  <option value="partenariat">Partenariat / Presse</option>
                  <option value="autre">Autre demande</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Message *</label>
                <textarea required value={form.message} onChange={set("message")} rows={5}
                  placeholder="Décrivez votre demande en quelques mots..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none" />
              </div>
              <button type="submit" disabled={sending}
                className="w-full h-11 bg-purple-600 text-white rounded-xl font-semibold text-sm hover:bg-purple-700 transition-colors disabled:opacity-60">
                {sending ? "Envoi en cours..." : "Envoyer le message"}
              </button>
            </form>
          )}
        </div>

        {/* Stores quick list */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-5">Nos magasins</h2>
          {stores.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <Store className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">Aucun magasin disponible</p>
              <p className="text-sm text-gray-400 mt-1">Les magasins apparaîtront ici dès leur ajout par l&apos;administrateur.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stores.map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Questions fréquentes</h2>
        <div className="max-w-3xl mx-auto space-y-3">
          {faq.map(({ q, a }, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-sm pr-4">{q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              {openFaq === i && (
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
