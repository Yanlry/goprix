"use client";

import Link from "next/link";
import { Heart, ShoppingCart, MapPin, Package } from "lucide-react";
import type { Product } from "@/types";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useStoresStore } from "@/stores/storesStore";
import { getTotalStockForStores } from "@/lib/stock";

interface ProductCardProps {
  product: Product;
  view?: "grid" | "list";
}

function isValidImageUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("/") || url.startsWith("data:");
}

function ProductImage({ src, alt, className }: { src: string | undefined; alt: string; className?: string }) {
  if (!isValidImageUrl(src)) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 ${className ?? ""}`}>
        <Package className="w-8 h-8 text-gray-300" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className ?? ""}`}
      onError={(e) => {
        const parent = (e.currentTarget as HTMLImageElement).parentElement;
        if (parent) {
          (e.currentTarget as HTMLImageElement).style.display = "none";
          const ph = document.createElement("div");
          ph.className = "w-full h-full flex items-center justify-center bg-gray-100";
          ph.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8l-2 4h12l-2-4z"/></svg>`;
          parent.appendChild(ph);
        }
      }}
    />
  );
}

export function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isFavorite } = useFavoritesStore();
  const stores = useStoresStore((s) => s.stores);
  const fav = isFavorite(product.id);
  const totalStock = getTotalStockForStores(product.stockByStore, stores);

  if (view === "list") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-4 p-4 hover:shadow-md transition-shadow product-card">
        <Link href={`/produits/${product.slug}`} className="flex-shrink-0 relative w-32 h-32 rounded-xl overflow-hidden bg-gray-50">
          <ProductImage src={product.images?.[0]} alt={product.name} />
          {product.discount > 0 && (
            <span className="absolute top-2 left-2 bg-[#EC4899] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
              -{product.discount}%
            </span>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 mb-1">{product.brand}</p>
          <Link href={`/produits/${product.slug}`}>
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-purple-700 transition-colors">{product.name}</h3>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-gray-900">{product.price.toFixed(2)} €</span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-gray-400 line-through">{product.originalPrice.toFixed(2)} €</span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-2">
            <div className={`w-1.5 h-1.5 rounded-full ${totalStock > 0 ? "bg-green-500" : "bg-red-400"}`} />
            <span className={`text-xs ${totalStock > 0 ? "text-green-700" : "text-red-500"}`}>
              {totalStock > 0 ? "Disponible en Click & Collect" : "Indisponible"}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => toggle(product)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
              fav ? "border-pink-200 bg-pink-50 text-pink-500" : "border-gray-200 hover:border-pink-200 hover:text-pink-500"
            }`}
          >
            <Heart className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={() => addItem(product)}
            className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group product-card relative flex flex-col">
      {/* Image */}
      <Link href={`/produits/${product.slug}`} className="relative block aspect-square overflow-hidden bg-gray-50">
        <ProductImage
          src={product.images?.[0]}
          alt={product.name}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.discount > 0 && (
            <span className="bg-[#EC4899] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">-{product.discount}%</span>
          )}
          {product.isNew && (
            <span className="bg-[#7C3AED] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">NOUVEAU</span>
          )}
          {product.isEndOfSeries && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">FIN DE SÉRIE</span>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product); }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
            fav ? "bg-pink-500 text-white" : "bg-white/80 text-gray-400 hover:text-pink-500 product-card-actions"
          }`}
        >
          <Heart className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
        </button>
      </Link>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-0.5">{product.brand}</p>
        <Link href={`/produits/${product.slug}`}>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-purple-700 transition-colors leading-snug mb-1.5">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-base font-bold text-gray-900">{product.price.toFixed(2)} €</span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">{product.originalPrice.toFixed(2)} €</span>
          )}
        </div>
        {product.originalPrice > product.price && (
          <p className="text-xs text-[#22C55E] font-medium mb-2">
            Économie : {(product.originalPrice - product.price).toFixed(2)} €
          </p>
        )}

        {/* Stock */}
        <div className="flex items-center gap-1 mb-3 mt-auto">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className={`text-xs ${totalStock > 0 ? "text-green-700" : "text-red-500"}`}>
            {totalStock > 0 ? "Dispo. Click & Collect" : "Indisponible"}
          </span>
        </div>

        {/* Add to cart */}
        <button
          onClick={() => addItem(product)}
          disabled={totalStock === 0}
          className="w-full h-9 bg-[#7C3AED] text-white rounded-xl text-xs font-semibold hover:bg-[#6D28D9] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}
