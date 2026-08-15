import { Minus, Plus, Trash2 } from "lucide-react";
import { MAX_QTY_PER_LINE } from "@/utils/constants";

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  label: string;
  /**
   * Per-order cap for this line. The server sets it per size
   * (`max_order_quantity`) and clamps anything above it, so pass the value from
   * the cart row; the app-wide constant is only a fallback.
   */
  max?: number;
}

export function QuantityStepper({
  quantity,
  onChange,
  label,
  max = MAX_QTY_PER_LINE,
}: QuantityStepperProps) {
  const atMax = quantity >= max;

  return (
    <div className="inline-flex items-center rounded-full border border-stone-300 bg-white">
      <button
        type="button"
        onClick={() => onChange(quantity - 1)}
        aria-label={quantity === 1 ? `Remove ${label}` : `Decrease ${label}`}
        className="hover:bg-maroon-50 grid h-8 w-8 place-items-center rounded-full text-stone-600 transition-colors"
      >
        {quantity === 1 ? (
          <Trash2 className="h-3.5 w-3.5" />
        ) : (
          <Minus className="h-3.5 w-3.5" />
        )}
      </button>

      <span
        aria-live="polite"
        className="w-7 text-center text-sm font-semibold tabular-nums"
      >
        {quantity}
      </span>

      <button
        type="button"
        onClick={() => onChange(quantity + 1)}
        disabled={atMax}
        aria-label={atMax ? `Maximum ${max}` : `Increase ${label}`}
        title={atMax ? `Limit ${max} per size` : undefined}
        className="hover:bg-maroon-50 grid h-8 w-8 place-items-center rounded-full text-stone-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
