import type { Product } from "@/interfaces/catalog";

/**
 * A product is out of stock only when *every* colourway is — one sold-out
 * colour must not hide the others.
 *
 * `variant.outOfStock` is the authority — the API adapter sets it when the
 * colour is flagged *or* every one of its sizes is. Size labels are
 * deliberately not used when variants exist: the slim PLP list can ship
 * colours with an incomplete size array, and treating that as "no sizes" would
 * mark in-stock products sold out. Products without variants (seed data) fall
 * back to the size list, where an empty array means nothing to buy.
 */
export function isProductSoldOut(product: Product): boolean {
  if (product.variants?.length) {
    return product.variants.every((v) => v.outOfStock === true);
  }
  return product.sizes.length === 0;
}
