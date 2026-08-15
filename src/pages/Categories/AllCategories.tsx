import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { SiteFooter } from "@/components/common/SiteFooter";
import { BackButton } from "@/components/bits/BackButton";
import {
  CATALOG,
  CATEGORY_META,
  CATEGORY_STORIES,
  COLLECTION_FILTERS,
} from "@/utils/mockData";
import { SITE_URL } from "@/utils/constants";

/* How many buyable items sit behind a category chip — mirrors the pool the
   listing page builds, so `sale` counts by its rule rather than a slug. */
const countFor = (slug: string) => {
  const collectionFilter = COLLECTION_FILTERS[slug];
  return collectionFilter
    ? CATALOG.filter(collectionFilter).length
    : CATALOG.filter((p) => p.category === slug).length;
};

/**
 * The categories index (/categories) — the destination for "Explore All" on the
 * home category rail and the Categories tab in the bottom nav. Each card opens
 * that category's product list page.
 */
export default function AllCategories() {
  return (
    <>
      <Helmet>
        <title>Shop by Category — ClothifyHer</title>
        <meta
          name="description"
          content="Browse every ClothifyHer category — kurtas, dresses, co-ord sets, tops, bottom wear and everything on sale."
        />
        <link rel="canonical" href={`${SITE_URL}/categories`} />
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
            <li className="text-stone-700">Categories</li>
          </ol>
        </nav>

        <header className="mt-4">
          <h1 className="font-serif text-3xl text-stone-900 sm:text-4xl">
            Shop by Category
          </h1>
          <p className="mt-1 text-sm text-stone-500">
            Every edit in one place — pick where you'd like to start.
          </p>
          <span className="via-gold-400 mt-3 block h-px w-16 bg-gradient-to-r from-transparent to-transparent" />
        </header>

        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
          {CATEGORY_STORIES.map((story) => {
            const tagline = CATEGORY_META[story.id]?.tagline;
            const count = countFor(story.id);

            return (
              <li key={story.id}>
                <Link
                  to={story.href}
                  className="group relative isolate block overflow-hidden rounded-2xl shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <img
                    src={story.image}
                    alt={story.label}
                    loading="lazy"
                    className="h-48 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 sm:h-64"
                  />

                  <span className="img-scrim pointer-events-none absolute inset-0" />

                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                    <span className="min-w-0">
                      <span className="block font-serif text-xl text-white sm:text-2xl">
                        {story.label}
                      </span>
                      {tagline && (
                        <span className="mt-0.5 line-clamp-2 block text-[13px] text-white/80">
                          {tagline}
                        </span>
                      )}
                      {count > 0 && (
                        <span className="mt-1 block text-[11px] font-medium tracking-wide text-white/70 uppercase">
                          {count} {count === 1 ? "style" : "styles"}
                        </span>
                      )}
                    </span>
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur-sm transition-colors duration-300 group-hover:bg-white">
                      <ArrowUpRight className="h-4 w-4 text-white transition-colors duration-300 group-hover:text-stone-900" />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <SiteFooter />
    </>
  );
}
