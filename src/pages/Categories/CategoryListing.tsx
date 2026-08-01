import { useCallback, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams, useSearchParams } from "react-router";
import {
  ChevronRight,
  Loader2,
  PackageX,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/bits/EmptyState";
import { FilterPanel } from "@/components/common/FilterPanel";
import { ProductCard } from "@/components/custom/card/ProductCard";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import { SiteFooter } from "@/components/common/SiteFooter";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  selectWishlistIds,
  toggleWishlist,
} from "@/features/wishlist/wishlistSlice";
import {
  applyFilters,
  applySort,
  coloursIn,
  countActive,
  type Filters,
  type SortKey,
} from "@/utils/catalogFilters";
import { SubCategoryRail } from "@/components/common/SubCategoryRail";
import {
  CATALOG,
  CATEGORY_META,
  SUBCATEGORIES,
  subCategoryLabel,
} from "@/utils/mockData";
import { SITE_URL } from "@/utils/constants";

/** Items appended per scroll batch. */
const PAGE_SIZE = 8;

export default function CategoryListing() {
  const { categorySlug = "" } = useParams();
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector(selectWishlistIds);
  const [searchParams, setSearchParams] = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const meta = CATEGORY_META[categorySlug];

  /* Everything in this category, before facets. `sale` is a pseudo-category:
     anything currently marked down, regardless of what it is. */
  const inCategory = useMemo(
    () =>
      categorySlug === "sale"
        ? CATALOG.filter((p) => p.mrp && p.mrp > p.price)
        : CATALOG.filter((p) => p.category === categorySlug),
    [categorySlug],
  );

  /* Filters and sort live in the URL so a filtered listing is shareable and
     the back button steps through refinements. */
  const filters: Filters = useMemo(
    () => ({
      sizes: searchParams.get("size")?.split(",").filter(Boolean) ?? [],
      prices: searchParams.get("price")?.split(",").filter(Boolean) ?? [],
      colors: searchParams.get("colour")?.split(",").filter(Boolean) ?? [],
      inStockOnly: searchParams.get("stock") === "1",
    }),
    [searchParams],
  );
  const sort = (searchParams.get("sort") as SortKey) ?? "featured";

  /* Subcategory is a navigational refinement, not a facet — single-select,
     and it narrows the pool the facets then work on. */
  const subCategories = SUBCATEGORIES[categorySlug] ?? [];
  const activeSub = searchParams.get("sub");

  const inScope = useMemo(
    () =>
      activeSub
        ? inCategory.filter((p) => p.subCategory === activeSub)
        : inCategory,
    [inCategory, activeSub],
  );

  /* Counts come from the category pool, not the filtered one, so a chip
     always says how much is behind it rather than reacting to other facets. */
  const subCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of inCategory) {
      if (p.subCategory)
        counts[p.subCategory] = (counts[p.subCategory] ?? 0) + 1;
    }
    return counts;
  }, [inCategory]);

  const results = useMemo(
    () => applySort(applyFilters(inScope, filters), sort),
    [inScope, filters, sort],
  );

  const colours = useMemo(() => coloursIn(inScope), [inScope]);
  const availableSizes = useMemo(
    () => [...new Set(inScope.flatMap((p) => p.sizes))],
    [inScope],
  );

  const selectSub = (slug: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (slug) params.set("sub", slug);
    else params.delete("sub");
    commit(params);
  };
  const activeCount = countActive(filters);

  /* ── Infinite scroll ──────────────────────────────────────────────
     `page` is derived from the URL rather than held in state, so there
     is one source of truth and no effect syncing the two. It also means
     going to a product and pressing Back restores how far you'd scrolled
     instead of dumping you at the first eight items.                   */
  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const visible = results.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < results.length;

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    // Simulated latency — becomes a real request in Phase 1.
    window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      params.set("page", String(page + 1));
      setSearchParams(params, { replace: true });
      setLoadingMore(false);
    }, 450);
  }, [page, setSearchParams]);

  const sentinelRef = useInfiniteScroll({
    hasMore,
    loading: loadingMore,
    onLoadMore: loadMore,
  });

  const PARAM_OF: Record<keyof Filters, string> = {
    sizes: "size",
    prices: "price",
    colors: "colour",
    inStockOnly: "stock",
  };

  /* Every facet change drops `page` — refining filters must restart the
     list, otherwise you'd keep a deep page against a shorter result set. */
  const commit = (params: URLSearchParams) => {
    params.delete("page");
    setSearchParams(params, { replace: true });
  };

  const toggleFacet = (facet: keyof Filters, value: string) => {
    const key = PARAM_OF[facet];
    const current = searchParams.get(key)?.split(",").filter(Boolean) ?? [];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const params = new URLSearchParams(searchParams);
    if (next.length) params.set(key, next.join(","));
    else params.delete(key);
    commit(params);
  };

  const setStock = (value: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("stock", "1");
    else params.delete("stock");
    commit(params);
  };

  const setSort = (value: SortKey) => {
    const params = new URLSearchParams(searchParams);
    if (value === "featured") params.delete("sort");
    else params.set("sort", value);
    commit(params);
  };

  /* Clearing facets keeps the subcategory — that's navigation, not a filter. */
  const clearFilters = () => {
    const params = new URLSearchParams();
    if (sort !== "featured") params.set("sort", sort);
    if (activeSub) params.set("sub", activeSub);
    commit(params);
  };

  if (!meta) {
    return (
      <>
        <Helmet>
          <title>Category not found — ClothifyHer</title>
        </Helmet>
        <EmptyState
          icon={PackageX}
          title="No such category"
          message="That link doesn't match any of our categories."
          action={{ label: "Back to Home", href: "/" }}
        />
        <SiteFooter />
      </>
    );
  }

  const chips = [
    ...filters.sizes.map((v) => ({
      facet: "sizes" as const,
      value: v,
      label: `Size ${v}`,
    })),
    ...filters.prices.map((v) => ({
      facet: "prices" as const,
      value: v,
      label: v,
    })),
    ...filters.colors.map((v) => ({
      facet: "colors" as const,
      value: v,
      label: v,
    })),
  ];

  return (
    <>
      <Helmet>
        <title>{`${meta.name} — ClothifyHer`}</title>
        <meta name="description" content={meta.tagline} />
        {/* Infinite scroll is a UI affordance layered over real paged state.
            rel prev/next keeps the sequence walkable for crawlers, and the
            canonical always points at the unpaginated listing. */}
        <link rel="canonical" href={`${SITE_URL}/categories/${meta.slug}`} />
        {page > 1 && (
          <link
            rel="prev"
            href={`${SITE_URL}/categories/${meta.slug}${page > 2 ? `?page=${page - 1}` : ""}`}
          />
        )}
        {hasMore && (
          <link
            rel="next"
            href={`${SITE_URL}/categories/${meta.slug}?page=${page + 1}`}
          />
        )}
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
        <nav aria-label="Breadcrumb" className="text-xs text-stone-500">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-maroon-800">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-stone-700">{meta.name}</li>
          </ol>
        </nav>

        <header className="mt-4">
          <h1 className="font-serif text-3xl text-stone-900 sm:text-4xl">
            {meta.name}
            {activeSub && (
              <span className="text-maroon-700">
                {" · "}
                {subCategoryLabel(categorySlug, activeSub)}
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-stone-500">{meta.tagline}</p>
        </header>

        {/* Toolbar: count · subcategory rail · filters, all on one band.
            The rail wraps to its own line only when there isn't room. */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-stone-200 py-3">
          <p className="shrink-0 text-sm text-stone-600">
            <span className="font-semibold text-stone-900">
              {results.length}
            </span>{" "}
            {results.length === 1 ? "item" : "items"}
          </p>

          {subCategories.length > 0 && (
            <div className="min-w-0 flex-1">
              <SubCategoryRail
                subCategories={subCategories}
                active={activeSub}
                onSelect={selectSub}
                counts={subCounts}
                totalCount={inCategory.length}
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="hover:border-maroon-600 ml-auto inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-stone-300 px-4 text-sm font-medium text-stone-700 lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeCount > 0 && (
              <span className="bg-maroon-800 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[10px] font-bold text-white">
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* Active filter chips */}
        {activeCount > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {chips.map((chip) => (
              <button
                key={`${chip.facet}-${chip.value}`}
                type="button"
                onClick={() => toggleFacet(chip.facet, chip.value)}
                className="bg-maroon-50 text-maroon-800 hover:bg-maroon-100 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
              >
                {chip.label}
                <X className="h-3 w-3" />
              </button>
            ))}
            {filters.inStockOnly && (
              <button
                type="button"
                onClick={() => setStock(false)}
                className="bg-maroon-50 text-maroon-800 hover:bg-maroon-100 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium"
              >
                In stock only
                <X className="h-3 w-3" />
              </button>
            )}
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-stone-500 underline underline-offset-2 hover:text-stone-800"
            >
              Clear all
            </button>
          </div>
        )}

        <div className="mt-6 flex gap-10">
          {/* Desktop filter rail */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-28">
              <FilterPanel
                filters={filters}
                colours={colours}
                availableSizes={availableSizes}
                onToggle={toggleFacet}
                onInStockChange={setStock}
                sort={sort}
                onSortChange={setSort}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {results.length === 0 ? (
              /* Never a dead end — always offer the way out. */
              <div className="py-20 text-center">
                <h2 className="font-serif text-2xl text-stone-900">
                  Nothing matches those filters
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                  Try widening your selection — there are {inScope.length} items
                  in{" "}
                  {activeSub
                    ? subCategoryLabel(categorySlug, activeSub)
                    : meta.name}
                  .
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-maroon-800 hover:bg-maroon-900 mt-6 rounded-full px-7 py-3 text-sm font-semibold text-white"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                  {visible.map((product) => (
                    <li key={product.id}>
                      <ProductCard
                        product={product}
                        wishlisted={wishlistIds.has(product.id)}
                        onToggleWishlist={() =>
                          dispatch(toggleWishlist(product))
                        }
                      />
                    </li>
                  ))}

                  {/* Skeletons occupy the grid so nothing below jumps. */}
                  {loadingMore &&
                    Array.from(
                      {
                        length: Math.min(
                          PAGE_SIZE,
                          results.length - visible.length,
                        ),
                      },
                      (_, i) => (
                        <li key={`skeleton-${i}`}>
                          <ProductCardSkeleton />
                        </li>
                      ),
                    )}
                </ul>

                {/* Screen readers get told what scrolling silently changed. */}
                <p aria-live="polite" className="sr-only">
                  Showing {visible.length} of {results.length} items
                </p>

                {hasMore ? (
                  <>
                    {/* Sentinel sits above the fold-end so the next batch is
                        already in flight by the time you reach the bottom. */}
                    <div ref={sentinelRef} aria-hidden className="h-px" />

                    <div className="flex justify-center py-10">
                      {loadingMore ? (
                        <span className="inline-flex items-center gap-2 text-sm text-stone-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading more
                        </span>
                      ) : (
                        /* Keyboard and reduced-motion users never trip the
                           observer — they need a real control. */
                        <button
                          type="button"
                          onClick={loadMore}
                          className="hover:border-maroon-600 hover:text-maroon-800 rounded-full border border-stone-300 px-7 py-3 text-sm font-semibold text-stone-700 transition-colors"
                        >
                          Load more
                        </button>
                      )}
                    </div>
                  </>
                ) : (
                  results.length > PAGE_SIZE && (
                    <p className="py-10 text-center text-sm text-stone-400">
                      You've seen all {results.length} items in {meta.name}.
                    </p>
                  )
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <SiteFooter />

      {/* Mobile filter sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            onClick={() => setSheetOpen(false)}
            className="absolute inset-0 animate-[fadeIn_200ms_ease-out] bg-stone-900/50"
          />
          <div className="bg-cream-50 absolute inset-x-0 bottom-0 max-h-[80svh] overflow-y-auto rounded-t-3xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-xl text-stone-900">Filters</h2>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                aria-label="Close filters"
                className="hover:bg-maroon-50 grid h-9 w-9 place-items-center rounded-full text-stone-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <FilterPanel
              filters={filters}
              colours={colours}
              availableSizes={availableSizes}
              onToggle={toggleFacet}
              onInStockChange={setStock}
              sort={sort}
              onSortChange={setSort}
            />

            <div className="mt-7 flex gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="h-12 flex-1 rounded-full border border-stone-300 text-sm font-semibold text-stone-700"
              >
                Clear all
              </button>
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className={cn(
                  "bg-maroon-800 h-12 flex-1 rounded-full text-sm font-semibold text-white",
                )}
              >
                Show {results.length} {results.length === 1 ? "item" : "items"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
