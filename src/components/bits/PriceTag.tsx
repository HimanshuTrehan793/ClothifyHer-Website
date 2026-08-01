import { cn } from "@/lib/utils";
import { discountPercent, formatPrice } from "@/utils/format";

interface PriceTagProps {
  price: number;
  mrp?: number;
  className?: string;
}

export function PriceTag({ price, mrp, className }: PriceTagProps) {
  const off = mrp ? discountPercent(mrp, price) : 0;

  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 gap-y-0.5",
        className,
      )}
    >
      <span className="text-[15px] font-semibold text-stone-900">
        {formatPrice(price)}
      </span>
      {mrp && off > 0 && (
        <>
          <span className="text-xs text-stone-400 line-through">
            {formatPrice(mrp)}
          </span>
          <span className="text-maroon-600 text-xs font-semibold">
            {off}% off
          </span>
        </>
      )}
    </p>
  );
}
