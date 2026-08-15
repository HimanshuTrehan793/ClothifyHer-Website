import { SIZE_SCALE } from "@/utils/constants";
import type { CartLine, Coupon, WishlistEntry } from "@/interfaces/cart";
import type {
  CategoryStory,
  ProductVariant,
  SubCategory,
  ProductMedia,
  Review,
  FeaturedCollectionData,
  HeroSlide,
  Occasion,
  Product,
  Testimonial,
} from "@/interfaces/catalog";

/**
 * Placeholder imagery.
 *
 * These are seeded picsum.photos URLs — they always resolve, so the layout can
 * be reviewed honestly, but they are NOT garment photography. Swap this one
 * helper for your CDN URLs and every section picks up the change.
 */
const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

/* Placeholder clip. Public sample MP4 — obviously not garment footage, but it
   streams reliably so video playback can be reviewed honestly. Swap with the
   CDN URL alongside the `img()` helper above. */
const SAMPLE_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

/** Gallery of `n` stills, optionally with a video slotted in second. */
const gallery = (
  seed: string,
  n: number,
  withVideo = false,
): ProductMedia[] => {
  const stills: ProductMedia[] = Array.from({ length: n }, (_, i) => ({
    kind: "image" as const,
    url: img(`${seed}-${i}`, 700, 1000),
  }));
  if (!withVideo) return stills;
  return [
    stills[0],
    {
      kind: "video",
      url: SAMPLE_VIDEO,
      poster: img(`${seed}-clip`, 700, 1000),
    },
    ...stills.slice(1),
  ];
};

/* Taxonomy per flow doc §1: Kurtas · Dresses · Co-ord Sets · Tops · Bottom Wear */
export const CATEGORY_STORIES: CategoryStory[] = [
  {
    id: "kurtas",
    label: "Kurtas",
    image: img("ch-kurta", 200, 200),
    href: "/categories/kurtas",
  },
  {
    id: "dresses",
    label: "Dresses",
    image: img("ch-dress", 200, 200),
    href: "/categories/dresses",
  },
  {
    id: "co-ord-sets",
    label: "Co-ord Sets",
    image: img("ch-coord", 200, 200),
    href: "/categories/co-ord-sets",
  },
  {
    id: "tops",
    label: "Tops",
    image: img("ch-top", 200, 200),
    href: "/categories/tops",
  },
  {
    id: "bottom-wear",
    label: "Bottom Wear",
    image: img("ch-bottom", 200, 200),
    href: "/categories/bottom-wear",
  },
  {
    id: "sale",
    label: "Sale",
    image: img("ch-sale", 200, 200),
    href: "/categories/sale",
  },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "new-season",
    eyebrow: "New Season",
    title: "Style Meets Comfort",
    subtitle:
      "Kurtas, dresses and co-ord sets cut for real days — breathable fabrics, considered fits, nothing fussy.",
    image: img("ch-hero-1", 1200, 1600),
    primaryCta: { label: "Shop New Arrivals", href: "/new-arrivals" },
    secondaryCta: { label: "Shop by Occasion", href: "#occasions" },
  },
  {
    id: "coord-edit",
    eyebrow: "The Co-ord Edit",
    title: "One Set, Every Day",
    subtitle:
      "Matched sets that work as a pair or split across your whole wardrobe.",
    image: img("ch-hero-2", 1200, 1600),
    primaryCta: { label: "Shop Co-ord Sets", href: "/categories/co-ord-sets" },
    secondaryCta: { label: "See the Lookbook", href: "/blog" },
  },
  {
    id: "festive",
    eyebrow: "Festive",
    title: "Dressed for the Occasion",
    subtitle:
      "Festive kurtas and dresses with the detailing turned up and the price kept sensible.",
    image: img("ch-hero-3", 1200, 1600),
    primaryCta: { label: "Shop Festive", href: "/collections/festive" },
  },
];

