import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DESKTOP_LINKS = [
  { label: "Sarees", href: "/categories/sarees" },
  { label: "Kurtas", href: "/categories/kurtas" },
  { label: "Lehengas", href: "/categories/lehengas" },
  { label: "Jewelry", href: "/categories/jewelry" },
  { label: "Fusion", href: "/categories/fusion" },
];

interface TopNavBarProps {
  bagCount?: number;
}

export function TopNavBar({ bagCount = 0 }: TopNavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // The drawer covers the page — stop the body scrolling behind it.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-stone-50/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="-ml-2 grid h-10 w-10 place-items-center rounded-full text-stone-800 transition-colors hover:bg-stone-200/70 lg:hidden"
          >
            <Menu className="h-6 w-6" strokeWidth={1.75} />
          </button>

          {/* Desktop gets inline links; mobile centres the wordmark instead. */}
          <nav className="hidden shrink-0 items-center gap-6 lg:flex">
            {DESKTOP_LINKS.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="hover:text-maroon-700 text-sm font-medium text-stone-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/"
            aria-label="VIRAASAT — home"
            className="text-maroon-800 flex-1 text-center font-serif text-2xl font-bold tracking-[0.28em] sm:text-[26px] lg:flex-none lg:px-8"
          >
            VIRAASAT
          </Link>

          <nav className="hidden shrink-0 items-center gap-6 lg:flex">
            {DESKTOP_LINKS.slice(2).map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="hover:text-maroon-700 text-sm font-medium text-stone-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1 lg:ml-auto">
            <IconLink to="/search" label="Search">
              <Search className="h-[22px] w-[22px]" strokeWidth={1.75} />
            </IconLink>
            <IconLink to="/wishlist" label="Wishlist">
              <Heart className="h-[22px] w-[22px]" strokeWidth={1.75} />
            </IconLink>
            <IconLink
              to="/cart"
              label={`Shopping bag, ${bagCount} item${bagCount === 1 ? "" : "s"}`}
            >
              <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.75} />
              {bagCount > 0 && (
                <span
                  aria-hidden
                  className="bg-maroon-700 absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-bold text-white"
                >
                  {bagCount > 9 ? "9+" : bagCount}
                </span>
              )}
            </IconLink>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function IconLink({
  to,
  label,
  children,
}: {
  to: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      aria-label={label}
      className="focus-visible:ring-maroon-700 relative grid h-10 w-10 place-items-center rounded-full text-stone-800 transition-colors hover:bg-stone-200/70 focus-visible:ring-2 focus-visible:outline-none"
    >
      {children}
    </Link>
  );
}

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-stone-900/40 transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        className={cn(
          "absolute inset-y-0 left-0 w-[78%] max-w-xs bg-stone-50 shadow-xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-stone-200 px-5">
          <span className="text-maroon-800 font-serif text-xl tracking-[0.2em]">
            VIRAASAT
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-9 w-9 place-items-center rounded-full text-stone-700 hover:bg-stone-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col p-2">
          {DESKTOP_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={onClose}
              className="hover:bg-maroon-50 hover:text-maroon-800 rounded-xl px-4 py-3 text-[15px] font-medium text-stone-700 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
