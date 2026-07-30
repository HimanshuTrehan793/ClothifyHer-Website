import { Link } from "react-router";

const COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "Sarees", href: "/categories/sarees" },
      { label: "Kurtas", href: "/categories/kurtas" },
      { label: "Lehengas", href: "/categories/lehengas" },
      { label: "Jewelry", href: "/categories/jewelry" },
    ],
  },
  {
    heading: "Help",
    links: [
      { label: "Track Order", href: "/orders" },
      { label: "Returns", href: "/returns" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Artisans", href: "/artisans" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-maroon-900 text-stone-200">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-serif text-2xl tracking-[0.24em] text-white">
              VIRAASAT
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-stone-300/80">
              Handcrafted Indian wear from ateliers and looms across the
              country.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="text-gold-300 mb-3 text-xs font-semibold tracking-[0.16em] uppercase">
                {column.heading}
              </p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-stone-300/85 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mt-10 border-t border-white/10 pt-6 text-xs text-stone-400">
          © {new Date().getFullYear()} Viraasat. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
