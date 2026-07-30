import { Helmet } from "react-helmet-async";
import { CategoryStories } from "@/components/common/CategoryStories";
import { HeroCarousel } from "@/components/common/HeroCarousel";
import { OccasionGrid } from "@/components/common/OccasionGrid";
import { SiteFooter } from "@/components/common/SiteFooter";
import { TrendingNow } from "@/components/common/TrendingNow";
import { TrustStrip } from "@/components/common/TrustStrip";
import {
  CATEGORY_STORIES,
  HERO_SLIDES,
  OCCASIONS,
  TRENDING_PRODUCTS,
} from "@/utils/mockData";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Viraasat — Authentic Indian Ethnic Wear for Women</title>
        <meta
          name="description"
          content="Handcrafted sarees, kurtas, lehengas and fusion wear from India's finest ateliers and looms."
        />
      </Helmet>

      <CategoryStories stories={CATEGORY_STORIES} />
      <HeroCarousel slides={HERO_SLIDES} />
      <TrustStrip />
      <OccasionGrid occasions={OCCASIONS} />
      <TrendingNow products={TRENDING_PRODUCTS} />
      <SiteFooter />
    </>
  );
}
