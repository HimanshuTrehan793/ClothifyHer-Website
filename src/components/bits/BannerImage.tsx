import { useSyncExternalStore } from "react";

/** Below this width the mobile crop is served — lines up with Tailwind's `md`. */
export const MOBILE_BANNER_QUERY = "(max-width: 767px)";

const subscribe = (onChange: () => void) => {
  const mql = window.matchMedia(MOBILE_BANNER_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
};
const isMobileViewport = () => window.matchMedia(MOBILE_BANNER_QUERY).matches;

interface BannerImageProps {
  src: string;
  /** Portrait crop for narrow screens. Omitted/null → `src` everywhere. */
  mobileSrc?: string | null;
  alt: string;
  className?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
}

/**
 * A banner image with an optional mobile crop.
 *
 * `<picture>` rather than a JS-chosen `src`: the browser picks the source
 * before it downloads anything, so there's no flash of the wrong banner and
 * only one file is fetched.
 *
 * Browsers aren't required to re-pick a source once the image has loaded, so a
 * window resized (or a tablet rotated) across 768px would keep the old crop.
 * Keying on the media query remounts the <picture> at the crossing, which
 * forces a fresh selection.
 *
 * `contents` makes the <picture> wrapper layout-transparent, so `h-full` etc.
 * on the <img> still resolve against the real parent instead of collapsing.
 */
export function BannerImage({
  src,
  mobileSrc,
  alt,
  className,
  loading = "lazy",
  fetchPriority,
}: BannerImageProps) {
  const isMobile = useSyncExternalStore(subscribe, isMobileViewport);

  return (
    <picture key={mobileSrc && isMobile ? "m" : "w"} className="contents">
      {mobileSrc && <source media={MOBILE_BANNER_QUERY} srcSet={mobileSrc} />}
      <img
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        className={className}
      />
    </picture>
  );
}
