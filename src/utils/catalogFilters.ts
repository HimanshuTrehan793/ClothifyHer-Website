import type { Product } from "@/interfaces/catalog";
import { SIZE_SCALE } from "@/utils/constants";

export type SortKey = "featured" | "price-asc" | "price-desc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export const PRICE_BUCKETS = [
  { id: "0-999", label: "Under ₹1,000", min: 0, max: 999 },
  { id: "1000-1999", label: "₹1,000 – ₹1,999", min: 1000, max: 1999 },
  { id: "2000-2999", label: "₹2,000 – ₹2,999", min: 2000, max: 2999 },
  { id: "3000+", label: "₹3,000 & above", min: 3000, max: Infinity },
];

/** Canonical order the size facet renders in — the full ladder up to 10XL. */
export const SIZE_OPTIONS = SIZE_SCALE;

export interface Filters {
  sizes: string[];
  prices: string[];
}

export const EMPTY_FILTERS: Filters = {
  sizes: [],
  prices: [],
};

export const countActive = (f: Filters) => f.sizes.length + f.prices.length;

export function applyFilters(products: Product[], f: Filters): Product[] {
  return products.filter((p) => {
    // Sizes are OR within the facet: pick S and M, get anything in S or M.
    if (f.sizes.length && !f.sizes.some((s) => p.sizes.includes(s)))
      return false;

    if (f.prices.length) {
      const inBucket = f.prices.some((id) => {
        const bucket = PRICE_BUCKETS.find((b) => b.id === id);
        return bucket && p.price >= bucket.min && p.price <= bucket.max;
      });
      if (!inBucket) return false;
    }

    return true;
  });
}

export function applySort(products: Product[], sort: SortKey): Product[] {
  const out = [...products];
  switch (sort) {
    case "price-asc":
      return out.sort((a, b) => a.price - b.price);
    case "price-desc":
      return out.sort((a, b) => b.price - a.price);
    default:
      return out; // "featured" keeps the merchandised order
  }
}
