"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useFavoritesStore } from "@/stores/favoritesStore";

export default function FavorisPage() {
  const { items } = useFavoritesStore();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-purple-700">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Mes favoris</span>
      </nav>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes favoris ({items.length})</h1>
      {items.length === 0 ? (
        <EmptyState icon={Heart} title="Aucun favori pour l'instant" description="Ajoutez des produits à vos favoris pour les retrouver facilement." action={{ label: "Découvrir nos produits", href: "/categories" }} />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
