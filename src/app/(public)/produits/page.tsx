"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  SlidersHorizontal, Grid2X2, List, X, Package,
  Tag, Sparkles, Flame, ChevronDown, ChevronUp,
} from "lucide-react";
import { ProductCard } from "@/components/common/ProductCard";
import { useCatalogStore } from "@/stores/catalogStore";

/* ─── Filtre latéral ─────────────────────────────────────────────── */

function Section({ title, children, defaultOpen = true }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full mb-3"
      >
        <span className="text-sm font-bold text-gray-900">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && children}
    </div>
  );
}

interface FilterPanelProps {
  categories: { slug: string; name: string }[];
  brands: string[];
  selectedCategories: string[];
  selectedBrands: string[];
  priceMin: number;
  priceMax: number;
  maxPrice: number;
  showPromo: boolean;
  showNew: boolean;
  showEndOfSeries: boolean;
  onToggleCategory: (slug: string) => void;
  onToggleBrand: (brand: string) => void;
  onPriceMinChange: (v: number) => void;
  onPriceMaxChange: (v: number) => void;
  onTogglePromo: () => void;
  onToggleNew: () => void;
  onToggleEndOfSeries: () => void;
  onReset: () => void;
  activeCount: number;
}

function FilterPanel({
  categories, brands,
  selectedCategories, selectedBrands,
  priceMin, priceMax, maxPrice,
  showPromo, showNew, showEndOfSeries,
  onToggleCategory, onToggleBrand,
  onPriceMinChange, onPriceMaxChange,
  onTogglePromo, onToggleNew, onToggleEndOfSeries,
  onReset, activeCount,
}: FilterPanelProps) {
  return (
    <div className="space-y-4">
      {activeCount > 0 && (
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl px-4 py-2.5 transition-colors"
        >
          <X className="w-4 h-4" />
          Effacer les filtres ({activeCount})
        </button>
      )}

      <Section title="Type de produit">
        <div className="space-y-2">
          {[
            { label: "Promotions", icon: <Tag className="w-3.5 h-3.5 text-pink-500" />, checked: showPromo, onToggle: onTogglePromo },
            { label: "Nouveautés", icon: <Sparkles className="w-3.5 h-3.5 text-blue-500" />, checked: showNew, onToggle: onToggleNew },
            { label: "Fin de série", icon: <Flame className="w-3.5 h-3.5 text-orange-500" />, checked: showEndOfSeries, onToggle: onToggleEndOfSeries },
          ].map(({ label, icon, checked, onToggle }) => (
            <label key={label} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-colors text-sm ${
              checked ? "bg-purple-50 text-purple-800 font-semibold" : "text-gray-700 hover:bg-gray-50"
            }`}>
              <input type="checkbox" checked={checked} onChange={onToggle} className="w-4 h-4 rounded accent-purple-600" />
              {icon}
              {label}
            </label>
          ))}
        </div>
      </Section>

      <Section title="Prix">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Min</label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={priceMax}
                  value={priceMin}
                  onChange={(e) => onPriceMinChange(Number(e.target.value))}
                  className="w-full h-9 pl-3 pr-6 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
              </div>
            </div>
            <span className="text-gray-400 mt-5">–</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Max</label>
              <div className="relative">
                <input
                  type="number"
                  min={priceMin}
                  max={maxPrice}
                  value={priceMax}
                  onChange={(e) => onPriceMaxChange(Number(e.target.value))}
                  className="w-full h-9 pl-3 pr-6 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">€</span>
              </div>
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={maxPrice}
            value={priceMax}
            onChange={(e) => onPriceMaxChange(Number(e.target.value))}
            className="w-full accent-purple-600"
          />
        </div>
      </Section>

      {categories.length > 0 && (
        <Section title="Catégories">
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {categories.map((cat) => (
              <label key={cat.slug} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-colors text-sm ${
                selectedCategories.includes(cat.slug) ? "bg-purple-50 text-purple-800 font-semibold" : "text-gray-700 hover:bg-gray-50"
              }`}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.slug)}
                  onChange={() => onToggleCategory(cat.slug)}
                  className="w-4 h-4 rounded accent-purple-600"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </Section>
      )}

      {brands.length > 0 && (
        <Section title="Marques" defaultOpen={false}>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {brands.map((brand) => (
              <label key={brand} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-colors text-sm ${
                selectedBrands.includes(brand) ? "bg-purple-50 text-purple-800 font-semibold" : "text-gray-700 hover:bg-gray-50"
              }`}>
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => onToggleBrand(brand)}
                  className="w-4 h-4 rounded accent-purple-600"
                />
                {brand}
              </label>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

/* ─── Page principale ────────────────────────────────────────────── */

export default function ProduitsPage() {
  const { products, categories } = useCatalogStore();

  const allActive = useMemo(() => products.filter((p) => p.isActive), [products]);
  const maxPrice = useMemo(() => Math.ceil(Math.max(0, ...allActive.map((p) => p.price)) / 100) * 100 || 2000, [allActive]);

  const [view,               setView]               = useState<"grid" | "list">("grid");
  const [sort,               setSort]               = useState("default");
  const [filterDrawer,       setFilterDrawer]       = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands,     setSelectedBrands]     = useState<string[]>([]);
  const [priceMin,           setPriceMin]           = useState(0);
  const [priceMax,           setPriceMax]           = useState(maxPrice);
  const [showPromo,          setShowPromo]          = useState(false);
  const [showNew,            setShowNew]            = useState(false);
  const [showEndOfSeries,    setShowEndOfSeries]    = useState(false);

  const catList = useMemo(
    () => categories.filter((c) => allActive.some((p) => p.categorySlug === c.slug)),
    [categories, allActive]
  );
  const brandList = useMemo(
    () => [...new Set(allActive.map((p) => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b, "fr")),
    [allActive]
  );

  const filtered = useMemo(() => {
    let list = allActive.filter((p) => {
      if (p.price < priceMin || p.price > priceMax) return false;
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.categorySlug)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
      if (showPromo && !p.isPromo) return false;
      if (showNew && !p.isNew) return false;
      if (showEndOfSeries && !p.isEndOfSeries) return false;
      return true;
    });
    return list.sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "discount") return b.discount - a.discount;
      if (sort === "newest") return Number(b.isNew) - Number(a.isNew);
      return 0;
    });
  }, [allActive, priceMin, priceMax, selectedCategories, selectedBrands, showPromo, showNew, showEndOfSeries, sort]);

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    (showPromo ? 1 : 0) +
    (showNew ? 1 : 0) +
    (showEndOfSeries ? 1 : 0) +
    (priceMin > 0 || priceMax < maxPrice ? 1 : 0);

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceMin(0);
    setPriceMax(maxPrice);
    setShowPromo(false);
    setShowNew(false);
    setShowEndOfSeries(false);
  };

  const toggleCategory = (slug: string) =>
    setSelectedCategories((prev) => prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]);
  const toggleBrand = (brand: string) =>
    setSelectedBrands((prev) => prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]);

  const filterProps = {
    categories: catList,
    brands: brandList,
    selectedCategories,
    selectedBrands,
    priceMin,
    priceMax,
    maxPrice,
    showPromo,
    showNew,
    showEndOfSeries,
    onToggleCategory: toggleCategory,
    onToggleBrand: toggleBrand,
    onPriceMinChange: setPriceMin,
    onPriceMaxChange: setPriceMax,
    onTogglePromo: () => setShowPromo((v) => !v),
    onToggleNew: () => setShowNew((v) => !v),
    onToggleEndOfSeries: () => setShowEndOfSeries((v) => !v),
    onReset: resetFilters,
    activeCount: activeFilterCount,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-purple-700">Accueil</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">Tous les produits</span>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Tous nos produits</h1>
            <p className="text-purple-200 mt-1 text-sm">Déstockage · Click &amp; Collect · Jusqu&apos;à -70%</p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-3xl font-extrabold">{allActive.length}</p>
              <p className="text-xs text-purple-200 mt-0.5">produits</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">{catList.length}</p>
              <p className="text-xs text-purple-200 mt-0.5">catégories</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold">{brandList.length}</p>
              <p className="text-xs text-purple-200 mt-0.5">marques</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedCategories.map((slug) => {
            const name = catList.find((c) => c.slug === slug)?.name ?? slug;
            return (
              <button key={slug} onClick={() => toggleCategory(slug)}
                className="flex items-center gap-1.5 bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-purple-200 transition-colors">
                {name} <X className="w-3 h-3" />
              </button>
            );
          })}
          {selectedBrands.map((brand) => (
            <button key={brand} onClick={() => toggleBrand(brand)}
              className="flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-blue-200 transition-colors">
              {brand} <X className="w-3 h-3" />
            </button>
          ))}
          {showPromo && (
            <button onClick={() => setShowPromo(false)}
              className="flex items-center gap-1.5 bg-pink-100 text-pink-800 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-pink-200 transition-colors">
              Promotions <X className="w-3 h-3" />
            </button>
          )}
          {showNew && (
            <button onClick={() => setShowNew(false)}
              className="flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-green-200 transition-colors">
              Nouveautés <X className="w-3 h-3" />
            </button>
          )}
          {showEndOfSeries && (
            <button onClick={() => setShowEndOfSeries(false)}
              className="flex items-center gap-1.5 bg-orange-100 text-orange-800 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-orange-200 transition-colors">
              Fin de série <X className="w-3 h-3" />
            </button>
          )}
          {(priceMin > 0 || priceMax < maxPrice) && (
            <button onClick={() => { setPriceMin(0); setPriceMax(maxPrice); }}
              className="flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">
              {priceMin}€ – {priceMax}€ <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      <div className="flex gap-6">
        {/* Sidebar desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-purple-600" />
              Filtres
            </h3>
            <FilterPanel {...filterProps} />
          </div>
        </aside>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          {/* Barre tri + vue */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 mb-4 flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setFilterDrawer(true)}
              className="lg:hidden flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-50 px-3 py-2 rounded-xl"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
              {activeFilterCount > 0 && (
                <span className="bg-purple-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <span className="text-sm text-gray-500 font-medium">
              <span className="font-bold text-gray-900">{filtered.length}</span> produit{filtered.length > 1 ? "s" : ""}
            </span>

            <div className="flex items-center gap-2 ml-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white"
              >
                <option value="default">Pertinence</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="discount">Meilleures remises</option>
                <option value="newest">Nouveautés d&apos;abord</option>
              </select>
              <button
                onClick={() => setView("grid")}
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${view === "grid" ? "bg-purple-100 text-purple-700" : "text-gray-400 hover:bg-gray-50"}`}
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${view === "list" ? "bg-purple-100 text-purple-700" : "text-gray-400 hover:bg-gray-50"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Package className="w-14 h-14 text-gray-200 mx-auto mb-4" />
              <p className="text-xl font-bold text-gray-400">Aucun produit trouvé</p>
              <p className="text-sm text-gray-400 mt-2">Essayez de modifier ou d&apos;effacer vos filtres</p>
              {activeFilterCount > 0 && (
                <button onClick={resetFilters}
                  className="mt-4 bg-purple-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
                  Effacer les filtres
                </button>
              )}
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

      {/* Drawer filtres mobile */}
      {filterDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFilterDrawer(false)} />
          <div className="relative bg-white w-80 h-full overflow-y-auto p-5 shadow-xl ml-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-lg">Filtres</h3>
              <button onClick={() => setFilterDrawer(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <FilterPanel {...filterProps} />
            <button
              onClick={() => setFilterDrawer(false)}
              className="w-full mt-6 bg-purple-600 text-white h-11 rounded-xl font-semibold text-sm hover:bg-purple-700 transition-colors"
            >
              Voir les {filtered.length} produit{filtered.length > 1 ? "s" : ""}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
