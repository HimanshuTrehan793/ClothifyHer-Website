import type { Product } from "@/interfaces/catalog";
import { CATEGORY_META, subCategoryLabel } from "@/utils/mockData";

/** Below this we prompt rather than search — one letter matches everything. */
export const MIN_QUERY_LENGTH = 2;

const normalise = (s: string) => s.toLowerCase().trim();

/**
 * Scored match so the most relevant products lead. A title hit beats a fabric
 * hit, and a prefix beats a mid-word hit — searching "kurta" should not rank a
 * product whose care text mentions it above one actually called a kurta.
 */
function scoreProduct(product: Product, terms: string[]): number {
  const haystacks = [
    { text: normalise(product.title), weight: 10 },
    { text: normalise(product.category), weight: 6 },
    { text: normalise(product.subCategory ?? ""), weight: 6 },
    { text: normalise(product.color ?? ""), weight: 4 },
    { text: normalise(product.fabric ?? ""), weight: 3 },
    { text: normalise(product.brand), weight: 2 },
  ];

  let score = 0;
  for (const term of terms) {
    let termScore = 0;
    for (const { text, weight } of haystacks) {
      if (!text) continue;
      if (text.startsWith(term)) {
        termScore = Math.max(termScore, weight * 2);
      } else if (text.split(/[\s,/-]+/).some((word) => word.startsWith(term))) {
        // Word-boundary, not substring: a bare `includes` makes "red" match
        // "Embroidered", which reads as a bug.
        termScore = Math.max(termScore, weight);
      }
    }
    // Every term must land somewhere, otherwise "red kurta" matches all kurtas.
    if (termScore === 0) return 0;
    score += termScore;
  }

  // Nudge well-reviewed items up when scores tie.
  return score + (product.rating ?? 0) / 10;
}

/** Bare "under 1500" / "below 999" price intent. */
function parsePriceCeiling(query: string): number | null {
  const match = normalise(query).match(
    /(?:under|below|less than)\s*₹?\s*(\d+)/,
  );
  return match ? Number(match[1]) : null;
}

export function searchCatalog(catalog: Product[], rawQuery: string): Product[] {
  const query = normalise(rawQuery);
  if (query.length < MIN_QUERY_LENGTH) return [];

  const ceiling = parsePriceCeiling(query);
  const terms = query
    .replace(/(?:under|below|less than)\s*₹?\s*\d+/, "")
    .split(/\s+/)
    .filter(Boolean);

  // Pure price query — "under 1000" on its own is a valid search.
  if (terms.length === 0 && ceiling !== null) {
    return catalog
      .filter((p) => p.price <= ceiling)
      .sort((a, b) => a.price - b.price);
  }

  let products = catalog
    .map((p) => ({ p, score: scoreProduct(p, terms) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);

  if (ceiling !== null) products = products.filter((p) => p.price <= ceiling);

  return products;
}

/** Human label for a product's subcategory, used in result meta lines. */
export const productTypeLabel = (product: Product) =>
  product.subCategory
    ? subCategoryLabel(product.category, product.subCategory)
    : (CATEGORY_META[product.category]?.name ?? product.category);