/* Occasions mirror the Collections list in doc §5. */
export const OCCASIONS: Occasion[] = [
  {
    id: "wedding",
    title: "Wedding",
    caption: "Festive kurtas & occasion dresses",
    image: img("ch-wedding", 900, 1100),
    href: "/collections/wedding",
    wide: true,
  },
  {
    id: "office-wear",
    title: "Office Wear",
    caption: "Structured, understated",
    image: img("ch-office", 700, 900),
    href: "/collections/office-wear",
  },
  {
    id: "casual",
    title: "Casual",
    caption: "Everyday cottons & co-ords",
    image: img("ch-casual", 700, 900),
    href: "/collections/casual",
  },
  {
    id: "summer",
    title: "Summer",
    caption: "Light layers, easy cuts",
    image: img("ch-summer", 900, 1100),
    href: "/collections/summer",
    wide: true,
  },
  {
    id: "winter",
    title: "Winter",
    caption: "Warm layers & knits",
    image: img("ch-winter", 700, 900),
    href: "/collections/winter",
  },
];

export const TRENDING_PRODUCTS: Product[] = [
  {
    id: "p1",
    subCategory: "straight",
    category: "kurtas",
    brand: "ClothifyHer",
    title: "Hand Block Printed Cotton Kurta",
    sizes: SIZE_SCALE,
    image: img("ch-p1", 700, 1000),
    price: 1499,
    mrp: 2299,
    badge: "Bestseller",
    media: gallery("ch-p1", 4, true),
    description:
      "A hand block printed straight kurta in breathable cotton. The print is stamped by hand, so no two panels line up identically.",
    fabric: "100% cotton",
    fit: "Straight fit",
    color: "Indigo",
    care: [
      "Machine wash cold",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed",
    ],
    rating: 4.6,
    reviewCount: 214,
  },
  {
    id: "p2",
    subCategory: "midi",
    category: "dresses",
    brand: "ClothifyHer",
    title: "Floral Midi Dress with Tie Waist",
    sizes: SIZE_SCALE,
    image: img("ch-p2", 700, 1000),
    price: 1899,
    mrp: 2799,
    media: gallery("ch-p2", 3, false),
    description:
      "A midi dress with a tie waist that cinches where you want it and skims where you don't.",
    fabric: "Viscose rayon",
    fit: "A-line",
    color: "Blush",
    care: [
      "Machine wash cold",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed",
    ],
    rating: 4.4,
    reviewCount: 132,
  },
  {
    id: "p3",
    subCategory: "2-pc-set",
    category: "co-ord-sets",
    brand: "ClothifyHer",
    title: "Ivory Co-ord Set in Textured Cotton",
    sizes: SIZE_SCALE,
    image: img("ch-p3", 700, 1000),
    price: 2499,
    mrp: 3499,
    badge: "New",
    media: gallery("ch-p3", 4, true),
    description:
      "A matched co-ord in textured cotton. Wear it as a set or split it across the rest of your wardrobe.",
    fabric: "Textured cotton",
    fit: "Relaxed",
    color: "Ivory",
    care: [
      "Machine wash cold",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed",
    ],
    rating: 4.7,
    reviewCount: 298,
  },
  {
    id: "p4",
    subCategory: "relaxed",
    category: "tops",
    brand: "ClothifyHer",
    title: "Relaxed Linen Blend Top",
    sizes: SIZE_SCALE,
    image: img("ch-p4", 700, 1000),
    price: 999,
    mrp: 1399,
    media: gallery("ch-p4", 3, false),
    description: "A relaxed top in a linen blend that softens with every wash.",
    fabric: "Linen blend",
    fit: "Relaxed",
    color: "Sand",
    care: [
      "Machine wash cold",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed",
    ],
    rating: 4.3,
    reviewCount: 88,
  },
  {
    id: "p5",
    subCategory: "palazzo",
    category: "bottom-wear",
    brand: "ClothifyHer",
    title: "High-Rise Straight Fit Palazzo",
    sizes: SIZE_SCALE,
    image: img("ch-p5", 700, 1000),
    price: 1199,
    media: gallery("ch-p5", 3, false),
    description:
      "High-rise palazzos with a clean straight fall and deep side pockets.",
    fabric: "Cotton twill",
    fit: "High-rise straight",
    color: "Black",
    care: [
      "Machine wash cold",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed",
    ],
    rating: 4.5,
    reviewCount: 176,
  },
  {
    id: "p6",
    subCategory: "anarkali",
    category: "kurtas",
    brand: "ClothifyHer",
    title: "Anarkali Kurta with Chikankari Detail",
    sizes: SIZE_SCALE,
    image: img("ch-p6", 700, 1000),
    price: 2799,
    mrp: 3999,
    badge: "Few left",
    media: gallery("ch-p6", 4, true),
    description:
      "An anarkali with chikankari detailing across the yoke, finished with a soft flare.",
    fabric: "Georgette",
    fit: "Anarkali",
    color: "Wine",
    care: [
      "Machine wash cold",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed",
    ],
    rating: 4.8,
    reviewCount: 341,
  },
  {
    id: "p7",
    subCategory: "blouses",
    category: "tops",
    brand: "ClothifyHer",
    title: "Puff Sleeve Cotton Blouse",
    sizes: SIZE_SCALE,
    image: img("ch-p7", 700, 1000),
    price: 1099,
    mrp: 1599,
    media: gallery("ch-p7", 3, false),
    description:
      "A puff sleeve blouse in crisp cotton poplin — smart enough for work, easy enough for weekends.",
    fabric: "Cotton poplin",
    fit: "Regular",
    color: "White",
    care: [
      "Machine wash cold",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed",
    ],
    rating: 4.2,
    reviewCount: 64,
  },
  {
    id: "p8",
    subCategory: "trousers",
    category: "bottom-wear",
    brand: "ClothifyHer",
    title: "Wide Leg Trousers in Sage",
    sizes: SIZE_SCALE,
    image: img("ch-p8", 700, 1000),
    price: 1349,
    mrp: 1899,
    media: gallery("ch-p8", 3, false),
    description: "Wide leg trousers with a fluid drape that moves as you walk.",
    fabric: "Tencel blend",
    fit: "Wide leg",
    color: "Sage",
    care: [
      "Machine wash cold",
      "Do not bleach",
      "Tumble dry low",
      "Warm iron if needed",
    ],
    rating: 4.4,
    reviewCount: 119,
  },
];

