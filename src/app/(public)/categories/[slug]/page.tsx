"use client";

import { useState, use } from "react";
import Link from "next/link";
import { SlidersHorizontal, Grid2X2, List, X, Package } from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import { useCatalogStore } from "@/stores/catalogStore";

interface Props {
  params: Promise<{ slug: string }>;
}

interface CategoryFilterPanelProps {
  priceMax: number;
  brandList: string[];
  selectedBrands: string[];
  onPriceMaxChange: (value: number) => void;
  onToggleBrand: (brand: string) => void;
}

function CategoryFilterPanel({
  priceMax,
  brandList,
  selectedBrands,
  onPriceMaxChange,
  onToggleBrand,
}: CategoryFilterPanelProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Prix maximum</h3>
        <input
          type="range"
          min={0}
          max={2000}
          value={priceMax}
          onChange={(e) => onPriceMaxChange(Number(e.target.value))}
          className="w-full accent-purple-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0 €</span>
          <span>{priceMax} €</span>
        </div>
      </div>
      {brandList.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3">Marques</h3>
          <div className="space-y-1.5">
            {brandList.map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => onToggleBrand(brand)}
                  className="w-4 h-4 rounded accent-purple-600"
                />
                <span className="text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function CategoryPage({ params }: Props) {
  const { slug } = use(params);

  const { products, categories } = useCatalogStore();

  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("default");
  const [filterDrawer, setFilterDrawer] = useState(false);
  const [priceMax, setPriceMax] = useState(2000);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const category = categories.find((c) => c.slug === slug);
  const categoryProducts = products.filter((p) => p.categorySlug === slug && p.isActive);

  let filtered = categoryProducts.filter((p) => {
    if (p.price > priceMax) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === "price_asc") return a.price - b.price;
    if (sort === "price_desc") return b.price - a.price;
    if (sort === "discount") return b.discount - a.discount;
    return 0;
  });

  const brandList = [...new Set(categoryProducts.map((p) => p.brand))];

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-purple-700">Accueil</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-purple-700">Catégories</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{category?.name || slug}</span>
      </nav>

      {category && (
        <div className="bg-gradient-to-r from-purple-50 to-white rounded-2xl p-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-gray-500 text-sm mt-1">{category.description}</p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-700">{categoryProducts.length}</p>
              <p className="text-xs">produits</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-6">
        <aside className="hidden lg:block w-60 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 text-sm">Filtrer les résultats</h3>
            <CategoryFilterPanel
              priceMax={priceMax}
              brandList={brandList}
              selectedBrands={selectedBrands}
              onPriceMaxChange={setPriceMax}
              onToggleBrand={toggleBrand}
            />
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-4 flex items-center gap-3 flex-wrap">
            <button onClick={() => setFilterDrawer(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 bg-gray-50 px-3 py-2 rounded-xl">
              <SlidersHorizontal className="w-4 h-4" /> Filtres
            </button>
            <span className="text-sm text-gray-500">{filtered.length} produit{filtered.length > 1 ? "s" : ""}</span>
            <div className="flex items-center gap-2 ml-auto">
              <select value={sort} onChange={(e) => setSort(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white">
                <option value="default">Pertinence</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="discount">Meilleures remises</option>
              </select>
              <button onClick={() => setView("grid")}
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${view === "grid" ? "bg-purple-100 text-purple-700" : "text-gray-400 hover:bg-gray-50"}`}>
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button onClick={() => setView("list")}
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${view === "list" ? "bg-purple-100 text-purple-700" : "text-gray-400 hover:bg-gray-50"}`}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Package className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-lg font-semibold text-gray-400">Aucun produit</p>
              <p className="text-sm text-gray-400 mt-1">Essayez de modifier vos filtres</p>
            </div>
          ) : (
            <div className={view === "grid" ? "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-3"}>
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} view={view} />
              ))}
            </div>
          )}
        </div>
      </div>

      {filterDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterDrawer(false)} />
          <div className="relative bg-white w-80 h-full overflow-y-auto p-5 ml-auto shadow-xl slide-in-right">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900">Filtres</h3>
              <button onClick={() => setFilterDrawer(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <CategoryFilterPanel
              priceMax={priceMax}
              brandList={brandList}
              selectedBrands={selectedBrands}
              onPriceMaxChange={setPriceMax}
              onToggleBrand={toggleBrand}
            />
            <button onClick={() => setFilterDrawer(false)}
              className="w-full mt-6 bg-purple-600 text-white h-11 rounded-xl font-semibold text-sm">
              Appliquer les filtres
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
