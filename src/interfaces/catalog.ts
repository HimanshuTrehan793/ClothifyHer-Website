/** A circular "story" chip in the category rail under the navbar. */
export interface CategoryStory {
  id: string;
  label: string;
  image: string;
  href: string;
}

/** An editorial tile in the "Shop by Occasion" grid. */
export interface Occasion {
  id: string;
  title: string;
  caption: string;
  image: string;
  href: string;
  /** Tiles marked wide span two columns on desktop. */
  wide?: boolean;
}

/**
 * A gallery item. Discriminated on `kind` so a video can't be rendered without
 * a poster — an unposted <video> shows a black rectangle until it buffers.
 */
export type ProductMedia =
  | { kind: "image"; url: string; alt?: string }
  | { kind: "video"; url: string; poster: string; alt?: string };

/**
 * A colourway of a product. Each carries its own gallery; price and sizes fall
 * back to the parent when a variant doesn't override them.
 */
export interface ProductVariant {
  id: string;
  color: string;
  /** Square crop used for the swatch button. */
  thumb: string;
  media: ProductMedia[];
  price?: number;
  mrp?: number;
  sizes?: string[];
}

export interface Product {
  id: string;
  brand: string;
  title: string;
  /** Category slug — the `:categorySlug` segment of /categories/:slug. */
  category: string;
  /** Refinement within the category, e.g. `3-pc-set` under `co-ord-sets`. */
  subCategory?: string;
  /** Sizes offered. Empty array = sold out in every size. */
  sizes: string[];
  /**
   * Primary still. Always an image — cards, cart line snapshots and OG tags
   * need something that renders without a player.
   */
  image: string;
  /** Full gallery: stills plus optional video. Falls back to `image`. */
  media?: ProductMedia[];
  /** Colourways. Absent when the product comes in one colour only. */
  variants?: ProductVariant[];
  /** What the customer pays, in rupees. */
  price: number;
  /** Pre-discount price. Omit when the product isn't discounted. */
  mrp?: number;
  /** e.g. "Few left" / "New" — rendered as a badge over the image. */
  badge?: string;

  /* ── Detail-page only ────────────────────────────────────────────── */
  description?: string;
  fabric?: string;
  fit?: string;
  care?: string[];
  color?: string;
  rating?: number;
  reviewCount?: number;
}

/** A chip in the listing page's subcategory rail. */
export interface SubCategory {
  slug: string;
  label: string;
  image: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  /** Only verified purchases get the badge. */
  verified: boolean;
  size?: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface FeaturedCollectionData {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  href: string;
  ctaLabel: string;
  products: Product[];
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  /** 1–5, drives the star row. */
  rating: number;
  quote: string;
  /** What they bought — adds credibility to the quote. */
  product: string;
}
