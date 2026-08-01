import { cn } from "@/lib/utils";
import {
  PRICE_BUCKETS,
  SIZE_OPTIONS,
  SORT_OPTIONS,
  type Filters,
  type SortKey,
} from "@/utils/catalogFilters";

interface FilterPanelProps {
  filters: Filters;
  colours: string[];
  availableSizes: string[];
  onToggle: (facet: keyof Filters, value: string) => void;
  onInStockChange: (value: boolean) => void;
  /** Sort lives here rather than in the toolbar — it's a refinement too. */
  sort: SortKey;
  onSortChange: (value: SortKey) => void;
}

export function FilterPanel({
  filters,
  colours,
  availableSizes,
  onToggle,
  onInStockChange,
  sort,
  onSortChange,
}: FilterPanelProps) {
  return (
    <div className="space-y-7">
      <Facet title="Sort by">
        <ul className="space-y-2.5">
          {SORT_OPTIONS.map((option) => (
            <li key={option.value}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-700">
                <input
                  type="radio"
                  name="sort"
                  checked={sort === option.value}
                  onChange={() => onSortChange(option.value)}
                  className="accent-maroon-800 h-4 w-4"
                />
                {option.label}
              </label>
            </li>
          ))}
        </ul>
      </Facet>

      <Facet title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.filter((s) => availableSizes.includes(s)).map(
            (size) => (
              <button
                key={size}
                type="button"
                onClick={() => onToggle("sizes", size)}
                aria-pressed={filters.sizes.includes(size)}
                className={cn(
                  "h-9 min-w-10 rounded-full border px-3 text-xs font-medium transition-colors",
                  filters.sizes.includes(size)
                    ? "border-maroon-800 bg-maroon-800 text-white"
                    : "hover:border-maroon-600 border-stone-300 text-stone-700",
                )}
              >
                {size}
              </button>
            ),
          )}
        </div>
      </Facet>

      <Facet title="Price">
        <ul className="space-y-2.5">
          {PRICE_BUCKETS.map((bucket) => (
            <li key={bucket.id}>
              <Check
                label={bucket.label}
                checked={filters.prices.includes(bucket.id)}
                onChange={() => onToggle("prices", bucket.id)}
              />
            </li>
          ))}
        </ul>
      </Facet>

      {colours.length > 1 && (
        <Facet title="Colour">
          <ul className="space-y-2.5">
            {colours.map((colour) => (
              <li key={colour}>
                <Check
                  label={colour}
                  checked={filters.colors.includes(colour)}
                  onChange={() => onToggle("colors", colour)}
                />
              </li>
            ))}
          </ul>
        </Facet>
      )}

      <Facet title="Availability">
        <Check
          label="In stock only"
          checked={filters.inStockOnly}
          onChange={() => onInStockChange(!filters.inStockOnly)}
        />
      </Facet>
    </div>
  );
}

function Facet({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-bold tracking-[0.14em] text-stone-500 uppercase">
        {title}
      </p>
      {children}
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-stone-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="accent-maroon-800 h-4 w-4"
      />
      {label}
    </label>
  );
}
