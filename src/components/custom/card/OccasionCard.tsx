import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Occasion } from "@/interfaces/catalog";

export function OccasionCard({ occasion }: { occasion: Occasion }) {
  return (
    <Link
      to={occasion.href}
      className={cn(
        "group relative isolate block overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 hover:shadow-md",
        occasion.wide ? "sm:col-span-2" : "sm:col-span-1",
      )}
    >
      <img
        src={occasion.image}
        alt={occasion.title}
        loading="lazy"
        className={cn(
          "w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105",
          occasion.wide ? "h-56 sm:h-72" : "h-56 sm:h-72",
        )}
      />

      <span className="img-scrim pointer-events-none absolute inset-0" />

      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
        <span>
          <span className="block font-serif text-xl text-white sm:text-2xl">
            {occasion.title}
          </span>
          <span className="mt-0.5 block text-[13px] text-white/80">
            {occasion.caption}
          </span>
        </span>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur-sm transition-colors duration-300 group-hover:bg-white">
          <ArrowUpRight className="h-4 w-4 text-white transition-colors duration-300 group-hover:text-stone-900" />
        </span>
      </span>
    </Link>
  );
}
