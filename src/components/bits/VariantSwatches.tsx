import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/interfaces/catalog";

interface VariantSwatchesProps {
  variants: ProductVariant[];
  activeId: string;
  onSelect: (variant: ProductVariant) => void;
}

/**
 * Colourway picker. Image swatches rather than colour dots — a photograph of
 * the actual garment tells you far more about a fabric than a flat hex chip.
 */
export function VariantSwatches({
  variants,
  activeId,
  onSelect,
}: VariantSwatchesProps) {
  const active = variants.find((v) => v.id === activeId);

  return (
    <div>
      <p className="text-sm font-semibold text-stone-800">
        Colour
        {active && (
          <span className="ml-1.5 font-normal text-stone-500">
            {active.color}
            {active.outOfStock && " · Sold out"}
          </span>
        )}
      </p>

      <ul className="mt-3 flex flex-wrap gap-2.5">
        {variants.map((variant) => {
          const isActive = variant.id === activeId;
          return (
            <li key={variant.id}>
              <button
                type="button"
                onClick={() => onSelect(variant)}
                aria-pressed={isActive}
                aria-label={
                  variant.outOfStock
                    ? `${variant.color}, sold out`
                    : variant.color
                }
                title={
                  variant.outOfStock
                    ? `${variant.color} — sold out`
                    : variant.color
                }
                className={cn(
                  "block rounded-xl border-2 p-0.5 transition-colors",
                  isActive
                    ? "border-maroon-800"
                    : "border-transparent hover:border-stone-300",
                )}
              >
                <span className="relative block">
                  <img
                    src={variant.thumb}
                    alt=""
                    loading="lazy"
                    className={cn(
                      "h-14 w-14 rounded-lg object-cover",
                      variant.outOfStock && "opacity-40 grayscale",
                    )}
                  />
                  {/* Still selectable — shoppers can view a sold-out colour's
                      photos — but the diagonal says it can't be bought. */}
                  {variant.outOfStock && (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg"
                    >
                      <span className="absolute top-1/2 left-1/2 h-px w-[140%] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-stone-500" />
                    </span>
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
