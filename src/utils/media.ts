import type { Product, ProductMedia } from "@/interfaces/catalog";

/** Gallery for a product, falling back to the primary still. */
export const galleryOf = (product: Product): ProductMedia[] =>
  product.media?.length
    ? product.media
    : [{ kind: "image", url: product.image, alt: product.title }];

/** First video in the gallery, if the product has one. */
export const videoOf = (product: Product) =>
  product.media?.find((m) => m.kind === "video");

/**
 * True when the device can hover AND the user hasn't asked for less motion.
 * Cards use this to decide between hover-to-play and viewport autoplay.
 */
export const prefersHoverPlayback = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
