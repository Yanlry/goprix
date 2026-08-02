"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import { useFavoritesStore } from "@/stores/favoritesStore";

export default function CompteFavorisPage() {
  const { items } = useFavoritesStore();

  return (
    <div className="space-y-5">
      <div>
        <nav className="text-xs text-gray-400 mb-1">
          <Link href="/compte" className="hover:text-purple-700">Mon compte</Link>
          <span className="mx-1">/</span>
          <span className="text-gray-600">Mes favoris</span>
        </nav>
        <h1 className="text-2xl font-bold text-gray-900">Mes favoris ({items.length})</h1>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center text-gray-400">
          <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Aucun favori pour l&apos;instant</p>
          <Link href="/categories" className="text-purple-700 text-sm hover:underline mt-1 inline-block">
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
