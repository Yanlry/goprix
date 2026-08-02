import Link from "next/link";
import { MapPin, Package, Tag, Recycle, Store, ShieldCheck, Truck, CheckCircle, Percent, Info } from "lucide-react";

export const metadata = { title: "À propos — Goprix" };

const steps = [
  { n: "1", icon: Package, title: "Sélection des stocks", desc: "Nos équipes achètent directement les surplus et fins de série auprès des fabricants et importateurs." },
  { n: "2", icon: Tag, title: "Prix jusqu'à −70%", desc: "Sans intermédiaire, l'économie réalisée à l'achat est répercutée directement sur le prix affiché." },
  { n: "3", icon: ShieldCheck, title: "Qualité vérifiée", desc: "Chaque article est neuf, sous emballage d'origine." },
  { n: "4", icon: Store, title: "Click & Collect", desc: "Réservez en ligne et retirez gratuitement en magasin sous quelques heures. Zéro frais." },
];

const values = [
  { icon: Tag, title: "Prix imbattables", desc: "30 à 70 % de remise grâce à l'achat direct de surplus, sans intermédiaire.", bg: "bg-purple-100", color: "text-purple-700" },
  { icon: ShieldCheck, title: "Qualité garantie", desc: "Produits neufs sous emballage d'origine.", bg: "bg-blue-100", color: "text-blue-700" },
  { icon: Recycle, title: "Économie circulaire", desc: "En rachetant des stocks dormants, nous évitons leur destruction et réduisons le gaspillage.", bg: "bg-green-100", color: "text-green-700" },
  { icon: Truck, title: "Click & Collect", desc: "Retrait gratuit en magasin, préparation rapide, aucun frais de livraison ni frais caché.", bg: "bg-orange-100", color: "text-orange-700" },
];

const checks = [
  "Produits neufs, jamais reconditionnés ni endommagés",
  "Stocks renouvelés régulièrement avec de nouvelles marques",
  "Transparence totale sur les remises et les prix d'origine",
  "Remises imbattables de 30 à 70 %",
];

export default function AProposPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-purple-700">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">À propos</span>
      </nav>

      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] p-7 shadow-xl shadow-purple-200/60 sm:p-9 mb-12">
        <div className="relative z-10 flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div className="text-white">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-purple-100 ring-1 ring-white/20">
              <Percent className="h-3.5 w-3.5" />
              Spécialiste du déstockage
            </div>
            <h1 className="max-w-2xl text-2xl font-black leading-tight sm:text-3xl">
              Grandes marques à prix déstockés,<br className="hidden sm:block" /> disponibles en Click &amp; Collect
            </h1>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium text-purple-100">
              {["Click & Collect gratuit", "Produits 100% neufs", "Remises jusqu'à −70%"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/15">
                  <CheckCircle className="h-4 w-4 text-green-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="shrink-0 rounded-2xl bg-white p-5 text-center shadow-2xl shadow-purple-950/20 sm:min-w-36">
            <p className="mb-1 text-sm font-bold text-purple-700">Jusqu&apos;à</p>
            <p className="text-5xl font-black leading-none text-gray-950">-70%</p>
            <p className="text-xs text-gray-400 mt-1">sur des produits neufs</p>
          </div>
        </div>
      </div>

      {/* Notre concept */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <Info className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Notre concept</h2>
            <p className="text-sm text-gray-500">Comment Goprix fonctionne</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-gray-600 leading-relaxed mb-4">
            Goprix est une enseigne de déstockage spécialisée dans la vente de produits de grandes marques à prix réduits. Nous travaillons directement avec les fabricants et importateurs pour racheter leurs surplus, fins de série et surproductions, que nous mettons ensuite à disposition via notre service Click &amp; Collect.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Le principe est simple : <strong className="text-gray-900">pas d&apos;intermédiaire, des prix honnêtes</strong>. Vous faites jusqu&apos;à 70 % d&apos;économies sur des produits neufs et garantis que les grandes enseignes ne peuvent plus ou ne souhaitent plus vendre. Chaque année, des millions d&apos;articles neufs sont détruits faute de débouchés — Goprix les intercepte et vous les propose à prix cassés.
          </p>
        </div>
      </div>

      {/* Comment ça marche */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Comment ça marche ?</h2>
        <p className="text-gray-500 mb-6">De la sélection du stock jusqu&apos;à votre retrait en magasin</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map(({ n, icon: Icon, title, desc }) => (
            <div key={n} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center font-bold flex-shrink-0">{n}</div>
                <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-purple-600" />
                </div>
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nos engagements */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Nos engagements</h2>
        <p className="text-gray-500 mb-6">Ce qui nous différencie</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map(({ icon: Icon, title, desc, bg, color }) => (
            <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1.5">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Garanties */}
      <div className="mb-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Ce que vous pouvez attendre de nous</h2>
              <p className="text-sm text-gray-500">Nos engagements concrets</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {checks.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Info rapide */}
      <div className="grid sm:grid-cols-4 gap-3 mb-12">
        {[
          { icon: "🏪", title: "Click & Collect uniquement", desc: "Retrait gratuit en magasin" },
          { icon: "⚡", title: "Commande prête sous 1h", desc: "Préparation rapide" },
          { icon: "📦", title: "Produits 100% neufs", desc: "Emballage d'origine" },
          { icon: "🔒", title: "Paiement sécurisé", desc: "CB, PayPal, Apple Pay" },
        ].map(({ icon, title, desc }) => (
          <div key={title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
            <p className="text-2xl mb-1.5">{icon}</p>
            <p className="text-xs font-semibold text-gray-900">{title}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <p className="text-lg font-bold text-gray-900 mb-2">Prêt à faire de bonnes affaires ?</p>
        <p className="text-sm text-gray-500 mb-4">
          Parcourez notre catalogue, réservez en quelques clics et retirez en magasin. Gratuit, sans engagement.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/categories"
            className="inline-flex items-center justify-center gap-2 bg-[#22C55E] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#16A34A] transition-colors">
            <Package className="w-4 h-4" /> Voir les produits
          </Link>
          <Link href="/contact"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white text-gray-700 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
            <MapPin className="w-4 h-4" /> Nous contacter
          </Link>
        </div>
      </div>

    </div>
  );
}
