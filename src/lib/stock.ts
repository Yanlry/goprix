import type { Store } from "@/types";

export function getTotalStockForStores(
  stockByStore: Record<string, number> | undefined,
  stores: Store[]
) {
  if (!stockByStore) return 0;
  if (stores.length === 0) {
    // No stores configured yet — sum all values (supports _default key)
    return Object.values(stockByStore).reduce((sum, v) => sum + (v || 0), 0);
  }
  // Sum store-specific stock, falling back to _default per store
  return stores.reduce(
    (total, store) => total + (stockByStore[store.id] ?? stockByStore["_default"] ?? 0),
    0
  );
}

export function createDefaultStockByStore(stores: Store[], quantity = 10) {
  if (stores.length === 0) return { _default: quantity };
  return Object.fromEntries(stores.map((store) => [store.id, quantity]));
}
