import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/bits/Logo";
import { PRIMARY_NAV, type PrimaryNavItem } from "@/config/navigation";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { useCart } from "@/features/cart/useCart";
import { useWishlist } from "@/features/wishlist/useWishlist";
import { openLogin, selectIsAuthenticated } from "@/features/auth/authSlice";

export function TopNavBar() {
  const dispatch = useAppDispatch();
  const { count: bagCount } = useCart();
  const { count: wishCount } = useWishlist();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);

  /* PRIMARY_NAV is entirely hash anchors (/#trending, /#new-arrivals …) that
     only resolve against the home page, so the menu — desktop row and mobile
     drawer alike — is hidden everywhere else. Other screens keep the logo,
     search, wishlist, bag and login; mobile still has the bottom tab bar. */
  const isHome = pathname === "/";

  // A route change while the drawer is open would otherwise strand it.
  useEffect(() => {
    setDrawerOpen(false);
    setOpenMega(null);
  }, [pathname]);

  // The drawer covers the page — stop the body scrolling behind it.
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Escape closes whichever layer is open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpenMega(null);
      setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="border-maroon-100 bg-cream-50/95 sticky top-0 z-50 border-b backdrop-blur-md">
        {/* ── Row 1: burger · logo · actions ─────────────────────── */}
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-10">
          {isHome ? (
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              className="hover:bg-maroon-50 -ml-2 grid h-10 w-10 place-items-center rounded-full text-stone-800 transition-colors lg:hidden"
            >
              <Menu className="h-6 w-6" strokeWidth={1.75} />
            </button>
          ) : (
            /* Holds the burger's footprint so the wordmark doesn't jump
               sideways when you navigate away from home. */
            <span aria-hidden className="-ml-2 h-10 w-10 shrink-0 lg:hidden" />
          )}

          <Link
            to="/"
            aria-label="ClothifyHer — home"
            className="flex flex-1 justify-center lg:flex-none lg:justify-start"
          >
            <Logo variant="wordmark" className="h-9 sm:h-10" />
          </Link>

          <div className="flex shrink-0 items-center gap-1 lg:ml-auto">
            <IconLink to="/search" label="Search">
              <Search className="h-[22px] w-[22px]" strokeWidth={1.75} />
            </IconLink>
            <IconLink to="/wishlist" label={`Favourites, ${wishCount} saved`}>
              <Heart className="h-[22px] w-[22px]" strokeWidth={1.75} />
              {wishCount > 0 && <Badge count={wishCount} />}
            </IconLink>
            {/* The bag lives on the account — guests are sent to sign in. */}
            {isAuthenticated ? (
              <IconLink
                to="/cart"
                label={`Shopping bag, ${bagCount} item${bagCount === 1 ? "" : "s"}`}
              >
                <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.75} />
                {bagCount > 0 && <Badge count={bagCount} />}
              </IconLink>
            ) : (
              <button
                type="button"
                onClick={() => dispatch(openLogin("cart"))}
                aria-label="Shopping bag"
                className="hover:bg-maroon-50 focus-visible:ring-maroon-700 relative grid h-10 w-10 place-items-center rounded-full text-stone-800 transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                <ShoppingBag className="h-[22px] w-[22px]" strokeWidth={1.75} />
              </button>
            )}

            {/* Signed in → straight to the account. Signed out → the login
                modal, so the user is never bounced to a gated page first. */}
            {isAuthenticated ? (
              <IconLink to="/profile" label="Your profile">
                <User className="h-[22px] w-[22px]" strokeWidth={1.75} />
              </IconLink>
            ) : (
              <button
                type="button"
                onClick={() => dispatch(openLogin("account"))}
                className="border-maroon-800 text-maroon-800 hover:bg-maroon-800 ml-2 hidden h-9 rounded-full border px-4 text-[13px] font-semibold transition-colors hover:text-white lg:block"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* ── Row 2: desktop nav + mega menu (doc §5) — home only ── */}
        {isHome && (
          <nav
            aria-label="Primary"
            onMouseLeave={() => setOpenMega(null)}
            className="border-maroon-100/70 hidden border-t lg:block"
          >
            <ul className="mx-auto flex max-w-7xl items-center justify-center gap-9 px-10">
              {PRIMARY_NAV.map((item) => (
                <MegaNavItem
                  key={item.href}
                  item={item}
                  open={openMega === item.label}
                  onOpen={() => setOpenMega(item.mega ? item.label : null)}
                />
              ))}
            </ul>
          </nav>
        )}
      </header>

      {isHome && (
        <MobileDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onLogin={() => {
            setDrawerOpen(false);
            dispatch(openLogin("account"));
          }}
        />
      )}
    </>
  );
}