export const FEATURED_COLLECTION: FeaturedCollectionData = {
  id: "summer-edit",
  eyebrow: "Collection",
  title: "The Summer Edit",
  description:
    "Breathable cottons and linen blends in a palette built for long, bright days.",
  image: img("ch-featured", 900, 1300),
  href: "/collections/summer",
  ctaLabel: "Shop the Edit",
  products: [
    {
      id: "f1",
      subCategory: "shift",
      category: "dresses",
      brand: "ClothifyHer",
      title: "Sleeveless Cotton Shift Dress",
      sizes: SIZE_SCALE,
      image: img("ch-f1", 700, 1000),
      price: 1699,
      mrp: 2399,
    },
    {
      id: "f2",
      subCategory: "2-pc-set",
      category: "co-ord-sets",
      brand: "ClothifyHer",
      title: "Striped Linen Co-ord Set",
      sizes: SIZE_SCALE,
      image: img("ch-f2", 700, 1000),
      price: 2299,
      mrp: 3199,
      badge: "New",
    },
    {
      id: "f3",
      subCategory: "straight",
      category: "kurtas",
      brand: "ClothifyHer",
      title: "Mul Cotton Straight Kurta",
      sizes: SIZE_SCALE,
      image: img("ch-f3", 700, 1000),
      price: 1249,
      mrp: 1799,
    },
  ],
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    name: "Ananya R.",
    location: "Bengaluru",
    rating: 5,
    quote:
      "The cotton is genuinely soft, not the stiff kind that softens after ten washes. Wore the kurta straight out of the packet.",
    product: "Hand Block Printed Kurta",
  },
  {
    id: "t2",
    name: "Meera S.",
    location: "Pune",
    rating: 5,
    quote:
      "Sizing chart was accurate, which almost never happens for me. The co-ord fits like it was measured for me.",
    product: "Ivory Co-ord Set",
  },
  {
    id: "t3",
    name: "Fatima K.",
    location: "Hyderabad",
    rating: 4,
    quote:
      "Lovely drape and the colour is exactly as photographed. Took a day longer than the estimate to arrive.",
    product: "Floral Midi Dress",
  },
];

