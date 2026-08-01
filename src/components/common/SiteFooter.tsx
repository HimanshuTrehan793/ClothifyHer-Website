import { Link } from "react-router";
import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/bits/Logo";
import { FOOTER_COLUMNS } from "@/config/navigation";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/clothifyher",
    icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://facebook.com/clothifyher",
    icon: Facebook,
  },
];

export function SiteFooter() {
  return (
    /* bg must stay maroon-800 (#5A1D29) — it matches the reversed logo art. */
    <footer className="bg-maroon-800 text-cream-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Logo variant="wordmark" tone="cream" className="h-10" />
            <p className="text-cream-100/70 mt-4 max-w-xs text-sm leading-relaxed">
              Everyday womenswear built for style, comfort and confidence.
            </p>

            <div className="mt-5 flex gap-2">
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="text-gold-300 mb-3 text-xs font-semibold tracking-[0.16em] uppercase">
                {column.heading}
              </p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-cream-100/75 text-sm transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-cream-100/55 text-xs">
            © {new Date().getFullYear()} ClothifyHer. All rights reserved.
          </p>
          <div className="text-cream-100/70 flex flex-wrap gap-x-5 gap-y-2 text-xs">
            <a
              href="mailto:care@clothifyher.com"
              className="inline-flex items-center gap-1.5 hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              care@clothifyher.com
            </a>
            <a
              href="tel:+919000000000"
              className="inline-flex items-center gap-1.5 hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              +91 90000 00000
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