function MegaNavItem({
  item,
  open,
  onOpen,
}: {
  item: PrimaryNavItem;
  open: boolean;
  onOpen: () => void;
}) {
  return (
    // `static` so the panel below can span the full header width.
    <li className="static" onMouseEnter={onOpen}>
      <Link
        to={item.href}
        aria-expanded={item.mega ? open : undefined}
        className={cn(
          "flex items-center gap-1 py-3.5 text-[13px] font-semibold tracking-wide uppercase transition-colors",
          item.accent
            ? "text-maroon-600 hover:text-maroon-800"
            : "hover:text-maroon-800 text-stone-700",
        )}
      >
        {item.label}
        {item.mega && (
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        )}
      </Link>

      {item.mega && (
        <div
          className={cn(
            "border-maroon-100 bg-cream-50 absolute inset-x-0 top-full border-t shadow-lg transition-all duration-200",
            open
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-1 opacity-0",
          )}
        >
          <div className="mx-auto flex max-w-7xl gap-16 px-10 py-8">
            {item.mega.map((column) => (
              <div key={column.heading}>
                <p className="text-gold-600 mb-3 text-[11px] font-bold tracking-[0.16em] uppercase">
                  {column.heading}
                </p>
                <ul className="space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="hover:text-maroon-800 text-sm text-stone-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <p className="text-maroon-800/70 ml-auto max-w-[15rem] self-end text-right font-serif text-lg leading-snug">
              Style · Comfort · Confidence
            </p>
          </div>
        </div>
      )}
    </li>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <span
      aria-hidden
      className="bg-maroon-800 absolute -top-0.5 -right-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full px-1 text-[10px] font-bold text-white"
    >
      {count > 9 ? "9+" : count}
    </span>
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
      className="hover:bg-maroon-50 focus-visible:ring-maroon-700 relative grid h-10 w-10 place-items-center rounded-full text-stone-800 transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      {children}
    </Link>
  );
}

function MobileDrawer({
  open,
  onClose,
  onLogin,
}: {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

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
          "bg-cream-50 absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col shadow-xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="border-maroon-100 flex h-16 shrink-0 items-center justify-between border-b px-5">
          <Logo variant="wordmark" className="h-8" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="hover:bg-maroon-50 grid h-9 w-9 place-items-center rounded-full text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="hide-scrollbar flex-1 overflow-y-auto p-2">
          {PRIMARY_NAV.map((item) =>
            item.mega ? (
              <div key={item.href}>
                <button
                  type="button"
                  onClick={() =>
                    setExpanded(expanded === item.label ? null : item.label)
                  }
                  aria-expanded={expanded === item.label}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-[15px] font-semibold text-stone-800"
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-stone-400 transition-transform duration-200",
                      expanded === item.label && "rotate-180",
                    )}
                  />
                </button>
                {expanded === item.label && (
                  <ul className="border-maroon-100 mb-1 ml-4 space-y-0.5 border-l pl-3">
                    {item.mega
                      .flatMap((c) => c.links)
                      .map((link) => (
                        <li key={link.href}>
                          <Link
                            to={link.href}
                            onClick={onClose}
                            className="hover:text-maroon-800 block rounded-lg px-3 py-2 text-sm text-stone-600"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={cn(
                  "hover:bg-maroon-50 block rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors",
                  item.accent ? "text-maroon-600" : "text-stone-800",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="border-maroon-100 shrink-0 border-t p-5">
          <button
            type="button"
            onClick={onLogin}
            className="bg-maroon-800 w-full rounded-full py-3 text-center text-sm font-semibold text-white"
          >
            Login / Sign up
          </button>
        </div>
      </aside>
    </div>
  );
}
