import { Minus, Plus, Trash2 } from "lucide-react";
import { MAX_QTY_PER_LINE } from "@/utils/constants";

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  label: string;
}

export function QuantityStepper({
  quantity,
  onChange,
  label,
}: QuantityStepperProps) {
  const atMax = quantity >= MAX_QTY_PER_LINE;

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
        aria-label={atMax ? `Maximum ${MAX_QTY_PER_LINE}` : `Increase ${label}`}
        title={atMax ? `Limit ${MAX_QTY_PER_LINE} per size` : undefined}
        className="hover:bg-maroon-50 grid h-8 w-8 place-items-center rounded-full text-stone-600 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
