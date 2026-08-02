"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2, Package, ShoppingBag, X } from "lucide-react";
import {
  CART_ITEM_ADDED_EVENT,
  type CartItemAddedEventDetail,
  useCartStore,
} from "@/stores/cartStore";
import type { Product } from "@/types";

function getProductImage(product: Product | null) {
  return product?.images?.[0] || "";
}

export function CartAddedDrawer() {
  const [open, setOpen] = useState(false);
  const [addedProduct, setAddedProduct] = useState<Product | null>(null);
  const [addedQuantity, setAddedQuantity] = useState(1);

  const itemCount = useCartStore((state) => state.itemCount());
  const total = useCartStore((state) => state.total());

  const closeDrawer = () => {
    setOpen(false);
  };

  useEffect(() => {
    const onCartItemAdded = (event: Event) => {
      const detail = (event as CustomEvent<CartItemAddedEventDetail>).detail;
      setAddedProduct(detail.product);
      setAddedQuantity(detail.quantity);
      setOpen(true);
    };

    window.addEventListener(CART_ITEM_ADDED_EVENT, onCartItemAdded);
    return () => {
      window.removeEventListener(CART_ITEM_ADDED_EVENT, onCartItemAdded);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open || !addedProduct) return null;

  const image = getProductImage(addedProduct);

  return (
    <div className="fixed inset-0 z-[70]">
      <button
        type="button"
        aria-label="Continuer mes achats"
        onClick={closeDrawer}
        className="absolute inset-0 bg-gray-950/25"
      />

      <aside className="fade-in absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl shadow-gray-950/20 sm:max-w-md">
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-950">Ajouté au panier</p>
              <p className="text-xs text-gray-500">Votre article a bien été ajouté.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Fermer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="flex gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
              {image ? (
                <Image
                  src={image}
                  alt={addedProduct.name}
                  fill
                  sizes="96px"
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Package className="h-9 w-9 text-gray-300" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-400">{addedProduct.brand}</p>
              <p className="mt-1 line-clamp-3 text-sm font-bold leading-snug text-gray-950">
                {addedProduct.name}
              </p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-lg font-black text-gray-950">
                  {addedProduct.price.toFixed(2)} €
                </span>
                {addedProduct.originalPrice > addedProduct.price && (
                  <span className="text-xs font-medium text-gray-400 line-through">
                    {addedProduct.originalPrice.toFixed(2)} €
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Quantité ajoutée : {addedQuantity}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Articles dans le panier</span>
              <span className="font-bold text-gray-950">{itemCount}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-base font-bold text-gray-950">
              <span>Total estimé</span>
              <span>{total.toFixed(2)} €</span>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-medium text-green-700">
              <ShoppingBag className="h-4 w-4 shrink-0" />
              Retrait Click &amp; Collect gratuit en magasin.
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 bg-white px-5 py-4">
          <Link
            href="/retrait"
            onClick={closeDrawer}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] text-sm font-bold text-white shadow-lg shadow-purple-200 transition-colors hover:bg-[#6D28D9]"
          >
            Payer maintenant
            <ArrowRight className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={closeDrawer}
            className="mt-3 flex h-11 w-full items-center justify-center rounded-xl border border-gray-200 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Continuer mes achats
          </button>
        </div>
      </aside>
    </div>
  );
}
