import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/custom/card/ProductCard";
import { BannerImage } from "@/components/bits/BannerImage";
import type { FeaturedCollectionData } from "@/interfaces/catalog";

interface FeaturedCollectionProps {
  collection: FeaturedCollectionData;
  wishlisted: Set<string>;
  onToggleWishlist: (productId: string) => void;
}

/**
 * Editorial split: a full-bleed story panel on the left, a short product rail
 * on the right. Stacks to panel-over-rail on mobile.
 */
export function FeaturedCollection({
  collection,
  wishlisted,
  onToggleWishlist,
}: FeaturedCollectionProps) {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="relative isolate overflow-hidden rounded-2xl lg:col-span-5">
            <BannerImage
              src={collection.image}
              mobileSrc={collection.mobileImage}
              alt={collection.title}
              className="h-72 w-full object-cover sm:h-96 lg:h-full"
            />
            <span className="img-scrim pointer-events-none absolute inset-0" />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <span className="bg-gold-500 inline-block rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-white uppercase">
                {collection.eyebrow}
              </span>
              <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
                {collection.title}
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/85">
                {collection.description}
              </p>
              <Link
                to={collection.href}
                className="text-maroon-900 group bg-cream-50 mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform duration-300 hover:scale-[1.03]"
              >
                {collection.ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-8 lg:col-span-7 lg:grid-cols-3">
            {collection.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                wishlisted={wishlisted.has(product.id)}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
