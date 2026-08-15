import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SubCategory } from "@/interfaces/catalog";

interface SubCategoryRailProps {
  subCategories: SubCategory[];
  /** null = "All" is selected. */
  active: string | null;
  onSelect: (slug: string | null) => void;
  /**
   * Result count per slug, so a chip can show how much sits behind it. Omit
   * when the counts aren't known — the chips then render without a number
   * rather than claiming every sub-category is empty.
   */
  counts?: Record<string, number>;
  totalCount?: number;
}

/**
 * Horizontal refinement rail under the listing toolbar. Echoes the home page's
 * circular category chips so the two read as the same family, but pill-shaped
 * to sit tighter in a page that already has a filter bar.
 */
export function SubCategoryRail({
  subCategories,
  active,
  onSelect,
  counts,
  totalCount,
}: SubCategoryRailProps) {
  return (
    <nav aria-label="Refine by type">
      <ul className="hide-scrollbar -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        <li>
          <Chip
            label="All"
            count={totalCount}
            active={active === null}
            onClick={() => onSelect(null)}
          />
        </li>

        {subCategories.map((sub) => (
          <li key={sub.slug}>
            <Chip
              label={sub.label}
              image={sub.image}
              count={counts?.[sub.slug]}
              active={active === sub.slug}
              onClick={() => onSelect(active === sub.slug ? null : sub.slug)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Chip({
  label,
  image,
  count,
  active,
  onClick,
}: {
  label: string;
  image?: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex shrink-0 items-center gap-2.5 rounded-full border py-1.5 pr-4 pl-1.5 transition-colors",
        active
          ? "border-maroon-800 bg-maroon-800 text-white"
          : "hover:border-maroon-300 border-stone-300 bg-white text-stone-700",
      )}
    >
      {/* "All" has no thumbnail, so its icon sits in an identically sized
          circle — otherwise that chip renders shorter than its neighbours. */}
      <span
        className={cn(
          "rounded-full p-[1.5px] transition-colors",
          active ? "bg-gold-400" : "bg-stone-200",
        )}
      >
        {image ? (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <span
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full transition-colors",
              active ? "bg-maroon-700" : "bg-stone-100",
            )}
          >
            <LayoutGrid
              className={cn(
                "h-4 w-4",
                active ? "text-cream-100" : "text-stone-500",
              )}
            />
          </span>
        )}
      </span>

      <span className="text-sm font-medium whitespace-nowrap">{label}</span>
      {count != null && (
        <span
          className={cn(
            "text-xs tabular-nums",
            active ? "text-white/60" : "text-stone-400",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
