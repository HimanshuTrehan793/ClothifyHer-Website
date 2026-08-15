import { Helmet } from "react-helmet-async";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router";
import { CategoryStories } from "@/components/common/CategoryStories";
import { FeaturedCollection } from "@/components/common/FeaturedCollection";
import { HeroCarousel } from "@/components/common/HeroCarousel";
import { OccasionGrid } from "@/components/common/OccasionGrid";
import { SiteFooter } from "@/components/common/SiteFooter";
import { Testimonials } from "@/components/common/Testimonials";
import { TrendingNow } from "@/components/common/TrendingNow";
import { TrustStrip } from "@/components/common/TrustStrip";
import { ProductRailSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import { useWishlist } from "@/features/wishlist/useWishlist";
import { useGetCategoriesQuery } from "@/features/category/categoryApi";
import {
  toHeroSlide,
  toOccasion,
  useGetBannersQuery,
} from "@/features/banner/bannerApi";
import { useGetProductsQuery } from "@/features/product/productApi";
import type { CategoryStory, Product } from "@/interfaces/catalog";
import { TESTIMONIALS } from "@/content/testimonials";

/** How many products each home rail shows. */
const RAIL_SIZE = 8;

export default function Home() {
  const { ids: wishlistIds, toggle: toggleWishlist } = useWishlist();
  const { hash } = useLocation();

  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: heroBanners = [] } = useGetBannersQuery("hero");
  const { data: occasionBanners = [] } = useGetBannersQuery("category");
  const { data: promoBanners = [] } = useGetBannersQuery("promo");

  /* Three rails off the same list endpoint. `collection` is an array column on
     the product, so these are whatever the dashboard tagged — a rail with no
     tagged products simply doesn't render. */
  const trending = useGetProductsQuery({
    collection: "trending",
    limit: RAIL_SIZE,
  });
  const newArrivals = useGetProductsQuery({
    sort: "new",
    limit: RAIL_SIZE,
  });
  const bestSellers = useGetProductsQuery({
    collection: "best-sellers",
    limit: RAIL_SIZE,
  });

  useEffect(() => {
    if (!hash) return;

    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({ behavior: "smooth" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash]);

  const stories = useMemo<CategoryStory[]>(
    () =>
      categories.map((c) => ({
        id: c.id,
        label: c.name,
        image: c.image ?? "",
        href: `/categories/${c.slug}`,
      })),
    [categories],
  );

  const slides = useMemo(
    () => heroBanners.map(toHeroSlide),
    [heroBanners],
  );
  const occasions = useMemo(
    () => occasionBanners.map(toOccasion),
    [occasionBanners],
  );

  /* Wishlisting needs the whole product record, so resolve the id against
     whichever rail rendered it rather than refetching. */
  const byId = useMemo(() => {
    const map = new Map<string, Product>();
    for (const list of [trending.data, newArrivals.data, bestSellers.data]) {
      for (const product of list?.items ?? []) map.set(product.id, product);
    }
    return map;
  }, [trending.data, newArrivals.data, bestSellers.data]);

  const toggle = (productId: string) => {
    const product = byId.get(productId);
    if (product) toggleWishlist(product);
  };

  /* The editorial split needs both a promo banner for the story panel and
     products for the rail beside it — without either half it's not a section. */
  const promo = promoBanners[0];
  const featuredProducts = (trending.data?.items ?? newArrivals.data?.items ?? [])
    .slice(0, 3);
  const featured =
    promo && featuredProducts.length
      ? {
          id: promo.id,
          eyebrow: "Featured",
          title: promo.title ?? "",
          description: promo.subtitle ?? "",
          image: promo.image,
          href: promo.link ?? "/categories",
          ctaLabel: promo.ctaLabel ?? "Shop the edit",
          products: featuredProducts,
        }
      : null;

  return (
    <>
      <Helmet>
        <title>ClothifyHer — Kurtas, Dresses &amp; Co-ord Sets for Women</title>
        <meta
          name="description"
          content="Shop women's kurtas, dresses, co-ord sets, tops and bottom wear at ClothifyHer. Style, comfort and confidence — delivered across India."
        />
      </Helmet>

      {stories.length > 0 && (
        <CategoryStories
          stories={stories}
          action={{ label: "Explore All", href: "/categories" }}
        />
      )}

      {slides.length > 0 && <HeroCarousel slides={slides} />}

      <TrustStrip />

      {featured && (
        <FeaturedCollection
          collection={featured}
          wishlisted={wishlistIds}
          onToggleWishlist={toggle}
        />
      )}

      <Rail
        id="trending"
        title="Trending Now"
        subtitle="What everyone's adding to their bag this week"
        href="/categories/trending"
        query={trending}
        emptyMessage="No products are tagged as trending yet."
        wishlisted={wishlistIds}
        onToggleWishlist={toggle}
      />

      <Rail
        id="new-arrivals"
        title="New Arrivals"
        subtitle="Fresh silhouettes and new-season favourites"
        href="/categories/new-arrivals"
        query={newArrivals}
        emptyMessage="New pieces will appear here as they're added."
        wishlisted={wishlistIds}
        onToggleWishlist={toggle}
      />

      <Rail
        id="best-sellers"
        title="Best Sellers"
        subtitle="The styles our customers keep coming back for"
        href="/categories/best-sellers"
        query={bestSellers}
        emptyMessage="No products are tagged as best sellers yet."
        wishlisted={wishlistIds}
        onToggleWishlist={toggle}
      />

      {occasions.length > 0 && <OccasionGrid occasions={occasions} />}

      <Testimonials items={TESTIMONIALS} />
      <SiteFooter />
    </>
  );
}

/**
 * One product rail. Shows skeletons while loading, then always renders its
 * section — an empty collection keeps its heading and shows an empty state
 * rather than vanishing, so the home page's shape doesn't depend on how much
 * of the catalog has been tagged yet.
 */
function Rail({
  id,
  title,
  subtitle,
  href,
  query,
  wishlisted,
  onToggleWishlist,
  emptyMessage,
}: {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  query: ReturnType<typeof useGetProductsQuery>;
  wishlisted: Set<string>;
  onToggleWishlist: (productId: string) => void;
  emptyMessage?: string;
}) {
  if (query.isLoading) {
    return <ProductRailSkeleton title={title} subtitle={subtitle} />;
  }

  return (
    <TrendingNow
      id={id}
      title={title}
      subtitle={subtitle}
      action={{ label: "Explore All", href }}
      products={query.data?.items ?? []}
      wishlisted={wishlisted}
      onToggleWishlist={onToggleWishlist}
      emptyMessage={emptyMessage}
    />
  );
}
