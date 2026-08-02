"use client";

import { useEffect } from "react";
import { useCatalogStore } from "@/stores/catalogStore";
import { useStoresStore } from "@/stores/storesStore";

export function DataInit() {
  useEffect(() => {
    useCatalogStore.getState().initialize();
    useStoresStore.getState().initialize();
  }, []);
  return null;
}
