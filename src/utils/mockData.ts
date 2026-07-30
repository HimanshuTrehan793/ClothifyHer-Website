import type {
  CategoryStory,
  HeroSlide,
  Occasion,
  Product,
} from "@/interfaces/catalog";

/**
 * Placeholder imagery.
 *
 * These are seeded picsum.photos URLs — they always resolve, so the layout can
 * be reviewed honestly, but they are NOT Indian fashion photography. Swap this
 * one map for your CDN/Unsplash URLs and every section picks up the change.
 */
const img = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const CATEGORY_STORIES: CategoryStory[] = [
  { id: "sarees", label: "Sarees", image: img("saree", 200, 200), href: "/categories/sarees" },
  { id: "kurtas", label: "Kurtas", image: img("kurta", 200, 200), href: "/categories/kurtas" },
  { id: "lehengas", label: "Lehengas", image: img("lehenga", 200, 200), href: "/categories/lehengas" },
  { id: "jewelry", label: "Jewelry", image: img("jewelry", 200, 200), href: "/categories/jewelry" },
  { id: "fusion", label: "Fusion", image: img("fusion", 200, 200), href: "/categories/fusion" },
  { id: "dupattas", label: "Dupattas", image: img("dupatta", 200, 200), href: "/categories/dupattas" },
];

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: "festive",
    eyebrow: "New Season",
    title: "The Festive Edit",
    subtitle:
      "Authentic handcrafted styles from top Indian brands — woven, dyed and embroidered by master artisans.",
    image: img("festive-hero", 1200, 1600),
    primaryCta: { label: "Shop the Collection", href: "/collections/festive" },
    secondaryCta: { label: "Shop by Occasion", href: "#occasions" },
  },
  {
    id: "banarasi",
    eyebrow: "Handloom",
    title: "Banarasi Revival",
    subtitle:
      "Pure silk weaves from Varanasi looms, in zari motifs that took six weeks a saree.",
    image: img("banarasi-hero", 1200, 1600),
    primaryCta: { label: "Explore Handloom", href: "/collections/handloom" },
    secondaryCta: { label: "Meet the Weavers", href: "/artisans" },
  },
  {
    id: "fusion",
    eyebrow: "Everyday",
    title: "Modern Heritage",
    subtitle:
      "Indo-western silhouettes that move from a morning meeting to an evening mehendi.",
    image: img("fusion-hero", 1200, 1600),
    primaryCta: { label: "Shop Fusion", href: "/collections/fusion" },
  },
];

export const OCCASIONS: Occasion[] = [
  {
    id: "wedding-guest",
    title: "Wedding Guest",
    caption: "Lehengas & heavy silks",
    image: img("wedding", 900, 1100),
    href: "/occasions/wedding-guest",
    wide: true,
  },
  {
    id: "everyday-ethnic",
    title: "Everyday Ethnic",
    caption: "Cotton kurtas & co-ords",
    image: img("everyday", 700, 900),
    href: "/occasions/everyday-ethnic",
  },
  {
    id: "office-wear",
    title: "Office Wear",
    caption: "Structured, understated",
    image: img("office", 700, 900),
    href: "/occasions/office-wear",
  },
  {
    id: "festive-nights",
    title: "Festive Nights",
    caption: "Sequins, silk & shimmer",
    image: img("nights", 900, 1100),
    href: "/occasions/festive-nights",
    wide: true,
  },
];

export const TRENDING_PRODUCTS: Product[] = [
  {
    id: "p1",
    brand: "Kalyani Weaves",
    title: "Kanjeevaram Silk Saree with Zari Border",
    image: img("prod-1", 700, 1000),
    price: 12499,
    mrp: 18999,
    badge: "Few left",
  },
  {
    id: "p2",
    brand: "Anokhi",
    title: "Hand Block Printed Cotton Kurta Set",
    image: img("prod-2", 700, 1000),
    price: 3299,
    mrp: 4499,
  },
  {
    id: "p3",
    brand: "Raas Couture",
    title: "Emerald Georgette Lehenga with Dupatta",
    image: img("prod-3", 700, 1000),
    price: 24999,
    mrp: 39999,
    badge: "New",
  },
  {
    id: "p4",
    brand: "Tarini",
    title: "Chanderi Silk Anarkali in Ivory",
    image: img("prod-4", 700, 1000),
    price: 8749,
    mrp: 12499,
  },
  {
    id: "p5",
    brand: "Meera Studio",
    title: "Indigo Ajrakh Cotton Co-ord Set",
    image: img("prod-5", 700, 1000),
    price: 4199,
  },
  {
    id: "p6",
    brand: "Suvarna",
    title: "Temple Jewellery Choker Set",
    image: img("prod-6", 700, 1000),
    price: 6899,
    mrp: 9499,
    badge: "Bestseller",
  },
];
