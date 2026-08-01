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
                aria-label={variant.color}
                title={variant.color}
                className={cn(
                  "block rounded-xl border-2 p-0.5 transition-colors",
                  isActive
                    ? "border-maroon-800"
                    : "border-transparent hover:border-stone-300",
                )}
              >
                <img
                  src={variant.thumb}
                  alt=""
                  loading="lazy"
                  className="h-14 w-14 rounded-lg object-cover"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
