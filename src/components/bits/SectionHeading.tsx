import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: { label: string; href: string };
}

export function SectionHeading({
  title,
  subtitle,
  action,
}: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4 px-4 sm:px-6 lg:px-10">
      <div>
        <h2 className="font-serif text-2xl tracking-tight text-stone-900 sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
        )}
        <span className="via-gold-400 mt-3 block h-px w-16 bg-gradient-to-r from-transparent to-transparent" />
      </div>

      {action && (
        <Link
          to={action.href}
          className="text-maroon-700 hover:text-maroon-900 group inline-flex shrink-0 items-center gap-1 text-sm font-medium transition-colors"
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
