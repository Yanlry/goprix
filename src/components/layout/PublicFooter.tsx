"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Share2 } from "lucide-react";
import { useStoresStore } from "@/stores/storesStore";

export function PublicFooter() {
  const stores = useStoresStore((state) => state.stores);
  const firstStore = stores[0];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter */}
      <div className="bg-[#7C3AED] py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white text-xl font-bold">Ne manquez aucune bonne affaire !</h3>
            <p className="text-purple-200 mt-1 text-sm">Recevez nos meilleures offres et nouveautés par e-mail.</p>
          </div>
          <form className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="Votre adresse e-mail"
              className="flex-1 md:w-64 h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-200 text-sm focus:outline-none focus:border-white"
            />
            <button
              type="submit"
              className="h-11 px-6 bg-white text-purple-700 font-semibold rounded-xl hover:bg-purple-50 transition-colors text-sm whitespace-nowrap"
            >
              S&apos;abonner
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <Image src="/logo.jpg" alt="Goprix" width={100} height={40} className="h-10 w-auto brightness-0 invert mb-4" />
          <p className="text-sm text-gray-400 leading-relaxed">
            Spécialiste du déstockage et surplus. Des milliers de produits à prix cassés, disponibles uniquement en Click &amp; Collect.
          </p>
          <div className="flex gap-3 mt-5">
            {["Facebook", "Instagram", "X", "YouTube"].map((name, i) => (
              <a key={i} href="#" aria-label={name} className="w-9 h-9 rounded-lg bg-white/5 hover:bg-purple-600 flex items-center justify-center transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Links 1 */}
        <div>
          <h4 className="text-white font-semibold mb-4">Nos produits</h4>
          <ul className="space-y-2 text-sm">
            {["Maison & Cuisine", "Électronique", "Beauté & Santé", "Sport & Loisirs", "Jardin & Bricolage", "Mode & Accessoires"].map((cat) => (
              <li key={cat}>
                <Link href="/categories" className="hover:text-white transition-colors">{cat}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links 2 */}
        <div>
          <h4 className="text-white font-semibold mb-4">Informations</h4>
          <ul className="space-y-2 text-sm">
            {[
              { label: "Contact & magasins", href: "/contact" },
              { label: "Nos promotions", href: "/promotions" },
              { label: "Nos marques", href: "/marques" },
              { label: "À propos", href: "/a-propos" },
              { label: "Recrutement", href: "/recrutement" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Click &amp; Collect</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <span>
                {stores.length > 0
                  ? `${stores.length} magasin${stores.length > 1 ? "s" : ""} renseigné${stores.length > 1 ? "s" : ""}`
                  : "Magasins bientôt disponibles"}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>{firstStore?.phone || "Téléphone à renseigner"}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>{firstStore?.email || "contact@goprix.fr"}</span>
            </li>
          </ul>
          <div className="mt-5 p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-gray-400 font-medium mb-1">Retrait gratuit sous 1h</p>
            <p className="text-xs text-gray-500">Commandez en ligne, retirez en magasin sans frais de livraison.</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2026 Goprix. Tous droits réservés. Spécialiste du déstockage.</p>
          <div className="flex gap-5">
            {["CGV", "Confidentialité", "Mentions légales", "Cookies"].map((l) => (
              <a key={l} href="#" className="hover:text-gray-300 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
