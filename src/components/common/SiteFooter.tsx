import { Link } from "react-router";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/bits/Logo";
import { BUSINESS } from "@/config/business";

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

const LINKS = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy & Policies", href: "/privacy" },
  { label: "About Us", href: "/about" },
  { label: "FAQ", href: "/faq" },
];

export function SiteFooter() {
  return (
    /* bg must stay maroon-800 (#5A1D29) — it matches the reversed logo art. */
    <footer className="bg-maroon-800 text-cream-100">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
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

          <div className="sm:text-right">
            <nav
              aria-label="Footer"
              className="flex flex-wrap gap-x-6 gap-y-2 sm:justify-end"
            >
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-cream-100/80 text-sm font-medium transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <address className="text-cream-100/70 mt-6 text-sm leading-relaxed not-italic">
              <span className="mb-1 flex items-start gap-2 sm:justify-end">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 sm:order-2" />
                <span className="sm:order-1">
                  {BUSINESS.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </span>
              <span className="text-cream-100/55 block text-xs">
                GSTIN: {BUSINESS.gstin}
              </span>
            </address>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-cream-100/55 text-xs">
            © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
          </p>
          <div className="text-cream-100/70 flex flex-wrap gap-x-5 gap-y-2 text-xs">
            <a
              href={`mailto:${BUSINESS.email}`}
              className="inline-flex items-center gap-1.5 hover:text-white"
            >
              <Mail className="h-3.5 w-3.5" />
              {BUSINESS.email}
            </a>
            <a
              href={`tel:${BUSINESS.phone}`}
              className="inline-flex items-center gap-1.5 hover:text-white"
            >
              <Phone className="h-3.5 w-3.5" />
              {BUSINESS.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
