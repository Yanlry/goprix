"use client";

import Link from "next/link";
import { PlusCircle, Edit, Trash2, ToggleLeft, ToggleRight, Package } from "lucide-react";
import { useState } from "react";
import { AdminDataTable } from "@/components/common/AdminDataTable";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { useCatalogStore } from "@/stores/catalogStore";
import { useStoresStore } from "@/stores/storesStore";
import { getTotalStockForStores } from "@/lib/stock";
import type { Product } from "@/types";

export default function ProduitsAdminPage() {
  const { products, deleteProduct, toggleProductActive } = useCatalogStore();
  const stores = useStoresStore((s) => s.stores);
  const [toDelete, setToDelete] = useState<string | null>(null);

  const columns = [
    {
      key: "image",
      label: "Photo",
      render: (row: Product) => (
        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
          {row.images[0] ? (
            <img src={row.images[0]} alt={row.name} className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          ) : (
            <Package className="w-4 h-4 text-gray-300" />
          )}
        </div>
      ),
    },
    {
      key: "name", label: "Produit", render: (row: Product) => (
        <div>
          <p className="text-sm font-semibold text-gray-900 line-clamp-1">{row.name}</p>
          <p className="text-xs text-gray-400">{row.reference}</p>
        </div>
      ),
    },
    { key: "brand", label: "Marque" },
    { key: "category", label: "Catégorie" },
    {
      key: "price", label: "Prix", render: (row: Product) => (
        <div>
          <p className="font-semibold text-gray-900">{row.price.toFixed(2)} €</p>
          {row.discount > 0 && <p className="text-xs text-pink-600">-{row.discount}%</p>}
        </div>
      ),
    },
    {
      key: "stock", label: "Stock", render: (row: Product) => {
        const total = getTotalStockForStores(row.stockByStore, stores);
        return (
          <span className={`text-sm font-semibold ${total === 0 ? "text-red-500" : total <= 3 ? "text-orange-500" : "text-gray-900"}`}>
            {total === 0 ? "Épuisé" : total}
          </span>
        );
      },
    },
    {
      key: "isPromo", label: "Tags", render: (row: Product) => (
        <div className="flex flex-wrap gap-1">
          {row.isNew && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-semibold">Nouveau</span>}
        </div>
      ),
    },
    {
      key: "isActive", label: "Statut", render: (row: Product) => (
        <button onClick={() => toggleProductActive(row.id)} className="flex items-center gap-1.5 text-xs font-semibold">
          {row.isActive ? (
            <><ToggleRight className="w-5 h-5 text-green-500" /><span className="text-green-700">Actif</span></>
          ) : (
            <><ToggleLeft className="w-5 h-5 text-gray-300" /><span className="text-gray-400">Inactif</span></>
          )}
        </button>
      ),
    },
    {
      key: "actions", label: "Actions", render: (row: Product) => (
        <div className="flex gap-1">
          <Link href={`/administration/produits/${row.id}/modifier`}
            className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
            <Edit className="w-3.5 h-3.5" />
          </Link>
          <button onClick={() => setToDelete(row.id)}
            className="w-7 h-7 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} produit{products.length > 1 ? "s" : ""} dans le catalogue</p>
        </div>
        <Link href="/administration/produits/nouveau"
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-colors">
          <PlusCircle className="w-4 h-4" />
          Ajouter un produit
        </Link>
      </div>
      <AdminDataTable data={products} columns={columns} searchPlaceholder="Rechercher un produit..." searchKey="name" />
      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer le produit"
        message="Cette action est irréversible. Le produit sera supprimé définitivement."
        confirmLabel="Supprimer"
        onConfirm={() => { if (toDelete) { deleteProduct(toDelete); setToDelete(null); } }}
        onCancel={() => setToDelete(null)}
        danger
      />
    </div>
  );
}
