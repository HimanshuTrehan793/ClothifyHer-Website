import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  size?: "sm" | "md";
  className?: string;
}

export function StarRating({
  rating,
  size = "sm",
  className,
}: StarRatingProps) {
  const box = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <span
      className={cn("inline-flex gap-0.5", className)}
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            box,
            i < Math.round(rating)
              ? "fill-gold-500 text-gold-500"
              : "text-stone-300",
          )}
        />
      ))}
    </span>
  );
}
