import { useEffect } from "react";
import { useLocation } from "react-router";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Reports each route change to Google Analytics.
 *
 * GA4's enhanced measurement usually catches History navigations on its own,
 * but it's inconsistent for client-side routers — this makes page views
 * explicit rather than hoping. The first page view still comes from the tag in
 * index.html, so this skips nothing and double-counts nothing of consequence.
 *
 * `window.gtag` is absent when the script is blocked (ad blockers, offline,
 * local dev), so every call is guarded — analytics must never break a page.
 */
export function RouteAnalytics() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path: `${pathname}${search}`,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, search]);

  return null;
}
