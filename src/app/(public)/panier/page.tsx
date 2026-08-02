"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, Tag, ArrowRight, Store, AlertCircle } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { useStoresStore } from "@/stores/storesStore";
import { useAuthStore } from "@/stores/authStore";
import { QuantitySelector } from "@/components/common/QuantitySelector";
import { EmptyState } from "@/components/common/EmptyState";
import { getTotalStockForStores } from "@/lib/stock";

export default function PanierPage() {
  const { items, removeItem, updateQuantity, subtotal, total, promoCode, promoDiscount, applyPromoCode, removePromoCode } = useCartStore();
  const stores = useStoresStore((state) => state.stores);
  const { user } = useAuthStore();
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const handlePromo = () => {
    const ok = applyPromoCode(promoInput);
    if (!ok) setPromoError("Code promotionnel invalide");
    else setPromoError("");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Mon panier</h1>
        <EmptyState
          icon={ShoppingBag}
          title="Votre panier est vide"
          description="Ajoutez des produits à votre panier pour les retrouver ici."
          action={{ label: "Continuer mes achats", href: "/categories" }}
        />
      </div>
    );
  }

  const sub = subtotal();
  const savings = items.reduce((acc, i) => acc + (i.product.originalPrice - i.product.price) * i.quantity, 0);
  const discountAmount = sub * (promoDiscount / 100);
  const finalTotal = total();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-purple-700">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Mon panier</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon panier ({items.length} article{items.length > 1 ? "s" : ""})</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-3">
          {/* Click & Collect notice */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3 text-sm">
            <Store className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700">
              <strong>Click &amp; Collect uniquement</strong> — Retrait gratuit dans nos magasins. Aucune livraison à domicile.
            </p>
          </div>

          {items.map((item) => {
            const itemTotal = item.product.price * item.quantity;
            const itemSaving = (item.product.originalPrice - item.product.price) * item.quantity;
            const totalStockAvailable = getTotalStockForStores(item.product.stockByStore, stores);
            return (
              <div key={item.product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-4">
                <Link href={`/produits/${item.product.slug}`} className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
                  <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="80px" />
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 mb-0.5">{item.product.brand}</p>
                  <Link href={`/produits/${item.product.slug}`} className="text-sm font-semibold text-gray-900 line-clamp-2 hover:text-purple-700 transition-colors">
                    {item.product.name}
                  </Link>
                  {item.product.discount > 0 && (
                    <span className="inline-block mt-1 text-xs bg-pink-100 text-pink-700 font-semibold px-2 py-0.5 rounded-full">
                      -{item.product.discount}%
                    </span>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    {totalStockAvailable > 0 ? (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Dispo. Click &amp; Collect
                      </span>
                    ) : (
                      <span className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Stock limité
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button onClick={() => removeItem(item.product.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <QuantitySelector value={item.quantity} onChange={(q) => updateQuantity(item.product.id, q)} max={10} size="sm" />
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{itemTotal.toFixed(2)} €</p>
                    {itemSaving > 0 && (
                      <p className="text-xs text-green-600">-{itemSaving.toFixed(2)} €</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          {/* Promo code */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-purple-600" /> Code promotionnel
            </h3>
            {promoCode ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
                <div>
                  <p className="text-sm font-bold text-green-700">{promoCode}</p>
                  <p className="text-xs text-green-600">-{promoDiscount}% appliqué</p>
                </div>
                <button onClick={removePromoCode} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input type="text" value={promoInput} onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                  placeholder="Code promo"
                  className="flex-1 h-9 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
                <button onClick={handlePromo}
                  className="h-9 px-3 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
                  OK
                </button>
              </div>
            )}
            {promoError && <p className="text-xs text-red-500 mt-2">{promoError}</p>}
            <p className="text-xs text-gray-400 mt-2">Codes : GOPRIX10, DESTOC20, BIENVENUE15</p>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Récapitulatif</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{sub.toFixed(2)} €</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Réductions produits</span>
                  <span>-{savings.toFixed(2)} €</span>
                </div>
              )}
              {promoDiscount > 0 && (
                <div className="flex justify-between text-pink-600">
                  <span>Code promo ({promoCode})</span>
                  <span>-{discountAmount.toFixed(2)} €</span>
                </div>
              )}
              <div className="flex justify-between text-green-600">
                <span>Retrait Click &amp; Collect</span>
                <span className="font-semibold">GRATUIT</span>
              </div>
              <hr className="border-gray-100 my-2" />
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total TTC</span>
                <span>{finalTotal.toFixed(2)} €</span>
              </div>
            </div>

            <Link
              href={user ? "/retrait" : "/connexion?redirect=/retrait"}
              className="mt-5 w-full h-12 bg-[#7C3AED] text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#6D28D9] transition-colors shadow-lg shadow-purple-200"
            >
              {user ? "Choisir mon magasin et réserver" : "Se connecter pour réserver"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            {!user && (
              <p className="text-xs text-center text-gray-400 mt-2">
                Un compte est nécessaire pour finaliser votre réservation.
              </p>
            )}

            <div className="mt-4 space-y-2 text-xs text-gray-400">
              <p className="flex items-center gap-1.5">✓ Paiement 100% sécurisé</p>
              <p className="flex items-center gap-1.5">✓ Réservation valable 48h</p>
              <p className="flex items-center gap-1.5">✓ Retrait gratuit en magasin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
