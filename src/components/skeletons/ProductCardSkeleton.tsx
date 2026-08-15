import { SectionHeading } from "@/components/bits/SectionHeading";

/**
 * Placeholder for a whole home/PLP rail. Matches `TrendingNow`'s heading and
 * grid so the layout doesn't jump when the real products arrive.
 */
export function ProductRailSkeleton({
  title,
  subtitle,
  count = 4,
}: {
  title: string;
  subtitle?: string;
  count?: number;
}) {
  return (
    <section className="bg-cream-100/60 py-12 sm:py-16">
      <SectionHeading title={title} subtitle={subtitle} />
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 sm:px-6 md:grid-cols-3 lg:grid-cols-4 lg:px-10">
        {Array.from({ length: count }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className="aspect-[3/4] w-full rounded-2xl bg-stone-200" />
      <div className="mt-3 space-y-2">
        <div className="h-2.5 w-16 rounded bg-stone-200" />
        <div className="h-3 w-full rounded bg-stone-200" />
        <div className="h-3 w-2/3 rounded bg-stone-200" />
        <div className="h-3.5 w-24 rounded bg-stone-200" />
      </div>
    </div>
  );
}
