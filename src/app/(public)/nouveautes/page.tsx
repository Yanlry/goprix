"use client";

import Link from "next/link";
import { Sparkles, Package } from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import { useCatalogStore } from "@/stores/catalogStore";

export default function NouveautesPage() {
  const products = useCatalogStore((s) => s.products);
  // Tous les produits actifs, du plus récent au plus ancien
  const newProducts = products.filter((p) => p.isActive);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-purple-700">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Nouveautés</span>
      </nav>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nouveautés</h1>
          <p className="text-sm text-gray-500">Les derniers arrivages en déstockage</p>
        </div>
      </div>

      {newProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-lg font-semibold text-gray-400">Aucune nouveauté</p>
          <p className="text-sm text-gray-400 mt-1">Revenez bientôt pour découvrir nos derniers arrivages.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {newProducts.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
