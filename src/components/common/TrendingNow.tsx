import { Sparkles } from "lucide-react";
import { Link } from "react-router";
import { SectionHeading } from "@/components/bits/SectionHeading";
import { ProductCard } from "@/components/custom/card/ProductCard";
import type { Product } from "@/interfaces/catalog";

interface TrendingNowProps {
  id?: string;
  title?: string;
  subtitle?: string;
  /** "Explore All" link rendered beside the heading — its product list page. */
  action?: { label: string; href: string };
  products: Product[];
  wishlisted: Set<string>;
  onToggleWishlist: (productId: string) => void;
  /** Line shown in place of the grid when nothing is tagged into this rail. */
  emptyMessage?: string;
}

export function TrendingNow({
  id = "trending",
  title = "Trending Now",
  subtitle = "What everyone's adding to their bag this week",
  action,
  products,
  wishlisted,
  onToggleWishlist,
  emptyMessage = "Nothing in this edit just yet — check back soon.",
}: TrendingNowProps) {
  return (
    <section id={id} className="bg-cream-100/60 scroll-mt-28 py-12 sm:py-16">
      <SectionHeading title={title} subtitle={subtitle} action={action} />

      {/* The rail keeps its heading even with nothing behind it, so the home
          page's sections stay put while the catalog is still being filled. */}
      {products.length === 0 ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="border-maroon-100 flex flex-col items-center rounded-2xl border border-dashed bg-white/60 px-6 py-12 text-center">
            <span className="bg-maroon-50 grid h-12 w-12 place-items-center rounded-full">
              <Sparkles className="text-maroon-700 h-5 w-5" strokeWidth={1.5} />
            </span>
            <p className="mt-4 text-sm text-stone-500">{emptyMessage}</p>
            {action && (
              <Link
                to={action.href}
                className="text-maroon-700 hover:text-maroon-900 mt-3 text-sm font-medium underline underline-offset-4"
              >
                Browse everything
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 sm:px-6 md:grid-cols-3 lg:grid-cols-4 lg:px-10">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              wishlisted={wishlisted.has(product.id)}
              onToggleWishlist={onToggleWishlist}
            />
          ))}
        </div>
      )}
    </section>
  );
}
