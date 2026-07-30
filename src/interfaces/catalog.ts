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

export interface Product {
  id: string;
  brand: string;
  title: string;
  image: string;
  /** What the customer pays, in rupees. */
  price: number;
  /** Pre-discount price. Omit when the product isn't discounted. */
  mrp?: number;
  /** e.g. "Few left" / "New" — rendered as a badge over the image. */
  badge?: string;
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
