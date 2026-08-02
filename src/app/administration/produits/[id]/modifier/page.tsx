"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle, AlertCircle, PlusCircle } from "lucide-react";
import { useCatalogStore } from "@/stores/catalogStore";
import { useStoresStore } from "@/stores/storesStore";
import { createDefaultStockByStore } from "@/lib/stock";
import { ImageUpload } from "@/components/common/ImageUpload";
import { QuickCreateModal } from "@/components/common/QuickCreateModal";

const autoSlug = (name: string) =>
  name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function ModifierProduitPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { products, categories, brands, updateProduct } = useCatalogStore();
  const stores = useStoresStore((state) => state.stores);

  const product = products.find((p) => p.id === id);

  const [form, setForm] = useState({
    name: "", category: "", brand: "", description: "",
    price: "", originalPrice: "", image: "",
    stock: "10",
    isActive: true, isNew: false,
  });
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [saved, setSaved] = useState(false);
  const [modal, setModal] = useState<"category" | "brand" | null>(null);

  useEffect(() => {
    if (product) {
      const perStoreStock = stores.length > 0
        ? (product.stockByStore?.[stores[0].id] ?? product.stockByStore?.["_default"] ?? 10)
        : (product.stockByStore?.["_default"] ?? 10);
      const nextForm = {
        name: product.name,
        category: product.category,
        brand: product.brand,
        description: product.description,
        price: product.price.toString(),
        originalPrice: product.originalPrice !== product.price ? product.originalPrice.toString() : "",
        image: product.images?.[0] || "",
        stock: String(perStoreStock),
        isActive: product.isActive,
        isNew: product.isNew,
      };
      queueMicrotask(() => setForm(nextForm));
    }
  }, [product]);

  if (!product) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="font-semibold text-gray-500">Produit introuvable</p>
        <Link href="/administration/produits" className="mt-4 inline-block text-sm text-purple-700 hover:underline">
          Retour aux produits
        </Link>
      </div>
    );
  }

  const set = (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const toggle = (field: "isActive" | "isNew") =>
    setForm((f) => ({ ...f, [field]: !f[field] }));

  const price = parseFloat(form.price) || 0;
  const original = parseFloat(form.originalPrice) || 0;
  const discount = original > price && price > 0 ? Math.round((1 - price / original) * 100) : 0;

  const validate = () => {
    const e: Partial<Record<string, string>> = {};
    if (!form.name.trim()) e.name = "Le nom est requis";
    if (!form.category) e.category = "Choisissez une catégorie";
    if (!form.brand) e.brand = "Choisissez une marque";
    if (!form.price || price <= 0) e.price = "Le prix est requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const foundBrand = brands.find((b) => b.name === form.brand);
    const foundCat = categories.find((c) => c.name === form.category);

    updateProduct(id, {
      name: form.name.trim(),
      brand: form.brand,
      brandSlug: foundBrand?.slug || autoSlug(form.brand),
      category: form.category,
      categorySlug: foundCat?.slug || autoSlug(form.category),
      description: form.description.trim(),
      images: form.image ? [form.image] : [],
      price,
      originalPrice: original || price,
      discount,
      isNew: form.isNew,
      isPromo: false,
      isActive: form.isActive,
      stockByStore: createDefaultStockByStore(stores, parseInt(form.stock) || 0),
    });

    setSaved(true);
    setTimeout(() => router.push("/administration/produits"), 1500);
  };

  return (
    <div className="max-w-xl mx-auto">
      {modal && (
        <QuickCreateModal
          type={modal}
          onClose={() => setModal(null)}
          onCreated={(name) => {
            setForm((f) => ({ ...f, [modal === "category" ? "category" : "brand"]: name }));
          }}
        />
      )}

      <div className="flex items-center gap-3 mb-6">
        <Link href="/administration/produits"
          className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Modifier le produit</h1>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{product.name}</p>
        </div>
      </div>

      {saved && (
        <div className="mb-5 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-2 text-green-700 font-medium">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          Modifications enregistrées ! Redirection...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Nom du produit *</label>
          <input value={form.name} onChange={set("name")} placeholder="ex: Friteuse sans huile 4.2L"
            className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-gray-800">Catégorie *</label>
            <button type="button" onClick={() => setModal("category")}
              className="flex items-center gap-1 text-xs text-purple-700 font-semibold hover:text-purple-900 transition-colors">
              <PlusCircle className="w-3.5 h-3.5" /> Nouvelle catégorie
            </button>
          </div>
          {categories.length === 0 ? (
            <div className="flex items-center gap-2 h-11 px-4 rounded-xl border border-orange-200 bg-orange-50">
              <span className="text-sm text-orange-700">Aucune catégorie —</span>
              <Link href="/administration/categories" className="text-sm text-orange-700 font-bold underline">En créer une</Link>
            </div>
          ) : (
            <select value={form.category} onChange={set("category")}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white">
              <option value="">Choisir une catégorie...</option>
              {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          )}
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-gray-800">Marque *</label>
            <button type="button" onClick={() => setModal("brand")}
              className="flex items-center gap-1 text-xs text-purple-700 font-semibold hover:text-purple-900 transition-colors">
              <PlusCircle className="w-3.5 h-3.5" /> Nouvelle marque
            </button>
          </div>
          {brands.length === 0 ? (
            <div className="flex items-center gap-2 h-11 px-4 rounded-xl border border-orange-200 bg-orange-50">
              <span className="text-sm text-orange-700">Aucune marque —</span>
              <Link href="/administration/marques" className="text-sm text-orange-700 font-bold underline">En créer une</Link>
            </div>
          ) : (
            <select value={form.brand} onChange={set("brand")}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white">
              <option value="">Choisir une marque...</option>
              {brands.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
          )}
          {errors.brand && <p className="text-xs text-red-500 mt-1">{errors.brand}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Description</label>
          <textarea value={form.description} onChange={set("description")} rows={3}
            placeholder="Décrivez brièvement le produit..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Prix de vente (€) *</label>
            <input value={form.price} onChange={set("price")} type="number" step="0.01" min="0" placeholder="29.99"
              className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
            {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Prix d&apos;origine (€)
              {discount > 0 && <span className="ml-2 text-pink-600 font-bold">−{discount}%</span>}
            </label>
            <input value={form.originalPrice} onChange={set("originalPrice")} type="number" step="0.01" min="0" placeholder="49.99"
              className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
          </div>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Quantité en stock</label>
          <input
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            type="number" step="1" min="0" placeholder="10"
            className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
          <p className="text-xs text-gray-400 mt-1">Quantité disponible par magasin (ou quantité globale si aucun magasin n&apos;est configuré)</p>
        </div>

        <ImageUpload
          label="Photo du produit"
          value={form.image}
          onChange={(b64) => setForm((f) => ({ ...f, image: b64 }))}
        />

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">Options</label>
          <div className="space-y-2">
            {([
              { key: "isActive" as const, label: "Visible sur le site", desc: "Le produit apparaît dans la boutique" },
              { key: "isNew" as const, label: "Badge « Nouveau »", desc: "Affiche un badge NOUVEAU sur la fiche" },
            ] as const).map(({ key, label, desc }) => (
              <label key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-purple-50 transition-colors">
                <div
                  onClick={(e) => { e.preventDefault(); toggle(key); }}
                  className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 cursor-pointer relative ${form[key] ? "bg-purple-600" : "bg-gray-200"}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form[key] ? "left-[18px]" : "left-0.5"}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Link href="/administration/produits"
            className="flex-1 h-11 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center transition-colors">
            Annuler
          </Link>
          <button type="submit" disabled={saved}
            className="flex-1 h-11 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors disabled:opacity-50">
            {saved ? "Enregistré !" : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
