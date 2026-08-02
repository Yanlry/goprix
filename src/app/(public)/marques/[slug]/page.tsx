"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Package, Tag } from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import { useCatalogStore } from "@/stores/catalogStore";
import { useStoresStore } from "@/stores/storesStore";
import { getTotalStockForStores } from "@/lib/stock";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BrandProductsPage({ params }: Props) {
  const { slug } = use(params);
  const { brands, products } = useCatalogStore();
  const stores = useStoresStore((state) => state.stores);

  const brand = brands.find((item) => item.slug === slug);
  const brandName = brand?.name || slug.replace(/-/g, " ");
  const brandProducts = products.filter(
    (product) =>
      product.isActive &&
      getTotalStockForStores(product.stockByStore, stores) > 0 &&
      (product.brandSlug === slug || product.brand === brand?.name)
  );

  if (!brand && brandProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-700 mb-2">Marque introuvable</h1>
        <p className="text-gray-400 text-sm mb-6">Cette marque n&apos;existe pas ou n&apos;a plus de produits en stock.</p>
        <Link href="/marques" className="inline-flex items-center gap-2 text-purple-700 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Retour aux marques
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-purple-700">Accueil</Link>
        <span>/</span>
        <Link href="/marques" className="hover:text-purple-700">Nos marques</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium capitalize">{brandName}</span>
      </nav>

      <div className="mb-8 rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-50 to-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100">
              {brand?.logo ? (
                <img src={brand.logo} alt={brand.name} className="h-full w-full object-contain" />
              ) : (
                <span className="text-2xl font-black text-purple-300">{brandName.slice(0, 2).toUpperCase()}</span>
              )}
            </div>
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-purple-700">
                <Tag className="h-3.5 w-3.5" />
                Marque
              </div>
              <h1 className="text-3xl font-black capitalize text-gray-950">{brandName}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Tous les produits disponibles en Click &amp; Collect pour cette marque.
              </p>
            </div>
          </div>
          <div className="rounded-2xl bg-white px-5 py-4 text-center shadow-sm ring-1 ring-gray-100">
            <p className="text-3xl font-black text-purple-700">{brandProducts.length}</p>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              produit{brandProducts.length > 1 ? "s" : ""} en stock
            </p>
          </div>
        </div>
      </div>

      {brandProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mb-12">
          <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-lg font-semibold text-gray-400">Aucun produit en stock</p>
          <p className="text-sm text-gray-400 mt-1">Revenez plus tard pour les prochains arrivages de cette marque.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-12">
          {brandProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
