"use client";

import { useState } from "react";
import { PlusCircle, Trash2, X, Edit, Check } from "lucide-react";
import { useCatalogStore } from "@/stores/catalogStore";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ImageUpload } from "@/components/common/ImageUpload";
import type { Category } from "@/types";

const autoSlug = (name: string) =>
  name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const emptyForm = { name: "", image: "" };

export default function CategoriesAdminPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCatalogStore();
  const [showForm, setShowForm] = useState(false);
  const [toDelete, setToDelete] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editError, setEditError] = useState("");

  const handleCreate = () => {
    if (!form.name.trim()) { setError("Le nom est requis"); return; }
    addCategory({
      id: crypto.randomUUID(),
      slug: autoSlug(form.name),
      name: form.name.trim(),
      description: "",
      image: form.image,
      icon: "Package",
      productCount: 0,
      color: "#7C3AED",
    });
    setForm(emptyForm);
    setError("");
    setShowForm(false);
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, image: cat.image || "" });
    setEditError("");
    setShowForm(false);
  };

  const handleUpdate = () => {
    if (!editForm.name.trim()) { setEditError("Le nom est requis"); return; }
    updateCategory(editingId!, {
      name: editForm.name.trim(),
      slug: autoSlug(editForm.name),
      image: editForm.image,
    });
    setEditingId(null);
    setEditError("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catégories</h1>
          <p className="text-sm text-gray-500 mt-1">
            {categories.length === 0
              ? "Aucune catégorie — créez-en une pour commencer"
              : `${categories.length} catégorie${categories.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setError(""); setForm(emptyForm); setEditingId(null); }}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
          {showForm ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
          {showForm ? "Fermer" : "Ajouter une catégorie"}
        </button>
      </div>

      {/* Formulaire création */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Nouvelle catégorie</h2>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">Nom *</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="ex: Maison & Cuisine" autoFocus
              className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200" />
          </div>
          <ImageUpload label="Photo de la catégorie" value={form.image}
            onChange={(b64) => setForm((f) => ({ ...f, image: b64 }))} />
          <div className="flex gap-3 pt-1">
            <button onClick={handleCreate}
              className="flex-1 h-11 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
              Créer la catégorie
            </button>
            <button onClick={() => { setShowForm(false); setError(""); }}
              className="h-11 px-5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <p className="text-4xl mb-3">🗂️</p>
          <p className="font-semibold text-gray-700">Aucune catégorie</p>
          <p className="text-sm text-gray-400 mt-1">Créez des catégories pour organiser vos produits.</p>
          {!showForm && (
            <button onClick={() => setShowForm(true)}
              className="mt-4 flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors mx-auto">
              <PlusCircle className="w-4 h-4" /> Créer une catégorie
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm divide-y divide-gray-50">
          {categories.map((cat) => (
            <div key={cat.id}>
              {editingId === cat.id ? (
                /* Formulaire d'édition inline */
                <div className="p-5 space-y-4 bg-purple-50/50">
                  {editError && <p className="text-xs text-red-500">{editError}</p>}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">Nom *</label>
                    <input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                      autoFocus
                      className="w-full h-11 px-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 bg-white" />
                  </div>
                  <ImageUpload label="Photo" value={editForm.image}
                    onChange={(b64) => setEditForm((f) => ({ ...f, image: b64 }))} />
                  <div className="flex gap-3">
                    <button onClick={handleUpdate}
                      className="flex-1 h-10 bg-purple-600 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" /> Enregistrer
                    </button>
                    <button onClick={() => setEditingId(null)}
                      className="h-10 px-4 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                /* Ligne normale */
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {cat.image
                        ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">🗂️</div>
                      }
                    </div>
                    <span className="font-semibold text-gray-900">{cat.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(cat)}
                      className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => setToDelete(cat.id)}
                      className="w-8 h-8 rounded-xl bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer la catégorie"
        message="Cette action est irréversible. Les produits associés ne seront pas supprimés."
        confirmLabel="Supprimer"
        onConfirm={() => { if (toDelete) { deleteCategory(toDelete); setToDelete(null); } }}
        onCancel={() => setToDelete(null)}
        danger
      />
    </div>
  );
}