/* Codes the mock cart accepts. Swap for the coupon API in Phase 3. */
export const COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    description: "10% off your first order",
    type: "percentage",
    value: 10,
    minOrderValue: 999,
    maxDiscount: 500,
  },
  {
    code: "FLAT300",
    description: "₹300 off orders above ₹2,499",
    type: "flat",
    value: 300,
    minOrderValue: 2499,
  },
  {
    code: "FESTIVE20",
    description: "20% off the festive edit",
    type: "percentage",
    value: 20,
    minOrderValue: 3499,
    maxDiscount: 1200,
  },
];

/* ────────────────────────────────────────────────────────────────────
   Demo seed data.

   The cart and wishlist slices fall back to these ONLY when localStorage
   is empty, so a first-time visitor lands on populated screens instead of
   empty states. Once the user touches either, their own state persists
   and these are never read again.

   Delete both exports (and their `readJSON` fallbacks in the slices) when
   the real cart/wishlist APIs land.
   To see the empty states again:  localStorage.clear()
   ──────────────────────────────────────────────────────────────────── */

const toLine = (
  product: Product,
  size: string,
  quantity: number,
): CartLine => ({
  lineId: `${product.id}:default:${size}`,
  productId: product.id,
  brand: product.brand,
  title: product.title,
  image: product.image,
  price: product.price,
  mrp: product.mrp,
  size,
  quantity,
});

export const DEMO_CART_LINES: CartLine[] = [
  toLine(TRENDING_PRODUCTS[0], "M", 1), // Hand Block Printed Cotton Kurta
  toLine(TRENDING_PRODUCTS[3], "S", 2), // Relaxed Linen Blend Top
  toLine(TRENDING_PRODUCTS[7], "L", 1), // Wide Leg Trousers in Sage
];

const DAY = 24 * 60 * 60 * 1000;

export const DEMO_WISHLIST: WishlistEntry[] = [
  TRENDING_PRODUCTS[1], // Floral Midi Dress
  TRENDING_PRODUCTS[2], // Ivory Co-ord Set
  TRENDING_PRODUCTS[5], // Anarkali Kurta
  // Seeded with no sizes so the sold-out treatment is visible on load.
  { ...TRENDING_PRODUCTS[6], sizes: [] },
].map((product, i) => ({ product, addedAt: Date.now() - i * DAY }));

/* Reviews shown on the product detail page (doc §8, §21). */
export const REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Ananya R.",
    rating: 5,
    date: "12 Jul 2026",
    title: "Softer than I expected",
    body: "Genuinely soft cotton, not the stiff kind that only softens after ten washes. Wore it straight out of the packet and the print hasn't faded.",
    verified: true,
    size: "M",
  },
  {
    id: "r2",
    author: "Meera S.",
    rating: 5,
    date: "28 Jun 2026",
    title: "Sizing chart is accurate",
    body: "Which almost never happens for me. Ordered my usual M and it fits exactly as the measurements said it would.",
    verified: true,
    size: "M",
  },
  {
    id: "r3",
    author: "Fatima K.",
    rating: 4,
    date: "15 Jun 2026",
    title: "Lovely colour, slow delivery",
    body: "The shade is exactly as photographed and the drape is beautiful. Took two days longer than the estimate to arrive, hence four stars.",
    verified: true,
    size: "L",
  },
  {
    id: "r4",
    author: "Priya N.",
    rating: 4,
    date: "2 Jun 2026",
    title: "Good for daily wear",
    body: "Comfortable enough to wear all day at the office. Wish the pockets were a little deeper.",
    verified: false,
    size: "S",
  },
];

/* ────────────────────────────────────────────────────────────────────
   Category listing data
   ──────────────────────────────────────────────────────────────────── */

export interface CategoryMeta {
  slug: string;
  name: string;
  tagline: string;
}

