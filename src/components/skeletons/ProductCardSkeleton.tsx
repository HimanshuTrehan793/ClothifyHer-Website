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
