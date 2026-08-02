"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useCatalogStore } from "@/stores/catalogStore";
import type { Category } from "@/types";

interface CategoryCarouselCardProps {
  category: Category;
  productCount: number;
  duplicate?: boolean;
}

function formatProductCount(count: number) {
  if (count === 1) return "1 produit";
  if (count > 1) return `${count} produits`;
  return "Rayon en ligne";
}

function CategoryCarouselCard({
  category,
  productCount,
  duplicate = false,
}: CategoryCarouselCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      aria-hidden={duplicate}
      tabIndex={duplicate ? -1 : undefined}
      aria-label={`Voir la catégorie ${category.name}`}
      className="group w-[18rem] shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-100/70 sm:w-80 lg:w-[21rem]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-purple-50">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 288px, (max-width: 1024px) 320px, 336px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-5xl font-black text-purple-200">
              {category.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/55 via-gray-950/5 to-transparent" />
        <div className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-gray-800 shadow-sm">
          {formatProductCount(productCount)}
        </div>
        <div className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-purple-700 shadow-md transition-transform group-hover:translate-x-1">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-base font-bold leading-snug text-gray-950 sm:text-lg">
          {category.name}
        </p>
      </div>
    </Link>
  );
}

export function PopularCategories() {
  const categories = useCatalogStore((s) => s.categories);
  const products = useCatalogStore((s) => s.products);

  if (categories.length === 0) return null;

  return (
    <section className="border-y border-gray-100 bg-[#F8F9FA] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold leading-tight text-gray-950 sm:text-4xl">
              Nos catégories populaires
            </h2>
            <p className="mt-3 max-w-xl text-base leading-7 text-gray-600">
              Repérez rapidement les rayons les plus demandés et accédez aux arrivages disponibles en Click &amp; Collect.
            </p>
          </div>
          <Link
            href="/categories"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-purple-200 bg-white px-4 text-sm font-semibold text-purple-700 shadow-sm transition-colors hover:border-purple-300 hover:bg-purple-50"
          >
            Voir toutes les catégories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="category-carousel relative -mx-4 overflow-hidden px-4">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#F8F9FA] to-transparent sm:w-24" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#F8F9FA] to-transparent sm:w-24" />

          <div className="category-carousel-track flex w-max">
            {[0, 1].map((loopIndex) => (
              <div
                key={loopIndex}
                aria-hidden={loopIndex === 1}
                className="flex shrink-0 gap-5 pr-5 sm:gap-6 sm:pr-6"
              >
                {categories.map((cat) => {
                  const computedCount = products.filter((product) => product.categorySlug === cat.slug).length;
                  const productCount = computedCount || cat.productCount;

                  return (
                    <CategoryCarouselCard
                      key={`${loopIndex}-${cat.id}`}
                      category={cat}
                      productCount={productCount}
                      duplicate={loopIndex === 1}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
