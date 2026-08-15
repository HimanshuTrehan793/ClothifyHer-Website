import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useLocation } from "react-router";
import { CategoryStories } from "@/components/common/CategoryStories";
import { FeaturedCollection } from "@/components/common/FeaturedCollection";
import { HeroCarousel } from "@/components/common/HeroCarousel";
import { OccasionGrid } from "@/components/common/OccasionGrid";
import { SiteFooter } from "@/components/common/SiteFooter";
import { Testimonials } from "@/components/common/Testimonials";
import { TrendingNow } from "@/components/common/TrendingNow";
import { TrustStrip } from "@/components/common/TrustStrip";
import { useWishlist } from "@/features/wishlist/useWishlist";
import {
  CATEGORY_STORIES,
  FEATURED_COLLECTION,
  HERO_SLIDES,
  OCCASIONS,
  TESTIMONIALS,
  TRENDING_PRODUCTS,
} from "@/utils/mockData";

export default function Home() {
  const { ids: wishlistIds, toggle: toggleWishlist } = useWishlist();
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const frame = window.requestAnimationFrame(() => {
      document
        .getElementById(hash.slice(1))
        ?.scrollIntoView({ behavior: "smooth" });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [hash]);

  /* Look the product up by id so the store gets the full record, not just an
     id — the wishlist screen renders from that snapshot. */
  const toggle = (productId: string) => {
    const product =
      TRENDING_PRODUCTS.find((p) => p.id === productId) ??
      FEATURED_COLLECTION.products.find((p) => p.id === productId);
    if (product) toggleWishlist(product);
  };

  return (
    <>
      <Helmet>
        <title>ClothifyHer — Kurtas, Dresses &amp; Co-ord Sets for Women</title>
        <meta
          name="description"
          content="Shop women's kurtas, dresses, co-ord sets, tops and bottom wear at ClothifyHer. Style, comfort and confidence — delivered across India."
        />
      </Helmet>

      <CategoryStories
        stories={CATEGORY_STORIES}
        action={{ label: "Explore All", href: "/categories" }}
      />
      <HeroCarousel slides={HERO_SLIDES} />
      <TrustStrip />
      <FeaturedCollection
        collection={FEATURED_COLLECTION}
        wishlisted={wishlistIds}
        onToggleWishlist={toggle}
      />
      <TrendingNow
        action={{ label: "Explore All", href: "/categories/trending" }}
        products={TRENDING_PRODUCTS}
        wishlisted={wishlistIds}
        onToggleWishlist={toggle}
      />
      <TrendingNow
        id="new-arrivals"
        title="New Arrivals"
        subtitle="Fresh silhouettes and new-season favourites"
        action={{ label: "Explore All", href: "/categories/new-arrivals" }}
        products={TRENDING_PRODUCTS.slice(2, 6)}
        wishlisted={wishlistIds}
        onToggleWishlist={toggle}
      />
      <TrendingNow
        id="best-sellers"
        title="Best Sellers"
        subtitle="The styles our customers keep coming back for"
        action={{ label: "Explore All", href: "/categories/best-sellers" }}
        products={[
          TRENDING_PRODUCTS[0],
          TRENDING_PRODUCTS[5],
          TRENDING_PRODUCTS[1],
          TRENDING_PRODUCTS[3],
        ]}
        wishlisted={wishlistIds}
        onToggleWishlist={toggle}
      />
      <OccasionGrid occasions={OCCASIONS} />
      <Testimonials items={TESTIMONIALS} />
      <SiteFooter />
    </>
  );
}
