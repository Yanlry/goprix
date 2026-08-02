"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  Heart, ShoppingCart, MapPin, Clock, Package,
  Shield, ChevronRight, ArrowLeft
} from "lucide-react";
import { useCatalogStore } from "@/stores/catalogStore";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useStoresStore } from "@/stores/storesStore";
import { QuantitySelector } from "@/components/common/QuantitySelector";
import { ProductCard } from "@/components/common/ProductCard";
import { getTotalStockForStores } from "@/lib/stock";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { products } = useCatalogStore();
  const stores = useStoresStore((s) => s.stores);
  const product = products.find((p) => p.slug === slug);

  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isFavorite } = useFavoritesStore();

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-700 mb-2">Produit introuvable</h1>
        <p className="text-gray-400 text-sm mb-6">Ce produit n&apos;existe pas ou a été supprimé.</p>
        <Link href="/" className="inline-flex items-center gap-2 text-purple-700 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" /> Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  const fav = isFavorite(product.id);
  const totalStock = getTotalStockForStores(product.stockByStore, stores);
  const related = products.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id && p.isActive
  ).slice(0, 4);

  const images = product.images?.length ? product.images : [];
  const mainImage = images[activeImage] ?? null;

  const handleAddToCart = () => {
    addItem(product, qty);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-purple-700">Accueil</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/categories" className="hover:text-purple-700">Catégories</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/categories/${product.categorySlug}`} className="hover:text-purple-700">{product.category}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10 mb-12">
        {/* Galerie */}
        <div className="flex gap-3">
          {/* Miniatures */}
          {images.length > 1 && (
            <div className="flex flex-col gap-2 w-16 flex-shrink-0">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors ${i === activeImage ? "border-purple-500" : "border-gray-100"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Image principale */}
          <div className="flex-1 relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
            {mainImage ? (
              <img src={mainImage} alt={product.name} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-20 h-20 text-gray-200" />
              </div>
            )}
            {product.discount > 0 && (
              <div className="absolute top-4 left-4 bg-[#EC4899] text-white font-bold text-lg px-3 py-1.5 rounded-xl shadow-lg">
                -{product.discount}%
              </div>
            )}
            {product.isNew && (
              <div className="absolute top-4 right-4 bg-[#7C3AED] text-white font-bold text-sm px-3 py-1.5 rounded-xl">
                NOUVEAU
              </div>
            )}
          </div>
        </div>

        {/* Informations produit */}
        <div className="lg:pt-2">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/marques" className="text-sm text-purple-700 font-semibold hover:underline">{product.brand}</Link>
            {product.category && (
              <>
                <span className="text-gray-300">•</span>
                <span className="text-xs text-gray-400">{product.category}</span>
              </>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3 leading-snug">{product.name}</h1>

          {/* Prix */}
          <div className="bg-purple-50 rounded-2xl p-5 mb-5">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-4xl font-bold text-gray-900">{product.price.toFixed(2)} €</span>
              {product.originalPrice > product.price && (
                <span className="text-xl text-gray-400 line-through">{product.originalPrice.toFixed(2)} €</span>
              )}
            </div>
            {product.originalPrice > product.price && (
              <div className="flex items-center gap-3">
                <span className="bg-[#EC4899] text-white text-sm font-bold px-2 py-0.5 rounded-lg">-{product.discount}%</span>
                <span className="text-sm text-green-700 font-medium">
                  Économie : {(product.originalPrice - product.price).toFixed(2)} €
                </span>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
            <h2 className="text-sm font-bold text-gray-900 mb-2">Description</h2>
            <p className="text-sm leading-6 text-gray-600">
              {product.description || "Aucune description disponible pour ce produit."}
            </p>
            {product.features?.length > 0 && (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {product.features.slice(0, 4).map((feature) => (
                  <div key={feature} className="flex items-start gap-2 text-xs text-gray-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            )}
            {Object.keys(product.specifications || {}).length > 0 && (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {Object.entries(product.specifications || {}).slice(0, 4).map(([key, val]) => (
                  <div key={key} className="rounded-xl bg-gray-50 px-3 py-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{key}</p>
                    <p className="text-xs font-semibold text-gray-800">{String(val)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {product.originalPrice > product.price && (
            <div className="mb-5 rounded-2xl border border-green-100 bg-green-50 p-4">
              <p className="text-sm font-bold text-green-800">
                Vous économisez {(product.originalPrice - product.price).toFixed(2)} € sur ce produit.
              </p>
              <p className="mt-1 text-xs text-green-700">Offre valable dans la limite des stocks disponibles.</p>
            </div>
          )}

          {/* Click & Collect */}
          <div className="space-y-2 mb-5">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-green-600" />
              <span className={totalStock > 0 ? "text-green-700 font-medium" : "text-red-500"}>
                {totalStock > 0 ? `Disponible — Click & Collect (${totalStock} en stock)` : "Indisponible actuellement"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Préparation sous 1h en magasin
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Package className="w-4 h-4" />
              Réservation valable 48h
            </div>
          </div>

          {/* Panier */}
          <div className="flex items-center gap-3 mb-4">
            <QuantitySelector value={qty} onChange={setQty} max={Math.min(totalStock || 1, 10)} />
            <button onClick={handleAddToCart} disabled={totalStock === 0}
              className={`flex-1 h-12 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                addedToCart
                  ? "bg-green-500 text-white"
                  : "bg-[#7C3AED] text-white hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed"
              }`}>
              <ShoppingCart className="w-5 h-5" />
              {addedToCart ? "Ajouté ✓" : "Ajouter au panier"}
            </button>
            <button onClick={() => toggle(product)}
              className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-colors ${
                fav ? "border-pink-500 bg-pink-50 text-pink-500" : "border-gray-200 text-gray-400 hover:border-pink-300 hover:text-pink-500"
              }`}>
              <Heart className={`w-5 h-5 ${fav ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 border border-gray-100 rounded-xl p-3">
            <Shield className="w-4 h-4 text-green-600" />
            Retrait gratuit en magasin — Click &amp; Collect uniquement
          </div>
        </div>
      </div>

      {/* Produits similaires */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Produits similaires</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
