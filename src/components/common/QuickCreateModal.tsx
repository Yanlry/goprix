"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { useCatalogStore } from "@/stores/catalogStore";
import { ImageUpload } from "@/components/common/ImageUpload";

interface Props {
  type: "category" | "brand";
  onClose: () => void;
  onCreated: (name: string) => void;
}

const autoSlug = (name: string) =>
  name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function QuickCreateModal({ type, onClose, onCreated }: Props) {
  const { addCategory, addBrand, categories, brands } = useCatalogStore();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const isCategory = type === "category";
  const title = isCategory ? "Nouvelle catégorie" : "Nouvelle marque";
  const placeholder = isCategory ? "ex: Maison & Cuisine" : "ex: Samsung, Bosch...";

  const handleCreate = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError("Le nom est requis"); return; }

    if (isCategory) {
      if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
        setError("Cette catégorie existe déjà"); return;
      }
      addCategory({
        id: `cat-${Date.now()}`,
        slug: autoSlug(trimmed),
        name: trimmed,
        description: "",
        image,
        icon: "Package",
        productCount: 0,
        color: "#7C3AED",
      });
    } else {
      if (brands.some((b) => b.name.toLowerCase() === trimmed.toLowerCase())) {
        setError("Cette marque existe déjà"); return;
      }
      addBrand({
        id: `b-${Date.now()}`,
        slug: autoSlug(trimmed),
        name: trimmed,
        logo: image,
        productCount: 0,
        description: "",
        categories: [],
        isPartner: false,
      });
    }

    onCreated(trimmed);
    onClose();
  };

  return (
    /* Overlay */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">{title}</h3>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Nom */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Nom *</label>
          {error && <p className="text-xs text-red-500 mb-1">{error}</p>}
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            placeholder={placeholder}
            autoFocus
            className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Image */}
        <ImageUpload
          label={isCategory ? "Photo de la catégorie" : "Logo de la marque"}
          value={image}
          onChange={setImage}
        />

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button onClick={onClose}
            className="flex-1 h-11 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            Annuler
          </button>
          <button onClick={handleCreate}
            className="flex-1 h-11 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> Créer
          </button>
        </div>
      </div>
    </div>
  );
}
