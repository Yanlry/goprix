"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/stores/catalogStore";
import { useStoresStore } from "@/stores/storesStore";
import { useStorePickerStore } from "@/stores/storePickerStore";

export function CatalogHydration() {
  useEffect(() => {
    useCatalogStore.getState().initialize();
    useStoresStore.getState().initialize().then(() => {
      const { stores } = useStoresStore.getState();
      const { selectedStore, clearSelection } = useStorePickerStore.getState();
      if (selectedStore && !stores.some((s) => s.id === selectedStore.id)) {
        clearSelection();
      }
    });
  }, []);
  return null;
}
