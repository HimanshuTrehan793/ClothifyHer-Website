import { useCallback, useMemo, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
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
import { useWishlist } from "@/features/wishlist/useWishlist";
import {
  applyFilters,
  applySort,
  countActive,
  type Filters,
  type SortKey,
} from "@/utils/catalogFilters";
import { SubCategoryRail } from "@/components/common/SubCategoryRail";
import { BackButton } from "@/components/bits/BackButton";
import { useGetProductsQuery } from "@/features/product/productApi";
import {
  useGetCategoryBySlugQuery,
  useGetSubCategoriesQuery,
} from "@/features/category/categoryApi";
import { SITE_URL } from "@/utils/constants";

/** Items appended per scroll batch. */
const PAGE_SIZE = 8;

/** Copy for the merchandised pseudo-categories that aren't real API rows. */
const COLLECTION_TITLES: Record<string, string> = {
  trending: "Trending Now",
  "new-arrivals": "New Arrivals",
  "best-sellers": "Best Sellers",
  sale: "On Sale",
};

export default function CategoryListing() {
  const { categorySlug = "" } = useParams();
  const { ids: wishlistIds, toggle: toggleWishlist } = useWishlist();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  /* A slug is either a real category or one of the merchandised collections
     (trending, new-arrivals, …). Ask for the category first: a 404 means the
     slug is a collection, which filters on the product's `collection` array
     instead of its category. */
  const { data: category, isError: notACategory } =
    useGetCategoryBySlugQuery(categorySlug);
  const isCollection = notACategory;

  /* Filters and sort live in the URL so a filtered listing is shareable and
     the back button steps through refinements. */
  const filters: Filters = useMemo(
    () => ({
      sizes: searchParams.get("size")?.split(",").filter(Boolean) ?? [],
      prices: searchParams.get("price")?.split(",").filter(Boolean) ?? [],
    }),
    [searchParams],
  );
  const sort = (searchParams.get("sort") as SortKey) ?? "featured";
  const activeSub = searchParams.get("sub");

  /* The list endpoint doesn't return each product's sub-category, so the rail
     has to refine server-side rather than filtering the fetched page. */
  const { data: apiList, isLoading: loading } = useGetProductsQuery(
    isCollection
      ? { collection: categorySlug, limit: 100 }
      : category
        ? {
            category: categorySlug,
            ...(activeSub ? { sub_category: activeSub } : {}),
            limit: 100,
          }
        : skipToken,
  );

  const title =
    category?.name ?? COLLECTION_TITLES[categorySlug] ?? categorySlug;

  /* Everything in this listing, before facets. */
  const inCategory = apiList?.items ?? [];

  /* Subcategory is a navigational refinement, not a facet — single-select,
     and it narrows the pool the facets then work on. Collections span
     categories, so they have no subcategory rail. */
  const { data: apiSubCategories = [] } = useGetSubCategoriesQuery(
    isCollection ? skipToken : categorySlug,
  );
  const subCategories = useMemo(
    () =>
      apiSubCategories.map((s) => ({
        slug: s.slug,
        label: s.name,
        image: s.image ?? "",
      })),
    [apiSubCategories],
  );
  const subCategoryLabel = (slug: string) =>
    apiSubCategories.find((s) => s.slug === slug)?.name ?? slug;

  /* The sub-category refinement is applied by the API, so the fetched page is
     already in scope. Per-chip counts would need one list request each, so the
     chips carry no count. */
  const inScope = inCategory;

  const results = useMemo(
    () => applySort(applyFilters(inScope, filters), sort),
    [inScope, filters, sort],
  );

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

  /* The listing fetches a full page of products up front and reveals them in
     batches, so "load more" is a local reveal rather than a request. */
  const loadMore = useCallback(() => {
    setLoadingMore(true);
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(page + 1));
    setSearchParams(params, { replace: true });
    setLoadingMore(false);
  }, [page, setSearchParams]);

  const sentinelRef = useInfiniteScroll({
    hasMore,
    loading: loadingMore,
    onLoadMore: loadMore,
  });

  const PARAM_OF: Record<keyof Filters, string> = {
    sizes: "size",
    prices: "price",
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

  /* The slug is neither a category the API knows nor a collection with any
     products behind it — that's a bad URL, not an empty listing. */
  const notFound =
    notACategory &&
    !loading &&
    !COLLECTION_TITLES[categorySlug] &&
    (apiList?.items.length ?? 0) === 0;

  if (notFound) {
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
  ];

  return (
    <>
      <Helmet>
        <title>{`${title} — ClothifyHer`}</title>
        <meta name="description" content={`Shop ${title} at ClothifyHer.`} />
        {/* Infinite scroll is a UI affordance layered over real paged state.
            rel prev/next keeps the sequence walkable for crawlers, and the
            canonical always points at the unpaginated listing. */}
        <link rel="canonical" href={`${SITE_URL}/categories/${categorySlug}`} />
        {page > 1 && (
          <link
            rel="prev"
            href={`${SITE_URL}/categories/${categorySlug}${page > 2 ? `?page=${page - 1}` : ""}`}
          />
        )}
        {hasMore && (
          <link
            rel="next"
            href={`${SITE_URL}/categories/${categorySlug}?page=${page + 1}`}
          />
        )}
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
        <BackButton fallback="/" className="mb-4" />

        <nav aria-label="Breadcrumb" className="text-xs text-stone-500">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-maroon-800">
                Home
              </Link>
            </li>
            <ChevronRight className="h-3 w-3" />
            <li className="text-stone-700">{title}</li>
          </ol>
        </nav>

        <header className="mt-4">
          <h1 className="font-serif text-3xl text-stone-900 sm:text-4xl">
            {title}
            {activeSub && (
              <span className="text-maroon-700">
                {" · "}
                {subCategoryLabel(activeSub)}
              </span>
            )}
          </h1>
          
        </header>

        {/* Toolbar. One row from lg (count + rail, Filters is hidden there);
            below that the rail drops to its own line — it bleeds to the screen
            edges to scroll, so sharing a line with Filters made them collide. */}
        <div className="mt-5 flex flex-col gap-3 border-y border-stone-200 py-3 lg:flex-row lg:items-center lg:gap-5">
          <div className="flex items-center justify-between gap-4 lg:justify-start">
            <p className="shrink-0 text-sm text-stone-600">
              <span className="font-semibold text-stone-900">
                {results.length}
              </span>{" "}
              {results.length === 1 ? "item" : "items"}
            </p>

            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className="hover:border-maroon-600 inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-stone-300 px-4 text-sm font-medium text-stone-700 lg:hidden"
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

          {subCategories.length > 0 && (
            <div className="min-w-0 lg:flex-1">
              <SubCategoryRail
                subCategories={subCategories}
                active={activeSub}
                onSelect={selectSub}
                totalCount={apiList?.meta?.totalItems ?? inCategory.length}
              />
            </div>
          )}
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
                availableSizes={availableSizes}
                onToggle={toggleFacet}
                sort={sort}
                onSortChange={setSort}
              />
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            {loading ? (
              <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: PAGE_SIZE }, (_, i) => (
                  <li key={`skeleton-${i}`}>
                    <ProductCardSkeleton />
                  </li>
                ))}
              </ul>
            ) : results.length === 0 ? (
              /* Never a dead end — always offer the way out. */
              <div className="py-20 text-center">
                <h2 className="font-serif text-2xl text-stone-900">
                  Nothing matches those filters
                </h2>
                <p className="mt-2 text-sm text-stone-500">
                  Try widening your selection — there are {inScope.length} items
                  in{" "}
                  {activeSub
                    ? subCategoryLabel(activeSub)
                    : title}
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
                        onToggleWishlist={() => toggleWishlist(product)}
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
                      You've seen all {results.length} items in {title}.
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
              availableSizes={availableSizes}
              onToggle={toggleFacet}
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
