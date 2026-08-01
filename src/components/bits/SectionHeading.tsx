import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
  /** `cream` inverts the type for sections on a maroon ground. */
  tone?: "dark" | "cream";
}

export function SectionHeading({
  title,
  subtitle,
  action,
  tone = "dark",
}: SectionHeadingProps) {
  const cream = tone === "cream";

  return (
    <div className="mb-5 flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-10">
      <div>
        <h2
          className={cn(
            "font-serif text-2xl tracking-tight sm:text-3xl",
            cream ? "text-cream-100" : "text-stone-900",
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            className={cn(
              "mt-1 text-sm",
              cream ? "text-cream-100/70" : "text-stone-500",
            )}
          >
            {subtitle}
          </p>
        )}
        <span className="via-gold-400 mt-3 block h-px w-16 bg-gradient-to-r from-transparent to-transparent" />
      </div>

      {action && (
        <Link
          to={action.href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-1 text-sm font-medium transition-colors",
            cream
              ? "text-gold-300 hover:text-gold-400"
              : "text-maroon-700 hover:text-maroon-900",
          )}
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
