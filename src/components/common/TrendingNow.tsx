import { useState } from "react";
import { SectionHeading } from "@/components/bits/SectionHeading";
import { ProductCard } from "@/components/custom/card/ProductCard";
import type { Product } from "@/interfaces/catalog";

export function TrendingNow({ products }: { products: Product[] }) {
  // Local until the wishlist API lands — see src/features/wishlist.
  const [wishlisted, setWishlisted] = useState<Set<string>>(new Set());

  const toggle = (productId: string) =>
    setWishlisted((prev) => {
      const next = new Set(prev);
      if (!next.delete(productId)) next.add(productId);
      return next;
    });

  return (
    <section className="bg-stone-100/60 py-12 sm:py-16">
      <SectionHeading
        title="Trending Now"
        subtitle="What everyone's adding to their bag this week"
        action={{ label: "View all", href: "/collections/trending" }}
      />

      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 sm:px-6 md:grid-cols-3 lg:grid-cols-4 lg:px-10">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            wishlisted={wishlisted.has(product.id)}
            onToggleWishlist={toggle}
          />
        ))}
      </div>
    </section>
  );
}
