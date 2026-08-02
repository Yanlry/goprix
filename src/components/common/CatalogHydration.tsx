"use client";
import { useEffect } from "react";
import { useCatalogStore } from "@/stores/catalogStore";
import { useStorePickerStore } from "@/stores/storePickerStore";
import { useStoresStore } from "@/stores/storesStore";

export function CatalogHydration() {
  useEffect(() => {
    Promise.resolve(useCatalogStore.persist.rehydrate()).then(() => {
      const { products, updateProduct, brands, addBrand } = useCatalogStore.getState();
      // Ensure the fallback "Autre" brand always exists
      if (!brands.some((b) => b.id === "brand-autre")) {
        addBrand({
          id: "brand-autre",
          slug: "autre",
          name: "Autre",
          logo: "",
          productCount: 0,
          description: "Produits sans marque spécifique",
          categories: [],
          isPartner: false,
        });
      }
      // Migrate products with empty stockByStore
      products.forEach((p) => {
        if (!p.stockByStore || Object.keys(p.stockByStore).length === 0) {
          updateProduct(p.id, { stockByStore: { _default: 10 } });
        }
      });
    });
    Promise.resolve(useStoresStore.persist.rehydrate()).then(() => {
      const { stores } = useStoresStore.getState();
      const { selectedStore, clearSelection } = useStorePickerStore.getState();
      if (selectedStore && !stores.some((store) => store.id === selectedStore.id)) {
        clearSelection();
      }
    });
  }, []);
  return null;
}
