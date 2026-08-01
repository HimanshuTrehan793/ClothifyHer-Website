import { useEffect, useRef } from "react";

interface Options {
  /** False once everything is loaded — stops the observer being re-attached. */
  hasMore: boolean;
  /** True while a batch is in flight, so scrolling can't stack requests. */
  loading: boolean;
  onLoadMore: () => void;
  /** How far below the fold to trigger. Bigger = fewer visible spinners. */
  rootMargin?: string;
}

/**
 * Attaches an IntersectionObserver to a sentinel element and calls
 * `onLoadMore` when it comes into range.
 *
 * `onLoadMore` must be referentially stable (wrap it in useCallback) or the
 * observer tears down and rebuilds on every render.
 */
export function useInfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  rootMargin = "400px",
}: Options) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onLoadMore();
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore, rootMargin]);

  return sentinelRef;
}
