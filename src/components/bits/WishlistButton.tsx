import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  active: boolean;
  onToggle: () => void;
  /** Used in the a11y label so screen readers know which product. */
  productTitle: string;
  className?: string;
}

export function WishlistButton({
  active,
  onToggle,
  productTitle,
  className,
}: WishlistButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={
        active
          ? `Remove ${productTitle} from wishlist`
          : `Add ${productTitle} to wishlist`
      }
      onClick={(e) => {
        // The card itself is a link — don't navigate when hearting.
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full bg-white/85 backdrop-blur-sm",
        "shadow-sm transition-transform duration-200 hover:scale-110",
        "focus-visible:ring-maroon-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
        className,
      )}
    >
      <Heart
        className={cn(
          "h-[18px] w-[18px] transition-colors",
          active ? "fill-maroon-700 text-maroon-700" : "text-stone-700",
        )}
      />
    </button>
  );
}
