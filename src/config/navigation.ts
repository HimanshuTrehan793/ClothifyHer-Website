/**
 * Site structure, straight from the flow doc — §1 (sitemap) and §5 (mega menu).
 * Everything that renders a nav link reads from here so the taxonomy lives in
 * exactly one place.
 */

export interface NavLink {
  label: string;
  href: string;
}

export interface MegaColumn {
  heading: string;
  links: NavLink[];
}

export interface PrimaryNavItem extends NavLink {
  /** Present → the item opens a mega-menu panel on desktop. */
  mega?: MegaColumn[];
  /** Renders in the brand accent, e.g. Sale. */
  accent?: boolean;
}

export const WOMEN_CATEGORIES: NavLink[] = [
  { label: "Kurtas", href: "/categories/kurtas" },
  { label: "Dresses", href: "/categories/dresses" },
  { label: "Co-ord Sets", href: "/categories/co-ord-sets" },
  { label: "Tops", href: "/categories/tops" },
  { label: "Bottom Wear", href: "/categories/bottom-wear" },
];

export const COLLECTIONS: NavLink[] = [
  { label: "Festive", href: "/collections/festive" },
  { label: "Summer", href: "/collections/summer" },
  { label: "Office Wear", href: "/collections/office-wear" },
  { label: "Casual", href: "/collections/casual" },
  { label: "Wedding", href: "/collections/wedding" },
];

export const PRIMARY_NAV: PrimaryNavItem[] = [
  { label: "Trending", href: "/#trending" },
  { label: "New Arrivals", href: "/#new-arrivals" },
  { label: "Best Sellers", href: "/#best-sellers" },
  { label: "Collections", href: "/#occasions" },
];

export const FOOTER_COLUMNS: MegaColumn[] = [
  { heading: "Shop", links: WOMEN_CATEGORIES },
  {
    heading: "Help",
    links: [
      { label: "Track Order", href: "/orders" },
      { label: "Returns & Exchange", href: "/returns" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
];
