import { NavLink } from "react-router";
import { Home, LayoutGrid, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BottomNavItem } from "@/interfaces/navigation";

const ITEMS: BottomNavItem[] = [
  { id: "home", label: "Home", href: "/", icon: Home },
  {
    id: "categories",
    label: "Categories",
    href: "/categories",
    icon: LayoutGrid,
  },
  { id: "studio", label: "Studio", href: "/studio", icon: Sparkles },
  { id: "profile", label: "Profile", href: "/profile", icon: User },
];

/** Mobile-only tab bar. Hidden from `lg` up, where the top nav takes over. */
export function BottomNavBar() {
  return (
    <nav
      aria-label="Primary"
      className="border-maroon-100 bg-cream-50/95 fixed inset-x-0 bottom-0 z-50 border-t pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch">
        {ITEMS.map(({ id, label, href, icon: Icon }) => (
          <li key={id} className="flex-1">
            <NavLink
              to={href}
              end={href === "/"}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 py-2.5 transition-colors",
                  isActive
                    ? "text-maroon-800"
                    : "text-stone-500 hover:text-stone-700",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className="h-[22px] w-[22px]"
                    strokeWidth={isActive ? 2.1 : 1.75}
                  />
                  <span
                    className={cn(
                      "text-[11px]",
                      isActive ? "font-semibold" : "font-medium",
                    )}
                  >
                    {label}
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
