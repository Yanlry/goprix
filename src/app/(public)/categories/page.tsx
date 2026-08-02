"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Package, Percent } from "lucide-react";
import { useCatalogStore } from "@/stores/catalogStore";

export default function CategoriesPage() {
  const { categories, products } = useCatalogStore();

  const productCount = (slug: string) =>
    products.filter((p) => p.categorySlug === slug && p.isActive).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      
      <nav className="text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-purple-700">Accueil</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Nos catégories</span>
      </nav>
      
      {/* Banner */}
      <div className="relative my-10 overflow-hidden rounded-3xl border border-purple-200 bg-gradient-to-r from-[#7C3AED] via-[#6D28D9] to-[#4C1D95] p-7 shadow-xl shadow-purple-200/60 sm:my-12 sm:p-9">
        <div className="relative z-10 flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div className="text-white">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-purple-100 ring-1 ring-white/20">
              <Percent className="h-3.5 w-3.5" />
              Déstockage permanent
            </div>
            <p className="max-w-2xl text-2xl font-black leading-tight sm:text-3xl">
              Des prix imbattables sur toutes nos catégories
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-sm font-medium text-purple-100">
              {["Click & Collect gratuit", "Produits 100% officiels", "Stocks limités"].map((item) => (
                <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/15">
                  <CheckCircle2 className="h-4 w-4 text-green-300" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="shrink-0 rounded-2xl bg-white p-5 text-center shadow-2xl shadow-purple-950/20 sm:min-w-36">
            <p className="mb-1 text-sm font-bold text-purple-700">Jusqu&apos;à</p>
            <p className="text-5xl font-black leading-none text-gray-950">-70%</p>
          </div>
        </div>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Nos catégories</h1>
        <p className="text-gray-500 mt-2">Découvrez notre sélection de produits en déstockage à prix imbattables</p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <Package className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-400">Aucune catégorie</p>
          <p className="text-sm text-gray-400 mt-1">L&apos;administrateur n&apos;a pas encore créé de catégories.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-14">
          {categories.map((cat) => {
            const count = productCount(cat.slug);
            return (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group flex flex-col"
              >
                {/* Image — ratio fixe 3/4, image entière */}
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-sm aspect-square">
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-200" />
                    </div>
                  )}

                  {/* Overlay hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />

                  {/* Badge articles */}
                  {count > 0 && (
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {count} article{count > 1 ? "s" : ""}
                    </div>
                  )}

                  {/* CTA hover */}
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-flex items-center gap-2 bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-xl shadow-lg">
                      Découvrir <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Nom */}
                <div className="px-1 pt-3 pb-1 flex items-center justify-between gap-2">
                  <p className="font-bold text-gray-900 text-sm leading-tight">{cat.name}</p>
                  <div className="w-7 h-7 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-600 transition-colors duration-200">
                    <ArrowRight className="w-3.5 h-3.5 text-purple-600 group-hover:text-white transition-colors duration-200" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
