"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import {
  Search, User, Heart, ShoppingCart, Menu, X, ChevronDown,
  MapPin, Store, Bell, LogOut, Package, ArrowRight, Phone, LayoutDashboard
} from "lucide-react";
import { useCatalogStore } from "@/stores/catalogStore";
import { useCartStore } from "@/stores/cartStore";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useStorePickerStore } from "@/stores/storePickerStore";
import { useAuthStore } from "@/stores/authStore";

const navLinks: Array<{ label: string; href: string; badge?: boolean }> = [
  { label: "Accueil", href: "/" },
  { label: "Nouveautés", href: "/nouveautes" },
  { label: "Nos marques", href: "/marques" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

export function PublicHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const categoriesMenuRef = useRef<HTMLDivElement>(null);
  const categoriesMenuCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [categoriesMenuOpen, setCategoriesMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const categories = useCatalogStore((s) => s.categories);
  const products = useCatalogStore((s) => s.products);
  const itemCount = useCartStore((s) => s.itemCount());
  const favoriteCount = useFavoritesStore((s) => s.items.length);
  const { selectedStore } = useStorePickerStore();
  const { user, logout, isAdmin } = useAuthStore();

  const productCountsByCategory = useMemo(
    () =>
      products.reduce<Record<string, number>>((counts, product) => {
        if (!product.isActive) return counts;
        counts[product.categorySlug] = (counts[product.categorySlug] ?? 0) + 1;
        return counts;
      }, {}),
    [products]
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!categoriesMenuOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!categoriesMenuRef.current?.contains(event.target as Node)) {
        setCategoriesMenuOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setCategoriesMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [categoriesMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/recherche?q=${encodeURIComponent(query)}`);
  };

  const getCategoryProductCount = (slug: string, fallback: number) =>
    productCountsByCategory[slug] ?? fallback;

  const clearCategoriesMenuCloseTimer = () => {
    if (categoriesMenuCloseTimerRef.current) {
      clearTimeout(categoriesMenuCloseTimerRef.current);
      categoriesMenuCloseTimerRef.current = null;
    }
  };

  const openCategoriesMenu = () => {
    clearCategoriesMenuCloseTimer();
    setCategoriesMenuOpen(true);
  };

  const closeCategoriesMenu = () => {
    clearCategoriesMenuCloseTimer();
    setCategoriesMenuOpen(false);
  };

  const closeCategoriesMenuSoon = () => {
    clearCategoriesMenuCloseTimer();
    categoriesMenuCloseTimerRef.current = setTimeout(() => {
      setCategoriesMenuOpen(false);
      categoriesMenuCloseTimerRef.current = null;
    }, 220);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top banner */}
      <div className="bg-[#7C3AED] text-white text-xs py-2 px-4 flex items-center justify-between">
        <span className="hidden sm:block">
          🎉 Soldes en cours — Jusqu&apos;à -70% dans nos magasins !
        </span>
        <span className="sm:hidden">Soldes jusqu&apos;à -70% !</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Store className="w-3 h-3" />
            100% Click &amp; Collect
          </span>
          <span className="hidden sm:flex items-center gap-1 text-purple-200">
            Retrait gratuit en magasin
          </span>
        </div>
      </div>

      {/* Main header */}
      <div className={`bg-white border-b border-gray-100 transition-shadow ${scrolled ? "shadow-md" : "shadow-sm"}`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.jpg" alt="Goprix" width={120} height={48} className="h-12 w-auto object-contain" priority />
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 hidden md:flex max-w-2xl">
            <div className="relative w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher un produit, une marque..."
                className="w-full h-11 pl-4 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-400 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#7C3AED] text-white rounded-lg p-2 hover:bg-[#6D28D9] transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-1 ml-auto md:ml-0">
            {/* Account */}
            {isAdmin ? (
              <div className="relative group">
                <Link
                  href="/administration"
                  className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-purple-100 bg-purple-50 text-purple-700 transition-colors"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="text-[10px] hidden sm:block font-semibold">Tableau de bord</span>
                </Link>
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <Link href="/administration" className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 font-semibold hover:bg-purple-50">
                    <LayoutDashboard className="w-4 h-4" /> Tableau de bord
                  </Link>
                  <hr className="my-1 border-gray-100" />
                  <button onClick={logout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative group">
                <Link
                  href={user ? "/compte" : "/connexion"}
                  className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-purple-50 text-gray-600 hover:text-purple-700 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-[10px] hidden sm:block">{user ? user.firstName : "Mon compte"}</span>
                </Link>
                {user && (
                  <div className="absolute top-full right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                    <Link href="/compte" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                      <User className="w-4 h-4" /> Mon compte
                    </Link>
                    <Link href="/compte/reservations" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                      <Bell className="w-4 h-4" /> Mes réservations
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={logout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" /> Déconnexion
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Favorites */}
            <Link
              href="/favoris"
              className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span className="text-[10px] hidden sm:block">Favoris</span>
              {favoriteCount > 0 && (
                <span className="absolute top-1 right-1.5 bg-pink-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {favoriteCount > 9 ? "9+" : favoriteCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/panier"
              className="relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-purple-50 text-gray-600 hover:text-purple-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="text-[10px] hidden sm:block">Panier</span>
              {itemCount > 0 && (
                <span className="absolute top-1 right-1.5 bg-[#7C3AED] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-600"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full h-10 pl-4 pr-10 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-600">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Sub-nav */}
      <div className="hidden md:block bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-11">
          <div className="flex items-center gap-1">
            {/* Categories button */}
            <div
              ref={categoriesMenuRef}
              className="relative mr-4"
              onMouseEnter={openCategoriesMenu}
              onMouseLeave={closeCategoriesMenuSoon}
            >
              <button
                type="button"
                onClick={openCategoriesMenu}
                aria-expanded={categoriesMenuOpen}
                aria-haspopup="menu"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  pathname.startsWith("/categories")
                    ? "bg-[#6D28D9] text-white ring-2 ring-purple-300 ring-offset-1"
                    : "bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
                }`}
              >
                <Menu className="w-4 h-4" />
                Nos catégories
                <ChevronDown className={`w-3 h-3 transition-transform ${categoriesMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {categoriesMenuOpen && (
                <div
                  role="menu"
                  className="fade-in absolute left-0 top-full z-50 mt-2 w-[760px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-purple-950/10"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-gray-950">Nos catégories</p>
                      <p className="text-xs text-gray-500">Accédez rapidement à chaque rayon</p>
                    </div>
                    <Link
                      href="/categories"
                      onClick={closeCategoriesMenu}
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold text-purple-700 transition-colors hover:bg-purple-50"
                    >
                      Tout voir
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {categories.length === 0 ? (
                    <div className="flex items-center gap-3 px-4 py-5 text-sm text-gray-500">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                        <Package className="h-5 w-5 text-gray-300" />
                      </div>
                      Aucune catégorie n&apos;est encore disponible.
                    </div>
                  ) : (
                    <div className="grid max-h-[66vh] grid-cols-2 gap-3 overflow-y-auto p-3 lg:grid-cols-3">
                      {categories.map((category) => {
                        const productCount = getCategoryProductCount(category.slug, category.productCount);

                        return (
                          <Link
                            key={category.id}
                            href={`/categories/${category.slug}`}
                            role="menuitem"
                            onClick={closeCategoriesMenu}
                            className="group flex min-h-24 items-center gap-3 rounded-xl border border-gray-100 bg-white p-2.5 text-left transition-all hover:border-purple-200 hover:bg-purple-50 hover:shadow-sm"
                          >
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                              {category.image ? (
                                <Image
                                  src={category.image}
                                  alt={category.name}
                                  fill
                                  sizes="64px"
                                  unoptimized
                                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Package className="h-6 w-6 text-gray-300" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold text-gray-950 group-hover:text-purple-800">
                                {category.name}
                              </p>
                              <p className="mt-1 text-xs font-medium text-gray-500">
                                {productCount > 0
                                  ? `${productCount} article${productCount > 1 ? "s" : ""}`
                                  : "Rayon en ligne"}
                              </p>
                            </div>
                            <ArrowRight className="h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-purple-600" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Nav links */}
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-purple-50 ${
                    isActive
                      ? "text-purple-700 after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-purple-600"
                      : "text-gray-600 hover:text-purple-700"
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[#EC4899] text-white text-[8px] font-bold rounded-full px-1">
                      HOT
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Bouton appel */}
          <a
            href="tel:0986249887"
            className="flex items-center gap-2.5 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl px-4 py-2 transition-colors shadow-sm shadow-green-200"
          >
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-xs leading-tight">
              <p className="font-bold tracking-wide">09 86 24 98 87</p>
              <p className="text-green-100 font-medium">Appel gratuit</p>
            </div>
          </a>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <nav className="relative bg-white w-72 h-full overflow-y-auto slide-in-right shadow-xl ml-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <Image src="/logo.jpg" alt="Goprix" width={100} height={40} className="h-10 w-auto" />
              <button onClick={() => setMobileOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 space-y-1">
              <button
                type="button"
                onClick={() => setMobileCategoriesOpen((open) => !open)}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold mb-3 ${
                  pathname.startsWith("/categories")
                    ? "bg-purple-700 text-white"
                    : "bg-purple-600 text-white"
                }`}
              >
                <Menu className="w-4 h-4" />
                Nos catégories
                <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${mobileCategoriesOpen ? "rotate-180" : ""}`} />
              </button>
              {mobileCategoriesOpen && (
                <div className="mb-3 grid grid-cols-2 gap-2">
                  {categories.length === 0 ? (
                    <div className="col-span-2 rounded-xl border border-gray-100 bg-gray-50 px-3 py-4 text-sm text-gray-500">
                      Aucune catégorie disponible.
                    </div>
                  ) : (
                    categories.map((category) => {
                      const productCount = getCategoryProductCount(category.slug, category.productCount);

                      return (
                        <Link
                          key={category.id}
                          href={`/categories/${category.slug}`}
                          onClick={() => {
                            setMobileOpen(false);
                            setMobileCategoriesOpen(false);
                          }}
                          className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
                        >
                          <div className="relative aspect-square bg-gray-100">
                            {category.image ? (
                              <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                sizes="50vw"
                                unoptimized
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Package className="h-7 w-7 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="p-2.5">
                            <p className="line-clamp-2 text-xs font-bold leading-snug text-gray-950">
                              {category.name}
                            </p>
                            <p className="mt-1 text-[11px] font-medium text-gray-500">
                              {productCount > 0 ? `${productCount} article${productCount > 1 ? "s" : ""}` : "Rayon"}
                            </p>
                          </div>
                        </Link>
                      );
                    })
                  )}
                  <Link
                    href="/categories"
                    onClick={() => {
                      setMobileOpen(false);
                      setMobileCategoriesOpen(false);
                    }}
                    className="col-span-2 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-purple-50 text-sm font-bold text-purple-700"
                  >
                    Voir toutes les catégories
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
              {navLinks.map((link) => {
                const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
                return (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl font-medium border-l-4 transition-colors ${
                      isActive
                        ? "border-purple-600 bg-purple-50 text-purple-700"
                        : "border-transparent text-gray-700 hover:bg-purple-50"
                    }`}>
                    {link.label}
                  </Link>
                );
              })}
              <hr className="my-3" />
              {isAdmin ? (
                <Link href="/administration" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-purple-700 font-semibold bg-purple-50 hover:bg-purple-100 rounded-xl">
                  <LayoutDashboard className="w-4 h-4" /> Tableau de bord
                </Link>
              ) : (
                <Link href={user ? "/compte" : "/connexion"} onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl">
                  <User className="w-4 h-4" /> {user ? "Mon compte" : "Connexion"}
                </Link>
              )}
              <Link href="/favoris" onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-purple-50 rounded-xl">
                <Heart className="w-4 h-4" /> Mes favoris
                {favoriteCount > 0 && <span className="ml-auto bg-pink-100 text-pink-700 text-xs font-bold px-2 py-0.5 rounded-full">{favoriteCount}</span>}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
