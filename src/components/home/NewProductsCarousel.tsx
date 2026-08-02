"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import { useCatalogStore } from "@/stores/catalogStore";

export function NewProductsCarousel() {
  const products = useCatalogStore((s) => s.products);
  // Les produits sont ajoutés en tête de tableau → les premiers sont les plus récents
  const newProducts = products.filter((p) => p.isActive).slice(0, 6);

  if (newProducts.length === 0) return null;

  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Nos nouveautés</h2>
            <p className="text-sm text-gray-500 mt-1">Les derniers arrivages en stock</p>
          </div>
          <Link href="/nouveautes" className="text-sm font-semibold text-purple-700 hover:underline flex items-center gap-1">
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
