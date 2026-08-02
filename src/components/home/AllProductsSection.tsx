"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import { useCatalogStore } from "@/stores/catalogStore";
import type { Product } from "@/types";

interface ProductCarouselItem {
  product: Product;
  duplicate: boolean;
}

interface ProductCarouselRowProps {
  products: Product[];
  reverse?: boolean;
  visualOnly?: boolean;
}

function buildCarouselItems(products: Product[], minimumItems = 6): ProductCarouselItem[] {
  if (products.length === 0) return [];

  const targetLength = Math.max(products.length, minimumItems);
  return Array.from({ length: targetLength }, (_, index) => ({
    product: products[index % products.length],
    duplicate: index >= products.length,
  }));
}

function ProductCarouselRow({
  products,
  reverse = false,
  visualOnly = false,
}: ProductCarouselRowProps) {
  const items = buildCarouselItems(products);

  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden py-1">
      <div className={`products-carousel-track flex w-max ${reverse ? "products-carousel-track-reverse" : ""}`}>
        {[0, 1].map((loopIndex) => (
          <div
            key={loopIndex}
            aria-hidden={loopIndex === 1}
            className="flex shrink-0 gap-4 pr-4 sm:gap-5 sm:pr-5"
          >
            {items.map((item, index) => {
              const isDuplicate = visualOnly || loopIndex === 1;

              return (
                <div
                  key={`${loopIndex}-${index}-${item.product.id}`}
                  inert={isDuplicate ? true : undefined}
                  aria-hidden={isDuplicate ? true : undefined}
                  className={`w-[13.5rem] shrink-0 sm:w-60 lg:w-64 ${isDuplicate ? "pointer-events-none" : ""}`}
                >
                  <ProductCard product={item.product} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AllProductsSection() {
  const products = useCatalogStore((s) => s.products);
  const active = products.filter((p) => p.isActive);

  if (active.length === 0) return null;

  const displayed = active.slice(0, 16);
  const splitIndex = Math.ceil(displayed.length / 2);
  const topRow = displayed.slice(0, splitIndex);
  const bottomRow = displayed.slice(splitIndex);
  const hasDedicatedBottomRow = bottomRow.length > 0;

  return (
    <section className="overflow-hidden bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">Nos produits</h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-gray-600">
              {active.length} article{active.length > 1 ? "s" : ""} en déstockage, à réserver en ligne puis à retirer gratuitement en magasin.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-4 text-sm font-semibold text-purple-700 shadow-sm transition-colors hover:border-purple-300 hover:bg-purple-50"
          >
            Voir par catégorie
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="products-carousel relative -mx-4 overflow-hidden px-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent sm:w-24" />

          <div className="space-y-5">
            <ProductCarouselRow products={topRow} />
            <ProductCarouselRow
              products={hasDedicatedBottomRow ? bottomRow : topRow}
              reverse
              visualOnly={!hasDedicatedBottomRow}
            />
          </div>
        </div>

        {active.length > displayed.length && (
          <div className="mt-10 text-center">
            <Link href="/categories"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-purple-700 transition-colors">
              Voir tous les {active.length} produits <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
