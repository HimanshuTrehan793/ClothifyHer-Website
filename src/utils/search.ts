import type { Product } from "@/interfaces/catalog";

/** Below this we prompt rather than search — one letter matches everything. */
export const MIN_QUERY_LENGTH = 2;

const normalise = (s: string) => s.toLowerCase().trim();

const PRICE_INTENT = /(?:under|below|less than)\s*₹?\s*(\d+)/;

/** Query params handed to `GET /api/products`. */
export interface SearchQuery {
  q?: string;
  max_price?: number;
}

/**
 * Turn what someone typed into product-list filters. Ranking and matching are
 * the server's job now (`q` is an ILIKE on the product name), but a bare price
 * intent — "kurtas under 1500", or just "under 1000" — is worth catching here
 * so it becomes a real `max_price` filter instead of a literal name search.
 *
 * Returns null when the query is too short to search on.
 */
export function parseSearchQuery(rawQuery: string): SearchQuery | null {
  const query = normalise(rawQuery);
  if (query.length < MIN_QUERY_LENGTH) return null;

  const match = query.match(PRICE_INTENT);
  const ceiling = match ? Number(match[1]) : null;
  const terms = query.replace(PRICE_INTENT, "").trim();

  // "under 1000" on its own is a valid search — price filter, no name term.
  if (!terms && ceiling !== null) return { max_price: ceiling };

  return {
    q: terms,
    ...(ceiling !== null ? { max_price: ceiling } : {}),
  };
}

/** `co-ord-sets` → `Co Ord Sets`, for result meta lines. */
const slugToLabel = (slug: string) =>
  slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/**
 * Human label for where a result sits. The list endpoint returns category and
 * sub-category slugs only, so the label is derived from the slug rather than
 * looked up.
 */
export const productTypeLabel = (product: Product) =>
  slugToLabel(product.subCategory || product.category || "");