export const CATEGORY_META: Record<string, CategoryMeta> = {
  kurtas: {
    slug: "kurtas",
    name: "Kurtas",
    tagline: "Everyday cottons, festive georgettes and everything between",
  },
  dresses: {
    slug: "dresses",
    name: "Dresses",
    tagline: "Midis, maxis and easy shift silhouettes",
  },
  "co-ord-sets": {
    slug: "co-ord-sets",
    name: "Co-ord Sets",
    tagline: "Matched sets that split across your whole wardrobe",
  },
  tops: {
    slug: "tops",
    name: "Tops",
    tagline: "Blouses and relaxed layers for work and weekends",
  },
  "bottom-wear": {
    slug: "bottom-wear",
    name: "Bottom Wear",
    tagline: "Palazzos, trousers and wide-leg staples",
  },
  sale: {
    slug: "sale",
    name: "Sale",
    tagline: "Everything currently marked down",
  },
};

/**
 * Pseudo-categories: collections drawn from the whole catalog by a rule rather
 * than a `category` slug. `sale` was the first of these; trending, best-sellers
 * and new-arrivals follow the same shape so the listing page can serve them all
 * from /categories/:slug without knowing which is which.
 */
export const COLLECTION_META: Record<string, CategoryMeta> = {
  trending: {
    slug: "trending",
    name: "Trending Now",
    tagline: "What everyone's adding to their bag this week",
  },
  "best-sellers": {
    slug: "best-sellers",
    name: "Best Sellers",
    tagline: "The styles our customers keep coming back for",
  },
  "new-arrivals": {
    slug: "new-arrivals",
    name: "New Arrivals",
    tagline: "Fresh silhouettes and new-season favourites",
  },
};

/**
 * Membership rule for each pseudo-category, keyed by slug. A listing page for
 * one of these filters the whole CATALOG by its predicate instead of matching
 * on `category`. `sale` lives here too so the special-case is gone from the
 * listing page. Once the catalog API lands these become server-side queries.
 */
export const COLLECTION_FILTERS: Record<string, (p: Product) => boolean> = {
  sale: (p) => Boolean(p.mrp && p.mrp > p.price),
  trending: (p) => (p.reviewCount ?? 0) >= 100,
  "best-sellers": (p) => p.badge === "Bestseller" || (p.rating ?? 0) >= 4.6,
  "new-arrivals": (p) => p.badge === "New",
};

/** Subcategory per generated product — keeps mk() call sites unchanged. */
const SUB_BY_ID: Record<string, string> = {
  k1: "straight",
  k2: "a-line",
  k3: "anarkali",
  k4: "a-line",
  d1: "maxi",
  d2: "midi",
  d3: "shirt-dress",
  d4: "maxi",
  c1: "2-pc-set",
  c2: "3-pc-set",
  c3: "3-pc-set",
  t1: "peplum",
  t2: "blouses",
  t3: "relaxed",
  b1: "culottes",
  b2: "dhoti-pants",
  b3: "trousers",
  b4: "palazzo",
};

/** Terser product factory — the listing needs volume, not eleven more literals. */
const mk = (
  id: string,
  category: string,
  title: string,
  price: number,
  mrp: number | undefined,
  opts: {
    badge?: string;
    sizes?: string[];
    video?: boolean;
    rating?: number;
    reviews?: number;
    color?: string;
    fabric?: string;
  } = {},
): Product => ({
  id,
  category,
  subCategory: SUB_BY_ID[id],
  brand: "ClothifyHer",
  title,
  sizes: opts.sizes ?? SIZE_SCALE,
  image: img(`ch-${id}`, 700, 1000),
  media: gallery(`ch-${id}`, 3, opts.video ?? false),
  price,
  mrp,
  badge: opts.badge,
  description: `${title} — cut for comfort and finished with the details that make it worth keeping.`,
  fabric: opts.fabric ?? "Cotton blend",
  fit: "Regular fit",
  color: opts.color ?? "Multi",
  care: ["Machine wash cold", "Do not bleach", "Tumble dry low"],
  rating: opts.rating ?? 4.3,
  reviewCount: opts.reviews ?? 74,
});

