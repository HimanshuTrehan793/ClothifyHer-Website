import { baseApi } from "@/api/baseApi";
import type { ApiSuccess } from "@/api/types";
import type { HeroSlide, Occasion } from "@/interfaces/catalog";

/** Where a banner renders. The dashboard picks one per row. */
export type BannerPlacement = "hero" | "category" | "promo";

/** Raw banner row as `GET /api/banners` returns it. */
interface ApiBanner {
  id: string;
  image: string;
  mobile_image?: string | null;
  title: string | null;
  subtitle: string | null;
  cta_label: string | null;
  link: string | null;
  placement: BannerPlacement;
  position: number;
  is_active: boolean;
}

export interface Banner {
  id: string;
  image: string;
  /** Portrait crop served under 768px; null → `image` is used everywhere. */
  mobileImage: string | null;
  title: string | null;
  subtitle: string | null;
  ctaLabel: string | null;
  link: string | null;
  placement: BannerPlacement;
  position: number;
}

const toBanner = (b: ApiBanner): Banner => ({
  id: b.id,
  image: b.image,
  mobileImage: b.mobile_image ?? null,
  title: b.title,
  subtitle: b.subtitle,
  ctaLabel: b.cta_label,
  link: b.link,
  placement: b.placement,
  position: b.position,
});

/**
 * Banner → hero slide. A banner carries no eyebrow and its copy fields are all
 * optional, so everything the carousel needs unconditionally gets a fallback —
 * an image-only banner still renders as a usable slide.
 */
export const toHeroSlide = (b: Banner): HeroSlide => ({
  id: b.id,
  eyebrow: "",
  title: b.title ?? "",
  subtitle: b.subtitle ?? "",
  image: b.image,
  mobileImage: b.mobileImage,
  primaryCta: {
    label: b.ctaLabel ?? "Shop Now",
    href: b.link ?? "/categories",
  },
});

/** Banner → occasion tile, for the `category`/`promo` placements. */
export const toOccasion = (b: Banner): Occasion => ({
  id: b.id,
  title: b.title ?? "",
  caption: b.subtitle ?? "",
  image: b.image,
  mobileImage: b.mobileImage,
  href: b.link ?? "/categories",
});

export const bannerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getBanners: build.query<Banner[], BannerPlacement | void>({
      query: (placement) => ({
        url: "/api/banners",
        method: "GET",
        params: placement ? { placement } : undefined,
      }),
      transformResponse: (res: ApiSuccess<ApiBanner[]>) =>
        res.data.map(toBanner),
      providesTags: [{ type: "Banner", id: "LIST" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetBannersQuery } = bannerApi;
