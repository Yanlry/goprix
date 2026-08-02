"use client";

import Link from "next/link";
import { ArrowRight, Search, Package, Tag, Timer } from "lucide-react";
import { useState } from "react";
import { useCatalogStore } from "@/stores/catalogStore";
import { useStoresStore } from "@/stores/storesStore";
import { getTotalStockForStores } from "@/lib/stock";
import type { Brand } from "@/types";

export default function MarquesPage() {
  const { brands, products } = useCatalogStore();
  const stores = useStoresStore((state) => state.stores);
  const [query, setQuery] = useState("");

  const filtered = brands.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase())
  );

  const stockedProductCount = (brand: Brand) =>
    products.filter(
      (product) =>
        product.isActive &&
        getTotalStockForStores(product.stockByStore, stores) > 0 &&
        (product.brandSlug === brand.slug || product.brand === brand.name)
    ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-purple-700">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Nos marques</span>
      </nav>

      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl p-8 md:p-12 mb-10 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Les plus grandes marques</h1>
            <p className="text-purple-200">à prix déstockés</p>
            <div className="flex flex-wrap gap-5 mt-4 text-sm text-purple-200">
              <span className="flex items-center gap-1.5"><Tag className="w-4 h-4" /> Jusqu&apos;à -70%</span>
              <span className="flex items-center gap-1.5"><Package className="w-4 h-4" /> Produits 100% officiels</span>
              <span className="flex items-center gap-1.5"><Timer className="w-4 h-4" /> Stocks limités</span>
            </div>
          </div>
          <div className="text-right bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
            <p className="text-4xl font-black">{brands.length}</p>
            <p className="text-purple-200 text-sm">marque{brands.length > 1 ? "s" : ""} partenaire{brands.length > 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Toutes nos marques</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher une marque..."
            className="pl-9 pr-4 h-9 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 w-48"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mb-12">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-lg font-semibold text-gray-400">
            {query ? "Aucune marque trouvée" : "Aucune marque"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {query ? "Essayez un autre terme de recherche." : "L&apos;administrateur n&apos;a pas encore ajouté de marques."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          {filtered.map((brand) => {
            const count = stockedProductCount(brand);
            const cardClassName = `group bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col items-center gap-3 transition-all ${
              count > 0
                ? "hover:-translate-y-1 hover:shadow-lg hover:border-purple-200"
                : "opacity-75"
            }`;
            const cardContent = (
              <>
                <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <span className="text-xl font-black text-gray-400 group-hover:text-purple-600 transition-colors">
                      {brand.name.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">{brand.name}</p>
                  <p className={`mt-1 text-xs font-semibold ${count > 0 ? "text-green-700" : "text-gray-400"}`}>
                    {count} produit{count > 1 ? "s" : ""} en stock
                  </p>
                  {brand.discount && (
                    <span className="inline-block mt-2 text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                      -{brand.discount}%
                    </span>
                  )}
                </div>
                <span className={`mt-auto inline-flex items-center gap-1.5 text-xs font-bold ${
                  count > 0 ? "text-purple-700" : "text-gray-400"
                }`}>
                  {count > 0 ? "Voir les produits" : "Aucun stock"}
                  {count > 0 && <ArrowRight className="w-3.5 h-3.5" />}
                </span>
              </>
            );

            return count > 0 ? (
              <Link key={brand.id} href={`/marques/${brand.slug}`} className={cardClassName}>
                {cardContent}
              </Link>
            ) : (
              <div key={brand.id} aria-disabled className={cardClassName}>
                {cardContent}
              </div>
            );
          })}
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <p className="text-lg font-bold text-gray-900 mb-2">Retrait gratuit dans nos magasins Goprix</p>
        <p className="text-sm text-gray-500 mb-4">
          {stores.length > 0
            ? `Disponible uniquement en Click & Collect dans ${stores.length} magasin${stores.length > 1 ? "s" : ""}`
            : "Les points de retrait apparaîtront dès qu'ils seront ajoutés par l'administrateur"}
        </p>
        <Link href="/contact" className="inline-flex items-center gap-2 bg-[#22C55E] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#16A34A] transition-colors">
          Voir les informations magasin
        </Link>
      </div>
    </div>
  );
}