/** Fills each category out to a believable listing page. */
export const MORE_PRODUCTS: Product[] = [
  mk("k1", "kurtas", "Straight Cotton Kurta in Mustard", 1299, 1899, {
    color: "Mustard",
    rating: 4.5,
    reviews: 156,
  }),
  mk("k2", "kurtas", "Embroidered Yoke Kurta in Teal", 1799, 2499, {
    color: "Teal",
    video: true,
    badge: "New",
    rating: 4.6,
    reviews: 92,
  }),
  mk("d1", "dresses", "Tiered Cotton Maxi Dress", 2199, 3199, {
    color: "Rust",
    rating: 4.4,
    reviews: 118,
  }),
  mk("d2", "dresses", "Wrap Dress in Printed Crepe", 1999, 2699, {
    color: "Navy",
    video: true,
    rating: 4.2,
    reviews: 67,
  }),
  mk("d3", "dresses", "Sleeveless Linen Shirt Dress", 2399, undefined, {
    color: "Olive",
    badge: "New",
    rating: 4.7,
    reviews: 41,
  }),
  mk("c1", "co-ord-sets", "Printed Cotton Co-ord with Shorts", 1899, 2699, {
    color: "Blush",
    rating: 4.3,
    reviews: 83,
  }),
  mk("c2", "co-ord-sets", "Relaxed Kurta & Palazzo Set", 2699, 3799, {
    color: "Ivory",
    badge: "Few left",
    sizes: ["S", "M", "L"],
    rating: 4.6,
    reviews: 204,
  }),
  mk("t1", "tops", "Cotton Peplum Top", 899, 1299, {
    color: "White",
    rating: 4.1,
    reviews: 52,
  }),
  mk("t2", "tops", "Bell Sleeve Georgette Blouse", 1249, 1799, {
    color: "Wine",
    video: true,
    rating: 4.4,
    reviews: 96,
  }),
  mk("t3", "tops", "Sleeveless Rib Knit Top", 749, 1099, {
    color: "Black",
    sizes: [],
    rating: 4.0,
    reviews: 33,
  }),
  mk("b1", "bottom-wear", "Pleated Culottes in Beige", 1449, 1999, {
    color: "Beige",
    rating: 4.3,
    reviews: 71,
  }),
  mk("b2", "bottom-wear", "Cotton Dhoti Pants", 1099, 1599, {
    color: "Indigo",
    rating: 4.5,
    reviews: 128,
  }),
  mk("b3", "bottom-wear", "Tapered Ankle Trousers", 1599, 2299, {
    color: "Charcoal",
    badge: "Bestseller",
    rating: 4.6,
    reviews: 189,
  }),
  // Depth for the thinner subcategory chips — a chip showing "1" reads broken.
  mk("k3", "kurtas", "Anarkali Kurta in Dusty Rose", 2299, 3199, {
    color: "Rose",
    rating: 4.5,
    reviews: 97,
  }),
  mk("k4", "kurtas", "A-Line Kurta in Sage Cotton", 1399, 1999, {
    color: "Sage",
    rating: 4.2,
    reviews: 61,
  }),
  mk("d4", "dresses", "Cotton Maxi with Smocked Bodice", 2499, 3499, {
    color: "Terracotta",
    video: true,
    rating: 4.6,
    reviews: 84,
  }),
  mk("c3", "co-ord-sets", "3 Pc Kurta, Pant & Dupatta Set", 3299, 4699, {
    color: "Maroon",
    badge: "New",
    rating: 4.7,
    reviews: 152,
  }),
  mk("b4", "bottom-wear", "Flared Cotton Palazzo", 1049, 1499, {
    color: "Ivory",
    rating: 4.4,
    reviews: 103,
  }),
];

/** One colourway: its own gallery plus a square swatch crop. */
const variant = (
  id: string,
  color: string,
  seed: string,
  withVideo = false,
): ProductVariant => ({
  id,
  color,
  thumb: img(`${seed}-sw`, 120, 120),
  media: gallery(seed, 3, withVideo),
});

/**
 * Colourways, keyed by product id. Kept separate so the product literals stay
 * readable; merged onto the product in CATALOG below, which is the shape the
 * API will return once it exists.
 */
