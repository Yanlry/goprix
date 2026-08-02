"use client";

import Link from "next/link";
import { PlusCircle, ShoppingBag, Tag, Award, ArrowRight, CheckCircle } from "lucide-react";
import { useCatalogStore } from "@/stores/catalogStore";
import { useReservationsStore } from "@/stores/reservationsStore";

export default function AdminDashboard() {
  const { products, categories, brands } = useCatalogStore();
  const { reservations } = useReservationsStore();

  const activeProducts = products.filter((p) => p.isActive);
  const pendingOrders = reservations.filter((r) => r.status === "nouvelle" || r.status === "en_preparation");

  const setupDone = categories.length > 0 && brands.length > 0 && products.length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6 py-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bonjour 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Que souhaitez-vous faire aujourd'hui ?</p>
      </div>

      {/* Setup guide — visible seulement si le catalogue est incomplet */}
      {!setupDone && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
          <p className="text-sm font-bold text-purple-900 mb-3">Pour commencer, suivez ces 3 étapes :</p>
          <div className="space-y-2">
            {[
              { done: categories.length > 0, label: "Créer au moins une catégorie", href: "/administration/categories" },
              { done: brands.length > 0, label: "Ajouter au moins une marque", href: "/administration/marques" },
              { done: products.length > 0, label: "Ajouter votre premier produit", href: "/administration/produits/nouveau" },
            ].map(({ done, label, href }) => (
              <Link key={href} href={done ? "#" : href}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${done ? "opacity-50 cursor-default" : "bg-white hover:bg-purple-100"}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-green-500" : "bg-purple-200"}`}>
                  {done
                    ? <CheckCircle className="w-4 h-4 text-white" />
                    : <span className="text-xs font-bold text-purple-700">→</span>}
                </div>
                <span className={`text-sm font-medium ${done ? "line-through text-gray-400" : "text-gray-800"}`}>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 2 actions principales */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/administration/produits/nouveau"
          className="flex flex-col items-center justify-center gap-3 p-8 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200 group">
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <PlusCircle className="w-7 h-7" />
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">Ajouter un produit</p>
            <p className="text-purple-200 text-sm">Mettre un article en vente</p>
          </div>
        </Link>

        <Link href="/administration/commandes"
          className="flex flex-col items-center justify-center gap-3 p-8 bg-white border-2 border-gray-100 rounded-2xl hover:border-purple-200 hover:bg-purple-50 transition-colors group relative">
          {pendingOrders.length > 0 && (
            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingOrders.length}
            </span>
          )}
          <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-7 h-7 text-purple-700" />
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-gray-900">Commandes</p>
            <p className="text-gray-400 text-sm">
              {pendingOrders.length > 0
                ? `${pendingOrders.length} commande${pendingOrders.length > 1 ? "s" : ""} en attente`
                : "Aucune commande en attente"}
            </p>
          </div>
        </Link>
      </div>

      {/* Stats simples */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: activeProducts.length, label: "Produits en ligne", icon: PlusCircle, href: "/administration/produits" },
          { value: categories.length, label: "Catégories", icon: Tag, href: "/administration/categories" },
          { value: brands.length, label: "Marques", icon: Award, href: "/administration/marques" },
        ].map(({ value, label, icon: Icon, href }) => (
          <Link key={label} href={href}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-center hover:border-purple-200 hover:bg-purple-50 transition-colors group">
            <p className="text-3xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-gray-400 mt-1">{label}</p>
            <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-purple-500 mx-auto mt-2 transition-colors" />
          </Link>
        ))}
      </div>

      <Link href="/" target="_blank"
        className="flex items-center justify-center gap-2 py-3 text-sm text-gray-400 hover:text-purple-700 transition-colors">
        Voir le site public →
      </Link>
    </div>
  );
}
