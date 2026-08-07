import { useEffect } from "react";
import { useLocation } from "react-router";

/**
 * Resets the window to the top on every route change. Without it, React Router
 * keeps the previous page's scroll offset — so following "Explore All" from
 * halfway down the home page lands you halfway down the next page.
 *
 * Two things it deliberately does NOT do:
 *  - Hash navigations (e.g. /#trending) are left alone — the target page
 *    scrolls that anchor into view itself, and forcing the top would fight it.
 *  - It keys off `pathname` only, not the query string, so refining filters or
 *    loading the next page on a listing (which live in the URL) don't reset the
 *    scroll out from under you.
 */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, hash]);

  return null;
}