const PRODUCT_VARIANTS: Record<string, ProductVariant[]> = {
  p1: [
    variant("p1-indigo", "Indigo", "ch-p1", true),
    variant("p1-rust", "Rust", "ch-p1-rust"),
    variant("p1-olive", "Olive", "ch-p1-olive"),
  ],
  p3: [
    variant("p3-ivory", "Ivory", "ch-p3", true),
    variant("p3-blush", "Blush", "ch-p3-blush"),
  ],
  p6: [
    variant("p6-wine", "Wine", "ch-p6", true),
    variant("p6-emerald", "Emerald", "ch-p6-emerald"),
    variant("p6-black", "Black", "ch-p6-black"),
  ],
  k2: [
    variant("k2-teal", "Teal", "ch-k2", true),
    variant("k2-mustard", "Mustard", "ch-k2-mustard"),
  ],
  d1: [
    variant("d1-rust", "Rust", "ch-d1"),
    variant("d1-navy", "Navy", "ch-d1-navy"),
    variant("d1-sage", "Sage", "ch-d1-sage"),
  ],
  c3: [
    variant("c3-maroon", "Maroon", "ch-c3"),
    variant("c3-ivory", "Ivory", "ch-c3-ivory"),
  ],
  b3: [
    variant("b3-charcoal", "Charcoal", "ch-b3"),
    variant("b3-beige", "Beige", "ch-b3-beige"),
  ],
};

/** Every buyable product, the source the listing and detail pages read from. */
export const CATALOG: Product[] = [
  ...TRENDING_PRODUCTS,
  ...FEATURED_COLLECTION.products,
  ...MORE_PRODUCTS,
].map((p) =>
  PRODUCT_VARIANTS[p.id] ? { ...p, variants: PRODUCT_VARIANTS[p.id] } : p,
);

/**
 * Subcategory rails, keyed by category slug (flow doc §7 refinement).
 * Only categories with meaningful splits get a rail — the listing hides it
 * entirely rather than showing a rail with one chip.
 */
export const SUBCATEGORIES: Record<string, SubCategory[]> = {
  kurtas: [
    {
      slug: "straight",
      label: "Straight",
      image: img("ch-sub-straight", 160, 160),
    },
    {
      slug: "anarkali",
      label: "Anarkali",
      image: img("ch-sub-anarkali", 160, 160),
    },
    { slug: "a-line", label: "A-Line", image: img("ch-sub-aline", 160, 160) },
  ],
  dresses: [
    { slug: "midi", label: "Midi", image: img("ch-sub-midi", 160, 160) },
    { slug: "maxi", label: "Maxi", image: img("ch-sub-maxi", 160, 160) },
    {
      slug: "shirt-dress",
      label: "Shirt Dress",
      image: img("ch-sub-shirt", 160, 160),
    },
    { slug: "shift", label: "Shift", image: img("ch-sub-shift", 160, 160) },
  ],
  "co-ord-sets": [
    { slug: "2-pc-set", label: "2 Pc Set", image: img("ch-sub-2pc", 160, 160) },
    { slug: "3-pc-set", label: "3 Pc Set", image: img("ch-sub-3pc", 160, 160) },
  ],
  tops: [
    {
      slug: "blouses",
      label: "Blouses",
      image: img("ch-sub-blouse", 160, 160),
    },
    {
      slug: "relaxed",
      label: "Relaxed",
      image: img("ch-sub-relaxed", 160, 160),
    },
    { slug: "peplum", label: "Peplum", image: img("ch-sub-peplum", 160, 160) },
  ],
  "bottom-wear": [
    {
      slug: "palazzo",
      label: "Palazzo",
      image: img("ch-sub-palazzo", 160, 160),
    },
    {
      slug: "trousers",
      label: "Trousers",
      image: img("ch-sub-trousers", 160, 160),
    },
    {
      slug: "culottes",
      label: "Culottes",
      image: img("ch-sub-culottes", 160, 160),
    },
    {
      slug: "dhoti-pants",
      label: "Dhoti Pants",
      image: img("ch-sub-dhoti", 160, 160),
    },
  ],
};

/** Label for a slug, for chips and page titles. */
export const subCategoryLabel = (category: string, slug: string) =>
  SUBCATEGORIES[category]?.find((s) => s.slug === slug)?.label ?? slug;
