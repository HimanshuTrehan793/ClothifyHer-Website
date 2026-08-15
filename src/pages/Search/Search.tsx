import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router";
import { Clock, Search as SearchIcon, X } from "lucide-react";
import { ProductCard } from "@/components/custom/card/ProductCard";
import { SiteFooter } from "@/components/common/SiteFooter";
import { BackButton } from "@/components/bits/BackButton";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { useWishlist } from "@/features/wishlist/useWishlist";
import { useGetProductsQuery } from "@/features/product/productApi";
import {
  MIN_QUERY_LENGTH,
  parseSearchQuery,
  productTypeLabel,
} from "@/utils/search";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { ids: wishlistIds, toggle: toggleWishlist } = useWishlist();
  const { recent, remember, remove, clear } = useRecentSearches();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debounced = useDebouncedValue(query, 200);
  const inputRef = useRef<HTMLInputElement>(null);

  // Landing on /search should put the cursor in the field straight away.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* The URL trails the typed value so a search is shareable and the back
     button works, but `replace` keeps every keystroke out of history. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (debounced.trim()) params.set("q", debounced.trim());
    else params.delete("q");
    setSearchParams(params, { replace: true });
  }, [debounced, setSearchParams]);

  const trimmed = debounced.trim();
  const apiQuery = useMemo(() => parseSearchQuery(trimmed), [trimmed]);
  const isSearching = apiQuery !== null;

  /* The server does the matching. `skip` keeps a half-typed word from firing a
     request, and the debounce above keeps it to one request per pause. */
  const { data, isFetching } = useGetProductsQuery(
    apiQuery ? { ...apiQuery, limit: 40 } : {},
    { skip: !apiQuery },
  );

  const results = data?.items ?? [];
  const total = data?.meta?.totalItems ?? results.length;

  return (
    <>
      <Helmet>
        <title>
          {trimmed ? `${trimmed} — Search ClothifyHer` : "Search — ClothifyHer"}
        </title>
        {/* Search result pages shouldn't compete with the real listings. */}
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10">
        <BackButton fallback="/" className="mb-4" />

        {/* ── Search field ─────────────────────────────────────────── */}
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (trimmed) remember(trimmed);
            inputRef.current?.blur();
          }}
          className="relative"
        >
          <label htmlFor="search-input" className="sr-only">
            Search for products
          </label>
          <SearchIcon className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-stone-400" />
          <input
            id="search-input"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search kurtas, dresses, co-ord sets…"
            autoComplete="off"
            className="focus:border-maroon-600 focus:ring-maroon-600/15 h-14 w-full rounded-full border border-stone-300 bg-white pr-14 pl-13 text-[15px] transition-colors outline-none focus:ring-4 [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              className="absolute top-1/2 right-4 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-stone-500 transition-colors hover:bg-stone-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* ── Nothing typed yet ────────────────────────────────────── */}
        {!isSearching && (
          <>
            {recent.length > 0 && (
              <section className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] text-stone-500 uppercase">
                    <Clock className="h-3.5 w-3.5" />
                    Recent
                  </h2>
                  <button
                    type="button"
                    onClick={clear}
                    className="text-xs font-medium text-stone-500 underline underline-offset-2 hover:text-stone-800"
                  >
                    Clear all
                  </button>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {recent.map((term) => (
                    <li key={term}>
                      <span className="inline-flex items-center gap-1 rounded-full border border-stone-300 bg-white pr-1 pl-4 text-sm text-stone-700">
                        <button
                          type="button"
                          onClick={() => {
                            setQuery(term);
                            remember(term);
                            inputRef.current?.focus();
                          }}
                          className="py-2"
                        >
                          {term}
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(term)}
                          aria-label={`Remove ${term} from recent searches`}
                          className="grid h-6 w-6 place-items-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="py-20 text-center">
              <span className="bg-maroon-50 mx-auto grid h-16 w-16 place-items-center rounded-full">
                <SearchIcon
                  className="text-maroon-700 h-7 w-7"
                  strokeWidth={1.5}
                />
              </span>
              <p className="mt-5 text-sm text-stone-500">
                {trimmed.length > 0
                  ? `Keep typing — at least ${MIN_QUERY_LENGTH} characters.`
                  : "Type to search for products"}
              </p>
            </div>
          </>
        )}

        {/* ── Loading ──────────────────────────────────────────────── */}
        {isSearching && isFetching && results.length === 0 && (
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <li key={i}>
                <ProductCardSkeleton />
              </li>
            ))}
          </ul>
        )}

        {/* ── No results ───────────────────────────────────────────── */}
        {isSearching && !isFetching && results.length === 0 && (
          <div className="py-20 text-center">
            <span className="bg-maroon-50 mx-auto grid h-16 w-16 place-items-center rounded-full">
              <SearchIcon
                className="text-maroon-700 h-7 w-7"
                strokeWidth={1.5}
              />
            </span>
            <h2 className="mt-5 font-serif text-2xl text-stone-900">
              No matches for “{trimmed}”
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Check the spelling, or try a different word.
            </p>
          </div>
        )}

        {/* ── Results ──────────────────────────────────────────────── */}
        {isSearching && results.length > 0 && (
          <section className="mt-8">
            <p aria-live="polite" className="mb-4 text-sm text-stone-600">
              <span className="font-semibold text-stone-900">{total}</span>{" "}
              {total === 1 ? "result" : "results"} for “{trimmed}”
            </p>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
              {results.map((product) => {
                const label = productTypeLabel(product);
                return (
                  <li key={product.id}>
                    <ProductCard
                      product={product}
                      wishlisted={wishlistIds.has(product.id)}
                      onToggleWishlist={() => toggleWishlist(product)}
                    />
                    {label && (
                      <p className="mt-1 text-[11px] text-stone-400">
                        in {label}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>

      <SiteFooter />
    </>
  );
}
