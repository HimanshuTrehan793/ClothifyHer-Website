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
}

export function TrendingNow({
  id = "trending",
  title = "Trending Now",
  subtitle = "What everyone's adding to their bag this week",
  action,
  products,
  wishlisted,
  onToggleWishlist,
}: TrendingNowProps) {
  return (
    <section id={id} className="bg-cream-100/60 scroll-mt-28 py-12 sm:py-16">
      <SectionHeading title={title} subtitle={subtitle} action={action} />

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
    </section>
  );
}
