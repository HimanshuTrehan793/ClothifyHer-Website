import { cn } from "@/lib/utils";
import wordmarkMaroon from "@/assets/brand/logo-wordmark.png";
import wordmarkCream from "@/assets/brand/logo-wordmark-cream.png";
import monogramMaroon from "@/assets/brand/logo-monogram.png";
import monogramCream from "@/assets/brand/logo-monogram-cream.png";

/* Intrinsic sizes of the rendered artwork — passed to the <img> so the
   browser reserves the right box and the header doesn't shift on load. */
const ART = {
  wordmark: { maroon: wordmarkMaroon, cream: wordmarkCream, w: 640, h: 172 },
  monogram: { maroon: monogramMaroon, cream: monogramCream, w: 320, h: 252 },
} as const;

interface LogoProps {
  variant?: "wordmark" | "monogram";
  /** `cream` is the recoloured artwork for maroon backgrounds. */
  tone?: "maroon" | "cream";
  className?: string;
}

export function Logo({
  variant = "wordmark",
  tone = "maroon",
  className,
}: LogoProps) {
  const art = ART[variant];

  return (
    <img
      src={art[tone]}
      alt="ClothifyHer"
      width={art.w}
      height={art.h}
      className={cn("w-auto object-contain", className)}
    />
  );
}
